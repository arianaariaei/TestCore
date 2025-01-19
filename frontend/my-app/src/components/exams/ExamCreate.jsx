import React, { useState } from 'react';
import '../../style/ExamCreate.css';
import { useNavigate } from 'react-router-dom';

const GlowingBackground = () => (
  <div className="glowing-background">
    <div className="glow-ball-1" />
    <div className="glow-ball-2" />
    <div className="glow-ball-3" />
  </div>
);

const ExamCreate = () => {
  const navigate = useNavigate(); 
  const [examData, setExamData] = useState({
    title: '',
    subject: '',
    correctAnswer: '',
    wrongAnswer: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExamData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('آزمون جدید:', examData);
    navigate('/dashboard');
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  return (
    <div className="exam-create-page" dir="rtl">
      <GlowingBackground />
      
      <div className="exam-create-container">
        <div className="exam-create-card">
          <div className="card-header">
            <h1 className="title">آزمون جدید</h1>
            <p className="subtitle">مشخصات آزمون را وارد کنید</p>
          </div>

          <form onSubmit={handleSubmit} className="exam-form">
            <div className="form-grid">
              <div className="input-group">
                <label>عنوان آزمون</label>
                <input
                  type="text"
                  name="title"
                  value={examData.title}
                  onChange={handleInputChange}
                  placeholder="مثال: آزمون میان‌ترم ریاضی ۱"
                  required
                />
              </div>

              <div className="input-group">
                <label>درس</label>
                <input
                  type="text"
                  name="subject"
                  value={examData.subject}
                  onChange={handleInputChange}
                  placeholder="مثال: ریاضی"
                  required
                />
              </div>

              <div className="input-group">
                <label>تعداد صحیح</label>
                <input
                  type="number"
                  name="correctAnswer"
                  value={examData.correctAnswer}
                  onChange={handleInputChange}
                  placeholder="مثال: 4"
                  required
                />
              </div>

              <div className="input-group">
                <label>تعداد غلط</label>
                <input
                  type="number"
                  name="wrongAnswer"
                  value={examData.wrongAnswer}
                  onChange={handleInputChange}
                  placeholder="مثال: 7"
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                ایجاد آزمون
              </button>
              <button type="button" onClick={handleCancel} className="cancel-btn">
                انصراف
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExamCreate;
