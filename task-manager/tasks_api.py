from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Task as TaskModel
from sqlalchemy import select


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5500"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


# Pydantic models

class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    completed: bool


class TaskCreate(BaseModel):
    title: str
    description: str | None = None


class TaskUpdate(BaseModel):
    completed: bool


class TaskReplace(BaseModel):
    title: str
    description: str | None = None
    completed: bool


# Database dependency

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/tasks", response_model=list[TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    """Получить список задач"""
    statement = select(TaskModel)
    return db.scalars(statement).all()


@app.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreate, db: Session = Depends(get_db)):
    """Создать новую задачу"""
    task = TaskModel(
    title=payload.title,
    description=payload.description,
    completed=False
)

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


@app.patch("/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    payload: TaskUpdate,
    db: Session = Depends(get_db)
):
    task = db.get(TaskModel, task_id)

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    task.completed = payload.completed

    db.commit()
    db.refresh(task)

    return task


@app.put("/tasks/{task_id}", response_model=TaskResponse)
def replace_task(
    task_id: int,
    payload: TaskReplace,
    db: Session = Depends(get_db)
):
    task = db.get(TaskModel, task_id)

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    task.title = payload.title
    task.completed = payload.completed
    task.description = payload.description 

    db.commit()
    db.refresh(task)

    return task


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    """Удалить задачу"""
    task = db.get(TaskModel, task_id)

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()

    return {"message": "Task deleted successfully"}