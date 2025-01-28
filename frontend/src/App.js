import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SidebarMenu from './components/SidebarMenu';
import ProjectsPage from './pages/ProjectsPage';
import './App.css'; // Make sure to import the CSS for the layout

function App() {
  return (
    <Router>
      <div className="app-container">
        <SidebarMenu />

        <div className="content">
          <Routes>
            <Route path="/projects" element={<ProjectsPage />} />
            {/* Add other routes here */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
