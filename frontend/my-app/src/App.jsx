import { useState } from 'react';
import Login from './Pages/auth/Login';
import Register from './Pages/auth/Register';
import UserDashboard from './Pages/dashboard/UserDashboard';
import AdminDashboardrn from './Pages/dashboard/AdminDashboard';

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
    setIsLoginView(true);
  };

  if (isAuthenticated) {
    const isAdmin = userData.role === 'admin';
    return isAdmin ? (
      <AdminDashboardrn onLogout={handleLogout} />
    ) : (
      <UserDashboard user={userData} onLogout={handleLogout} />
    );
  }
  
  return (
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
      
      <div className="auth-wrapper">
        {isLoginView ? (
          <Login 
            onRegisterClick={handleToggleView}
            onLoginSuccess={handleLoginSuccess}
          />
        ) : (
          <Register 
            onLoginClick={handleToggleView}
            onRegisterSuccess={() => setIsLoginView(true)}
          />
        )}
      </div>
    </div>
  );
}

export default App;