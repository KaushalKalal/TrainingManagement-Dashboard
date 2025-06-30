# 🚀 Training Management Dashboard

A MERN stack project that allows instructors to manage training modules and track trainee progress, while trainees can complete assigned modules and monitor their learning journey.

---

## 📌 Features

### 👨‍🏫 Instructor Features:

- Register/Login with security code
- Create and delete modules
- Assign/unassign modules to trainees
- View each trainee’s assigned modules and their completion status

### 👨‍🎓 Trainee Features:

- Register/Login
- View assigned modules
- Mark modules as completed
- See summary of total/completed/pending modules

### 🛡️ Auth & Security:

- JWT-based protected routes
- Role-based access control
- Password hashing with bcrypt
- Password reset functionality

--

## 🛠️ Tech Stack

- **Frontend:** React, React Router, Axios, Bootstrap
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT, bcrypt
- **Styling:** Bootstrap 5
- **Tools Used:**
  - AI Assistance (ChatGPT): 25% of the code base was generated or improved using AI—primarily for:
    - UI layout suggestions
    - Code commenting and documentation
    - Error handling enhancements
  - 75% of the code, logic, and structure was implemented manually, with thoughtful planning and debugging

---

## 📁 Project Structure

Backend/
│
├── config/
├── controllers/
│ ├── authController.js
│ ├── moduleController.js
│ └── userController.js
├── middleware/
│ └── authMiddleware.js
├── models/
│ ├── module.js
│ ├── SecurityCode.js
│ └── user.js
├── routes/
│ ├── authRoutes.js
│ ├── moduleRoutes.js
│ └── userRoutes.js
├── .env
├── server.js
└── package.json

Frontend/
│
├── public/
├── src/
│ ├── assets/
│ ├── components/
│ │ └── ProtectedRoute.jsx
│ ├── pages/
│ │ ├── InstructorDashboard.jsx
│ │ ├── Login.jsx
│ │ ├── Register.jsx
│ │ ├── ResetPassword.jsx
│ │ └── TraineeDashboard.jsx
│ ├── services/
│ │ └── authService.js
│ ├── App.jsx
│ ├── index.jsx
│ └── App.css
├── vite.config.js
└── package.json
├── README.md



