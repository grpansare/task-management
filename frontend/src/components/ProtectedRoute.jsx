import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../authcontext/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return user ? children : null;
};
export default ProtectedRoute