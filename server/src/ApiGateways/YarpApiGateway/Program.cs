using BuildingBlocks.Auth.Abstractions.Middlewares;
using BuildingBlocks.Auth.OptionsSetup;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

builder.Services.ConfigureOptions<JwtOptionsSetup>();
builder.Services.ConfigureOptions<JwtBearerOptionsSetup>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer();


var app = builder.Build();

// Configure the HTTP request pipeline
app.UseRouting();

app.UseAuthentication();

app.UseMiddleware<UserToHeaderMiddleware>();

app.MapReverseProxy();

app.Run();
