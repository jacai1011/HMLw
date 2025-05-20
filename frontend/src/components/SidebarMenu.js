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

  const toggleNavigate = ( path ) => {
    if (location.pathname === path) {
      window.location.reload();
    } else {
      navigate(path);
    }
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
            onClick={() => toggleNavigate('/projects')}
            className="menu-item"
          >
            Projects
          </div>
      
        </li>
        <li>
          <div className="menu-item">Item 3</div>
        </li>
      </ul>
    </div>
  );
};

export default SidebarMenu;
