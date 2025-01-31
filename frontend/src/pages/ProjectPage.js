import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProject } from "../services/api";
import "./ProjectPage.css";

const ProjectPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    console.log("Fetching project with ID:", projectId); // Debugging log
  
    const fetchProject = async () => {
      try {
        const data = await getProject(projectId);
        console.log("Fetched project data:", data); // Debugging log
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };
  
    fetchProject();
  }, [projectId]);
  

  if (!project) return <div>Loading project...</div>;

  return (
    <div className="project-container">
      <h2>{project.name}</h2>
      <p>Due Date: {project.dueDate}</p>
      <div className="color-box" style={{ backgroundColor: project.color }}></div>
    </div>
  );
};

export default ProjectPage;
