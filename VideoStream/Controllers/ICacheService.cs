using System.Web;
using AngularJSWebApiEmpty.Controllers;

static internal class ICacheService
{
    private static StreamContent GetStreamContent()
    {
        return (StreamContent)HttpContext.Current.Application["StreamContent"];
    }
}