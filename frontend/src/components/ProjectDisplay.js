import React, { useState, useEffect } from 'react';
import { getProject, getProjectTasksCount } from '../services/api';
import './ProjectDisplay.css';

const ProjectDisplay = ({ projectId }) => {
  const [project, setProject] = useState(null);
  const [tasksCount, setTasksCount] = useState({ completedTasks: 0, totalTasks: 0 });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const fetchedProject = await getProject(projectId);
        setProject(fetchedProject);
      } catch (error) {
        setError('Error fetching project details');
        console.error('Error fetching project:', error);
      }
    };

    const fetchTasksCount = async () => {
      try {
        const fetchedTasksCount = await getProjectTasksCount(projectId);
        setTasksCount(fetchedTasksCount);
      } catch (error) {
        setError('Error fetching task count');
        console.error('Error fetching task count:', error);
      }
    };

    fetchProject();
    fetchTasksCount();
  }, [projectId]);

  if (error) {
    return <div className="box">Error: {error}</div>;
  }

  if (!project) {
    return <div className="box">Loading...</div>;
  }

  
  const percentageCompleted =
    tasksCount.totalTasks > 0
      ? (tasksCount.completedTasks / tasksCount.totalTasks) * 100
      : 0;

  return (
    <div className="box">
      <div className="containerTop">
        <div
          className="colorBox"
          style={{ backgroundColor: project.color }}
        ></div>
        <div className="projectName">{project.name}</div>
      </div>
      <div className="containerMiddle">
        <div className="tasksDone">Task Done: {tasksCount.completedTasks}/{tasksCount.totalTasks}</div>
        <div className="progressBar">
          <div
            className="progress"
            style={{ width: `${percentageCompleted}%` }}
          ></div>
        </div>
      </div>
      <div className="containerBottom">
        <div className="dueDate">DUE DATE: {project.dueDate}</div>
      </div>
    </div>
  );
};

export default ProjectDisplay;
