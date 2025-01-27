import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SidebarMenu from './components/SidebarMenu';
import AddProjectPage from './pages/AddProjectPage';
import ProjectsPage from './pages/ProjectsPage';
import './App.css'; // Make sure to import the CSS for the layout

function App() {
  return (
    <Router>
      <div className="app-container">
        <SidebarMenu />  {/* Sidebar on the left */}

        <div className="content">
          <Routes>
            <Route path="/add-project" element={<AddProjectPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            {/* Add other routes here */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
