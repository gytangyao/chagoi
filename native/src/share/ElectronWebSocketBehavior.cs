using System;
using WebSocketSharp;
using WebSocketSharp.Server;

namespace share
{
    public class ElectronWebSocketBehavior : WebSocketBehavior
    {
        protected override void OnMessage(MessageEventArgs e)
        {
            Console.WriteLine("OnMessage:" + base.ID);
            var msg = e.Data == "BALUS"
                ? "I've been balused already..."
                : "I'm not available now.";

            Send(msg);
        }

        protected override void OnClose(CloseEventArgs e)
        {
            Console.WriteLine("OnClose:" + base.ID);
            base.OnClose(e);
        }



        protected override void OnOpen()
        {
            Console.WriteLine("OnOpen:" + base.ID);
            base.OnOpen();
        }

        protected override void OnError(ErrorEventArgs e)
        {
            Console.WriteLine("OnError:" + base.ID);
            base.OnError(e);
        }
    }
}
