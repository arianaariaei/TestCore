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
    // fix this part
    setIsAuthenticated(true);

  };
  // useEffect(() => {
  //   // Check if there's a valid access token
  //   const token = localStorage.getItem('access_token');
  //   if (token) {
  //     verifyToken(token);
  //   }
  // }, []);

  // const verifyToken = async (token) => {
  //   try {
  //     const response = await fetch('', {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }
  //     });

  //     if (response.ok) {
  //       const user = await response.json();
  //       setUserData(user);
  //       setIsAuthenticated(true);
  //     } else {
  //       // Clear invalid token
  //       localStorage.removeItem('access_token');
  //       setIsAuthenticated(false);
  //     }
  //   } catch (error) {
  //     console.error('Error verifying token:', error);
  //     localStorage.removeItem('access_token');
  //     setIsAuthenticated(false);
  //   }
  // };

  // const handleToggleView = () => {
  //   setIsLoginView(!isLoginView);
  // };

  // const handleLoginSuccess = async (user) => {
  //   const { access_token } = user;

  //   // Store the token for future API requests
  //   localStorage.setItem('access_token', access_token);

  //   // Verify the token before setting user data
  //   await verifyToken(access_token);
  // };

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