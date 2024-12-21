var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddValidatorsFromAssembly(AssemblyReference.Assembly, includeInternalTypes: true);

builder.Services.AddMediatR(config =>
{
    config.RegisterServicesFromAssembly(AssemblyReference.Assembly);
    config.AddOpenBehavior(typeof(ValidationPipelineBehavior<,>));
});

builder.Services.AddCarter();

builder.Services.AddMarten(options =>
{
    options.Connection(builder.Configuration.GetConnectionString("Database")!);
    options.DisableNpgsqlLogging = true;
}).UseLightweightSessions();

builder.Services.AddExceptionHandler<GlobalExceptionhandler>();

builder.Services.AddAuthentication("NoAuth")
    .AddScheme<AuthenticationSchemeOptions, NoOpAuthenticationHandler>("NoAuth", _ => { });
builder.Services.AddAuthorization(ConfigurePolicies.AddAllPolicies);




var app = builder.Build();



// Configure the HTTP request pipline
app.UseExceptionHandler(config => { });

app.UseMiddleware<UserFromHeaderMiddleware>();

app.UseAuthorization();

app.MapCarter();

app.Run();
