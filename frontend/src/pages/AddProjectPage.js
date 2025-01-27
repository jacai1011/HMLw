import React, { useState } from 'react';

const AddProjectPage = () => {
  const [projectName, setProjectName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the page reload on form submission
    // Your form submission logic for adding a project
    console.log('Project added:', projectName);
    // Optionally, reset the form
    setProjectName('');
  };

  return (
    <div>
      <h2>Add New Project</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
        />
        <button type="submit">Add Project</button>
      </form>
    </div>
  );
};

export default AddProjectPage;
