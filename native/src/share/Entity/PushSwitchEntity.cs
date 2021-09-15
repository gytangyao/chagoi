using Jyh.Domain.Entities;
using SQLite;

namespace share.Entity
{
    /// <summary>
    ///     推送开关
    /// </summary>
    public class PushSwitchEntity : Entity<string>
    {
        [PrimaryKey]
        public override string Id { get; set; }


        /// <summary>
        ///     是否已经关闭手机扫码点单
        /// </summary>
        public bool CloseScanOrderPrint { get; set; }


        /// <summary>
        ///     会员充值打印
        /// </summary>
        public bool CloseMemberRechargePint { get; set; }



        /// <summary>
        ///     会员退费打印
        /// </summary>
        public bool CloseMemberSubtractBalancePrint { get; set; }




        /// <summary>
        ///     退菜打印
        /// </summary>
        public bool CloseRefundPrint { get; set; }



        /// <summary>
        ///     关闭排队打印
        /// </summary>
        public bool CloseQueuePrint { get; set; }


        /// <summary>
        ///     转台通知、联台通知、合并台通知
        /// </summary>
        public bool CloseTableChangedPrint { get; set; }


        /// <summary>
        ///     消费明细单打印
        /// </summary>
        public bool CloseXfmxdPrint { get; set; }


        /// <summary>
        ///     未付打印
        /// </summary>
        public bool CloseNotPayPrint { get; set; }



        /// <summary>
        ///     是否已经关闭手机翻台预打印
        /// </summary>
        public bool CloseOverTablePrePrint { get; set; }


        /// <summary>
        ///     是否已经关闭手机翻台明细
        /// </summary>
        public bool CloseOverTableDetailPrint { get; set; }



        /// <summary>
        ///     关闭手机取酒打印
        /// </summary>
        public bool CloseMobileOutWinePrint { get; set; }


        /// <summary>
        ///     关闭呼叫服务员
        /// </summary>
        public bool CloseCallWaiter { get; set; }


        /// <summary>
        ///     关闭H5充值收银台提示
        /// </summary>
        public bool CloseH5Recharge { get; set; }
    }
}
