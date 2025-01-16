import React, { useState } from 'react';
import '../../style/UserDashboard.css';
import { Download, Share2 } from 'lucide-react';

const GlowingBackground = () => (
  <div className="glowing-background">
    <div className="glow-ball-1" />
    <div className="glow-ball-2" />
    <div className="glow-ball-3" />
  </div>
);

const StatCard = ({ icon, title, value, gradient }) => (
  <div className="dashboard-card">
    <div className={`card-icon ${gradient}`}>
      {icon}
    </div>
    <div>
      <p className="card-title">{title}</p>
      <p className="card-value">{value}</p>
    </div>
  </div>
);

const ExamCard = ({ exam }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDetails = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`exam-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="exam-header">
        <h3 className="exam-title">{exam.title}</h3>
        <span className={`exam-status ${exam.status}`}>{exam.statusText}</span>
      </div>
      
      <div className="exam-details">
        {/* Progress bar section */}
        <div className="progress-bar">
          <div className="progress-text">
            <span>پیشرفت</span>
            <span>{exam.progress}%</span>
          </div>
          <div className="progress-track">
            <div 
              className="progress-fill" 
              style={{ width: `${exam.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats section - will be hidden/shown based on expanded state */}
      <div className="exam-stats">
        <div className="stat-box">
          <span className="stat-label">کل سوالات</span>
          <span className="stat-value">{exam.totalQuestions}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">پاسخ‌های درست</span>
          <span className="stat-value correct">{exam.correctAnswers}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">پاسخ‌های نادرست</span>
          <span className="stat-value incorrect">{exam.incorrectAnswers}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">درصد موفقیت</span>
          <span className="stat-value">{exam.successRate}%</span>
        </div>
      </div>

      <div className="exam-footer">
        <div className="exam-actions">
          <button className="action-btn">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button className="action-btn">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <button className="view-details-btn" onClick={toggleDetails}>
          {isExpanded ? 'پنهان کردن جزئیات' : 'مشاهده جزئیات'}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-4 h-4" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  const stats = [
    {
      icon: (
        <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "کل آزمون‌ها",
      value: "24",
      gradient: "gradient-purple"
    },
    {
      icon: (
        <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="22 4 12 14.01 9 11.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "آزمون‌های تکمیل شده",
      value: "18",
      gradient: "gradient-green"
    },
    {
      icon: (
        <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="12 6 12 12 16 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "در حال انجام",
      value: "6",
      gradient: "gradient-orange"
    },
    {
      icon: (
        <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 15l-2 5l9-9l-9-9l2 5l-9 4l9 4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "میانگین نمره",
      value: "17.8",
      gradient: "gradient-blue"
    }
  ];

  const exams = [
    {
      title: "آزمون ریاضی ۱",
      status: "تکمیل شده",
      totalQuestions: 30,
      correctAnswers: 25,
      incorrectAnswers: 5,
      progress: 100,
      successRate: Math.round((25 / 30) * 100)
    },
    {
      title: "آزمون فیزیک",
      status: "در حال انجام",
      totalQuestions: 40,
      correctAnswers: 15,
      incorrectAnswers: 8,
      progress: Math.round(((15 + 8) / 40) * 100),
      successRate: Math.round((15 / 40) * 100)
    },
    {
      title: "آزمون شیمی",
      status: "تکمیل شده",
      totalQuestions: 35,
      correctAnswers: 28,
      incorrectAnswers: 7,
      progress: 100,
      successRate: Math.round((28 / 35) * 100)
    },
    {
      title: "آزمون زبان",
      status: "در حال انجام",
      totalQuestions: 50,
      correctAnswers: 20,
      incorrectAnswers: 10,
      progress: Math.round(((20 + 10) / 50) * 100),
      successRate: Math.round((20 / 50) * 100)
    }
  ];

  const filteredExams = exams.filter(exam => {
    if (activeTab === 'all') return true;
    if (activeTab === 'completed') return exam.status === 'تکمیل شده';
    if (activeTab === 'ongoing') return exam.status === 'در حال انجام';
    return true;
  });

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <GlowingBackground />
        <div className="dashboard-main">
          {/* Header */}
          <div className="dashboard-header">
            <div className="user-welcome">
              <h1>سلام، خوش آمدید 👋</h1>
              <p>آخرین وضعیت آزمون‌های خود را مشاهده کنید</p>
            </div>
            
          </div>

          {/* Stats Grid */}
          <div className="dashboard-stats">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Tabs */}
          <div className="dashboard-tabs">
            <button
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              همه آزمون‌ها
            </button>
            <button
              className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              تکمیل شده
            </button>
            <button
              className={`tab-btn ${activeTab === 'ongoing' ? 'active' : ''}`}
              onClick={() => setActiveTab('ongoing')}
            >
              در حال انجام
            </button>
          </div>

          {/* Exams Grid */}
          <div className="exams-grid">
            {filteredExams.map((exam, index) => (
              <ExamCard key={index} exam={exam} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;