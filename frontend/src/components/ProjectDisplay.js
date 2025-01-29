import React, { useState, useEffect } from 'react';
import { getProject, getProjectTasksCount, getTimeLog } from '../services/api';
import { Bar } from 'react-chartjs-2';
import './ProjectDisplay.css';
import 'chart.js/auto';

const ProjectDisplay = ({ projectId }) => {
  const [project, setProject] = useState(null);
  const [tasksCount, setTasksCount] = useState({ completedTasks: 0, totalTasks: 0 });
  const [timeLogs, setTimeLogs] = useState([]); // Store logs for the last 5 days
  const [error, setError] = useState(null);
  const [isActive, setIsActive] = useState(false);

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

    const fetchTimeLogs = async () => {
      try {
        const today = new Date();
        const lastFiveDays = Array.from({ length: 5 }, (_, i) => {
          const date = new Date();
          date.setDate(today.getDate() - i);
          return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        }).reverse(); // Reverse to show in order (oldest to newest)

        const timeLogPromises = lastFiveDays.map(date => getTimeLog(projectId, date));
        const fetchedTimeLogs = await Promise.all(timeLogPromises);

        const formattedLogs = fetchedTimeLogs.map((log, index) => ({
          date: lastFiveDays[index], 
          hoursSpent: log?.hoursSpent || 0, // Default to 0 if no data
        }));

        setTimeLogs(formattedLogs);
      } catch (error) {
        setError('Error fetching time logs');
        console.error('Error fetching time logs:', error);
      }
    };

    fetchProject();
    fetchTasksCount();
    fetchTimeLogs();
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

  const chartData = {
    labels: timeLogs.map(log => ''), // Hide X-axis labels
    datasets: [
      {
        label: 'Hours Spent',
        data: timeLogs.map(log => log.hoursSpent),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { 
        grid: { display: false },
        ticks: { display: false }, // Hide X-axis labels
      },
      y: { 
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  const handleToggle = () => {
    setIsActive((prev) => !prev); // Toggle state
  };

  return (
    <div className="box">
      <div className="containerTop">
        <div className="colorBox" style={{ backgroundColor: project.color }}></div>
        <div className="projectName">{project.name}</div>
        <button
          className={`toggleButton ${isActive ? "active" : ""}`}
          onClick={handleToggle}
        >
          {isActive ? "Stop" : "Start"}
        </button>
      </div>
      <div className="containerMiddle">
        <div className="tasksDone">Tasks Done: {tasksCount.completedTasks}/{tasksCount.totalTasks}</div>
        <div className="progressBar">
          <div className="progress" style={{ width: `${percentageCompleted}%` }}></div>
        </div>
      </div>
      <div className="containerMiddleTwo">
        <Bar data={chartData} options={chartOptions} height={150} />
      </div>
      <div className="containerBottom">
        <div className="dueDate">DUE DATE: {project.dueDate}</div>
      </div>
    </div>
  );
};

export default ProjectDisplay;
