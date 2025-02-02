import React, { useState } from "react";
import { addTaskList } from '../services/api';
import './AddProject.css';

const AddTaskList = ({ projectId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dueDate: "",
    order: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting task list for projectId:", projectId);
    
    try {
      await addTaskList(formData, projectId);
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to create task list:", error);
    }
  };

  return (
    <div className="addProjectContainer">
      <button onClick={() => setIsOpen(true)} className="plusButton">+ Add Task List</button>

      {isOpen && (
        <div className="overlay">
          <div className="modal">
            <h2>Add Task List</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter name..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                required
              />

              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="input"
              />

              <div className="buttonGroup">
                <button type="button" onClick={() => setIsOpen(false)} className="closeButton">Close</button>
                <button type="submit" className="submitButton">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTaskList;
