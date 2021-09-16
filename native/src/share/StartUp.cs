using System;
using System.IO;
using System.Reflection;
using Castle.Facilities.Logging;
using Jyh;
using Jyh.Castle.Log4Net.Castle.Logging.Log4Net;
using Jyh.Dependency;
using Jyh.Modules;
using Jyh.Threading.BackgroundWorkers;
using share.BackgroundWorker;
using share.CoreConst;
using share.Http;

namespace share
{
    public class StartUp
    {
        private JyhBootstrapper _jyhBootstrapper;
        private SimpleHttpServer _simpleHttpServer;
        private IBackgroundWorkerManager _backgroundWorkerManager;

        public void SetUp<TStartupModule>() where TStartupModule : JyhModule
        {
            Environment.CurrentDirectory = new FileInfo(Assembly.GetEntryAssembly()?.Location ?? throw new InvalidOperationException()).DirectoryName ?? string.Empty;


            var exeDirFullName = new DirectoryInfo(Environment.CurrentDirectory).Parent?.Parent?.FullName;
            var appDataDirPath = Path.Combine(exeDirFullName ?? throw new InvalidOperationException(), "App_Data");
            if (!Directory.Exists(appDataDirPath))
            {
                Directory.CreateDirectory(appDataDirPath);
            }
            DatabaseConst.ChagoiBarDbPath = Path.Combine(appDataDirPath, "ChagoiBar.db");
            DatabaseConst.LogDbPath = Path.Combine(appDataDirPath, "Log.db");



            _jyhBootstrapper = JyhBootstrapper.Create<TStartupModule>(options => { options.DisablePersistence = true; });
            IocManager.Instance.IocContainer.AddFacility<LoggingFacility>(m => m.UseLog4Net());
            _jyhBootstrapper.Initialize();


            _backgroundWorkerManager = IocManager.Instance.Resolve<BackgroundWorkerManager>();
            _backgroundWorkerManager.Add(IocManager.Instance.Resolve<CheckParentProcessExistBackgroundWorker>());

            _simpleHttpServer = IocManager.Instance.Resolve<SimpleHttpServer>();
            _simpleHttpServer.Start(7777);
            Console.WriteLine("Started");
        }


        public void Exit()
        {
            _simpleHttpServer.Stop();
            _jyhBootstrapper?.Dispose();
        }


    }
}
