import React, { useState, useEffect } from "react";
import { addTask } from '../services/api';
import './AddTask.css';

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
      <button onClick={() => setIsOpen(true)} className="plusButton1">+</button>

      {isOpen && (
        <div className="overlay1">
          <div className="modal1">
            <h2>Add Task</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input1"
                required
              />

              <div className="buttonGroup1">
                <button type="button" onClick={() => setIsOpen(false)} className="closeButton1">Close</button>
                <button type="submit" className="submitButton1">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTaskList;
