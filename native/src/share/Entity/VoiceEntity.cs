using Jyh.Domain.Entities;
using SQLite;

namespace share.Entity
{
    /// <summary>
    /// 语音设置
    /// </summary>
    [Table("VoiceEntities")]
    public class VoiceEntity : Entity<string>
    {
        [PrimaryKey]
        public override string Id { get; set; }


        /// <summary>
        /// 排队叫号次数
        /// </summary>
        public int QueueCallingCount { get; set; }



        /// <summary>
        /// 排队叫号模板
        /// </summary>
        public string QueueCallingTemplate { get; set; }


        /// <summary>
        /// 启用支付语音播报
        /// </summary>
        public bool EnablePayPlay { get; set; }


        /// <summary>
        ///     启用存取酒语音播报
        /// </summary>
        public bool EnableWinePlay { get; set; }
    }


}
