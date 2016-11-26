using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace AngularJSWebApiEmpty.Controllers
{
    public class StreamController : ApiController
    {
        private readonly ICacheService _cacheService;

        public StreamController(ICacheService cacheService)
        {
            _cacheService = cacheService;
        }

        public StreamContent Get()
        {
            return _cacheService.GetStreamContent();
        }

        public void Post([FromBody]StreamContent value)
        {
            _cacheService.AddStreamContent(value);
        }
    }

    public interface ICacheService
    {
        StreamContent GetStreamContent();
        void AddStreamContent(StreamContent value);
    }

    public class CacheService : ICacheService
    {
        public StreamContent GetStreamContent()
        {
            return (StreamContent)HttpContext.Current.Application["StreamContent"];
        }

        public void AddStreamContent(StreamContent value)
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
