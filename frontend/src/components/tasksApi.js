import axios from "axios";

const API_BASE_URL = "https://task-management-1-cdb4.onrender.com/api";

export const updateTaskStatus = async (taskId, completed, userToken) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/tasks/${taskId}/status`,
      { completed },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
};

export const deleteTaskById = async (taskId, userToken) => {
  try {
    await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

export const updateTask = async (taskId, updatedTask, userToken) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/tasks/${taskId}`,
      updatedTask,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error editing task:", error);
    throw error;
  }
};
