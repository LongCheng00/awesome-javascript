namespace WorldCities.Data.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class City
{
  [Key]
  [Required]
  public int Id { get; set; }
  public string Name { get; set; } = null!;
  public string Name_ASCII { get; set; } = null!;
  public decimal lat { get; set; }
  public decimal lng { get; set; }
  [ForeignKey("Country")]
  public int CountryId { get; set; }
  public virtual Country Country { get; set; } = null!;
}