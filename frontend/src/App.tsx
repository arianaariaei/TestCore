import React, { useState } from 'react';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import './App.css';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'login' | 'register'>('login');

  return (
    <div className="app-container">
      {currentPage === 'login' ? (
        <Login onRegisterClick={() => setCurrentPage('register')} />
      ) : (
        <Register onLoginClick={() => setCurrentPage('login')} />
      )}
    </div>
  );
};

export default App;