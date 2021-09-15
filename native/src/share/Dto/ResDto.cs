using System.Diagnostics.CodeAnalysis;

namespace share.Dto
{
    /// <summary>
    ///     响应数据
    /// </summary>
    /// <typeparam name="T"></typeparam>
    [SuppressMessage("ReSharper", "InconsistentNaming")]
    public class ResDto<T>
    {
        public int responseCode { get; set; }

        public T data { get; set; }
    }
}
