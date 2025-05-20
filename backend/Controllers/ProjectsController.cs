using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HMLw_WebApi.Models;

namespace HMLw_WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly ProjectContext _context;

    public ProjectsController(ProjectContext context)
    {
        _context = context;
    }

    // Get all projects without tasklists && tasks
    [HttpGet("getProjects")]
    public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjects()
    {
        var projects = await _context.Projects
            .Select(x => new ProjectDto(x))
            .ToListAsync();

        if (projects == null || !projects.Any())
        {
            return NotFound();
        }

        return Ok(projects);
    }


    // Get a single project including tasklists && tasks
    [HttpGet("getProject/{projectId}")]
    public async Task<ActionResult<ProjectDto>> GetProject(long projectId)
    {

        if (projectId <= 0)
        {
            return BadRequest("Invalid project ID.");
        }
        var project = await _context.Projects.Include(p => p.TaskLists)
                                             .ThenInclude(tl => tl.Tasks)
                                             .FirstOrDefaultAsync(p => p.Id == projectId);

        if (project == null) return NotFound();

        var projectDto = new ProjectDto
        {
            Id = project.Id,
            Name = project.Name,
            DueDate = project.DueDate,
            Color = project.Color,
            TaskLists = project.TaskLists.Select(tl => new TaskListDto
            {
                Id = tl.Id,
                Name = tl.Name,
                Order = tl.Order,
                DueDate = tl.DueDate,
                Tasks = tl.Tasks.Select(t => new TaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    IsComplete = t.IsComplete
                }).ToList()
            }).ToList()
        };

        return Ok(projectDto);
    }

    [HttpPost("createProject")]
    public async Task<ActionResult<ProjectDto>> CreateProject(ProjectDto projectDto)
    {
        var project = new Project
        {
            Name = projectDto.Name,
            DueDate = projectDto.DueDate,
            Color = projectDto.Color
        };

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        var createdProjectDto = new ProjectDto(project);

        return CreatedAtAction(nameof(GetProject), new { projectId = project.Id }, createdProjectDto);
    }


    [HttpGet("getTaskList/{taskListId}")]
    public async Task<ActionResult<TaskListDto>> GetTaskList(long taskListId)
    {
        if (taskListId <= 0)
        {
            return BadRequest("Invalid task list ID.");
        }

        var taskList = await _context.TaskLists
                                    .Include(tl => tl.Tasks)
                                    .FirstOrDefaultAsync(tl => tl.Id == taskListId);

        if (taskList == null)
        {
            return NotFound();
        }

        var taskListDto = new TaskListDto
        {
            Id = taskList.Id,
            Name = taskList.Name,
            Order = taskList.Order,
            DueDate = taskList.DueDate,
            Tasks = taskList.Tasks.Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                IsComplete = t.IsComplete
            }).ToList()
        };

        return Ok(taskListDto);
    }

    [HttpPost("addTaskList/{projectId}")]
    public async Task<ActionResult<TaskListDto>> AddTaskList(long projectId, TaskListDto taskListDto)
    {
        var project = await _context.Projects.FindAsync(projectId);
        if (project == null) return NotFound();

        var taskList = new TaskList
        {
            Name = taskListDto.Name,
            Order = taskListDto.Order,
            DueDate = taskListDto.DueDate,
            ProjectId = project.Id        
        };
        project.TaskLists.Add(taskList);
        _context.TaskLists.Add(taskList);
        await _context.SaveChangesAsync();

        var createdTaskListDto = new TaskListDto(taskList);

        return CreatedAtAction(nameof(GetTaskList), new { taskListId = taskList.Id }, createdTaskListDto);
    }

    [HttpGet("getTask/{taskId}")]
    public async Task<ActionResult<TaskDto>> GetTask(long taskId)
    {
        if (taskId <= 0)
        {
            return BadRequest("Invalid task list ID.");
        }

        var task = await _context.Tasks.FirstOrDefaultAsync(tl => tl.Id == taskId);

        if (task == null)
        {
            return NotFound();
        }

        var taskDto = new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            IsComplete = task.IsComplete,
        };

        return Ok(taskDto);
    }

    [HttpPost("addTask/{taskListId}")]
    public async Task<ActionResult<TaskDto>> AddTask(long taskListId, TaskDto taskDto)
    {
        var taskList = await _context.TaskLists.FindAsync(taskListId);
        if (taskList is null) return NotFound();

        var task = new Models.Task
        {
            Title = taskDto.Title,
            IsComplete = taskDto.IsComplete,
            TaskListId = taskList.Id
        };
        taskList.Tasks.Add(task);
        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        var createdTaskDto = new TaskDto(task);

        return CreatedAtAction(nameof(GetTask), new { taskId = task.Id }, createdTaskDto);
    }

    [HttpDelete("deleteTask/{taskId}")]
    public async Task<IActionResult> DeleteTask(long taskId)
    {
        var task = await _context.Tasks.FindAsync(taskId);
        if (task is null) return NotFound();

        var taskList = await _context.TaskLists.FindAsync(task.TaskListId);
        if (taskList is null) return NotFound();

        taskList.Tasks.Remove(task);
        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("deleteTaskList/{taskListId}")]
    public async Task<IActionResult> DeleteTaskList(long taskListId)
    {
        var taskList = await _context.TaskLists.FindAsync(taskListId);
        if (taskList is null) return NotFound();

        var project = await _context.Projects.FindAsync(taskList.ProjectId);
        if (project is null) return NotFound();

        project.TaskLists.Remove(taskList);
        _context.TaskLists.Remove(taskList);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("deleteProject/{projectId}")]
    public async Task<IActionResult> DeleteProject(long projectId)
    {
        var project = await _context.Projects.FindAsync(projectId);
        if (project is null) return NotFound();

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();

        return NoContent();
    }
    
    [HttpGet("getCompletedTaskCount/{projectId}")]
    public async Task<ActionResult<int>> GetCompletedTaskCount(long projectId)
    {
        var completedTaskCount = await _context.Tasks
            .Where(t => t.TaskList.ProjectId == projectId && t.IsComplete)
            .CountAsync();

        return Ok(completedTaskCount);
    }

    [HttpGet("getTaskListStatus/{taskListId}")]
    public async Task<ActionResult<bool>> GetTaskListStatus(long taskListId)
    {
        var taskCount = await _context.Tasks
            .Where(t => t.TaskList.Id == taskListId)
            .CountAsync();

        if (taskCount == 0)
        {
            return NotFound($"No tasks found for TaskList with ID {taskListId}");
        }

        var completedTaskCount = await _context.Tasks
            .Where(t => t.TaskList.Id == taskListId && t.IsComplete)
            .CountAsync();

        bool allTasksCompleted = completedTaskCount == taskCount;

        return Ok(allTasksCompleted);
    }
    [HttpGet("getProjectTasksCount/{projectId}")]
    public async Task<ActionResult<object>> GetProjectTasksCount(long projectId)
    {
        var taskLists = await _context.TaskLists
            .Where(tl => tl.ProjectId == projectId)
            .Include(tl => tl.Tasks)
            .ToListAsync();

        if (!taskLists.Any())
        {
            return Ok(new { CompletedTasks = 0, TotalTasks = 0 });
        }

        int totalTasks = 0;
        int completedTasks = 0;

        foreach (var taskList in taskLists)
        {
            int taskListTotalTasks = taskList.Tasks.Count;
            totalTasks += taskListTotalTasks;

            int taskListCompletedTasks = taskList.Tasks.Count(t => t.IsComplete);
            completedTasks += taskListCompletedTasks;
        }

        return Ok(new { CompletedTasks = completedTasks, TotalTasks = totalTasks });
    }


    [HttpPut("completeTask/{taskId}")]
    public async Task<IActionResult> CompleteTask(long taskId)
    {
        var task = await _context.Tasks.FindAsync(taskId);

        if (task is null) return NotFound();

        task.IsComplete = !task.IsComplete;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("reorderTaskList/{taskListId}/{reorder}")]
    public async Task<IActionResult> ReorderTaskList(long taskListId, int reorder)
    {
        var taskList = await _context.TaskLists.FindAsync(taskListId);

        if (taskList is null) return NotFound();

        taskList.Order = reorder;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("clearDatabase")]
    public async Task<IActionResult> ClearDatabase()
    {
        try
        {
            // Remove all entries from each DbSet
            _context.Tasks.RemoveRange(_context.Tasks);
            _context.TaskLists.RemoveRange(_context.TaskLists);
            _context.Projects.RemoveRange(_context.Projects);

            // Save changes to the database
            await _context.SaveChangesAsync();

            return Ok("Database cleared successfully.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error clearing database: {ex.Message}");
        }
    }

    [HttpGet("getTimeLog/{projectId}/{date}")]
    public async Task<ActionResult<IEnumerable<TimeLogDto>>> GetTimeLog(long projectId, DateOnly date)
    {
        var timeLog = await _context.TimeLogs
            .FirstOrDefaultAsync(tl => tl.ProjectId == projectId && tl.Date == date);

        if (timeLog is null) return NotFound();

        var timeLogDto = new TimeLogDto
        {
            Id = timeLog.Id,
            Date = timeLog.Date,
            HoursSpent = timeLog.HoursSpent,
        };

        return Ok(timeLogDto);
    }

    [HttpPost("addTimeLog/{projectId}")]
    public async Task<ActionResult<TimeLogDto>> AddTimeLog(long projectId, TimeLogDto timeLogDto)
    {
        var project = await _context.Projects.FindAsync(projectId);
        if (project == null) return NotFound();

        var timeLog = new TimeLog
        {
            Id = timeLogDto.Id,
            Date = timeLogDto.Date,
            HoursSpent = timeLogDto.HoursSpent,
            ProjectId = projectId,
        };
        project.TimeLogs.Add(timeLog);
        _context.TimeLogs.Add(timeLog);
        await _context.SaveChangesAsync();

        var createdTimeLogDto = new TimeLogDto(timeLog);

        return CreatedAtAction(nameof(GetTimeLog), new { projectId = timeLog.Id, date = timeLog.Date }, createdTimeLogDto);
    }

    [HttpPut("updateTimeLog/{projectId}/{date}")]
    public async Task<IActionResult> UpdateTimeLog(long projectId, DateOnly date, double hoursSpent)
    {
        var timeLog = await _context.TimeLogs
            .FirstOrDefaultAsync(tl => tl.ProjectId == projectId && tl.Date == date);

        if (timeLog is null) return NotFound();

        if (hoursSpent < 0)
        {
            return BadRequest("Hours spent cannot be negative.");
        }

        timeLog.HoursSpent += hoursSpent;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("renameTaskList/{taskListId}")]
    public async Task<IActionResult> RenameTaskList(long taskListId, [FromQuery] string name)
    {
        var taskList = await _context.TaskLists.FindAsync(taskListId);
        if (taskList == null)
        {
            return NotFound();
        }

        taskList.Name = name;
        await _context.SaveChangesAsync();

        return NoContent();
    }

}
