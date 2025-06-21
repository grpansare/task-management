import React, { useState } from "react";
import { Edit2, Trash2, Save, X, Calendar } from "lucide-react";
import axios from "axios";
import { useAuth } from "../authcontext/AuthContext";
import Swal from "sweetalert2";

const TaskList = ({ tasks, setTasks, filter }) => {
  const { user } = useAuth();
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
  });

  const toggleTask = async (id) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    const newCompletedStatus = !taskToUpdate.completed;

    // Optimistically update the UI
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: newCompletedStatus } : task
      )
    );

    try {
      const updatedTask = await updateTaskStatus(id, newCompletedStatus);

      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));

      Swal.fire({
        icon: "success",
        title: newCompletedStatus ? "Task Completed!" : "Task Reopened!",
        text: newCompletedStatus
          ? "Great job on completing this task!"
          : "Task has been reopened.",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    } catch (error) {
      // Revert the optimistic update on error
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !newCompletedStatus } : task
        )
      );

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update task status. Please try again.",
        confirmButtonColor: "#8B5CF6",
      });
    }
  };
  const updateTaskStatus = async (taskId, completed) => {
    try {
      const response = await axios.patch(
        `https://task-management-1-cdb4.onrender.com/api/tasks/${taskId}/status`,
        { completed },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
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

  const deleteTask = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://task-management-1-cdb4.onrender.com/api/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setTasks(tasks.filter((task) => task.id !== id));

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your task has been deleted.",
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });
      } catch (error) {
        console.error("Error deleting task:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to delete task. Please try again.",
          confirmButtonColor: "#8B5CF6",
        });
      }
    }
  };

  const startEdit = (task) => {
    setEditingTask(task.id);
    setEditForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate || "",
    });
  };

  const saveEdit = async () => {
    if (!editForm.title.trim() || !editForm.description.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in both title and description.",
        confirmButtonColor: "#8B5CF6",
      });
      return;
    }

    const currentTask = tasks.find((task) => task.id === editingTask);

    const updatedTask = {
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      priority: editForm.priority,
      dueDate: editForm.dueDate,
      completed: currentTask.completed, // Preserve the current completed status
    };

    try {
      const response = await axios.put(
        `https://task-management-1-cdb4.onrender.com/api/tasks/${editingTask}`,
        updatedTask,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const updated = response.data;

      setTasks(tasks.map((task) => (task.id === editingTask ? updated : task)));

      setEditingTask(null);
      setEditForm({
        title: "",
        description: "",
        priority: "MEDIUM",
        dueDate: "",
      });

      Swal.fire({
        icon: "success",
        title: "Task Updated!",
        text: "Your task has been successfully updated.",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    } catch (error) {
      console.error("Error editing task:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update task. Please try again.",
        confirmButtonColor: "#8B5CF6",
      });
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditForm({
      title: "",
      description: "",
      priority: "MEDIUM",
      dueDate: "",
    });
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    if (filter === "overdue") {
      return (
        !task.completed &&
        task.dueDate &&
        new Date(task.dueDate) < new Date(new Date().toDateString())
      );
    }
    return true;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800 border-red-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "LOW":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "HIGH":
        return "🔴";
      case "MEDIUM":
        return "🟡";
      case "LOW":
        return "🟢";
      default:
        return "⚪";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getDueDateStatus = (dueDate, completed) => {
    if (!dueDate || completed) return "";
    const today = new Date(new Date().toDateString());
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "overdue";
    if (diffDays === 0) return "today";
    if (diffDays === 1) return "tomorrow";
    if (diffDays <= 3) return "soon";
    return "upcoming";
  };

  const getDueDateColor = (status) => {
    switch (status) {
      case "overdue":
        return "text-red-600 bg-red-50 border-red-200";
      case "today":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "tomorrow":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "soon":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "upcoming":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
        Your Tasks
      </h2>
      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-base sm:text-lg mb-2">No tasks found</p>
          <p className="text-sm sm:text-base">Add a new task to get started!</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredTasks.map((task) => {
            const dueDateStatus = getDueDateStatus(
              task.dueDate,
              task.completed
            );
            return (
              <div
                key={task.id}
                className={`p-3 sm:p-4 border rounded-lg transition-all hover:shadow-md ${
                  task.completed
                    ? "bg-gray-50 border-gray-200"
                    : dueDateStatus === "overdue"
                    ? "bg-red-50 border-red-200"
                    : "bg-white border-gray-300"
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 rounded focus:ring-purple-500 mt-1 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    {editingTask === task.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium text-sm sm:text-base"
                          placeholder="Task title"
                        />
                        <textarea
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              description: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm sm:text-base"
                          rows={2}
                          placeholder="Task description"
                        />
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <div className="relative">
                            <select
                              value={editForm.priority}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  priority: e.target.value,
                                })
                              }
                              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base appearance-none bg-white pr-8"
                            >
                              <option value="LOW">🟢 Low</option>
                              <option value="MEDIUM">🟡 Medium</option>
                              <option value="HIGH">🔴 High</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                              <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                          </div>
                          <input
                            type="date"
                            value={editForm.dueDate}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                dueDate: e.target.value,
                              })
                            }
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3
                          className={`text-base sm:text-lg font-semibold mb-1 break-words ${
                            task.completed
                              ? "line-through text-gray-500"
                              : "text-gray-800"
                          }`}
                        >
                          {task.title}
                        </h3>
                        <p
                          className={`text-xs sm:text-sm mb-2 break-words ${
                            task.completed
                              ? "line-through text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          {task.description}
                        </p>
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                              task.priority
                            )} flex items-center gap-1 flex-shrink-0`}
                          >
                            <span>{getPriorityIcon(task.priority)}</span>
                            <span className="hidden xs:inline">
                              {task.priority}
                            </span>
                          </span>
                          {task.dueDate && (
                            <span
                              className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getDueDateColor(
                                dueDateStatus
                              )} flex-shrink-0`}
                            >
                              <Calendar size={10} className="sm:w-3 sm:h-3" />
                              <span className="truncate">
                                {formatDate(task.dueDate)}
                                {dueDateStatus === "overdue" && (
                                  <span className="hidden sm:inline">
                                    {" "}
                                    (Overdue)
                                  </span>
                                )}
                                {dueDateStatus === "today" && (
                                  <span className="hidden sm:inline">
                                    {" "}
                                    (Today)
                                  </span>
                                )}
                                {dueDateStatus === "tomorrow" && (
                                  <span className="hidden sm:inline">
                                    {" "}
                                    (Tomorrow)
                                  </span>
                                )}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 flex-shrink-0">
                    {editingTask === task.id ? (
                      <>
                        <button
                          onClick={saveEdit}
                          className="p-1.5 sm:p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        >
                          <Save size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <X size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(task)}
                          className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit2
                            size={16}
                            className="sm:w-[18px] sm:h-[18px]"
                          />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1.5 sm:p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2
                            size={16}
                            className="sm:w-[18px] sm:h-[18px]"
                          />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TaskList;
