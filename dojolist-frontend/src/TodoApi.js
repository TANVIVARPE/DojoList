import api from "./api";

// Fetch all todos
export const getTodos = async () => {
  try {
    const response = await api.get("/todos");
    return response.data;
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
};

// Add a new todo
export const addTodo = async (todoData) => {
  try {
    const response = await api.post("/todos", todoData);
    return response.data;
  } catch (error) {
    console.error("Error adding todo:", error);
    throw error;
  }
};

// Mark todo as completed
export const completeTodo = async (todoId) => {
  try {
    const response = await api.put(`/todos/${todoId}/complete`);
    return response.data;
  } catch (error) {
    console.error("Error completing todo:", error);
    throw error;
  }
};

// Delete a todo
export const deleteTodo = async (todoId) => {
  try {
    await api.delete(`/todos/${todoId}`);
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
};
