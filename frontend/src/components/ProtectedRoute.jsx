import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => setUser(false));
  }, []);

  if (user === null) return null;
  if (!user) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;