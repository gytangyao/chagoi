using System.Threading;
using share;

namespace classic
{
    internal class Program
    {
        private static void Main()
        {
            var startUp = new StartUp();
            startUp.SetUp<ChagoiBarWpfModule>();
            //Task.Factory.StartNew(() =>
            //{
            //    while (true)
            //    {
            //        Console.WriteLine("123213213");
            //        Thread.Sleep(1000);
            //    }
            //});
            var manualResetEvent = new ManualResetEvent(false);
            manualResetEvent.WaitOne();
            startUp.Exit();
        }

    }
}
