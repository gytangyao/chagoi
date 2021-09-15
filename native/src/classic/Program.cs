using System;
using System.Threading;
using System.Threading.Tasks;

namespace classic
{
    internal class Program
    {
        private static void Main()
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
