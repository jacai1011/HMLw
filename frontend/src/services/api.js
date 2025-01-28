import axios from 'axios';

const API_BASE_URL = "https://localhost:7252/api/Projects";

export const getProjects = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getProjects`);
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const createProject = async (project) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/createProject`, project);
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const getProject = async (projectId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getProject/${projectId}`, projectId);
    return response.data
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
}

export const getProjectTasksCount = async (projectId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getProjectTasksCount/${projectId}`, projectId);
    return response.data
  } catch (error) {
    console.error("Error fetching project tasks count:", error);
    throw error;
  }
}