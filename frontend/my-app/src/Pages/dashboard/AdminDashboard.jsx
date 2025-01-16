import React, { useState } from 'react';
import { Search, Users, BookOpen, Clock, CheckCircle } from 'lucide-react';

const GlowingBackground = () => (
  <div className="glowing-background">
    <div className="glow-ball-1" />
    <div className="glow-ball-2" />
    <div className="glow-ball-3" />
  </div>
);

const StatCard = ({ icon: Icon, title, value, gradient }) => (
  <div className="dashboard-card">
    <div className={`card-icon ${gradient}`}>
      <Icon className="stat-icon" size={24} />
    </div>
    <div className="card-content">
      <p className="card-title">{title}</p>
      <p className="card-value">{value}</p>
    </div>
  </div>
);

const UserCard = ({ user }) => {
  const getRandomGradient = () => {
    const gradients = [
      'from-purple-500 to-indigo-500',
      'from-blue-500 to-cyan-500',
      'from-emerald-500 to-teal-500',
      'from-orange-500 to-amber-500'
    ];
    return gradients[user.username?.length % gradients.length || 0];
  };

  return (
    <div className="relative bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10 transition-all duration-300 hover:shadow-lg hover:bg-white/15">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getRandomGradient()} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
            {user.username[0].toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{user.username}</h3>
            <p className="text-slate-300 text-sm mt-1">{user.university}</p>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mb-6">
        <a 
          href={`mailto:${user.email}`}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm"
        >
          {user.email}
        </a>
      </div>
    </div>
  );
};

const ExamCard = ({ exam }) => {
  const statusColors = {
    'تکمیل شده': 'bg-green-500/20 text-green-400',
    'در حال انجام': 'bg-yellow-500/20 text-yellow-400'
  };

  return (
    <div className="exam-card hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-white">{exam.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm ${statusColors[exam.status]}`}>
          {exam.status}
        </span>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [users] = useState([
    { id: 1, username: 'user1', email: 'user1@example.com', university: 'University A' },
    { id: 2, username: 'user2', email: 'user2@example.com', university: 'University B' },
    { id: 3, username: 'user3', email: 'user3@example.com', university: 'University A' },
    { id: 4, username: 'user4', email: 'user4@example.com', university: 'University B' },
  ]);

  const [exams] = useState([
    { id: 1, title: 'آزمون ریاضی ۱', status: 'تکمیل شده' },
    { id: 2, title: 'آزمون فیزیک', status: 'در حال انجام' },
    { id: 3, title: 'آزمون شیمی', status: 'تکمیل شده' },
    { id: 4, title: 'آزمون برنامه‌نویسی', status: 'در حال انجام' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  const stats = [
    {
      icon: Users,
      title: "کل کاربران",
      value: users.length,
      gradient: "gradient-purple"
    },
    {
      icon: BookOpen,
      title: "کل آزمون‌ها",
      value: exams.length,
      gradient: "gradient-blue"
    },
    {
      icon: Clock,
      title: "آزمون‌های در حال انجام",
      value: exams.filter(exam => exam.status === 'در حال انجام').length,
      gradient: "gradient-orange"
    },
    {
      icon: CheckCircle,
      title: "آزمون‌های تکمیل شده",
      value: exams.filter(exam => exam.status === 'تکمیل شده').length,
      gradient: "gradient-green"
    }
  ];

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.university.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExams = exams.filter(exam => 
    exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exam.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-wrapper" dir="rtl">
      <div className="dashboard-container">
        <GlowingBackground />

        <div className="dashboard-main">
          <div className="dashboard-header">
            <div className="user-welcome">
              <h1>پنل مدیریت 👋</h1>
              <p>مدیریت کاربران و آزمون‌ها</p>
            </div>
          </div>

          <div className="dashboard-stats">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          <div className="flex items-center justify-between mb-8">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="جستجو..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 rounded-lg pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>

            <div className="dashboard-tabs">
              <button
                className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                کاربران
              </button>
              <button
                className={`tab-btn ${activeTab === 'exams' ? 'active' : ''}`}
                onClick={() => setActiveTab('exams')}
              >
                آزمون‌ها
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'users' ? 
              filteredUsers.map(user => (
                <UserCard
                  key={user.id}
                  user={user}
                />
              ))
              :
              filteredExams.map(exam => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                />
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
