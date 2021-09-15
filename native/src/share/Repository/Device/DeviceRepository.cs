using share.Entity;
using share.Func.Extensions;

namespace share.Repository.Device
{

    /// <summary>
    /// <see cref="IDeviceRepository"/>
    /// </summary>
    public class DeviceRepository : IDeviceRepository
    {
        /// <summary>
        /// <see cref="IDeviceRepository.QueryFirstOrDefault"/>
        /// </summary>
        /// <returns></returns>
        public DeviceEntity QueryFirstOrDefault()
        {
            return ConnectionFactory.Connection.Table<DeviceEntity>().FirstOrDefault();
        }


        /// <summary>
        /// <see cref="IDeviceRepository.Update"/>
        /// </summary>
        /// <returns></returns>
        public int Update(DeviceEntity deviceEntity)
        {
            return deviceEntity.SafeUpdate();
        }

    }
}
