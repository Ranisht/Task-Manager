import React, { useEffect, useState } from "react";

function TaskManager() {
  // ✅ Initialize directly from localStorage (no effect needed)
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("my_tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [taskInput, setTaskInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // ✅ Only save when tasks change
  useEffect(() => {
    localStorage.setItem("my_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddOrUpdate = () => {
    if (!taskInput.trim()) return;

    if (editingId) {
      // Update task
      const updatedTasks = tasks.map((task) =>
        task.id === editingId ? { ...task, text: taskInput } : task,
      );

      setTasks(updatedTasks);
      setEditingId(null);
    } else {
      // Add task
      const newTask = {
        id: Date.now(),
        text: taskInput,
        completed: false,
      };

      setTasks([...tasks, newTask]);
    }

    setTaskInput("");
  };

  const handleEdit = (id) => {
    const selected = tasks.find((task) => task.id === id);
    if (selected) {
      setTaskInput(selected.text);
      setEditingId(id);
    }
  };

  const handleToggle = (id) => {
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    );

    setTasks(updated);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    const filtered = tasks.filter((task) => task.id !== deleteId);
    setTasks(filtered);
    setDeleteId(null);
    setShowConfirm(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Task Manager</h2>

      <input
        type="text"
        placeholder="Enter task..."
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
      />

      <button onClick={handleAddOrUpdate}>
        {editingId ? "Update" : "Add"}
      </button>

      <ul style={{ marginTop: "20px" }}>
        {tasks.map((task) => (
          <li key={task.id} style={{ marginBottom: "10px" }}>
            <span
              onClick={() => handleToggle(task.id)}
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              {task.text}
            </span>

            <button onClick={() => handleEdit(task.id)}>Edit</button>

            <button
              onClick={() => handleDeleteClick(task.id)}
              style={{ marginLeft: "5px" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {showConfirm && (
        <div style={{ marginTop: "20px" }}>
          <p>Are you sure you want to delete?</p>

          <button onClick={confirmDelete}>Yes</button>

          <button
            onClick={() => setShowConfirm(false)}
            style={{ marginLeft: "10px" }}
          >
            No
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskManager;
