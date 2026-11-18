# Task Manager

A full-stack task management application built with Python, FastAPI, SQLAlchemy, SQLite, HTML, CSS, and JavaScript.

## Features

- Create new tasks
- View all tasks
- Edit task titles and descriptions
- Mark tasks as completed
- Delete tasks
- Track total, active, and completed tasks
- Persistent data storage using SQLite
- Database schema management using Alembic migrations

## Tech Stack

- **Backend:** Python, FastAPI
- **ORM:** SQLAlchemy
- **Database:** SQLite
- **Migrations:** Alembic
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
├── migrations/
│   ├── versions/
│   ├── env.py
│   ├── README
│   └── script.py.mako
├── .gitignore
├── alembic.ini
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
pip install fastapi uvicorn sqlalchemy alembic
```

### 4. Initialize the database

```bash
python init_db.py
```

This creates the SQLite database and the required tables.

Register the current database schema with Alembic:

```bash
alembic stamp head
```

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

The `Task` model includes the following fields:

- `id` — unique task identifier
- `title` — task title
- `description` — optional task description
- `completed` — task completion status

Tasks are stored in `tasks.db` and remain available after the backend server restarts.

The database file is excluded from Git using `.gitignore`.

## Database Migrations

Alembic is used to manage database schema changes.

Migrations allow the database structure to evolve alongside SQLAlchemy models without manually recreating tables.

Useful commands:

```bash
# Check the current database revision
alembic current

# View migration history
alembic history

# Generate a migration automatically
alembic revision --autogenerate -m "Migration message"

# Apply all pending migrations
alembic upgrade head

# Revert the latest migration
alembic downgrade -1
```

After changing SQLAlchemy models, generate and review a migration before applying it.

**Note:** The initial baseline migration records the existing database schema. The database tables are created by `init_db.py` during initial setup.
