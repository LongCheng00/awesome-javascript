using HealthCheck;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();
// builder.Services.AddHealthChecks();
builder.Services.AddHealthChecks().AddCheck<ICMPHealthCheck>("ICMP");
// builder.Services.AddHealthChecks()
//     .AddCheck("ICMP01", new ICMPHealthCheck("www.google.com", 100))
//     .AddCheck("ICMP02", new ICMPHealthCheck("www.ryadel.com", 100))
//     .AddCheck("ICMP03", new ICMPHealthCheck("www.does-not-exist.com", 100));

var app = builder.Build();
var configuration = app.Services.GetRequiredService<IConfiguration>();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles(new StaticFileOptions()
{
    OnPrepareResponse = (context) =>
    {
        // Disable caching for all static files.
        context.Context.Response.Headers.Append("Cache-Control", "no-cache, no-store, must-revalidate");
        context.Context.Response.Headers.Append("Pragma", "no-cache");
        context.Context.Response.Headers["Expires"] = configuration["StaticFiles:Headers:Expires"];
    }
});
app.UseRouting();

app.UseHealthChecks("/health");

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller}/{action=Index}/{id?}");
    endpoints.MapControllers();
    // endpoints.MapHealthChecks("/health");
});
// app.MapControllerRoute(
//     name: "default",
//     pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();