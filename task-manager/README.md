### Task Manager
A simple full-stack task management application built with Python, FastAPI, HTML, CSS, and JavaScript.

### FEATURES
Create new tasks
View all tasks
Edit task titles
Mark tasks as completed
Delete tasks
Track total, active, and completed tasks

### Tech Stack
Backend: Python, FastAPI
Frontend: HTML, CSS, JavaScript
API: REST API
Server: Uvicorn

### Project Structure
python-projects/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── tasks_api.py
├── .gitignore
└── README.md

### How to Run
1. Install dependencies
pip install fastapi uvicorn

2. Start the backend
python -m uvicorn tasks_api:app --reload

Backend: http://127.0.0.1:8000
API documentation: http://127.0.0.1:8000/docs

3. Start the frontend
Open a second terminal:
cd frontend
python -m http.server 5500

Frontend: http://localhost:5500


### Note
Tasks are currently stored in memory and reset when the backend server restarts.