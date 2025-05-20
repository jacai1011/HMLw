import React, { useState, useEffect } from "react";
import { addTask } from '../services/api';
import './AddTask.css';
import { Plus, X } from 'lucide-react';

const AddTaskList = ({ taskListId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    isComplete: false,
    taskListId: taskListId,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await addTask(taskListId, formData);
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <div className="addProjectContainer">
      <button onClick={() => setIsOpen(true)} className="plusButton1">
        <Plus size={16} />
      </button>

      {isOpen && (
        <div className="overlay1">
          <div className="modal1">

            <button className="closeButton1" onClick={() => setIsOpen(false)}>
              <X size={16} />
            </button>


            <div className="addTask">New Task</div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Task..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input1"
                required
              />


              <button type="submit" className="submitButton1"> 
                Add Task
              </button>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTaskList;
