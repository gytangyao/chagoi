using System;
using Jyh.Domain.Entities;
using SQLite;

namespace share.Entity
{
    /// <summary>
    /// 设备信息
    /// </summary>
    [Table("Device")]
    public class DeviceEntity : Entity<string>
    {
        /// <summary>
        ///     主键Id
        /// </summary>
        [PrimaryKey]
        public override string Id { get; set; }




        /// <summary>
        ///     设备Id
        /// </summary>
        public string DeviceId { get; set; }

        /// <summary>
        ///     设备名称
        /// </summary>
        public string DeviceName { get; set; }



        /// <summary>
        ///     商户Id
        /// </summary>
        [Obsolete]
        public string TenantId { get; set; }



        /// <summary>
        ///     商户显示名称
        /// </summary>
        [Obsolete]
        public string TenantDisplay { get; set; }


        /// <summary>
        ///     商户名
        /// </summary>
        [Obsolete]
        public string TenantName { get; set; }



        /// <summary>
        ///     门店Id
        /// </summary>
        public string StoreId { get; set; }


        /// <summary>
        ///     门店名
        /// </summary>
        public string StoreName { get; set; }


        /// <summary>
        ///     签名Key
        /// </summary>
        [Obsolete]
        public string SignKey { get; set; }


        /// <summary>
        ///     设备序列号
        /// </summary>
        [Obsolete]
        public string CdKey { get; set; }


        /// <summary>
        ///     网关地址
        /// </summary>
        public string GatewayHost { get; set; }

        /// <summary>
        ///     WebsocketUri
        /// </summary>
        public string WebsocketUri { get; set; }

        /// <summary>
        ///     用户Id,用于下次启动重新登录
        /// </summary>
        public string Uid { get; set; }


        /// <summary>
        ///     登录密码,用于下次启动重新登录
        /// </summary>
        public string Pwd { get; set; }


        /// <summary>
        ///     是否显示悬浮窗
        /// </summary>
        public bool? ShowTouchWindow { get; set; }


        /// <summary>
        ///     悬浮窗的位置
        /// </summary>
        public string TouchWindowLocation { get; set; }


        /// <summary>
        ///     是否已经关闭手机扫码点单
        /// </summary>
        public bool? ClosedIotScanOrder { get; set; }



        /// <summary>
        ///     是否已经关闭翻台推送
        /// </summary>
        public bool? ClosedOverTable { get; set; }



        /// <summary>
        ///     是否是触摸模式
        /// </summary>
        public bool ? IsTouchMode { get; set; }


        /// <summary>
        ///     是否记住账号密码
        /// </summary>
        public bool ? RememberAccount { get; set; }
    }

}
