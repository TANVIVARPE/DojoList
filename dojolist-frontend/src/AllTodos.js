import React, { useEffect, useState, useContext } from "react";
import api from "./api";
import AuthContext from "./AuthContext";
import TaskTimer from "./TaskTimer";
import "./AllTodos.css";// Make sure this path is correct

function AllTodos() {
  const [todos, setTodos] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchTodos = async () => {
    if (!user?.id) return;
    try {
      const response = await api.get(`/todos/user/${user.id}`);
      setTodos(response.data);
    } catch (error) {
      console.error("Failed to fetch todos:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [user?.id]);

  const handleStartTask = (todo) => {
    console.log("Starting task:", todo); // Log the selected task
    setActiveTask(todo);
  };

  return (
    <div className="all-todos-container">
      <h3>All Todos</h3>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <div className="todo-details">
              <div className="task-title-row">
                <strong>{todo.task}</strong>

                {/* Priority Badge - Add icon based on priority */}
                <span
                  className={`priority-badge ${todo.priority.toLowerCase()}`}
                  style={{ color: 'white', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold' }} 
                >

                  
        {/* Log the todo priority */}
        {console.log("Todo priority:", todo.priority)}



                  {todo.priority === "HIGH" && "🔥"}
                  {todo.priority === "MEDIUM" && "⚖️"}
                  {todo.priority === "LOW" && "🌱"} 
                  {todo.priority}
                </span>

                {/* Duration Badge */}
                <span className="duration-badge">{todo.duration} mins</span>
              </div>

              {todo.scheduledTime && (
                <span className="scheduled-time">
                  (Scheduled: {new Date(todo.scheduledTime).toLocaleString()})
                </span>
              )}
            </div>

            {!todo.completed && (
              <button className="start-task-btn" onClick={() => handleStartTask(todo)}>
                Start
              </button>
            )}
          </li>
        ))}
      </ul>

      {activeTask && <TaskTimer task={activeTask} onExit={() => setActiveTask(null)} />}
    </div>
  );
}

export default AllTodos;
