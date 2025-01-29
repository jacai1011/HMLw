namespace HMLw_WebApi.Models;
public class TimeLog
{
    public long Id { get; set; }
    public long ProjectId { get; set; }
    public DateOnly Date { get; set; }
    public double HoursSpent { get; set; }
    public Project Project { get; set; } = null!;
}
