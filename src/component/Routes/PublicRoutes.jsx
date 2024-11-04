import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const useAuth = () => {
  const user = Cookies.get("user");
  if (!user) {
    localStorage.clear();
  }
  return user ? true : false;
};

const PublicRoutes = (props) => {
  const auth = useAuth();

  return auth ? <Navigate to="/home" /> : <Outlet />;
};

export default PublicRoutes;
