import React, { useState, useEffect } from 'react';
import './SidebarMenu.css';
import { getProjects } from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarMenu = () => {
  const [projects, setProjects] = useState([]);
  const [dropdowns, setDropdowns] = useState({});
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await getProjects();
        setProjects(fetchedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const toggleDropdownAndNavigate = (key, path) => {
    if (location.pathname === path) {
      // Reload the page if already on the same path
      window.location.reload();
    } else {
      navigate(path);
    }
    setDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="sidebar">
      <h2>Sidebar Menu</h2>
      <ul className="menu">
        <li>
          <div className="menu-item">Dashboard</div>
        </li>
        <li>
          <div
            onClick={() => toggleDropdownAndNavigate('projects', '/projects')}
            className="menu-item"
          >
            Projects
          </div>
          {dropdowns['projects'] && (
            <ul className="submenu">
              {projects.map((project) => (
                <li key={project.id}>{project.name}</li>
              ))}
            </ul>
          )}
        </li>
        <li>
          <div className="menu-item">Item 3</div>
        </li>
      </ul>
    </div>
  );
};

export default SidebarMenu;
