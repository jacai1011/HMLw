namespace HMLw_WebApi.Models;
public class TimeLog
{
    public long Id { get; set; }
    public long ProjectId { get; set; } // Foreign key to Project
    public DateTime Date { get; set; } // Tracks the date for daily logs
    public double HoursSpent { get; set; } // Number of hours logged for the day

    public Project Project { get; set; } // Navigation property
}
