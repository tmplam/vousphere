using BuildingBlocks.Messaging.MassTransit;
using MediaService.API.BackgroundJobs;
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

    options.Schema.For<Media>();
}).UseLightweightSessions();

builder.Services.AddMessageBroker(builder.Configuration, Assembly.GetExecutingAssembly());

builder.Services.AddScoped<IFileStorageService, AzureFileStorageService>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("AzureBlobStorage")!;
    return new AzureFileStorageService(connectionString);
});

// Background jobs
builder.Services.AddQuartz(config =>
{
    var jobKey = new JobKey("clear-draft-medias-job");

    config.AddJob<ClearDraftMediasJob>(opts => opts.WithIdentity(jobKey));

    config.AddTrigger(opts => opts
        .ForJob(jobKey)
        .WithIdentity("clear-draft-medias-job-trigger")
        .WithCronSchedule("0 0 * * * ?")); // Runs every 1 hour
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

builder.Services.AddExceptionHandler<GlobalExceptionhandler>();



var app = builder.Build();



// Configure the HTTP request pipline
app.UseExceptionHandler(config => { });

app.UseAuthentication();
app.UseAuthorization();


app.MapCarter();

app.Run();
