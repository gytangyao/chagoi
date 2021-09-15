using System;
using System.Net;
using System.Text;
using Jyh.Dependency;
using Newtonsoft.Json;
using share.Dto;
using share.Entity;
using share.Repository.Device;

namespace share.Http
{
    public class RequestDispatcher : ISingletonDependency
    {
        private readonly IDeviceRepository _deviceRepository;
        public RequestDispatcher(IDeviceRepository deviceRepository)
        {
            _deviceRepository = deviceRepository;
        }

        public void Dispatch(HttpListenerContext context)
        {
            var queryString = context.Request.QueryString;
            var action = queryString.Get("action");
            Console.WriteLine($"接收到请求:{action}");
            if (string.IsNullOrEmpty(action))
            {
                var resDto = new ResDto<string> { responseCode = 400, data = "无效的请求,缺少action参数" };
                Response(context, resDto);
            }
            else
            {
                switch (action)
                {
                    case nameof(QueryDevice):
                        QueryDevice(context);
                        break;
                }
            }
        }


        private void QueryDevice(HttpListenerContext context)
        {
            var device = _deviceRepository.QueryFirstOrDefault();
            var resDto = new ResDto<DeviceEntity> { responseCode = 200, data = device };
            Response(context, resDto);
        }


        /// <summary>
        ///     执行响应
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="context"></param>
        /// <param name="resDto"></param>
        private static void Response<T>(HttpListenerContext context, ResDto<T> resDto)
        {
            var response = context.Response;
            response.ContentType = "application/json";
            response.ContentEncoding = Encoding.UTF8;

            var responseString = JsonConvert.SerializeObject(resDto);
            var buffer = Encoding.UTF8.GetBytes(responseString);
            response.ContentLength64 = buffer.Length;
            using var output = response.OutputStream;
            output.Write(buffer, 0, buffer.Length);
            output.Close();
        }

    }
}
