import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../style/ExamEdit.css';
import { examService } from '../../api/services';

const GlowingBackground = () => (
  <div className="glowing-background">
    <div className="glow-ball-1" />
    <div className="glow-ball-2" />
    <div className="glow-ball-3" />
  </div>
);

const ExamEdit = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [examData, setExamData] = useState({ correct_answers: 0, wrong_answers: 0 });

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const exam = await examService.getExamById(examId); 
        setExamData(exam);
      } catch (error) {
        alert("Error fetching exam data: " + error.message);
      }
    };

    fetchExamData();
  }, [examId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExamData({ ...examData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedExam = await examService.updateExam(examId, examData);
      setExamData(updatedExam); 
      navigate('/exams');  
    } catch (error) {
      alert("Error saving exam: " + error.message);
    }
  };
  
  return (
    <div className="exam-create-page" dir="rtl">
      <GlowingBackground />
      <div className="exam-create-container">
        <div className="exam-create-card">
          <div className="card-header">
            <h1 className="title">ویرایش آزمون</h1>
          </div>

          <form onSubmit={handleSubmit} className="exam-form">
            <div className="form-grid">
              {/* <div className="input-group">
                <label>عنوان آزمون</label>
                <input
                  type="text"
                  name="title"
                  value={examData.title}
                  onChange={handleChange}
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
                  onChange={handleChange}
                  placeholder="مثال: ریاضی"
                  required
                />
              </div> */}

              <div className="input-group">
                <label>تعداد صحیح</label>
                <input
                  type="number"
                  name="correct_answers"
                  value={examData.correct_answers}
                  onChange={handleChange}
                  placeholder="مثال: 4"
                  required
                />
              </div>

              <div className="input-group">
                <label>تعداد غلط</label>
                <input
                  type="number"
                  name="wrong_answers"
                  value={examData.wrong_answers}
                  onChange={handleChange}
                  placeholder="مثال: 7"
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">ذخیره</button>
              <button type="button" className="cancel-btn" onClick={() => navigate('/exams')}>
                انصراف
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExamEdit;