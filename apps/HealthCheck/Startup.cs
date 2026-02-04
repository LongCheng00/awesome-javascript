namespace HealthCheck
{
  public class Startup
  {
    public IConfiguration Configuration { get; }

    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services)
    {
      services.AddControllers();
      services.AddHealthChecks();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }
      else
      {
        app.UseExceptionHandler("/error");
        app.UseHsts();
      }

      app.UseHttpsRedirection();
      app.UseStaticFiles();
      if (!env.IsDevelopment())
      {
        // app.UseSpaStaticFiles();
      }
      app.UseRouting();
      // app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllerRoute(
          name: "default",
          pattern: "{controller}/{action=Index}/{id?}");
        endpoints.MapControllers();
        endpoints.MapHealthChecks("/health");
      });

      // app.UseSpa(spa =>
      // {
      //   spa.Options.SourcePath = "ClientApp";

      //   if (env.IsDevelopment())
      //   {
      //     spa.UseAngularCliServer(nameScript: "start");
      //   }
      // });
    }
  }
}