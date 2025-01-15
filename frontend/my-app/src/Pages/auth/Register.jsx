import React, { useState } from 'react';
import '../../style/Register.css';

const FloatingParticle = ({ delay }) => (
  <div
    className="floating-particle"
    style={{ animationDelay: `${delay}s` }}
  />
);

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
      {label && <label className="label">{label}</label>}
      <input {...props} className="input" />
      <Icon className="input-icon" />
    </div>
  </div>
);

const Register = ({ onLoginClick }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('لطفاً نام کاربری را وارد کنید');
      return false;
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('لطفاً یک ایمیل معتبر وارد کنید');
      return false;
    }

    if (formData.password.length < 6) {
      setError('رمز عبور باید حداقل 6 کاراکتر باشد');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('رمز عبور و تکرار آن باید یکسان باشند');
      return false;
    }

    if (!formData.university.trim()) {
      setError('لطفاً نام دانشگاه را وارد کنید');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // اینجا می‌توانید کد مربوط به ارسال اطلاعات به سرور را اضافه کنید
      await new Promise(resolve => setTimeout(resolve, 1500)); // شبیه‌سازی تأخیر شبکه
      
      console.log('اطلاعات ثبت‌نام:', formData);
      
      // پاک کردن فرم
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        university: '',
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ثبت‌نام. لطفاً دوباره تلاش کنید');
    } finally {
      setLoading(false);
    }
  };

  const UserIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const EmailIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const LockIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  const SchoolIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );

  return (
    <div className="register-page" dir="rtl">
      <GlowingBackground />
      
      {Array.from({ length: 20 }, (_, i) => i * 0.2).map((delay, index) => (
        <FloatingParticle key={index} delay={delay} />
      ))}

      <div className="register-container">
        <div className="register-card">
          <div className="card-body">
            <div className="header">
              <h1 className="title">سامانه مدیریت آزمون</h1>
              <p className="subtitle">عضویت در سامانه هوشمند آزمون</p>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="form">
              <InputField
                id="username"
                type="text"
                label="نام کاربری"
                icon={UserIcon}
                value={formData.username}
                onChange={handleInputChange}
                required
                disabled={loading}
                placeholder="نام کاربری خود را وارد کنید"
              />

              <InputField
                id="email"
                type="email"
                label="ایمیل"
                icon={EmailIcon}
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
                placeholder="ایمیل خود را وارد کنید"
              />

              <InputField
                id="password"
                type="password"
                label="گذرواژه"
                icon={LockIcon}
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={loading}
                placeholder="گذرواژه خود را وارد کنید"
              />

              <InputField
                id="confirmPassword"
                type="password"
                label="تأیید گذرواژه"
                icon={LockIcon}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                disabled={loading}
                placeholder="گذرواژه را مجدداً وارد کنید"
              />

              <InputField
                id="university"
                type="text"
                label="دانشگاه"
                icon={SchoolIcon}
                value={formData.university}
                onChange={handleInputChange}
                required
                disabled={loading}
                placeholder="نام دانشگاه خود را وارد کنید"
              />

              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
              </button>
            </form>

            <button
              type="button"
              onClick={onLoginClick}
              className="login-link"
              disabled={loading}
            >
              قبلاً ثبت‌نام کرده‌اید؟ ورود
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;