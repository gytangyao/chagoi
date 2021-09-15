using Jyh.Domain.Entities;
using SQLite;

namespace share.Entity
{
    /// <summary>
    /// 打印作业
    /// </summary>
    [Table("PrintJob")]
    public class PrintJobEntity : Entity<string>
    {
        /// <summary>
        /// 主键Id
        /// </summary>
        [PrimaryKey]
        public override string Id { get; set; }

        /// <summary>
        ///  对应的服务器上的数据记录Id
        /// </summary>
        public string RefServerRecordId { get; set; }

        /// <summary>
        /// 作业设备,JSON对象
        /// </summary>
        public string Device { get; set; }


        /// <summary>
        /// 作业设备,id
        /// </summary>
        public string DeviceId { get; set; }


        /// <summary>
        /// 作业设备名称
        /// </summary>
        public string DeviceName { get; set; }

        /// <summary>
        /// 作业状态
        /// </summary>
        public string State { get; set; }


        /// <summary>
        ///     桌台号
        /// </summary>
        public string TabNum { get; set; }


        /// <summary>
        ///    票据数据,JSON
        /// </summary>
        public string ReceiptVo { get; set; }


        /// <summary>
        ///     标签数据,JSON
        /// </summary>
        public string DrawData { get; set; }


        /// <summary>
        /// 票据类型
        /// </summary>
        public string TicketType { get; set; }


        /// <summary>
        /// 作业创建时间
        /// </summary>
        public long CreateTime { get; set; }


        /// <summary>
        /// 作业id,由客户端自己生成
        /// </summary>
        public string JobId { get; set; }

        /// <summary>
        /// 作业流水号,由客户端自己生成
        /// </summary>
        public long SerialNumber { get; set; }


        /// <summary>
        /// 错误信息
        /// </summary>
        public string ErrorMsg { get; set; }

        /// <summary>
        ///     重试次数
        /// </summary>
        public int RetryCount { get; set; }


        /// <summary>
        ///     已经上传
        /// </summary>
        public bool AlreadyUploaded { get; set; }
    }
}
