using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;

namespace AngularJSWebApiEmpty.Controllers
{
    public class StreamController : ApiController
    {
        private readonly ICacheService _cacheService;
        private readonly MediaTypeHeaderValue _mediaTypeHeaderValue = new MediaTypeHeaderValue("application/octet-stream");

        public StreamController(ICacheService cacheService)
        {
            _cacheService = cacheService;
        }

        public HttpResponseMessage Get()
        {
            var responseMessage = new HttpResponseMessage(HttpStatusCode.OK);
            responseMessage.Content = new ByteArrayContent(_cacheService.GetStreamContent());
            responseMessage.Content.Headers.ContentType = _mediaTypeHeaderValue;
            return responseMessage;
        }

        //public HttpResponseMessage Get()
        //{
        //    if (Request.Headers.Range != null)
        //    {
        //        var partialResponse = Request.CreateResponse(HttpStatusCode.PartialContent);
        //        partialResponse.Content = new ByteRangeStreamContent(new MemoryStream(_cacheService.GetStreamContent()), Request.Headers.Range, _mediaTypeHeaderValue);
        //        return partialResponse;
        //    }
        //    var responseMessage = new HttpResponseMessage(HttpStatusCode.OK);
        //    responseMessage.Content = new ByteArrayContent(_cacheService.GetStreamContent());
        //    responseMessage.Content.Headers.ContentType = _mediaTypeHeaderValue;
        //    return responseMessage;
        //}

        public void Post([FromBody]byte[] value)
        {
            _cacheService.AddStreamContent(value);
        }
    }

    public interface ICacheService
    {
        byte[] GetStreamContent();
        void AddStreamContent(byte[] value);
    }

    public class CacheService : ICacheService
    {
        public byte[] GetStreamContent()
        {
            return (byte[])HttpContext.Current.Application["StreamContent"];
        }

        public void AddStreamContent(byte[] value)
        {
            var session = HttpContext.Current.Application;

            session["StreamContent"] = value;
        }
    }

    public class StreamContent
    {
        public int X { get; set; }
        public int Y { get; set; }
    }
}
