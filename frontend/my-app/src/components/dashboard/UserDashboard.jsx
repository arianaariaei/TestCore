import React, { useState, useEffect } from 'react';
import '../../style/UserDashboard.css';
import { useNavigate } from 'react-router-dom'; 
import { examService } from '../../api/services';

const UserDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState({ totalExams: 0, averageScore: 0 });

  const calculateStats = (examList) => {
    const totalExams = examList.length;
    const totalScore = examList.reduce((acc, exam) => acc + exam.correct_answers, 0);
    const totalQuestions = examList.reduce((acc, exam) => acc + (exam.correct_answers + exam.wrong_answers), 0);
    const averageScore = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;

    setStats({ totalExams, averageScore });
  };

  const handleEdit = (exam_id) => {
    navigate(`/exams/edit/${exam_id}`);
  };

  const handleDelete = async (exam_id) => {
    const confirmDelete = window.confirm("آیا مطمئن هستید که می خواهید این آزمون را حذف کنید؟");
    if (confirmDelete) {
      try {
        await examService.deleteExam(exam_id);
        setExams((prevExams) => prevExams.filter((e) => e.exam_id !== exam_id));
      } catch (error) {
        alert("Error deleting exam: " + error.message);
      }
    }
  };

  const StatCard = ({ icon, title, value, gradient }) => (
    <div className={`stat-card ${gradient}`}>
      {icon}
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );

  const ExamCard = ({ exam }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleDetails = () => {
      setIsExpanded(!isExpanded);
    };

    const totalAnswers = exam.correct_answers + exam.wrong_answers;
    const successRate = totalAnswers > 0 ? (exam.correct_answers / totalAnswers) * 100 : 0;

    return (
      <div className={`exam-card ${isExpanded ? 'expanded' : ''}`}>
        <div className="exam-header" onClick={toggleDetails}>
          <h3 className="exam-title">{exam.title}</h3>
          <span className={`exam-status ${exam.subject}`}>{exam.subject}</span>
        </div>
        
        {isExpanded && (
          <div className="exam-details">
            <div className="progress-bar">
              <div className="progress-text">
                <span>درصد</span>
                <span>{successRate.toFixed(2)}%</span>
              </div>
              <div className="progress-track">
                <div 
                  className="progress-fill" 
                  style={{ width: `${successRate.toFixed(2)}%` }}
                />
              </div>
            </div>

            <div className="exam-stats">
              <div className="stat-box">
                <span className="stat-label">کل سوالات</span>
                <span className="stat-value">{totalAnswers}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">پاسخ‌های درست</span>
                <span className="stat-value correct">{exam.correct_answers}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">پاسخ‌های نادرست</span>
                <span className="stat-value incorrect">{exam.wrong_answers}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">درصد موفقیت</span>
                <span className="stat-value">{successRate.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        )}

        <div className="exam-footer">
          <div className="exam-actions">
            <button className="action-btn" onClick={() => handleEdit(exam.exam_id)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button className="action-btn" onClick={() => handleDelete(exam.exam_id)}>
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

  useEffect(() => {
    const fetchUserExams = async () => {
      try {
        const fetchedExams = await examService.getUserExams(); 
        setExams(fetchedExams);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserExams();
  }, []);

  useEffect(() => {
    calculateStats(exams);
  }, [exams]);

  const filteredExams = exams.filter(exam => {
    if (activeTab === 'all') return true;
    return true; 
  });

  return (
    <div className="dashboard-wrapper">
      {loading && <p>Loading exams...</p>}
      {error && <p>Error: {error}</p>}
      
      <div className="dashboard-container">
        <div className="dashboard-main">
          <div className="dashboard-header">
            <div className="user-welcome">
              <h1>سلام، خوش آمدید 👋</h1>
              <p>آخرین وضعیت آزمون‌های خود را مشاهده کنید</p>
            </div>
            <button className="logout" onClick={onLogout}>
              خروج
            </button>
          </div>

          <div className="dashboard-stats">
            <StatCard 
              icon={<svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>}
              title="کل آزمون‌ها"
              value={stats.totalExams}
              gradient="gradient-purple"
            />
            <StatCard 
              icon={<svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 15l-2 5l9-9l-9-9l2 5l-9 4l9 4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>}
              title="میانگین نمره"
              value={stats.averageScore.toFixed(2)} 
              gradient="gradient-blue"
            />
          </div>

          <div className="dashboard-tabs">
            <button
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              همه آزمون‌ها
            </button>
            <button className="tab" onClick={() => navigate('/exams/create')}>
              ➕ آزمون جدید 
            </button>
          </div>

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
