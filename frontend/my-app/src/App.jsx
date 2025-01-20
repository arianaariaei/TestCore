import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import UserDashboard from './components/dashboard/UserDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import ExamCreate from './components/exams/ExamCreate';

import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleToggleView = () => {
    setIsLoginView(!isLoginView);
  };

  const handleLoginSuccess = (user) => {
    setUserData(user);
    setIsAuthenticated(true);

  };
  const handleRegisterSuccess = (user) => {
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
                <Navigate to={userData.is_admin ? '/admin' : '/dashboard'} /> 
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
                <Navigate to={userData.is_admin ? '/admin' : '/dashboard'} />
              ) : (
                <Register 
                  onLoginClick={handleToggleView}
                  onRegisterSuccess={handleRegisterSuccess}
                />
              )
            }
          />
          <Route 
            path="/dashboard"
            element={
              isAuthenticated && !userData.is_admin ? (
                <UserDashboard user={userData} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route 
            path="/admin"
            element={
              isAuthenticated && userData.is_admin ? (
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
          <Route 
  path="/exams/edit/:examId"  // Include the :examId parameter
  element={
    isAuthenticated ? (
      <ExamEdit />
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