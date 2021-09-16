using System;
using System.Net;
using System.Threading.Tasks;
using Jyh.Dependency;

namespace share.Http
{
    public class SimpleHttpServer : ISingletonDependency
    {
        private readonly RequestDispatcher _requestDispatcher;
        private HttpListener _listener;
        private bool _isStarted;
        private int _startPort;
        private const int MaxPort = 60000;

        public SimpleHttpServer(RequestDispatcher requestDispatcher)
        {
            _requestDispatcher = requestDispatcher;
        }

        public void Start(int port)
        {
            _startPort = port;
            var prefix = $"http://+:{_startPort}/";
            _listener = new HttpListener();

            while (!_isStarted && _startPort <= MaxPort)
            {
                try
                {
                    _listener.Prefixes.Add(prefix);
                    _listener.Start();
                    _isStarted = true;
                }
                catch (HttpListenerException)
                {
                    ++_startPort;
                    prefix = $"http://+:{_startPort}/";
                    _listener = null;
                    _listener = new HttpListener();
                }
            }
            _listener.BeginGetContext(ListenerCallback, _listener);
        }

        public void ListenerCallback(IAsyncResult result)
        {
            var listener = (HttpListener)result.AsyncState;
            listener.BeginGetContext(ListenerCallback, listener);

            Task.Factory.StartNew(() =>
            {
                var context = listener.EndGetContext(result);
                _requestDispatcher.Dispatch(context);
            });
        }

        public void Stop()
        {
            _listener?.Stop();
            _listener = null;
        }
    }
}
