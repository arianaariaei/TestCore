import React, { useState } from 'react';
import '../../style/ExamCreate.css';

const GlowingBackground = () => (
  <div className="glowing-background">
    <div className="glow-ball-1" />
    <div className="glow-ball-2" />
    <div className="glow-ball-3" />
  </div>
);

const ExamCreate = () => {
  const [examData, setExamData] = useState({
    title: '',
    subject: '',
    duration: '',
    totalQuestions: '',
    passingScore: '',
    description: '',
    questions: [
      {
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      }
    ]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExamData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    setExamData(prev => {
      const newQuestions = [...prev.questions];
      if (field === 'text') {
        newQuestions[index].text = value;
      } else if (field.startsWith('option')) {
        const optionIndex = parseInt(field.slice(-1)) - 1;
        newQuestions[index].options[optionIndex] = value;
      } else if (field === 'correctAnswer') {
        newQuestions[index].correctAnswer = parseInt(value);
      }
      return { ...prev, questions: newQuestions };
    });
  };

  const addQuestion = () => {
    setExamData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          text: '',
          options: ['', '', '', ''],
          correctAnswer: 0
        }
      ]
    }));
  };

  const removeQuestion = (index) => {
    setExamData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // اینجا می‌توانید کد مربوط به ذخیره آزمون را اضافه کنید
    console.log('آزمون جدید:', examData);
  };

  return (
    <div className="exam-create-page" dir="rtl">
      <GlowingBackground />
      
      <div className="exam-create-container">
        <div className="exam-create-card">
          <div className="card-header">
            <h1 className="title">ایجاد آزمون جدید</h1>
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
                <label>مدت زمان (دقیقه)</label>
                <input
                  type="number"
                  name="duration"
                  value={examData.duration}
                  onChange={handleInputChange}
                  placeholder="مثال: 60"
                  required
                />
              </div>

              <div className="input-group">
                <label>تعداد سوالات</label>
                <input
                  type="number"
                  name="totalQuestions"
                  value={examData.totalQuestions}
                  onChange={handleInputChange}
                  placeholder="مثال: 20"
                  required
                />
              </div>

              <div className="input-group">
                <label>نمره قبولی</label>
                <input
                  type="number"
                  name="passingScore"
                  value={examData.passingScore}
                  onChange={handleInputChange}
                  placeholder="مثال: 12"
                  required
                />
              </div>
            </div>

            <div className="input-group full-width">
              <label>توضیحات آزمون</label>
              <textarea
                name="description"
                value={examData.description}
                onChange={handleInputChange}
                placeholder="توضیحات و راهنمایی‌های آزمون را وارد کنید..."
                rows="4"
              />
            </div>

            <div className="questions-section">
              <div className="section-header">
                <h2>سوالات</h2>
                <button type="button" onClick={addQuestion} className="add-question-btn">
                  افزودن سوال
                </button>
              </div>

              {examData.questions.map((question, qIndex) => (
                <div key={qIndex} className="question-card">
                  <div className="question-header">
                    <h3>سوال {qIndex + 1}</h3>
                    {qIndex > 0 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="remove-question-btn"
                      >
                        حذف
                      </button>
                    )}
                  </div>

                  <div className="question-content">
                    <div className="input-group">
                      <label>متن سوال</label>
                      <textarea
                        value={question.text}
                        onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                        placeholder="متن سوال را وارد کنید..."
                        rows="2"
                        required
                      />
                    </div>

                    <div className="options-grid">
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="option-group">
                          <label>گزینه {oIndex + 1}</label>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleQuestionChange(qIndex, `option${oIndex + 1}`, e.target.value)}
                            placeholder={`گزینه ${oIndex + 1}`}
                            required
                          />
                        </div>
                      ))}
                    </div>

                    <div className="input-group">
                      <label>پاسخ صحیح</label>
                      <select
                        value={question.correctAnswer}
                        onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                        required
                      >
                        <option value="">انتخاب کنید</option>
                        <option value="0">گزینه 1</option>
                        <option value="1">گزینه 2</option>
                        <option value="2">گزینه 3</option>
                        <option value="3">گزینه 4</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                ایجاد آزمون
              </button>
              <button type="button" className="cancel-btn">
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