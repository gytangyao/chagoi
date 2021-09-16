using System;
using System.Collections.Generic;
using System.Diagnostics;
using Jyh.Dependency;
using Jyh.Threading.BackgroundWorkers;
using Jyh.Threading.Timers;
using share.CoreConst;

namespace share.BackgroundWorker
{
    /// <summary>
    ///     WebSocket心跳
    /// <see cref="CheckParentProcessExistBackgroundWorker"/>
    /// </summary>
    public class CheckParentProcessExistBackgroundWorker : PeriodicBackgroundWorkerBase, ISingletonDependency
    {
        public CheckParentProcessExistBackgroundWorker(JyhTimer timer) : base(timer)
        {
            timer.Period = BackgroundWorkerPeriodConst.CheckParentProcessExist;
        }

        protected override void DoWork()
        {
            try
            {
                var processes = new List<Process>();
                processes.AddRange(Process.GetProcessesByName("微喵虎斑"));
                processes.AddRange(Process.GetProcessesByName("Electron"));

                if (processes.Count == 0)
                {
                    Process.GetCurrentProcess().Kill();
                }
            }
            catch (Exception ex)
            {
                Logger.Error("结束微喵虎斑native进程失败", ex);
            }
        }

    }
}
