using Jyh.Domain.Repositories;
using share.Entity;

namespace share.Repository.Device
{
    /// <summary>
    ///     设置仓储
    /// </summary>
    public interface IDeviceRepository : IRepository
    {
        /// <summary>
        ///     查询第一个
        /// </summary>
        /// <returns></returns>
        /// 
        DeviceEntity QueryFirstOrDefault();



        /// <summary>
        ///     更新
        /// </summary>
        /// <returns></returns>
        int Update(DeviceEntity deviceEntity);
    }

}
