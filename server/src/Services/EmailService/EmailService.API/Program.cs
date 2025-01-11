using BuildingBlocks.Exceptions.Handlers;
using BuildingBlocks.Messaging.MassTransit;
using EmailService.API.OptionsSetup;
using EmailService.API.Services;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureOptions<EmailSenderOptionsSetup>();
builder.Services.AddScoped<IEmailSenderService, EmailSenderService>();

// Add database and message broker
builder.Services.AddMessageBroker(builder.Configuration, "email-service", Assembly.GetExecutingAssembly());

// Add exception handler
builder.Services.AddExceptionHandler<GlobalExceptionhandler>();

var app = builder.Build();

app.UseExceptionHandler(config => { });

app.Run();
