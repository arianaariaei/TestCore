import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import '../../Style/AdminDashboard.css';

const AdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();


  const [users] = useState([
    { id: 1, username: 'user1', email: 'user1@example.com', university: 'University A', examCount: 12 },
    { id: 2, username: 'user2', email: 'user2@example.com', university: 'University B', examCount: 8 },
    { id: 3, username: 'user3', email: 'user3@example.com', university: 'University A', examCount: 15 },
    { id: 4, username: 'user4', email: 'user4@example.com', university: 'University B', examCount: 6 },
  ]);

  // تغییر ساختار داده‌های آزمون
  const [exams] = useState([
    { id: 1, title: 'آزمون ریاضی ۱', user: 'علی محمدی', score: 85, date: '2024/01/15' },
    { id: 2, title: 'آزمون فیزیک', user: 'سارا احمدی', score: 78, date: '2024/01/14' },
    { id: 3, title: 'آزمون شیمی', user: 'رضا کریمی', score: 92, date: '2024/01/13' },
    { id: 4, title: 'آزمون برنامه‌نویسی', user: 'مریم حسینی', score: 88, date: '2024/01/12' },
    { id: 5, title: 'آزمون برنامه‌نویسی', user: 'حسین علوی', score: 88, date: '2024/01/12' },
  ]);

  const subjects = exams.map(exam => exam.title);
  const subjectCounts = subjects.reduce((acc, subject) => {
    acc[subject] = (acc[subject] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(subjectCounts),
    datasets: [
      {
        label: 'درصد آزمون',
        data: Object.values(subjectCounts).map(count => (count / exams.length) * 100),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverOffset: 4,
      },
    ],
  };

  const barData = {
    labels: users.map(user => user.username), 
    datasets: [
      {
        label: 'تعداد آزمون',
        data: users.map(user => user.examCount), 
        backgroundColor: 'rgba(3, 194, 252, 0.6)',
        borderColor: 'rgba(3, 194, 252, 1)',
        borderWidth: 1,
      },
    ],
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredUsers = users
    .filter(user => 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.university.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const aValue = a[sortField];
      const bValue = b[sortField];
      return sortDirection === 'asc' 
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1;
    });

  const filteredExams = exams
    .filter(exam => 
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.user.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const aValue = a[sortField];
      const bValue = b[sortField];
      return sortDirection === 'asc' 
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1;
    });

  const stats = [
    {
      icon: "👥",
      title: "کل کاربران",
      value: users.length,
      gradient: "gradient-purple"
    },
    {
      icon: "📚",
      title: "کل آزمون‌ها",
      value: exams.length,
      gradient: "gradient-blue"
    },
    {
      icon: "⏳",
      title: "میانگین نمرات",
      value: Math.round(exams.reduce((acc, exam) => acc + exam.score, 0) / exams.length),
      gradient: "gradient-orange"
    },
    {
      icon: "✅",
      title: "بالاترین نمره",
      value: Math.max(...exams.map(exam => exam.score)),
      gradient: "gradient-green"
    }
  ];

  return (
    <div className="admin-dashboard" dir="rtl">
      <div className="logout_conatiner">
        <button className="logout-button" onClick={onLogout}>
          خروج
        </button>
      </div>
      <div className="glowing-background">
        <div className="glow-ball-1"></div>
        <div className="glow-ball-2"></div>
        <div className="glow-ball-3"></div>
      </div>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="welcome-section">
            <h1>پنل مدیریت <span className="wave">👋</span></h1>
            <p>مدیریت کاربران و آزمون‌ها</p>
          </div>
          
          <div className="header-actions">
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="جستجو..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </header>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card ${stat.gradient}`}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <h3>{stat.title}</h3>
                <p>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="content-section">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              👥 کاربران
            </button>
            <button 
              className={`tab ${activeTab === 'exams' ? 'active' : ''}`}
              onClick={() => setActiveTab('exams')}
            >
              📚 آزمون‌ها
            </button>
          </div>

          {activeTab === 'users' ? (
            <div className="data-table">
              <div className="table-header">
                <div className="header-cell" onClick={() => handleSort('username')}>
                  نام کاربری
                  <span className="sort-arrow">▼</span>
                </div>
                <div className="header-cell" onClick={() => handleSort('email')}>
                  ایمیل
                  <span className="sort-arrow">▼</span>
                </div>
                <div className="header-cell" onClick={() => handleSort('university')}>
                  دانشگاه
                  <span className="sort-arrow">▼</span>
                </div>
                <div className="header-cell">عملیات</div>
              </div>
              {filteredUsers.map(user => (
                <div key={user.id} className="table-row">
                  <div className="cell">{user.username}</div>
                  <div className="cell">{user.email}</div>
                  <div className="cell">{user.university}</div>
                  <div className="cell actions">
                    <button className="action-btn delete" title="حذف">🗑️</button>
                    <button className="action-btn view" title="مشاهده">👁️</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="data-table">
              <div className="table-header">
                <div className="header-cell" onClick={() => handleSort('title')}>عنوان آزمون</div>
                <div className="header-cell" onClick={() => handleSort('user')}>کاربر</div>
                <div className="header-cell" onClick={() => handleSort('score')}>نمره</div>
                <div className="header-cell">عملیات</div>
              </div>
              {filteredExams.map(exam => (
                <div key={exam.id} className="table-row">
                  <div className="cell">{exam.title}</div>
                  <div className="cell">{exam.user}</div>
                  <div className="cell">{exam.score}</div>
                  <div className="cell actions">
                    <button className="action-btn view" title="مشاهده">👁️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="charts_container">
          <h2 className="charts_title"> نمودار ها 📊</h2>
          <div className="percentage_chart">
            <Pie data={pieData}/>
          </div>
          <div className="count_chart">
            <Bar data={barData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;