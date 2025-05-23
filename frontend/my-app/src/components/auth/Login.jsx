import React, { useState } from 'react';
import '../../style/Login.css';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/exam-system-logo.svg";
import { authService } from "../../api/services";


const FloatingParticle = ({ delay }) => {
  return (
    <div 
      className="floating-particle"
      style={{
        animationDelay: `${delay}s`,
      }}
    />
  );
};

const GlowingBackground = () => (
  <div className="glowing-background">
    <div className="glow-ball-1" />
    <div className="glow-ball-2" />
    <div className="glow-ball-3" />
  </div>
);

const InputField = ({ icon: Icon, label, ...props }) => (
  <div className="input-field">
    <div className="input-background" />
    <div className="input-wrapper">
      <label className="label">{label}</label>
      <input
        {...props}
        className="input"
      />
      <Icon className="icon" />
    </div>
  </div>
);

const Login = ({ onRegisterClick, onLoginSuccess }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); 

  const handleToggleView = () => {
    navigate('/register'); 
  };

  const handlePasswordToggle = () => {
    setIsPasswordVisible(prev => !prev);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev, 
      [id]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const userData = await authService.login({
          email: formData.email,
          password: formData.password,
      });

      if (userData && typeof userData.is_admin !== 'undefined') {
          onLoginSuccess(userData);
          navigate(userData.is_admin ? '/admin' : '/dashboard');
      } else {
          throw new Error('Unexpected response structure');
      }
      
  } catch (err) {
      console.error("Error during login:", err.message);
      setError(err.response?.data?.message || 'خطا در ورود. لطفاً دوباره تلاش کنید');  
    } finally {
      setIsLoading(false);
  }
  };

  return (
    <div className="login-page" dir="rtl">
      <GlowingBackground />
      {Array.from({ length: 20 }, (_, i) => i * 0.2).map((delay, index) => (
        <FloatingParticle key={index} delay={delay} />
      ))}
      
      <div className="login-container">
        <div className="login-card">
          <div className="card-body">
            <div className="header">
              <div className="logo">
                  <img src={logo} alt="" />
              </div>

              <h1 className="title">ورود به سامانه</h1>
              <p className="sub-title">لطفاً با حساب کاربری خود وارد شوید</p>
            </div>

            {error && (
              <div className="error-message" style={{ color: 'red', marginBottom: '10px', display: 'flex', justifyContent:'center' ,fontSize:'15px'}}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="form">
              <div className="input-fields">
                <InputField
                  id="email"
                  type="text"
                  label="ایمیل"
                  icon={() => (
                    <svg xmlns="http://www.w3.org/2000/svg" className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  placeholder="ایمیل خود را وارد کنید"
                />

                <InputField
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}               
                  label="رمز عبور"
                  icon={() => (
                    <div onClick={handlePasswordToggle} className="toggle-password-visibility">
                      {isPasswordVisible ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>

                      )}
                    </div>
                  )}
                  value={formData.password}
                  onChange={handleInputChange}  
                  required
                  disabled={isLoading}
                  placeholder="رمز عبور خود را وارد کنید"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="submit-button"
              >
                {isLoading ? (
                  <span className="loading-text">در حال ورود...</span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="submit-icon" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    ورود به سامانه  
                  </>
                )}
              </button>
            </form>

            <div className="footer">
              <button 
                type="button"
                onClick={handleToggleView}   
                className="register-button"
              >
                هنوز ثبت‌نام نکرده‌اید؟ ثبت‌نام
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default Login;