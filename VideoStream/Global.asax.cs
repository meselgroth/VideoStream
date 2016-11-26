using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using Autofac;
using Autofac.Integration.WebApi;
using System.Reflection;
using System.Web.Http;
using System.Web.Routing;
using Autofac;
using Autofac.Integration.WebApi;

namespace VideoStream
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
            RegisterIoc();
        }

        public void RegisterIoc()
        {
            var builder = new ContainerBuilder();


            // OPTIONAL: Register model binders that require DI.
            var executingAssembly = Assembly.GetExecutingAssembly();

            builder.RegisterAssemblyTypes(typeof(ICacheService).Assembly).AsImplementedInterfaces();


            // WEBAPI
            // Get your HttpConfiguration.
            var config = GlobalConfiguration.Configuration;

            // Register your Web API controllers.
            builder.RegisterApiControllers(executingAssembly);

            // OPTIONAL: Register the Autofac filter provider.
            builder.RegisterWebApiFilterProvider(config);


            // Set the dependency resolver to be Autofac.
            var container = builder.Build();
            //DependencyResolver.SetResolver(new AutofacDependencyResolver(container));

            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);
        }
    }
}
