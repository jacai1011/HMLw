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
    const projectData = {
      name: project.name,  // Access properties from project
      dueDate: project.dueDate,
      color: project.color,
    };

    const response = await axios.post(
      `${API_BASE_URL}/createProject`,
      projectData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data; // Return response if needed
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};


export const getProject = async (projectId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getProject/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};

export const getProjectTasksCount = async (projectId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getProjectTasksCount/${projectId}`);
    return response.data
  } catch (error) {
    console.error("Error fetching project tasks count:", error);
    throw error;
  }
};

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
    const response = await axios.put(
      `${API_BASE_URL}/updateTimeLog/${projectId}/${date}?hoursSpent=${hoursSpent}`
    );
    return response.data;
  } catch (error) {
    console.error("Error updating timeLog:", error);
    throw error;
  }
};

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

export const addTaskList = async (taskList, projectId) => {
  try {
    const taskListData = {
      name: taskList.name,
      dueDate: taskList.dueDate,
      order: taskList.order,
    };

    const response = await axios.post(
      `${API_BASE_URL}/addTaskList/${projectId}`,
      taskListData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating taskList:", error);
    throw error;
  }
}; 

export const getTaskList = async (taskListId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getTaskList/${taskListId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching task list:", error);
    throw error;
  }
};

export const addTask = async (taskListId, task) => {
  try {
    const taskData = {
      title: task.title,
      isComplete: task.isComplete,
      taskListId: taskListId,
    };

    const response = await axios.post(
      `${API_BASE_URL}/addTask/${taskListId}`,
      taskData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const deleteProject = async (projectId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/deleteProject/${projectId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

export const renameTaskList = async (taskListId, newName) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/renameTaskList/${taskListId}?name=${newName}`
    );
    return response.data;
  } catch (error) {
    console.error("Error updating TaskList:", error);
    throw error;
  }
};

export const deleteTaskList = async (taskListId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/deleteTaskList/${taskListId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting TaskList:", error);
    throw error;
  }
};