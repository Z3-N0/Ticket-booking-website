import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginRegister from './components/LoginRegister';
import AdminDashboard from './pages/AdminDashboard'; 
import UserDashboard from './pages/UserDashboard'; 

function App() {
  const [user, setUser] = useState(null); 
  const [isAdmin, setIsAdmin] = useState(false); 

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAdmin(userData.isAdmin); 
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegister onLogin={handleLogin} />} />
        <Route path="/admin-dashboard" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/user-dashboard" element={user ? <UserDashboard /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
