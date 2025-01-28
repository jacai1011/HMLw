namespace HMLw_WebApi.Models;
public class Task
{
    public long Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool IsComplete { get; set; } = false;
    public long TaskListId { get; set; }
    public TaskList TaskList { get; set; } = null!;
}