//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DeviceDetails from './pages/DeviceDetails';
import CreateDevice from './pages/CreateDevice';
import EditDevice from './pages/EditDevice';

// A helper to protect routes from unlogged users
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  // If user is logged in, show the children; otherwise, redirect
  return user ? <>{children}</> : <Navigate to="/login" />;
};



function App() {
  //const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Only logged-in users can see these */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/create-device" element={<PrivateRoute><CreateDevice /></PrivateRoute>} />
          <Route path="/device/:id" element={<PrivateRoute><DeviceDetails /></PrivateRoute>} />
          <Route path="/edit-device/:id" element={<PrivateRoute><EditDevice /></PrivateRoute>} />
          
          {/* Default to login */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>  
  );
};

export default App;
