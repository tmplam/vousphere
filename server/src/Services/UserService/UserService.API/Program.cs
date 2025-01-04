using UserService.API;
using UserService.Application;
using UserService.Infrastructure;
using UserService.Infrastructure.Persistence.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services
    .AddApiServices()
    .AddApplicationServices(builder.Configuration)
    .AddInfrastructureServices(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    await app.InitialiseDatabaseAsync();
}

// Configure the HTTP request pipline
app.UseApiServices();

app.Run();
