namespace HMLw_WebApi.Models;
public class TimeLogDto
{
    public long Id { get; set; }
    public DateOnly Date { get; set; }
    public double HoursSpent { get; set; }
    public TimeLogDto() { }
    public TimeLogDto(TimeLog timeLog)
        : this()
    {
        Id = timeLog.Id;
        Date = timeLog.Date;
        HoursSpent = timeLog.HoursSpent;
    }
}