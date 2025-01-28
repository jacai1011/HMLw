import React, { useState, useEffect } from 'react';
import { getProjects } from '../services/api'; // Make sure the path is correct
import ProjectDisplay from '../components/ProjectDisplay';
import './ProjectsPage.css';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data); // Set the fetched projects to state
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  if (!projects || projects.length === 0) {
    return <div>No projects available.</div>;
  }

  return (
    <div>
      <h2>Projects</h2>

      <div className="grid-container">
        {projects.map((project) => (
          <ProjectDisplay key={project.id} projectId={project.id} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
