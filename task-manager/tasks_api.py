from uuid import uuid4

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI()


app.add_middleware( 
    CORSMiddleware, 
    allow_origins=[ "http://localhost:5500"], 
    allow_methods=["*"], 
    allow_headers=["*"], 
    allow_credentials=True, 
)


class Task(BaseModel):
    """Модель задачи"""
    id: str
    title: str
    completed: bool = False


class TaskCreate(BaseModel):
    title: str

class TaskUpdate(BaseModel):
    completed: bool

class TaskReplace(BaseModel):
    title: str
    completed: bool

tasks: list[Task] = []


@app.get("/tasks", response_model=list[Task])
def get_tasks():
    """Получить список задач"""
    return tasks


@app.post("/tasks", response_model=Task, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreate):
    """Создать новую задачу"""
    task = Task(id=str(uuid4()), title=payload.title, completed=False)
    tasks.append(task)
    return task


@app.patch("/tasks/{task_id}", response_model=Task)
def update_task(task_id: str, payload: TaskUpdate):
    for task in tasks:
        if task.id == task_id:
            task.completed = payload.completed
            return task
    raise HTTPException(status_code=404, detail="Task not found")


@app.put("/tasks/{task_id}", response_model=Task)
def replace_task(task_id: str, payload: TaskReplace):
    for index, task in enumerate(tasks):
        if task.id == task_id:
            update_task = Task(id=task.id, title=payload.title, completed=payload.completed)
            tasks[index] = update_task
            return update_task
    raise HTTPException(status_code=404, detail="Task not found")


@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: str):
    for index, task in enumerate(tasks):
        if task.id == task_id:
            tasks.pop(index)
            return
    raise HTTPException(status_code=404, detail="Task not found")