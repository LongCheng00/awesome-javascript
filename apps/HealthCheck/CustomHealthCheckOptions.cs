
using System.Net.Mime;
using System.Linq;
using System.Text.Json;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace HealthCheck;

public class CustomHealthCheckOptions : HealthCheckOptions
{
  public CustomHealthCheckOptions() : base()
  {
    var jsonSerializerOptions = new JsonSerializerOptions
    {
      WriteIndented = true
    };
    ResponseWriter = async (c, r) =>
    {
      c.Response.ContentType = MediaTypeNames.Application.Json;
      c.Response.StatusCode = StatusCodes.Status200OK;
      var result = JsonSerializer.Serialize(new
      {
        status = r.Status.ToString(),
        checks = r.Entries.Select(e => new
        {
          name = e.Key,
          responseTime = e.Value.Duration.TotalMilliseconds,
          status = e.Value.Status.ToString(),
          description = e.Value.Description
        }),
        totalStatus = r.Status.ToString(),
        totalResponseTime = r.TotalDuration.TotalMilliseconds
      }, jsonSerializerOptions);
      await c.Response.WriteAsync(result);
    };
  }
}