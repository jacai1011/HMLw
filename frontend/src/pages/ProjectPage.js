import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProject } from "../services/api";
import "./ProjectPage.css";
import AddTaskList from '../components/AddTaskList';
import TaskList from "../components/TaskList";

const ProjectPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

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
  
    fetchProject();
  }, [projectId]);

  if (!project) return <div>Loading project...</div>;

  return (
    <div className="project-container">
      <h2>{project.name}</h2>
      <p>Due Date: {project.dueDate}</p>
      <div className="taskTitleContainer">
        <div className="tasksTitle">Tasks</div>
        <AddTaskList key={projectId} projectId={projectId} />
      </div>
      <div className="taskListContainer">
        <div>
          {project.taskLists.map((taskList) => (
            <TaskList key={taskList.id} taskListId={taskList.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
