import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const location = useLocation(); // 🔥 important

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/me", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => setUser(false));
  }, []);

  // loading
  if (user === null) return null;

  // not logged in → redirect with state
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }} // 🔥 THIS FIXES YOUR FLOW
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;