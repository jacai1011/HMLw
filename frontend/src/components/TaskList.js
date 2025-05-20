import React, { useState, useEffect } from "react";
import { getTaskList } from "../services/api"; // Updated API call
import "./TaskList.css"; // For styling
import AddTask from '../components/AddTask';
import EditTaskList from "./EditTaskList";
import { ChevronDown, ChevronRight } from 'lucide-react';


const TaskList = ({ taskListId }) => {
  const [taskList, setTaskList] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const fetchTaskList = async () => {
      try {
        const list = await getTaskList(taskListId); // Use getTaskList directly
        setTaskList(list);
      } catch (error) {
        console.error("Error fetching task list:", error);
      }
    };

    fetchTaskList();
  }, [taskListId]);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return `${date.toLocaleDateString('en-GB', options)}`;
  };

  if (!taskList) {
    return <div className="task-list">Loading...</div>;
  }

  return (
    <div className="task-list">
      <div className="taskListContainer">
        <button
          className="collapseToggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle Task Visibility"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
        </button>
        <div className="taskListName">{taskList.name}</div>
        <div className="taskListDate"> Due {formatDate(taskList.dueDate)}</div>
        <EditTaskList key={taskListId} taskListId={taskListId} />
        <AddTask key={taskListId} taskListId={taskListId} />
      </div>

      {!collapsed && (
        <div className="tasksContainer">
          <ul>
            {taskList.tasks.map((task) => (
              <li key={task.id} className={task.isComplete ? "completed" : ""}>
                {task.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskList;
