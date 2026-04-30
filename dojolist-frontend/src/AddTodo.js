import React, { useState, useContext } from "react";
import api from "./api";
import { toast } from "react-toastify";
import AuthContext from "./AuthContext";
import "./AddTodo.css";

function AddTodo({ onTodoAdded }) {
  const [showForm, setShowForm] = useState(false);
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [duration, setDuration] = useState(20);
  const [scheduledTime, setScheduledTime] = useState("");
  const [recurrence, setRecurrence] = useState("NONE"); // ✅ NEW STATE
  const { user } = useContext(AuthContext);

  const handleAddTodo = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("User ID is missing. Please try logging in again.");
      return;
    }

    if (!task.trim()) {
      toast.error("Todo task cannot be empty");
      return;
    }

      // Log the data before sending it to the backend
  console.log("Adding Todo:", { task, priority, duration, scheduledTime});

    try {
      const response = await api.post(`/todos/user/${user.id}`, {
        task,
        priority,
        duration,
        scheduledTime: scheduledTime || null,
        recurrence, // ✅ Include in request
      });

      if (response.status === 201) {
        toast.success("Todo added successfully!");
        onTodoAdded(); 
        setTask("");
        setPriority("LOW");
        setDuration(20);
        setScheduledTime("");
        setRecurrence("NONE"); // ✅ Reset recurrence
        setShowForm(false);
      }
    } catch (error) {
      toast.error(error.response?.data || "Failed to add todo");
    }
  };

  return (
    <div className="add-todo-container">
      <button className="add-task-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? "✖ Close" : "+ Add Task"}
      </button>

      {showForm && (
        <div className="add-todo-form">
          <h3>Add a New Todo</h3>
          <form onSubmit={handleAddTodo}>
            <input
              type="text"
              placeholder="Todo Task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              required
            />

            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="LOW">Low Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="HIGH">High Priority</option>
            </select>

            <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
              <option value={10}>10 mins</option>
              <option value={20}>20 mins</option>
              <option value={30}>30 mins</option>
              <option value={45}>45 mins</option>
              <option value={60}>60 mins</option>
              <option value={90}>90 mins</option>
            </select>

            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />

            <button type="submit">Add Todo</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AddTodo;
