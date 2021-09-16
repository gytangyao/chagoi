using System.Net;
using System.Text;
using Jyh.Dependency;
using Newtonsoft.Json;
using share.Dto;
using share.Entity;
using share.Repository.Device;
using share.Repository.PushSwitch;

namespace share.Http
{
    public class RequestDispatcher : ISingletonDependency
    {
        private readonly IDeviceRepository _deviceRepository;
        private readonly IPushSwitchRepository _pushSwitchRepository;
        public RequestDispatcher(IDeviceRepository deviceRepository, IPushSwitchRepository pushSwitchRepository)
        {
            _deviceRepository = deviceRepository;
            _pushSwitchRepository = pushSwitchRepository;
        }

        public void Dispatch(HttpListenerContext context)
        {
            using var inputStream = context.Request.InputStream;
            var encoding = context.Request.ContentEncoding;
            using var streamReader = new System.IO.StreamReader(inputStream, encoding);
            var content = streamReader.ReadToEnd();
            var reqDto = JsonConvert.DeserializeObject<ReqDto>(content);
            if (reqDto == null)
            {
                var resDto = new ResDto<string> { responseCode = 400, message = "读取InputStream.data出错" };
                Response(context, resDto);
                return;
            }

            var action = reqDto.action;
            if (string.IsNullOrEmpty(action))
            {
                var resDto = new ResDto<string> { responseCode = 400, message = "无效的请求,缺少action参数" };
                Response(context, resDto);
            }
            else
            {
                switch (action)
                {
                    case nameof(QueryDevice):
                        QueryDevice(context);
                        break;
                    case nameof(QueryPushSwitch):
                        QueryPushSwitch(context);
                        break;
                    case nameof(UpdateActiveInfo):
                        UpdateActiveInfo(context, reqDto.data);
                        break;
                    default:
                        var resDto = new ResDto<string> { responseCode = 400, message = $"未知的action参数{action}" };
                        Response(context, resDto);
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


        private void UpdateActiveInfo(HttpListenerContext context, string data)
        {
            var device = _deviceRepository.QueryFirstOrDefault();
            var destObject = JsonConvert.DeserializeObject<DeviceEntity>(data);
            if (destObject is not null)
            {
                device.RememberAccount = destObject.RememberAccount;
                device.Uid = destObject.Uid;
                device.Pwd = destObject.Pwd;
                device.DeviceId = destObject.DeviceId;
                device.DeviceName = destObject.DeviceName;
                device.StoreId = destObject.StoreId;
                device.StoreName = destObject.StoreName;
                _deviceRepository.Update(device);
                var resDto = new ResDto<DeviceEntity> { responseCode = 200, data = device };
                Response(context, resDto);
            }
            else
            {
                var resDto = new ResDto<DeviceEntity> { responseCode = 400, message = $"Invoke{nameof(UpdateActiveInfo)}失败,解析参数失败" };
                Response(context, resDto);
            }
        }


        private void QueryPushSwitch(HttpListenerContext context)
        {
            var pushSwitchEntity = _pushSwitchRepository.QueryFirstOrDefault();
            var resDto = new ResDto<PushSwitchEntity> { responseCode = 200, data = pushSwitchEntity };
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
