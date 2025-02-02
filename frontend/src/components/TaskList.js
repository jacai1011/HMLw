import React, { useState, useEffect } from "react";
import { getTaskList } from "../services/api"; // Updated API call
import "./TaskList.css"; // For styling
import AddTask from '../components/AddTask';

const TaskList = ({ taskListId }) => {
  const [taskList, setTaskList] = useState(null);

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
        <div className="taskListName">{taskList.name}</div>
        <div className="taskListDate"> Due {formatDate(taskList.dueDate)}</div>
        <AddTask key={taskListId} taskListId={taskListId} />
      </div>
      <div className="tasksContainer">
        <ul>
            {taskList.tasks.map((task) => (
            <li key={task.id} className={task.isComplete ? "completed" : ""}>
                {task.title}
            </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskList;
