namespace share.CoreConst
{
    /// <summary>
    /// 数据库常量
    /// </summary>
    public class DatabaseConst
    {

        public static object LogDbWriteLocker=new();

        /// <summary>
        /// 业务数据库路径
        /// </summary>
        public static string ChagoiBarDbPath { get; set; }
 

        /// <summary>
        /// 日志数据库地址
        /// </summary>
        public static string LogDbPath { get; set; }
    }
}
