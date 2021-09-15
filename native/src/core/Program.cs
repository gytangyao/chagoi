using System;
using System.Threading;
using System.Threading.Tasks;

namespace core
{
    internal class Program
    {
        private static void Main(string[] args)
        {
            Task.Factory.StartNew(() =>
            {
                while (true)
                {
                    Console.WriteLine("123213213");
                    Thread.Sleep(1000);
                }
            });

            ManualResetEvent manualResetEvent = new ManualResetEvent(false);
            manualResetEvent.WaitOne();
        }
    }
}
