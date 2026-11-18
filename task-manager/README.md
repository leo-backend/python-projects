# Task Manager

A full-stack task management application built with Python, FastAPI, SQLAlchemy, SQLite, HTML, CSS, and JavaScript.

## Features

- Create new tasks
- View all tasks
- Edit task titles
- Mark tasks as completed
- Delete tasks
- Track total, active, and completed tasks
- Persistent data storage using SQLite

## Tech Stack

- **Backend:** Python, FastAPI
- **ORM:** SQLAlchemy
- **Database:** SQLite
- **Frontend:** HTML, CSS, JavaScript
- **API:** REST API
- **Server:** Uvicorn

## Project Structure

```text
task-manager/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .venv/
├── .gitignore
├── database.py
├── init_db.py
├── models.py
├── tasks_api.py
└── README.md
```

## How to Run

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd task-manager
```

### 2. Create a virtual environment

```bash
python -m venv .venv
```

Activate it:

**Windows PowerShell:**

```powershell
.\.venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```bash
pip install fastapi uvicorn sqlalchemy
```

### 4. Initialize the database

```bash
python init_db.py
```

This creates the SQLite database and the required tables.

### 5. Start the backend

```bash
python -m uvicorn tasks_api:app --reload
```

Backend: http://127.0.0.1:8000

API documentation: http://127.0.0.1:8000/docs

### 6. Start the frontend

Open a second terminal:

```bash
cd frontend
python -m http.server 5500
```

Frontend: http://localhost:5500

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Get all tasks |
| POST | `/tasks` | Create a new task |
| PATCH | `/tasks/{task_id}` | Update task completion status |
| PUT | `/tasks/{task_id}` | Replace task data |
| DELETE | `/tasks/{task_id}` | Delete a task |

## Database

The application uses SQLite for persistent data storage.

SQLAlchemy ORM handles database operations, while `models.py` defines the database structure.

Tasks are stored in `tasks.db` and remain available after the backend server restarts.

The database file is excluded from Git using `.gitignore`.