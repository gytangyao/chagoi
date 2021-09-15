using WebSocketSharp.Server;

namespace share
{
    public class WebSocketSharpServer
    {
        private WebSocketServer _webSocketServer;
        public void Start()
        {
            _webSocketServer = new WebSocketServer("ws://0.0.0.0:3457");
            _webSocketServer.AddWebSocketService<ElectronWebSocketBehavior>("/electron");
            _webSocketServer.Start();
        }

        public void Stop()
        {
            _webSocketServer?.Stop();
        }
    }
}
