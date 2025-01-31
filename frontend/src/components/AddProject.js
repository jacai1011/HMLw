import React, { useState } from "react";
import { createProject } from '../services/api';
import './AddProject.css';

const AddProject = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dueDate: "",
    color: "#000000", // Default color
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createProject(formData);  // Call API function
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  return (
    <div className="addProjectContainer">
      <button onClick={() => setIsOpen(true)} className="plusButton">+ Add Project</button>

      {isOpen && (
        <div className="overlay">
          <div className="modal">
            <h2>Add Project</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter name..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
              />

              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="input"
              />

              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="colorPicker"
              />

              <div className="buttonGroup">
                <button type="submit" className="submitButton">Submit</button>
                <button type="button" onClick={() => setIsOpen(false)} className="closeButton">Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProject;
