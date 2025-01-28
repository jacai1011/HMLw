namespace HMLw_WebApi.Models;

public class ProjectDto
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateOnly DueDate { get; set; }
    public string Color { get; set; } = "#FFFFFF";
    public List<TaskListDto> TaskLists { get; set; } = [];
    public ProjectDto() { }
    public ProjectDto(Project project)
    {
        Id = project.Id;
        Name = project.Name;
        DueDate = project.DueDate;
        Color = project.Color;

        TaskLists.AddRange(project.TaskLists.Select(tl => new TaskListDto(tl)).ToList());
    }
}