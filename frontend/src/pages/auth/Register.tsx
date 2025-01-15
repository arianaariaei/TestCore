import React, { useState } from 'react';

interface RegisterProps {
  onLoginClick: () => void;
}

interface FloatingParticleProps {
  delay: number;
}

const FloatingParticle: React.FC<FloatingParticleProps> = ({ delay }) => {
  return (
    <div
      className="absolute w-1 h-1 bg-white rounded-full animate-float"
      style={{
        animationDelay: `${delay}s`,
        transform: `translateY(-20px) translateX(-10px)`,
      }}
    />
  );
};

const GlowingBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
    <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
  </div>
);

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label?: string;
}

const InputField: React.FC<InputFieldProps> = ({ icon: Icon, label, ...props }) => (
  <div className="relative group">
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity" />
    <div className="relative">
      {label && <label className="text-gray-200 block mb-2">{label}</label>}
      <input
        {...props}
        className="w-full pr-10 px-3 py-2 bg-white/80 backdrop-blur-sm border rounded border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all hover:bg-white"
      />
      <Icon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 group-hover:text-indigo-500 transition-colors" />
    </div>
  </div>
);

const Register: React.FC<RegisterProps> = ({ onLoginClick }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // TODO: Add registration logic
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900" dir="rtl">
      <GlowingBackground />

      {Array.from({ length: 20 }, (_, i) => i * 0.2).map((delay, index) => (
        <FloatingParticle key={index} delay={delay} />
      ))}

      <div className="w-full max-w-md px-4 relative z-10">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-lg rounded-2xl" />

        <div className="backdrop-blur-md bg-white/10 shadow-2xl border-0 rounded-2xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-100">
                سامانه مدیریت آزمون
              </h1>
              <p className="text-gray-300 mt-2">
                عضویت در سامانه هوشمند آزمون
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField
                id="username"
                type="text"
                label="نام کاربری"
                icon={() => (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
                value={formData.username}
                onChange={handleInputChange}
                required
              />

              <InputField
                id="email"
                type="email"
                label="ایمیل"
                icon={() => (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )}
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <InputField
                id="password"
                type="password"
                label="گذرواژه"
                icon={() => (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
                value={formData.password}
                onChange={handleInputChange}
                required
              />

              <InputField
                id="confirmPassword"
                type="password"
                label="تأیید گذرواژه"
                icon={() => (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />

              <InputField
                id="university"
                type="text"
                label="دانشگاه"
                icon={() => (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )}
                value={formData.university}
                onChange={handleInputChange}
                required
              />

              <button
                type="submit"
                className="w-full py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                ثبت‌نام
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={onLoginClick}
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                قبلاً ثبت‌نام کرده‌اید؟ ورود
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;