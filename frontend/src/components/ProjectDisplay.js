import React, { useState, useRef, useEffect } from 'react';
import { getProject, getProjectTasksCount, getTimeLog, addTimeLog } from '../services/api';
import { useNavigate } from "react-router-dom";
import { Line } from 'react-chartjs-2';
import './ProjectDisplay.css';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { deleteProject } from '../services/api';
import { Trash, Pencil, Calendar } from 'lucide-react';

const ProjectDisplay = ({ projectId }) => {
  const [project, setProject] = useState(null);
  const [tasksCount, setTasksCount] = useState({ completedTasks: 0, totalTasks: 0 });
  const [timeLogs, setTimeLogs] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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
    
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    handleClickOutside();
    fetchProject();
    fetchTasksCount();
    fetchTimeLogs();
      
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
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
    <div
      className="box"
      onClick={() => {
        if (open) {
          setOpen(false);
        } else {
          navigate(`/project/${projectId}`);
        }
      }}
    >
      <div className="containerTop">
        <div className="colorBox" style={{ backgroundColor: project.color }}></div>
        <div className="projectName">{project.name}</div>
        <div ref={dropdownRef} className="dropdownWrapper" >
          <button
            className="optionsDropdown"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((prev) => !prev);
            }}
          />
          {open && (
            <div className="dropdownMenu" onClick={(e) => e.stopPropagation()}>
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
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDisplay;
