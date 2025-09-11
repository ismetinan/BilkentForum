import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import React from "react";

const PrivateRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // 👈 show spinner/skeleton here
  }

  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
