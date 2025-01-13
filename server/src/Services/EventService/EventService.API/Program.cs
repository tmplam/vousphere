using BuildingBlocks.Cors;
using BuildingBlocks.Http.OptionsSetup;
using BuildingBlocks.Messaging.MassTransit;
using EventService.API.Data;
using Quartz;
using System.Reflection;
using System.Text.Json.Serialization;

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

    options.Schema.For<Event>()
        .NgramIndex(e => e.Name)
        .NgramIndex(e => e.Description);
}).UseLightweightSessions();

builder.Services.AddMessageBroker(builder.Configuration, "event-service", Assembly.GetExecutingAssembly());

// Background jobs
builder.Services.AddQuartz(options =>
{
    options.UsePersistentStore(persistenceOptions =>
    {
        persistenceOptions.UsePostgres(cfg =>
        {
            cfg.ConnectionStringName = "Database";
            cfg.TablePrefix = "quartz_scheduler.qrtz_";
        },
        dataSourceName: "EventDb");

        persistenceOptions.UseNewtonsoftJsonSerializer();
        persistenceOptions.UseProperties = true;
    });
});

builder.Services.AddQuartzHostedService(options =>
{
    options.WaitForJobsToComplete = true;
});

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

// Internal servives call configuration
builder.Services.ConfigureOptions<InternalServiceOptionsSetup>();

builder.Services.AddMediaServiceClient();
builder.Services.AddUserServiceClient();


// Add exception handler
builder.Services.AddExceptionHandler<GlobalExceptionhandler>();

// Add CORS
builder.Services.AddAllowAllCors();

if (builder.Environment.IsDevelopment())
{
    builder.Services.InitializeMartenWith<InitialData>();
}


var app = builder.Build();



// Configure the HTTP request pipline
app.UseExceptionHandler(config => { });

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapCarter();

app.Run();
