using share.Entity;
using share.Func.Extensions;
using share.Repository.Device;

namespace share.Repository.PushSwitch
{

    /// <summary>
    /// <see cref="IDeviceRepository"/>
    /// </summary>
    public class PushSwitchRepository : IPushSwitchRepository
    {
        /// <summary>
        /// <see cref="IPushSwitchRepository.QueryFirstOrDefault"/>
        /// </summary>
        /// <returns></returns>
        public PushSwitchEntity QueryFirstOrDefault()
        {
            return ConnectionFactory.Connection.Table<PushSwitchEntity>().FirstOrDefault();
        }


        /// <summary>
        /// <see cref="IPushSwitchRepository.Update"/>
        /// </summary>
        /// <returns></returns>
        public int Update(PushSwitchEntity pushSwitchEntity)
        {
            return pushSwitchEntity.SafeUpdate();
        }

    }
}
