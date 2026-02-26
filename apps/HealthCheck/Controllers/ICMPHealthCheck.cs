
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace HealthCheck;

public class ICMPHealthCheck : IHealthCheck
{
  private string Host { get; set; } = "www.google.com";
  private int Timeout { get; set; } = 300;

  public ICMPHealthCheck(string host, int timeout)
  {
    Host = host;
    Timeout = timeout;
  }

  public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
  {
    try
    {
      using (var ping = new Ping())
      {
        var reply = await ping.SendPingAsync(Host);
        if (reply.Status == IPStatus.Success)
        {
          if (reply.RoundtripTime > Timeout)
          {
            return HealthCheckResult.Degraded($"ICMP to {Host} succeeded but took too long: {reply.RoundtripTime}ms.");
          }
          return HealthCheckResult.Healthy($"ICMP to {Host} succeeded.");
        }
        else
        {
          return HealthCheckResult.Unhealthy($"ICMP to {Host} failed with status {reply.Status}.");
        }
      }
    }
    catch (Exception ex)
    {
      return HealthCheckResult.Unhealthy($"ICMP to {Host} failed with exception: {ex.Message}");
    }
  }
}