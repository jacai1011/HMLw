import React, { useState, useEffect } from 'react';
import { getProjects } from '../services/api';
import ProjectDisplay from '../components/ProjectDisplay';
import './ProjectsPage.css';
import AddProject from '../components/AddProject';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);


  return (
    <div className="projectsPageContainer">
      <h2>Projects</h2>
      <AddProject/>
      <div className="grid-container">
        {projects.map((project) => (
          <ProjectDisplay key={project.id} projectId={project.id} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;