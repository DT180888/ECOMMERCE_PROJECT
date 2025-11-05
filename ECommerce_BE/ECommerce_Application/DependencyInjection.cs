using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using AutoMapper;

namespace ECommerce_Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

            // Quét các AutoMapper Profile nằm trong chính Application
            services.AddAutoMapper(_ => { }, Assembly.GetExecutingAssembly());

            return services;
        }
    }
}
