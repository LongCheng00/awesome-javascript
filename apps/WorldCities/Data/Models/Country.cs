namespace WorldCities.Data.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
public class Country
{
  [Key]
  [Required]
  public int Id { get; set; }
  public string Name { get; set; } = null!;
  public string ISO2 { get; set; } = null!;
  public string ISO3 { get; set; }
  public virtual ICollection<City> Cities { get; set; } = new List<City>();
}