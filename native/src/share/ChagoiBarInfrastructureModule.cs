using System;
using Jyh.Extensions;
using Jyh.Modules;
using Jyh.Reflection.Extensions;
using share.CoreConst;
using share.Entity;
using share.Func.Extensions;
using share.Repository;
using SQLite;

namespace share
{
    public class ChagoiBarInfrastructureModule : JyhModule
    {
        private const string GatewayHost = "https://api-saas.wemew.com/";
        private const string WebSocketUri = "wss://socket-saas.wemew.com/";
        public override void PreInitialize()
        {
            var chagoiBarDb = ConnectionFactory.Connection;
            chagoiBarDb.CreateTable<DeviceEntity>();
            chagoiBarDb.CreateTable<PrintJobEntity>();
            chagoiBarDb.CreateTable<VoiceEntity>();
            chagoiBarDb.CreateTable<PushSwitchEntity>();
            Seed(chagoiBarDb);

            using var logDb = new SQLiteConnection(DatabaseConst.LogDbPath);
            logDb.CreateTable<LogEntity>();
        }

        private static void Seed(SQLiteConnection chagoiBarDb)
        {
            var existDevice = chagoiBarDb.Table<DeviceEntity>().FirstOrDefault();
            if (null == existDevice)
            {
                existDevice = new DeviceEntity
                {
                    Id = Guid.NewGuid().NStr(),
                    GatewayHost = GatewayHost,
                    WebsocketUri = WebSocketUri
                };
                existDevice.SafeInsert();
            }
            else
            {
                if (string.IsNullOrEmpty(existDevice.GatewayHost))
                {
                    existDevice.GatewayHost = GatewayHost;
                }

                if (string.IsNullOrEmpty(existDevice.WebsocketUri))
                {
                    existDevice.WebsocketUri = WebSocketUri;
                }
                existDevice.SafeUpdate();
            }


            //把设备表里的开关配置迁移到推送开关数据表
            var existPushSwitch = chagoiBarDb.Table<PushSwitchEntity>().FirstOrDefault();
            if (null == existPushSwitch)
            {
                existPushSwitch = new PushSwitchEntity
                {
                    Id = Guid.NewGuid().NStr(),
                    CloseScanOrderPrint = existDevice.ClosedIotScanOrder.GetValueOrDefault(),
                    CloseRefundPrint = existDevice.ClosedIotScanOrder.GetValueOrDefault(),
                    CloseXfmxdPrint = existDevice.ClosedIotScanOrder.GetValueOrDefault(),
                    CloseNotPayPrint = existDevice.ClosedIotScanOrder.GetValueOrDefault(),
                    CloseOverTablePrePrint = existDevice.ClosedOverTable.GetValueOrDefault(),
                    CloseOverTableDetailPrint = false,
                    CloseMemberRechargePint = false,
                    CloseMemberSubtractBalancePrint = false,
                    CloseQueuePrint = false,
                    CloseCallWaiter = false,
                    CloseMobileOutWinePrint = false,
                    CloseTableChangedPrint = false,
                    CloseH5Recharge = false
                };
                existPushSwitch.SafeInsert();
            }


            var existVoice = chagoiBarDb.Table<VoiceEntity>().FirstOrDefault();
            if (null == existVoice)
            {
                var voiceEntity = new VoiceEntity
                {
                    Id = Guid.NewGuid().NStr(),
                    QueueCallingCount = 2,
                    QueueCallingTemplate = "{排队号码}号请您入场啦",
                    EnablePayPlay = false
                };
                voiceEntity.SafeInsert();
            }
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(ChagoiBarInfrastructureModule).GetAssembly());
        }

    }
}
