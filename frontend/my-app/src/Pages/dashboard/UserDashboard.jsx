import React, { useState } from 'react';
import '../../style/UserDashboard.css';

const DashboardCard = ({ title, value, icon: Icon }) => (
  <div className="dashboard-card">
    <div className="card-icon">
      <Icon />
    </div>
    <div className="card-content">
      <h3 className="card-title">{title}</h3>
      <p className="card-value">{value}</p>
    </div>
  </div>
);

const ExamCard = ({ exam }) => (
  <div className="exam-card">
    <div className="exam-header">
      <h4 className="exam-title">{exam.title}</h4>
      <span className={`exam-status ${exam.status.toLowerCase()}`}>
        {exam.status}
      </span>
    </div>
    <div className="exam-details">
      <div className="exam-stat">
        <span className="stat-label">تعداد سوالات:</span>
        <span className="stat-value">{exam.totalQuestions}</span>
      </div>
      <div className="exam-stat">
        <span className="stat-label">پاسخ‌های درست:</span>
        <span className="stat-value correct">{exam.correctAnswers}</span>
      </div>
      <div className="exam-stat">
        <span className="stat-label">پاسخ‌های نادرست:</span>
        <span className="stat-value incorrect">{exam.incorrectAnswers}</span>
      </div>
    </div>
    <div className="exam-footer">
      <button className="view-details-btn">مشاهده جزئیات</button>
    </div>
  </div>
);

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const dashboardStats = {
    totalExams: 12,
    completedExams: 8,
    averageScore: 85,
    upcomingExams: 2
  };

  const recentExams = [
    {
      id: 1,
      title: "آزمون ریاضی ۲",
      status: "تکمیل‌شده",
      totalQuestions: 20,
      correctAnswers: 16,
      incorrectAnswers: 4,
      date: "۱۴۰۲/۱۰/۱۵"
    },
    {
      id: 2,
      title: "آزمون فیزیک ۱",
      status: "در حال انجام",
      totalQuestions: 30,
      correctAnswers: 12,
      incorrectAnswers: 8,
      date: "۱۴۰۲/۱۰/۲۰"
    }
  ];

  return (
    <div className="dashboard-container" dir="rtl">
      <div className="dashboard-wrapper">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <div className="user-welcome">
              <h1>خوش آمدید، کاربر عزیز</h1>
              <p>داشبورد مدیریت آزمون‌های شما</p>
            </div>
            <div className="header-actions">
              <button className="new-exam-btn">
                <svg xmlns="http://www.w3.org/2000/svg" className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                آزمون جدید
              </button>
            </div>
          </div>

          <div className="dashboard-stats">
            <DashboardCard
              title="کل آزمون‌ها"
              value={dashboardStats.totalExams}
              icon={() => (
                <svg xmlns="http://www.w3.org/2000/svg" className="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              )}
            />
            <DashboardCard
              title="آزمون‌های تکمیل شده"
              value={dashboardStats.completedExams}
              icon={() => (
                <svg xmlns="http://www.w3.org/2000/svg" className="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            />
            <DashboardCard
              title="میانگین نمرات"
              value={`${dashboardStats.averageScore}%`}
              icon={() => (
                <svg xmlns="http://www.w3.org/2000/svg" className="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              )}
            />
            <DashboardCard
              title="آزمون‌های پیش رو"
              value={dashboardStats.upcomingExams}
              icon={() => (
                <svg xmlns="http://www.w3.org/2000/svg" className="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            />
          </div>

          <div className="dashboard-tabs">
            <button
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              نمای کلی
            </button>
            <button
              className={`tab-btn ${activeTab === 'exams' ? 'active' : ''}`}
              onClick={() => setActiveTab('exams')}
            >
              آزمون‌ها
            </button>
            <button
              className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
              onClick={() => setActiveTab('results')}
            >
              نتایج
            </button>
          </div>

          <div className="exams-section">
            <h2 className="section-title">آزمون‌های اخیر</h2>
            <div className="exams-grid">
              {recentExams.map(exam => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;