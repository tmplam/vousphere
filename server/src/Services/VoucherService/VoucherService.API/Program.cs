using BuildingBlocks.Auth.Services;
using BuildingBlocks.Cors;
using BuildingBlocks.Messaging.MassTransit;
using System.Reflection;
using VoucherService.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add pipelines
builder.Services.AddValidatorsFromAssembly(AssemblyReference.Assembly, includeInternalTypes: true);

builder.Services.AddMediatR(config =>
{
    config.RegisterServicesFromAssembly(AssemblyReference.Assembly);
    config.AddOpenBehavior(typeof(ValidationPipelineBehavior<,>));
});

builder.Services.AddCarter();

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

// Add database and message broker
builder.Services.AddMarten(options =>
{
    options.Connection(builder.Configuration.GetConnectionString("Database")!);
    options.UseNewtonsoftForSerialization(enumStorage: EnumStorage.AsString);
    options.DisableNpgsqlLogging = true;

    options.Schema.For<Voucher>();
    options.Schema.For<ItemPiece>();
    options.Schema.For<Transaction>();
}).UseLightweightSessions();

builder.Services.AddMessageBroker(builder.Configuration, "voucher-service", Assembly.GetExecutingAssembly());

// Add authentication and authorization
builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = PayloadDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = PayloadDefaults.AuthenticationScheme;
    })
    .AddScheme<AuthenticationSchemeOptions, PayloadAuthenticationHandler>(PayloadDefaults.AuthenticationScheme, options => { });

builder.Services.AddAuthorization(ConfigurePolicies.AddAllPolicies);

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IClaimService, ClaimService>();

// Add services
builder.Services.AddScoped<IVoucherUtility, VoucherUtility>();

// Add CORS
builder.Services.AddAllowAllCors();


builder.Services.AddExceptionHandler<GlobalExceptionhandler>();



var app = builder.Build();



// Configure the HTTP request pipline
app.UseExceptionHandler(config => { });

app.UseCors();

app.UseAuthentication();

app.UseAuthorization();

app.MapCarter();

app.Run();
