using System.Text;
using API.Data;
using API.Entities;
using API.Middleware;
using API.RequestHelpers;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);
builder.Services.AddEndpointsApiExplorer();
// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);
builder.Services.AddEndpointsApiExplorer();


string connString;
if (builder.Environment.IsDevelopment())
{
    connString = builder.Configuration.GetConnectionString("DefaultConnection");
}
else
{
    // Use connection string provided at runtime by FlyIO.
    var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

    if (string.IsNullOrEmpty(connUrl))
    {
        // This will show up clearly in your 'fly logs'
        throw new InvalidOperationException("DATABASE_URL environment variable is empty. Check if Postgres is attached.");
    }

    try 
    {
        // Parse connection URL to connection string for Npgsql using Uri class
        var databaseUri = new Uri(connUrl);
        var userInfo = databaseUri.UserInfo.Split(':');

        var pgUser = userInfo[0];
        var pgPass = userInfo[1];
        var pgHost = databaseUri.Host;
        var pgPort = databaseUri.Port;
        var pgDb = databaseUri.LocalPath.TrimStart('/');

        // Fly.io specific: internal networking
        var updatedHost = pgHost.Replace("flycast", "internal");

        // В Program.cs найди строку формирования connString и замени на эту:
        connString = $"Server={updatedHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb};Trust Server Certificate=true;";
    }
    catch (Exception ex)
    {
        throw new Exception("Error parsing DATABASE_URL. Make sure it's in the correct format.", ex);
    }
}

builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning));
    opt.UseNpgsql(connString);
});

// Configure IdentityCore on the service collection
builder.Services.AddIdentityCore<User>(opt =>
{
    opt.User.RequireUniqueEmail = true; //avoid duplicates for email
    opt.SignIn.RequireConfirmedEmail = false;
    })
    .AddRoles<Role>()
    .AddEntityFrameworkStores<StoreContext>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt => {
        opt.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies["jwt"];
                return Task.CompletedTask;
            }
        };
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.
                GetBytes(builder.Configuration["JWTSettings:TokenKey"]))
        };
    });
builder.Services.AddAuthorization();
builder.Services.AddScoped<TokenService>(); //add scoped to http response and dispose when responsed
builder.Services.AddScoped<PaymentService>();
builder.Services.AddScoped<ImageService>();

// Build the application
var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

app.UseXContentTypeOptions();

app.UseXXssProtection(Options => Options.EnabledWithBlockMode());
app.UseXfo(opt => opt.Deny()); //against click-hijacking
app.UseCsp(opt => opt
    .BlockAllMixedContent()
    .StyleSources(s => s.Self()
        .CustomSources("https://fonts.googleapis.com", "https://checkout.stripe.com")
        .UnsafeInline() 
    )
    .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com", "data:"))
    .FormActions(s => s.Self())
    .FrameAncestors(s => s.Self())
    // Добавляем Stripe в скрипты и фреймы
    .ScriptSources(s => s.Self()
        .CustomSources("https://js.stripe.com", "https://checkout.stripe.com")
    )
    .FrameSources(s => s.Self()
        .CustomSources("https://js.stripe.com", "https://checkout.stripe.com")
    )
    .ImageSources(s => s.Self()
        .CustomSources("blob:", "data:", "https://res.cloudinary.com", "https://*.stripe.com")
    )
);

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
else
{
    // Включаем HSTS (уже есть ручной заголовок, но лучше использовать стандарт)
    app.UseHsts(); 
    
    // Обязательно добавляем редирект с http на https
    app.UseHttpsRedirection(); 

    app.Use(async (context, next) =>
    {
        context.Response.Headers.Remove("X-Powered-By");
        context.Response.Headers.Append("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
        context.Response.Headers.Append("Strict-Transport-Security", "max-age=31536000");
        await next.Invoke();
    });
}



app.UseReferrerPolicy(options => options.NoReferrer());
app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

app.MapFallbackToController("index", "Fallback"); // auto-recognizing routes

using var scope = app.Services.CreateScope();
var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

try
{
    logger.LogInformation("Starting migrations..."); 
    await context.Database.MigrateAsync();
    logger.LogInformation("Migrations applied successfully!"); 
    
    await DbInitializer.Initialize(context, userManager);
    logger.LogInformation("Database seeding completed!");
}
catch (Exception ex)
{
    logger.LogError(ex, "A problem occurred during migration");
}

app.Run();
