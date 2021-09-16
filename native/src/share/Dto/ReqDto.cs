using System.Diagnostics.CodeAnalysis;

namespace share.Dto
{
    /// <summary>
    ///     请求数据
    /// </summary>
    /// <typeparam name="T"></typeparam>
    [SuppressMessage("ReSharper", "InconsistentNaming")]
    public class ReqDto
    {
        public string action { get; set; }

        public string data { get; set; }
    }
}
