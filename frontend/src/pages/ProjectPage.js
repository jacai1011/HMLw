import React, { useEffect, useState, useRef } from "react";
import { Trash, Pencil, Calendar, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams } from "react-router-dom";
import { getProject, updateTimeLog } from "../services/api";
import "./ProjectPage.css";
import AddTaskList from '../components/AddTaskList';
import EditTaskList from "../components/EditTaskList";
import TaskList from "../components/TaskList";
import { deleteProject } from '../services/api';

const ProjectPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    console.log("Fetching project with ID:", projectId);
    const fetchProject = async () => {
      try {
        const data = await getProject(projectId);
        console.log("Fetched project data:", data);
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    handleClickOutside();
    fetchProject();
  
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [projectId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return `${date.toLocaleDateString('en-GB', options)}`;
  };

  const handleToggle = async () => {
    if (isActive) {
      const now = Date.now();
      const secondsElapsed = Math.floor((now - startTime) / 1000);
  
      const today = new Date().toISOString().split('T')[0];
      console.log(secondsElapsed);

      updateTimeLog(projectId, today, Math.round((secondsElapsed / 3600) * 10) / 10);
  
      setStartTime(null);
    } else {
      setStartTime(Date.now());
    }
  
    setIsActive((prev) => !prev);
  };

  if (!project) return <div>Loading project...</div>;

  return (
    <div className="project-container">
      <div className="titleContainer">
        <div className="projectTitle">{project.name}</div>
        <div ref={dropdownRef} className="ppDropdownWrapper" >
          <button 
            className="projectButton"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((prev) => !prev);
            }}
          >
            <div
              className="ppOptionsDropdown"
            />
          </button>
          {open && (

            <div className="ppDropdownMenu" onClick={(e) => e.stopPropagation()}>
              <button className="dropdownOption">
                Rename
                <Pencil className="optionIcon" size={16} />
              </button>
              <button className="dropdownOption">
                Due Date
                <Calendar className="optionIcon" size={16} />
              </button>
              <button
                className="dropdownOption"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    if (window.confirm('Are you sure you want to delete this project?')) {
                      await deleteProject(projectId);
                      setOpen(false);
                      window.location.reload();
                    }
                  } catch (err) {
                    console.error('Error deleting project:', err);
                  }
                }}
              >
                Delete
                <Trash className="optionIcon" size={16} />
              </button>
            </div>

          )}
        </div>
      </div>
      <button
          className={`toggleButton ${isActive ? "active" : ""}`}
          onClick={handleToggle}
        >
        {isActive ? "Stop" : "Start"}
      </button>
      <p>Due {formatDate(project.dueDate)}</p>
      <hr style={{ border: '1px solid #ccc', width: '100%' }} />
      <div className="taskListsPageContainer">
        {!collapsed && (
          <div className="taskListsAppendix">
            <List size={16} />
            TaskLists
          </div>
        )}
        <div className="appendixSliderContainer">
          <button
            className="appendixButton"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle Appendix Visibility"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          <div className="vertical-line"></div>
        </div>
        <div className="taskLists">
          <div className="taskTitleContainer">
            <div className="tasksTitle">Tasks</div>
            <AddTaskList key={projectId} projectId={projectId} />
          </div>
          <div className="taskListsContainer">
            <div>
              {project.taskLists.map((taskList) => (
                <TaskList key={taskList.id} taskListId={taskList.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
