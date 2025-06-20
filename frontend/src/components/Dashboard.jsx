import { useEffect, useState } from "react";
import { Plus, AlertCircle } from 'lucide-react';
import axios from 'axios'
import { useAuth } from "../authcontext/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import TaskList from "./Tasks";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: ''
  });
  const [filter, setFilter] = useState('all');
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [taskError, setTaskError] = useState('');


  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure you want to logout?',
      text: "You will be logged out of your account.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire(
          'Logged Out!',
          'You have been logged out successfully.',
          'success'
        ).then(() => {
          navigate("/");
        });
      }
    });
  };

  useEffect(() => {
    console.log("Fetching tasks...");
    getTasks();
  }, []);

  const validateTask = (task) => {
    if (!task.title.trim()) {
      setTaskError('Task title is required');
      return false;
    }
    if (task.title.trim().length < 3) {
      setTaskError('Task title must be at least 3 characters long');
      return false;
    }
    if (task.title.trim().length > 50) {
      setTaskError('Task title must be less than 50 characters');
      return false;
    }
    if (!task.description.trim()) {
      setTaskError('Task description is required');
      return false;
    }
    if (task.description.trim().length < 3) {
      setTaskError('Task description must be at least 3 characters long');
      return false;
    }
    if (task.description.trim().length > 200) {
      setTaskError('Task description must be less than 200 characters');
      return false;
    }
    if (task.dueDate && new Date(task.dueDate) < new Date(new Date().toDateString())) {
      setTaskError('Due date cannot be in the past');
      return false;
    }
    setTaskError('');
    return true;
  };

  const getTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/tasks/${user.userid}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      console.log(response.data);
      setTasks(response.data);
    } catch (error) {
      console.error("Error getting task:", error);
    }
  };

  const [isAddingTask, setIsAddingTask] = useState(false);

  const addTask = async () => {
    if (isAddingTask) return; // Prevent multiple simultaneous calls
    
    if (validateTask(newTask)) {
      setIsAddingTask(true);
      
      const task = {
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        completed: false,
        priority: newTask.priority,
        dueDate: newTask.dueDate
      };

      try {
        const response = await axios.post(`http://localhost:8080/api/tasks/${user.email}`, task, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        const savedTask = response.data;

        setTasks(prevTasks => [...prevTasks, savedTask]);

        setNewTask({
          title: '',
          description: '',
          priority: 'MEDIUM',
          dueDate: ''
        });
        setIsFormExpanded(false);
        setTaskError('');
      } catch (error) {
        console.error("Error adding task:", error);
      } finally {
        setIsAddingTask(false);
      }
    }
  };

  const getOverdueTasksCount = () => {
    return tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) < new Date(new Date().toDateString())
    ).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
            <p className="text-gray-600">Welcome back, {user.username}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Add Task Section */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 cursor-pointer hover:from-purple-700 hover:to-pink-700 transition-all"
            onClick={() => setIsFormExpanded(!isFormExpanded)}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Plus size={24} className={`transition-transform ${isFormExpanded ? 'rotate-45' : ''}`} />
                Add New Task
              </h2>
              <span className="text-purple-200 text-sm">
                {isFormExpanded ? 'Click to collapse' : 'Click to expand'}
              </span>
            </div>
          </div>

          <div className={`transition-all duration-300 ease-in-out ${isFormExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <div className="p-6">
              <div className="space-y-4">
                {/* Task Title */}
                <div>
                  <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    id="taskTitle"
                    type="text"
                    value={newTask.title}
                    onChange={(e) => {
                      setNewTask({...newTask, title: e.target.value});
                      if (taskError) validateTask({...newTask, title: e.target.value});
                    }}
                    placeholder="e.g., Project Planning, Team Meeting"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                      taskError && taskError.includes('title') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    maxLength={50}
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    {newTask.title.length}/50 characters
                  </div>
                </div>

                {/* Task Description */}
                <div>
                  <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Task Description *
                  </label>
                  <textarea
                    id="taskDescription"
                    value={newTask.description}
                    onChange={(e) => {
                      setNewTask({...newTask, description: e.target.value});
                      if (taskError) validateTask({...newTask, description: e.target.value});
                    }}
                    placeholder="e.g., Complete the quarterly report by Friday"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none ${
                      taskError && taskError.includes('description') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    rows={3}
                    maxLength={200}
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    {newTask.description.length}/200 characters
                  </div>
                </div>

                {/* Priority and Due Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="prioritySelect" className="block text-sm font-medium text-gray-700 mb-2">
                      Priority Level
                    </label>
                    <select
                      id="prioritySelect"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="LOW">🟢 Low Priority - Can be done later</option>
                      <option value="MEDIUM">🟡 Medium Priority - Should be done soon</option>
                      <option value="HIGH">🔴 High Priority - Urgent and important</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date (Optional)
                    </label>
                    <input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {taskError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    <AlertCircle size={16} />
                    {taskError}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={addTask}
                    disabled={!newTask.title.trim() || !newTask.description.trim() || isAddingTask}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={20} />
                    {isAddingTask ? 'Adding...' : 'Add Task'}
                  </button>
                  <button
                    onClick={() => {
                      setNewTask({
                        title: '',
                        description: '',
                        priority: 'MEDIUM',
                        dueDate: ''
                      });
                      setTaskError('');
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Add (when collapsed) */}
          {!isFormExpanded && (
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="Quick add: Type task title and click + to expand..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={() => setIsFormExpanded(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Tasks ({tasks.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'pending' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pending ({tasks.filter(t => !t.completed).length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'completed' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Completed ({tasks.filter(t => t.completed).length})
            </button>
            <button
              onClick={() => setFilter('overdue')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'overdue' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } ${getOverdueTasksCount() > 0 ? 'animate-pulse' : ''}`}
            >
              Overdue ({getOverdueTasksCount()})
            </button>
          </div>
        </div>

        {/* Task List Component */}
        <TaskList tasks={tasks} setTasks={setTasks} filter={filter} />
      </div>
    </div>
  );
};

export default Dashboard;