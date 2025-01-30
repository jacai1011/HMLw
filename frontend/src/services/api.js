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
    const response = await axios.get(`${API_BASE_URL}/getProjectTasksCount/${projectId}`);
    return response.data
  } catch (error) {
    console.error("Error fetching project tasks count:", error);
    throw error;
  }
}

export const getTimeLog = async (projectId, date) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getTimeLog/${projectId}/${date}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching timeLog:", error);
    throw error;
  }
};

export const updateTimeLog = async (projectId, date, hoursSpent) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/updateTimeLog/${projectId}/${date}`, hoursSpent);
    return response.data;
  } catch (error) {
    console.error("Error updating timeLog:", error);
    throw error;
  }
}

export const addTimeLog = async (projectId, date, hoursSpent) => {
  try {
    const timeLogData = {
      date: date,
      hoursSpent: hoursSpent,
    };

    const response = await axios.post(
      `${API_BASE_URL}/addTimeLog/${projectId}`,
      timeLogData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating timeLog:", error);
    throw error;
  }
};

