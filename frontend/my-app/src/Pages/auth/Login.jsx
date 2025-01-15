import React, { useState } from 'react';
import '../../style/Login.css';

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
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (formData.username.trim() === '' || formData.password.trim() === '') {
        throw new Error('لطفاً نام کاربری و رمز عبور را وارد کنید');
      }

      // Mock successful login response
      const userData = {
        username: formData.username,
        fullName: 'کاربر نمونه',
        email: 'user@example.com',
        university: 'دانشگاه نمونه',
        role: 'دانشجو'
      };

      // Call onLoginSuccess with user data
      if (onLoginSuccess) {
        onLoginSuccess(userData);
      }

      console.log('ورود موفقیت‌آمیز', userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای نامشخص در ورود');  
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
                <svg xmlns="http://www.w3.org/2000/svg" className="logo-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zm0 12L2 9l10 5 10-5v6l-10 5L2 15v-6z" />
                </svg>
              </div>

              <h1 className="title">ورود به سامانه</h1>
              <p className="sub-title">لطفاً با حساب کاربری خود وارد شوید</p>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="form">
              <div className="input-fields">
                <InputField
                  id="username"
                  type="text"
                  label="نام کاربری"
                  icon={() => (
                    <svg xmlns="http://www.w3.org/2000/svg" className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  placeholder="نام کاربری خود را وارد کنید"
                />

                <InputField
                  id="password"
                  type="password"
                  label="رمز عبور"
                  icon={() => (
                    <svg xmlns="http://www.w3.org/2000/svg" className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
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
                onClick={onRegisterClick}  
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