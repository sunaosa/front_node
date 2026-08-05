import React, { type JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    // 未登录，重定向到登录页，并记录当前页面位置，以便登录后跳回
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
