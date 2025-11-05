using ECommerce_Application.Common.Interfaces;
using ECommerce_Infrastructure.Auth;
using ECommerce_Infrastructure.Persistence;
using ECommerce_Infrastructure.Services.ImageStorage;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration cfg)
        {
            var cs = cfg.GetConnectionString("SqlServer") ?? throw new InvalidOperationException("Missing ConnectionStrings:SqlServer");
            services.AddDbContext<AppDbContext>(o => o.UseSqlServer(cs));
            services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<AppDbContext>());

            // Identity
            services.AddIdentityCore<IdentityUser>(o =>
            {
                o.Password.RequireNonAlphanumeric = false;
                o.Password.RequireUppercase = false;
            })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<AppDbContext>()
            .AddDefaultTokenProviders();

            // JWT
            services.Configure<JwtOptions>(cfg.GetSection("Jwt"));
            var jwt = cfg.GetSection("Jwt").Get<JwtOptions>()!;

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(o =>
                {
                    o.TokenValidationParameters = new()
                    {
                        ValidateIssuer = true,
                        ValidIssuer = jwt.Issuer,
                        ValidateAudience = true,
                        ValidAudience = jwt.Audience,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey =
                            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key)),
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.FromMinutes(1)
                    };

                    o.Events = new()
                    {
                        OnAuthenticationFailed = ctx =>
                        {
                            Console.WriteLine("JWT fail: " + ctx.Exception.Message);
                            return Task.CompletedTask;
                        }
                    };
                });

            services.Configure<ImageStorageOptions>(cfg.GetSection("ImageStorage"));
            services.AddSingleton<IImageStorage, LocalImageStorage>();

            services.AddAuthorization();

            // 👉 QUAN TRỌNG: đăng ký ITokenService
            services.AddScoped<ITokenService, TokenService>();

            return services;
        }
    }
}
