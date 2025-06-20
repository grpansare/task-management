import { useNavigate } from "react-router-dom";

import { useEffect } from "react";
import { useAuth } from "../authcontext/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-bold text-gray-800 mb-6">Task Manager</h1>
        <p className="text-xl text-gray-600 mb-8">
          Organize your life, boost your productivity, and achieve your goals with our intuitive task management system.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};
export default Home