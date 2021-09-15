using Jyh.Domain.Entities;
using SQLite;

namespace share.Entity
{
    /// <summary>
    /// 日志
    /// </summary>
    [Table("LogEntities")]
    public class LogEntity : Entity<string>
    {
        [PrimaryKey]
        public override string Id { get; set; }


        public long Date { get; set; }

        public string Level { get; set; }

        public string Logger { get; set; }


        public string Message { get; set; }

    }
}
