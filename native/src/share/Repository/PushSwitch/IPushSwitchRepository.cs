using Jyh.Domain.Repositories;
using share.Entity;

namespace share.Repository.PushSwitch
{
    /// <summary>
    ///     推送开关仓储
    /// </summary>
    public interface IPushSwitchRepository : IRepository
    {
        /// <summary>
        ///     查询第一个
        /// </summary>
        /// <returns></returns>
        /// 
        PushSwitchEntity QueryFirstOrDefault();



        /// <summary>
        ///     更新
        /// </summary>
        /// <returns></returns>
        int Update(PushSwitchEntity deviceEntity);
    }

}
