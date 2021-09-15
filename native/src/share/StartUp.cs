using System;
using System.IO;
using System.Reflection;
using Castle.Facilities.Logging;
using Jyh;
using Jyh.Castle.Log4Net.Castle.Logging.Log4Net;
using Jyh.Dependency;
using Jyh.Modules;
using share.CoreConst;
using share.Http;

namespace share
{
    public class StartUp
    {
        private JyhBootstrapper _jyhBootstrapper;
        private SimpleHttpServer _simpleHttpServer;
        public void SetUp<TStartupModule>() where TStartupModule : JyhModule
        {
            Environment.CurrentDirectory = new FileInfo(Assembly.GetEntryAssembly()?.Location ?? throw new InvalidOperationException()).DirectoryName ?? string.Empty;
            //Console.WriteLine($"工作目录已设定为:{Environment.CurrentDirectory}");

            var exeDirFullName = new DirectoryInfo(Environment.CurrentDirectory).Parent?.Parent?.FullName;
            var appDataDirPath = Path.Combine(exeDirFullName ?? throw new InvalidOperationException(), "App_Data");
            //Console.WriteLine($"App_Data目录已设定为:{appDataDirPath}");


            if (!Directory.Exists(appDataDirPath))
            {
                Directory.CreateDirectory(appDataDirPath);
                //Console.WriteLine($"已创建App_Data目录:{appDataDirPath}");
            }

            DatabaseConst.ChagoiBarDbPath = Path.Combine(appDataDirPath, "ChagoiBar.db");
            //Console.WriteLine($"ChagoiBarDbPath:{DatabaseConst.ChagoiBarDbPath}");

            DatabaseConst.LogDbPath = Path.Combine(appDataDirPath, "Log.db");
            //Console.WriteLine($"LogDbPath:{DatabaseConst.LogDbPath}");



            //初始化Jyh
            _jyhBootstrapper = JyhBootstrapper.Create<TStartupModule>(options =>
            {
                options.DisablePersistence = true;
            });
            IocManager.Instance.IocContainer.AddFacility<LoggingFacility>(m => m.UseLog4Net());
            _jyhBootstrapper.Initialize();
            //Console.WriteLine("JyhBootstrapper初始化完成");

            _simpleHttpServer = IocManager.Instance.Resolve<SimpleHttpServer>();
            _simpleHttpServer.Start(7777);
        }


        public void Exit()
        {
            _simpleHttpServer.Stop();
            _jyhBootstrapper?.Dispose();
        }


    }
}
