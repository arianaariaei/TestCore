import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie, Bar } from 'react-chartjs-2';
import { examService } from '../../api/services';
import '../../Style/AdminDashboard.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';


const AdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [exams, setExams] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingExams, setLoadingExams] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await examService.getAllUsers();
        setUsers(userData);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchExams = async () => {
      try {
        const examData = await examService.getAllExams();
        setExams(examData);
      } catch (err) {
        console.error('Error fetching exams:', err);
        setError('Failed to load exams');
      } finally {
        setLoadingExams(false);
      }
    };

    fetchUsers();
    fetchExams();
  }, []);

  // Prepare data for pie chart
// function getRandomColor() {
//     const randomColor = Math.floor(Math.random()*16777215).toString(16);
//     return `#${randomColor}`;
// }

// // Generate background colors based on the number of subjects
// const subjects = exams.map(exam => exam.subject);
// const subjectCounts = subjects.reduce((acc, subject) => {
//   acc[subject] = (acc[subject] || 0) + 1;
//   return acc;
// }, {});

// const totalExams = exams.length; // Ensure this is defined
// const backgroundColors = Array.from({ length: Object.keys(subjectCounts).length }, getRandomColor);

// const pieData = {
//   labels: Object.keys(subjectCounts),
//   datasets: [
//     {
//       label: 'درصد آزمون',
//       data: totalExams === 0 ? [] : Object.values(subjectCounts).map(count => (count / totalExams) * 100),
//       backgroundColor: backgroundColors,
//       hoverOffset: 4,
//     },
//   ],
// };

//   const pieOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//   };

  // const userExamCounts = users.map(user => {
  //   const userExams = exams.filter(exam => exam.user.user_id === user.user_id);
  //   return {
  //     userId: user.user_id,
  //     name: user.name,
  //     examCount: userExams.length,
  //   };
  // });

  // const barData = {
  //   labels: userExamCounts.map(user => user.name),
  //   datasets: [
  //     {
  //       label: 'تعداد آزمون',
  //       data: userExamCounts.map(user => user.examCount),
  //       backgroundColor: 'rgba(3, 194, 252, 0.6)',
  //       borderColor: 'rgba(3, 194, 252, 1)',
  //       borderWidth: 1,
  //     },
  //   ],
  // };
  
  // const barOptions = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  // };
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [sortField, setSortField] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
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
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
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
      exam.title.toLowerCase().includes(searchQuery.toLowerCase())
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
      value: exams.length ? Math.round(exams.reduce((acc, exam) => acc + exam.correct_answers / (exam.correct_answers + exam.wrong_answers) * 100, 0) / exams.length) : 0,
      gradient: "gradient-orange"
    },
    {
      icon: "✅",
      title: "بالاترین نمره",
      value: exams.length ? Math.max(...exams.map(exam => exam.correct_answers / (exam.correct_answers + exam.wrong_answers) * 100)) : 0,
      gradient: "gradient-green"
    }
  ];
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟");
    if (!confirmDelete) return;
  
    try {
      await examService.deleteUser(userId); 
      setUsers(users.filter(user => user.user_id !== userId));  
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('حذف کاربر با خطا مواجه شد');
    }
  };

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

          <div className="content-section">
          {loadingUsers || loadingExams ? (
            <p>در حال بارگذاری...</p>
          ) : error ? (
            <p>{error}</p>
          ) : activeTab === 'users' ? (
            <div className="data-table">
              <div className="table-header">
                <div className="header-cell">نام</div>
                <div className="header-cell">ایمیل</div>
                <div className="header-cell">دانشگاه</div>
                <div className="header-cell">عملیات</div>
              </div>
              {users.map(user => (
                <div key={user.id} className="table-row">
                  <div className="cell">{user.name}</div>
                  <div className="cell">{user.email}</div>
                  <div className="cell">{user.university}</div>
                  <div className="cell actions">
                    <button className="action-btn" onClick={() => handleDelete(user.user_id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <details>
                      <summary className="action-btn view" title="مشاهده">👁️</summary>
                      <div className="details-modal">
                        <p><strong>شناسه:</strong> {user.user_id}</p>
                        <p><strong>نام:</strong> {user.name}</p>
                        <p><strong>ایمیل:</strong> {user.email}</p>
                        <p><strong>دانشگاه:</strong> {user.university}</p>
                        <p><strong>ادمین:</strong> {user.is_admin ? 'بله' : 'خیر'}</p>
                      </div>
                    </details>
                    
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="data-table">
              <div className="table-header">
                <div className="header-cell">عنوان آزمون</div>
                <div className="header-cell">کاربر</div>
                <div className="header-cell">نمره</div>
                <div className="header-cell">عملیات</div>
              </div>
              {exams.map(exam => (
                <div key={exam.exam_id} className="table-row">
                  <div className="cell">{exam.title}</div>
                  <div className="cell">{exam.user.name}</div>
                  <div className="cell">{(exam.correct_answers / (exam.correct_answers + exam.wrong_answers) * 100).toFixed(2)}%</div>
                  <div className="cell actions">
                    <details>
                      <summary className="action-btn view" title="مشاهده">👁️</summary>
                      <div className="details-modal">
                        <p><strong>شناسه:</strong> {exam.exam_id}</p>
                        <p><strong>عنوان:</strong> {exam.title}</p>
                        <p><strong>درس:</strong> {exam.subject}</p>
                        <p><strong>کاربر:</strong> {exam.user.name}</p>
                        <p><strong>جواب درست:</strong> {exam.correct_answers}</p>
                        <p><strong>جواب غلط:</strong> {exam.wrong_answers}</p>
                        <p><strong>نمره:</strong> {(exam.correct_answers / (exam.correct_answers + exam.wrong_answers) * 100).toFixed(2)}%</p>
                      </div>
                    </details>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

        {(selectedUser || selectedExam) && (
          <div className='expand_container'>  
            <div className="view-details-btn">
              <button className="close-button" onClick={closeDetailView}>✖️</button>
              {selectedUser && (
                <div>
                  <h2>جزئیات کاربر</h2>
                  <p><strong>شناسه:</strong> {selectedUser.user_id}</p>
                  <p><strong>نام:</strong> {selectedUser.name}</p>
                  <p><strong>ایمیل:</strong> {selectedUser.email}</p>
                  <p><strong>دانشگاه:</strong> {selectedUser.university}</p>
                </div>
              )}
              {selectedExam && (
                <div>
                  <h2>جزئیات آزمون</h2>
                  <p><strong>شناسه:</strong> {selectedExam.exam_id}</p>
                  <p><strong>عنوان:</strong> {selectedExam.title}</p>
                  <p><strong>درس:</strong> {selectedExam.subject}</p>
                  <p><strong>کاربر:</strong> {selectedExam.user.name}</p>
                  <p><strong>جواب درست:</strong> {selectedExam.correct_answers}</p>
                  <p><strong>جواب غلط:</strong> {selectedExam.wrong_answers}</p>
                  <p><strong>نمره:</strong> {(selectedExam.correct_answers / (selectedExam.correct_answers + selectedExam.wrong_answers) * 100).toFixed(2)}%</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="charts_container">
          <h2 className="charts_title"> نمودار ها 📊</h2>
          <div className='chart_container'>
            {/* <div className="percentage_chart">
              <Pie data={pieData} options={pieOptions} />
            </div> */}
            {/* <div className="count_chart">
              <Bar data={barData} options={barOptions}/>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;