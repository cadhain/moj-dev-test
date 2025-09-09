from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.task import Task
from app.schemas.task import TaskCreate  # import Pydantic model
from starlette.status import HTTP_201_CREATED, HTTP_204_NO_CONTENT, HTTP_404_NOT_FOUND
from typing import List
from app.schemas.task import TaskOut  # import Pydantic model for output

print("Loading task routes...")

router = APIRouter()


# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# POST route to create a new task
@router.post("/tasks", status_code=HTTP_201_CREATED, tags=["Tasks"])
def create_task(task_data: TaskCreate, db: Session = Depends(get_db)):
    new_task = Task(
        title=task_data.title,
        description=task_data.description,
        due_date=task_data.due_date,
        status=task_data.status,
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


# DELETE route
@router.delete("/tasks/{task_id}", status_code=HTTP_204_NO_CONTENT, tags=["Tasks"])
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Task not found")

    db.delete(task)
    db.commit()
    return  # 204 No Content


# GET all tasks
@router.get("/tasks", response_model=List[TaskOut], tags=["Tasks"])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()


# GET a single task by ID
@router.get("/tasks/{task_id}", response_model=TaskOut, tags=["Tasks"])
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Task not found")
    return task
