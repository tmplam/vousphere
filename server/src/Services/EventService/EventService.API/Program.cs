using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
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

builder.Services.AddMarten(options =>
{
    options.Connection(builder.Configuration.GetConnectionString("Database")!);
    options.UseNewtonsoftForSerialization(enumStorage: EnumStorage.AsString);
    options.DisableNpgsqlLogging = true;

    options.Schema.For<Event>()
        .NgramIndex(e => e.Name)
        .NgramIndex(e => e.Description);
}).UseLightweightSessions();

builder.Services.AddExceptionHandler<GlobalExceptionhandler>();

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



var app = builder.Build();



// Configure the HTTP request pipline
app.UseExceptionHandler(config => { });

app.UseAuthentication();
app.UseAuthorization();

app.MapCarter();

app.Run();
