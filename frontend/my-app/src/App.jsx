import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/auth/Login';
import Register from './Pages/auth/Register';
import UserDashboard from './Pages/dashboard/UserDashboard';
import AdminDashboard from './Pages/dashboard/AdminDashboard';
import ExamCreate from './Pages/exams/ExamCreate';

import './App.css';

function App() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleToggleView = () => {
    setIsLoginView(!isLoginView);
  };

  const handleLoginSuccess = (user) => {
    setUserData(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUserData(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="app-container">
        <div className="glowing-background">
          <div className="glow-ball glow-ball-1" />
          <div className="glow-ball glow-ball-2" />
          <div className="glow-ball glow-ball-3" />
        </div>
        
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="floating-particle"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
        
        <Routes>
          <Route 
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to={userData.role === 'admin' ? '/admin' : '/dashboard'} />
              ) : (
                <Login 
                  onRegisterClick={handleToggleView}
                  onLoginSuccess={handleLoginSuccess}
                />
              )
            }
          />
          <Route 
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to={userData.role === 'admin' ? '/admin' : '/dashboard'} />
              ) : (
                <Register 
                  onLoginClick={handleToggleView}
                  onRegisterSuccess={() => setIsLoginView(true)}
                />
              )
            }
          />
          <Route 
            path="/dashboard"
            element={
              isAuthenticated && userData.role !== 'admin' ? (
                <UserDashboard user={userData} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route 
            path="/admin"
            element={
              isAuthenticated && userData.role === 'admin' ? (
                <AdminDashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route 
            path="/exams/create"
            element={
              isAuthenticated ? (
                <ExamCreate />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;