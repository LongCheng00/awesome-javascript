namespace WorldCities.Data;

using Microsoft.EntityFrameworkCore;
using WorldCities.Data.Models;

public class AppDbContext : DbContext
{
  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
  {
  }
  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);
    modelBuilder.Entity<Country>().ToTable("countries");
    modelBuilder.Entity<City>().ToTable("cities");
  }

  public DbSet<Country> Countries { get; set; } = null!;
  public DbSet<City> Cities { get; set; } = null!;
}