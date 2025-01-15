import React, { useState } from 'react';
import '../../style/UserDashboard.css';

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
    <div className="card-content">
      <p className="card-title">{title}</p>
      <p className="card-value">{value}</p>
    </div>
  </div>
);

const ExamCard = ({ exam }) => (
  <div className="exam-card">
    <div className="exam-header">
      <h3 className="exam-title">{exam.title}</h3>
      <span className={`exam-status ${exam.status.replace(' ', '-')}`}>
        {exam.status}
      </span>
    </div>
    
    <div className="exam-details">
      <div className="exam-stat">
        <span className="stat-label">تعداد سوالات</span>
        <span className="stat-value">{exam.totalQuestions}</span>
      </div>
      <div className="exam-stat">
        <span className="stat-label">پاسخ صحیح</span>
        <span className="stat-value correct">{exam.correctAnswers}</span>
      </div>
      <div className="exam-stat">
        <span className="stat-label">پاسخ اشتباه</span>
        <span className="stat-value incorrect">{exam.incorrectAnswers}</span>
      </div>
    </div>

    <div className="exam-footer">
      <button className="view-details-btn">
        مشاهده جزئیات
      </button>
    </div>
  </div>
);

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
      incorrectAnswers: 5
    },
    {
      title: "آزمون فیزیک",
      status: "در حال انجام",
      totalQuestions: 40,
      correctAnswers: 15,
      incorrectAnswers: 8
    },
    {
      title: "آزمون شیمی",
      status: "تکمیل شده",
      totalQuestions: 35,
      correctAnswers: 28,
      incorrectAnswers: 7
    },
    {
      title: "آزمون زبان",
      status: "در حال انجام",
      totalQuestions: 50,
      correctAnswers: 20,
      incorrectAnswers: 10
    }
  ];


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
            
            <button className="new-exam-btn">
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              آزمون جدید
            </button>
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
            {exams.map((exam, index) => (
              <ExamCard key={index} exam={exam} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;