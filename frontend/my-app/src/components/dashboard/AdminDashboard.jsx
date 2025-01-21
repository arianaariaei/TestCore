import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie, Bar } from 'react-chartjs-2';
import { examService } from '../../api/services';
import '../../Style/AdminDashboard.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);


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


const subjects = exams.map(exam => exam.subject);
const subjectCounts = subjects.reduce((acc, subject) => {
  acc[subject] = (acc[subject] || 0) + 1;
  return acc;
}, {});


const subjectLabels = Object.keys(subjectCounts);
const subjectData = Object.values(subjectCounts);

const totalExams = subjectData.reduce((acc, count) => acc + count, 0);

function getRandomColor() {
  const randomColor = Math.floor(Math.random()*16777215).toString(16);
  return `#${randomColor}`;
}

const backgroundColors = Array.from({ length: subjectLabels.length }, getRandomColor);

const pieChartData = {
  labels: subjectLabels,
  datasets: [
    {
      label: 'Subject Distribution',
      data: subjectData,
      backgroundColor: backgroundColors,
      borderWidth: 1,
    },
  ],
};

const pieOptions = {
  plugins: {
    tooltip: {
      callbacks: {
        label: (tooltipItem) => {
          const label = tooltipItem.label || '';
          const value = tooltipItem.formattedValue || 0;
          const percentage = ((value / totalExams) * 100).toFixed(2);
          return `${label}: ${value} (${percentage}%)`;
        },
      },
    },
  },
};

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [sortField, setSortField] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); 
  const [selectedUserExams, setSelectedUserExams] = useState(null);


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

  // const handleDelete = async (userId) => {
  //   const confirmDelete = window.confirm("آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟");
  //   if (!confirmDelete) return;
  
  //   try {
  //     await examService.deleteUser(userId); 
  //     setUsers(users.filter(user => user.user_id !== userId));  
  //   } catch (error) {
  //     console.error('Error deleting user:', error);
  //     alert('حذف کاربر با خطا مواجه شد');
  //   }
  // };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟");
    if (!confirmDelete) return;

    const userToDelete = users.find(user => user.user_id === userId);
    
    if (userToDelete && userToDelete.is_admin) {
        alert('حذف کاربر ادمین ممکن نیست');
        return; 
    }

    try {
        await examService.deleteUser(userId);
        setUsers(users.filter(user => user.user_id !== userId));  
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('حذف کاربر با خطا مواجه شد');
    }
};

  const handleUserClick = async (userId) => {
    try {
      const examDetails = await examService.getUserExamDetails(userId);
      setSelectedUserExams(examDetails);
    } catch (error) {
      console.error('Error fetching user exam details:', error);
    }
  };

  const closeModal = () => {
    setSelectedUserExams(null);
  };
  
  const closeDetailView = () => {
    setSelectedUser(null);
    setSelectedExam(null);
  };

  return (
    <div className="admin-dashboard" dir="rtl">
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
              <div className='header_container'>    
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
            <button className="logout" onClick={onLogout}>خروج
              </button>
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
                <div className="header-cell">نام ▼</div>
                <div className="header-cell">ایمیل ▼</div>
                <div className="header-cell">دانشگاه ▼</div>
                <div className="header-cell">عملیات ▼</div>
              </div>
               {filteredUsers.map(user => (
                <div key={user.id} className="table-row">
                  {/* <div className="cell">{user.name}</div> */}
                  <div className="cell">
                    {user.name}
                      {user.is_admin && <span role="img" aria-label="admin icon" style={{ marginLeft: '5px' }}>👤</span>}
                  </div>
                  <div className="cell">{user.email}</div>
                  <div className="cell">{user.university}</div>
                  <div className="cell actions">
                    <button className="action-btn" onClick={() => handleDelete(user.user_id)}>
                     🗑️
                    </button>
                    <button className="action-btn" onClick={() => handleUserClick(user.user_id)}>
                      📋
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
                     {/* {!user.is_admin && (
                        <button className="action-btn" onClick={() => handleUserClick(user.user_id)}>
                          📋
                        </button>
                      )} */}
                   </div>
                 </div>
              ))} 
            </div>
          ) : (
            <div className="data-table">
              <div className="table-header">
                <div className="header-cell">عنوان آزمون ▼</div>
                <div className="header-cell">کاربر ▼</div>
                <div className="header-cell">نمره ▼</div>
                <div className="header-cell">عملیات ▼</div>
              </div>
              {filteredExams.map(exam => (
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
              <button className="close-button" onClick={closeDetailView}>✖</button>
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
                <div >
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
            {selectedUserExams && (
        <div className='modal'>
          <div className='modal-content'>
            <button className="close-button" onClick={closeModal}>🗙</button>
            <ul>
                  {selectedUserExams.exams.map(exam => (
                    <li key={exam.id}>
                      <div>
                        <strong>عنوان:</strong> {exam.title} <br />
                        <strong>نمره:</strong> {exam.score_percentage.toFixed(2)}% <br />
                        <strong>جواب درست:</strong> {exam.correct_answers} <br />
                        <strong>جواب غلط:</strong> {exam.wrong_answers}
                      </div>
                    </li>
                  ))}
                </ul>
                <div>
                  <strong>خلاصه:</strong>
                  <p>تعداد آزمون‌ها: {selectedUserExams.summary.total_exams}</p>
                  <p>تعداد پاسخ‌های درست: {selectedUserExams.summary.total_correct_answers}</p>
                  <p>تعداد پاسخ‌های غلط: {selectedUserExams.summary.total_wrong_answers}</p>
                  <p>میانگین نمره: {selectedUserExams.summary.average_score.toFixed(2)}%</p>
                </div>
          </div>
        </div>)}
      
        <div className="charts_container">
          <h2 className="charts_title">نمودار  📊</h2>
            <div className='chart_container'>
              {loadingExams ? (
                <p>در حال بارگذاری نمودار...</p>
                ) : error ? (
                <p>{error}</p>
                ) : ( 
                <div className="percentage_chart">
                  {subjectData.length > 0 ? (
                    
                  <Pie data={pieChartData} options={pieOptions} />
                  ) : (
                  <p>هیچ داده‌ای برای نمایش وجود ندارد.</p>
                  )}
                </div>
                )}
              {/* <div className="count_chart">
                <h3>تعداد آزمون‌ها بر اساس کاربر</h3>
                <Bar data={barChartData} options={barOptions} />
              </div> */}
            </div>
        </div>
      </div>
    </div>
   );
 };

 export default AdminDashboard;