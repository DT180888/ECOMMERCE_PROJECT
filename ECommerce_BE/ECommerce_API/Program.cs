using AutoMapper;
//using ECommerce_API.Mappings;
using ECommerce_API.Middleware;
using ECommerce_Application;
using ECommerce_Application.Common.Interfaces;
using ECommerce_Infrastructure;
using ECommerce_Infrastructure.Auth;
using ECommerce_Infrastructure.Identity;
using ECommerce_Infrastructure.Persistence;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

//builder.Services.AddAutoMapper(_ => { },
//    typeof(BrandMappingProfile).Assembly,                 // Profiles ở API
//    typeof(ECommerce_Application.DependencyInjection).Assembly  // Profiles ở Application (nếu có)
//);

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ECommerce_API.Services.IAuthCookieService,
                           ECommerce_API.Services.AuthCookieService>();

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));
builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(ECommerce_Application.DependencyInjection).Assembly));

builder.Services.AddValidatorsFromAssembly(typeof(ECommerce_Application.DependencyInjection).Assembly);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "ECommerce_API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new()
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Nhập: Bearer {token}"
    });
    c.AddSecurityRequirement(new()
    {
        {
            new() { Reference = new() { Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme, Id = "Bearer" } },
            Array.Empty<string>()
        }
    });
    c.CustomSchemaIds(t => t.FullName!.Replace("+", "."));
    c.SupportNonNullableReferenceTypes();

    c.MapType<IFormFile>(() => new OpenApiSchema
    {
        Type = "string",
        Format = "binary"
    });
});

builder.Services.AddTransient<ExceptionMiddleware>();

//builder.Services.AddCors(o => o.AddDefaultPolicy(p => p.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin()));

var allowedOrigins = new[] {
    "http://localhost:5173",   // FE dev server (Vite)
    "https://localhost:5173"   // nếu bạn dùng HTTPS cho FE
};

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // <-- cho phép cookie/token
    });
});

builder.Services.AddControllers();

var app = builder.Build();

app.UseStaticFiles();

app.UseMiddleware<ExceptionMiddleware>();
app.UseCors();

if (app.Environment.IsDevelopment()) { app.UseSwagger(); app.UseSwaggerUI(); }

app.UseHttpsRedirection();

app.UseCors("FrontendPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

await Seeding.SeedAsync(app.Services);

app.Run();
