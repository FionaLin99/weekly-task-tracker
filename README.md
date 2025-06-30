# Weekly Productivity & Task Tracker Dashboard

A simple and intuitive full-stack React application to help you track, manage, and complete your weekly tasks and habits efficiently.

---

## Features

- **Add, edit, delete tasks** with detailed information including title, assignee, description, estimated time, and goal week.
- **Filter tasks** by selecting a date from the calendar or entering an ISO week (e.g., `2025-W27`).
- **View all tasks** sorted by goal week, or filter to focus on a specific week.
- **Track task completion progress** with a clean, animated progress bar.
- Responsive and user-friendly interface designed for ease of use.
- Backend API integration for persistent data storage and full CRUD operations.

---

## Technologies Used

- **Frontend:** React, React DatePicker, date-fns
- **Backend:** Node.js, Express, MongoDB
- **API Communication:** Fetch API

---

## Project Structure

task-tracker-backend/
├── server.js
├── package.json
├── package-lock.json
├── README.md
├── node_modules/ # (excluded from repo via .gitignore)
└── task-tracker-frontend/
├── public/
├── src/
│ └── App.js
├── package.json
├── package-lock.json
├── README.md
├── .gitignore
└── node_modules/ # (excluded from repo via .gitignore)

## Getting Started

### Prerequisites
- Node.js installed (https://nodejs.org/)
- npm comes with Node.js
- Backend dependencies installed (`npm install` inside backend folder if needed)
- Frontend dependencies installed (`npm install` inside frontend folder)

### Run the Application

1. Open terminal in the root project folder, and start the backend server: (`task-tracker-backend`):

node server.js 

2. Open a new terminal window, navigate into the frontend folder, and start the frontend app:

cd task-tracker-frontend
npm start 

3. Open your browser and go to http://localhost:3000 to view the app.

Optional: Installing Dependencies

If dependencies are not installed yet, run the following:

# Backend dependencies
cd task-tracker-backend
npm install

# Frontend dependencies
cd task-tracker-frontend
npm install

