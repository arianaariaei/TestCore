import React, { useState, FormEvent, ChangeEvent } from 'react';

interface LoginProps {
  onRegisterClick: () => void;
}

const FloatingParticle: React.FC<{ delay: number }> = ({ delay }) => {
  return (
    <div 
      className="absolute w-1 h-1 bg-white rounded-full animate-float"
      style={{
        animationDelay: `${delay}s`,
      }}
    />
  );
};

const GlowingBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
    <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
  </div>
);

const InputField: React.FC<{ 
  icon: React.ComponentType<{ className: string }> ;
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>> = ({ icon: Icon, label, ...props }) => (
  <div className="relative group">
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity" />
    <div className="relative">
      <label className="text-gray-200 block mb-2">{label}</label>
      <input
        {...props}
        className="w-full pr-10 px-3 py-2 bg-white/80 backdrop-blur-sm border rounded border-gray-200 text-gray-900 
          focus:border-indigo-500 focus:ring-indigo-500 
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all"
      />
      <Icon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 group-hover:text-indigo-500 transition-colors" />
    </div>
  </div>
);

const Login: React.FC<LoginProps> = ({ onRegisterClick }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev, 
      [id]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (formData.username.trim() === '' || formData.password.trim() === '') {
        throw new Error('لطفاً نام کاربری و رمز عبور را وارد کنید');
      }

      console.log('ورود موفقیت‌آمیز', formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای نامشخص در ورود');  
    } finally {
      setIsLoading(false);
    }
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
              <div className="w-24 h-24 mx-auto mb-4 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl transform rotate-12 group-hover:rotate-6 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-2xl transform -rotate-12 opacity-75 group-hover:rotate-6 transition-transform" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white transform -rotate-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zm0 12L2 9l10 5 10-5v6l-10 5L2 15v-6z" />
                  </svg>
                </div>
              </div>

              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-100">
                ورود به سامانه
              </h1>
              <p className="text-gray-300 mt-2">
                لطفاً با حساب کاربری خود وارد شوید
              </p>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded mb-4 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <InputField
                  id="username"
                  type="text"
                  label="نام کاربری"
                  icon={() => (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white rounded-lg transform transition-all hover:shadow-lg 
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="animate-pulse">در حال ورود...</span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    ورود به سامانه  
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button 
                type="button"
                onClick={onRegisterClick}  
                className="text-sm text-gray-300 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
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