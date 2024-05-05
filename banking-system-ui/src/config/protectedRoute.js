import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const isAuthenticated = () => {
    return !!localStorage.getItem("customerToken");
}

const ProtectedRoute = () => {
    return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
