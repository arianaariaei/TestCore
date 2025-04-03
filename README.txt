<!-- Logo -->
<p align="center">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100">
    <defs>
      <pattern id="examPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="5" r="1" fill="#818cf8" opacity="0.3"/>
        <path d="M15 3 L17 5 L19 2" stroke="#6366f1" stroke-width="0.5" opacity="0.3"/>
        <text x="3" y="15" font-size="4" fill="#4f46e5" opacity="0.3">×</text>
        <text x="12" y="18" font-size="4" fill="#4f46e5" opacity="0.3">÷</text>
        <text x="17" y="13" font-size="4" fill="#6366f1" opacity="0.3">?</text>
      </pattern>
      <clipPath id="circleClip">
        <circle cx="100" cy="50" r="40"/>
      </clipPath>
    </defs>
    <circle cx="100" cy="50" r="40" fill="url(#examPattern)" stroke="#6366f1" stroke-width="2"/>
    <g clip-path="url(#circleClip)">
      <path d="M70 35 L100 30 L130 35 L100 40 Z" fill="#6366f1"/>
      <path d="M70 35 L100 80 L130 35" fill="#4f46e5"/>
      <path d="M85 25 L115 25 L115 75 L85 75 Z" fill="#f1f5f9" stroke="#818cf8" stroke-width="1.5"/>
      <line x1="90" y1="35" x2="110" y2="35" stroke="#6366f1" stroke-width="1"/>
      <line x1="90" y1="45" x2="110" y2="45" stroke="#6366f1" stroke-width="1"/>
      <line x1="90" y1="55" x2="110" y2="55" stroke="#6366f1" stroke-width="1"/>
      <line x1="90" y1="65" x2="110" y2="65" stroke="#6366f1" stroke-width="1"/>
      <g transform="rotate(-45, 120, 40)">
        <path d="M110 35 L130 35 L128 45 L112 45 Z" fill="#4f46e5"/>
        <path d="M130 35 L135 40 L133 42 L128 45 Z" fill="#818cf8"/>
        <rect x="112" y="35" width="4" height="10" fill="#818cf8"/>
        <line x1="114" y1="37" x2="126" y2="37" stroke="#f1f5f9" stroke-width="0.5"/>
      </g>
      <g transform="translate(65, 20) scale(0.6)">
        <rect x="0" y="0" width="4" height="4" fill="none" stroke="#818cf8" stroke-width="0.5" opacity="0.4"/>
        <path d="M0.5 2 L1.5 3 L3.5 0.5" stroke="#818cf8" stroke-width="0.5" opacity="0.4"/>
      </g>
      <g transform="translate(130, 70) scale(0.6)">
        <circle cx="0" cy="0" r="1.5" fill="none" stroke="#818cf8" stroke-width="0.5" opacity="0.4"/>
        <circle cx="6" cy="0" r="1.5" fill="none" stroke="#818cf8" stroke-width="0.5" opacity="0.4"/>
        <circle cx="12" cy="0" r="1.5" fill="none" stroke="#818cf8" stroke-width="0.5" opacity="0.4"/>
      </g>
    </g>
  </svg>
</p>

---

# 📝 TestCore

**Track your exams. Visualize your progress. Administer with ease.**

---

## 📘 Overview

**TestCore** is a sleek, exam-tracking platform that allows users to register, view, and analyze their exam performance — all in one place.

It also includes a powerful admin panel for managing users and generating insightful reports.

---

## ✨ Features

### 👩‍🎓 User Features

- Register exams with subject, score, and date
- View your personal exam history
- Analyze your score trends over time

### 🛠️ Admin Panel

- View all users and their exams
- Manage records and data easily
- Access insightful reports:
  - Subjects with the most exams
  - Score distributions
  - Overall user activity

---

## ⚙️ Tech Stack

- **Frontend:** React  
- **Backend:** FastAPI  
- **Database:** PostgreSQL

---

## 👥 Authors

- **Ariana Ariaei** – Backend Developer  
- **Roxana Gholami** – Backend Developer  
- **Kimia Zolfaghari** – Frontend Developer  
- **Saqar Aezi** – Frontend Developer

---

## 📄 License

Licensed under the [MIT License](LICENSE).

---

## 💬 Feedback

Got suggestions or issues? Feel free to open an issue or pull request. We'd love to hear from you!
