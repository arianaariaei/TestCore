import React, { useState } from 'react';
import '../../style/AdminDashboard.css';

const GlowingBackground = () => (
  <div className="glowing-background">
    <div className="glow-ball-1" />
    <div className="glow-ball-2" />
    <div className="glow-ball-3" />
  </div>
);

const UserCard = ({ user, onDelete }) => (
  <div className="user-card">
    <h3 className="user-name">{user.username}</h3>
    <p className="user-email">{user.email}</p>
    <p className="user-university">{user.university}</p>
    <button className="delete-user-btn" onClick={() => onDelete(user.id)}>حذف کاربر</button>
  </div>
);

const ExamCard = ({ exam, onDelete }) => (
  <div className="exam-card">
    <h3 className="exam-title">{exam.title}</h3>
    <p className="exam-status">{exam.status}</p>
    <button className="delete-exam-btn" onClick={() => onDelete(exam.id)}>حذف آزمون</button>
  </div>
);

const AdminDashboard = () => {
  const [users, setUsers] = useState([
    { id: 1, username: 'user1', email: 'user1@example.com', university: 'University A' },
    { id: 2, username: 'user2', email: 'user2@example.com', university: 'University B' },
    { id: 3, username: 'user3', email: 'user3@example.com', university: 'University A' },
    { id: 4, username: 'user4', email: 'user4@example.com', university: 'University B' },

  ]);

  const [exams, setExams] = useState([
    { id: 1, title: 'آزمون ریاضی ۱', status: 'تکمیل شده' },
    { id: 2, title: 'آزمون فیزیک', status: 'در حال انجام' },
  ]);

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleDeleteExam = (examId) => {
    setExams(exams.filter(exam => exam.id !== examId));
  };

  return (
    <div className="admin-dashboard-wrapper">
      <GlowingBackground />
      <div className="admin-dashboard-container">
        <h1>پنل مدیریت</h1>
        <div className="user-management">
          <h2>مدیریت کاربران</h2>
          <div className="user-list">
            {users.map(user => (
              <UserCard key={user.id} user={user} onDelete={handleDeleteUser} />
            ))}
          </div>
        </div>

        <div className="exam-management">
          <h2>مدیریت آزمون‌ها</h2>
          <div className="exam-list">
            {exams.map(exam => (
              <ExamCard key={exam.id} exam={exam} onDelete={handleDeleteExam} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
