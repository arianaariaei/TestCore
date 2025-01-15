import { useState } from 'react';
import Login from './Pages/auth/Login';
import Register from './Pages/auth/Register';
import './App.css';

function App() {
  const [isLoginView, setIsLoginView] = useState(true);

  const handleToggleView = () => {
    setIsLoginView(!isLoginView);
  };

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
          <Login onRegisterClick={handleToggleView} />
        ) : (
          <Register onLoginClick={handleToggleView} />
        )}
      </div>
    </div>
  );
}

export default App;