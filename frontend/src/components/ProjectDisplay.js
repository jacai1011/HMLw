import React, { useState, useEffect } from 'react';
import { getProject, getProjectTasksCount, getTimeLog, addTimeLog, updateTimeLog } from '../services/api';
import { Line } from 'react-chartjs-2';
import './ProjectDisplay.css';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const ProjectDisplay = ({ projectId }) => {
  const [project, setProject] = useState(null);
  const [tasksCount, setTasksCount] = useState({ completedTasks: 0, totalTasks: 0 });
  const [timeLogs, setTimeLogs] = useState([]);
  const [error, setError] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // To track the time elapsed in seconds
  const [timerId, setTimerId] = useState(null); // To store the timer interval ID

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
          return date.toISOString().split('T')[0];
        }).reverse();
    
        const timeLogPromises = lastFiveDays.map(async (date) => {
          try {
            const log = await getTimeLog(projectId, date);
            return { date, hoursSpent: log?.hoursSpent || 0 };
          } catch (error) {
            await addTimeLog(projectId, date, 0);
            return { date, hoursSpent: 0 };
          }
        });
    
        const formattedLogs = await Promise.all(timeLogPromises);
        setTimeLogs(formattedLogs);
    
      } catch (error) {
        setError('Error fetching time logs');
        console.error('Error fetching or adding time logs:', error);
      }
    };

    fetchProject();
    fetchTasksCount();
    fetchTimeLogs();
  }, [projectId]);

  useEffect(() => {
    // Clean up timer on component unmount or when the timer is stopped
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [timerId]);

  const handleToggle = async () => {
    if (isActive) {
      // Stop the timer
      clearInterval(timerId);
      setTimerId(null);
      
      // Update time log for the project
      const today = new Date().toISOString().split('T')[0]; // Get today's date in yyyy-mm-dd format
      console.log(elapsedTime/3600)
      await updateTimeLog(projectId, today, Math.round((elapsedTime/3600) * 10) / 10); // Convert seconds to hours
      setElapsedTime(0); // Reset elapsed time
    } else {
      // Start the timer
      const id = setInterval(() => {
        setElapsedTime((prev) => prev + 1); // Increment time every second
      }, 1000);
      setTimerId(id);
    }

    setIsActive((prev) => !prev); // Toggle state
  };

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
    labels: timeLogs.map(log => log.date), // X-axis labels (dates)
    datasets: [
      {
        label: 'Hours Spent',
        data: timeLogs.map(log => log.hoursSpent), // Y-axis data (hours)
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        pointRadius: 5,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'PP',
        },
        grid: { display: false },
        ticks: {
          callback: function (value) {
            const date = new Date(value);
            const options = { month: 'short', day: '2-digit' };
            return date.toLocaleDateString('en-AU', options);
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
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
        <Line data={chartData} options={chartOptions} height={150} />
      </div>
      <div className="containerBottom">
        <div className="dueDateWrap">
          <div className="dueDate">
            DUE DATE: {new Date(project.dueDate).toLocaleDateString('en-AU', {
              day: '2-digit',   // Day (e.g., '01')
              month: 'short',   // Abbreviated month (e.g., 'Jan')
              year: 'numeric',  // Full year (e.g., '2025')
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDisplay;
