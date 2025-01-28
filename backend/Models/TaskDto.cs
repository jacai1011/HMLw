namespace HMLw_WebApi.Models;
public class TaskDto
{
    public long Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool IsComplete { get; set; }
    public TaskDto() { }
    public TaskDto(Task task)
        : this()
    {
        Id = task.Id;
        Title = task.Title;
        IsComplete = task.IsComplete;
    }
}