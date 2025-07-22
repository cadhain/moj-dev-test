from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.task import Task
from starlette.status import HTTP_204_NO_CONTENT, HTTP_404_NOT_FOUND

router = APIRouter()

# Dependency: get DB session for each request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.delete("/tasks/{task_id}", status_code=HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Task not found")

    db.delete(task)
    db.commit()
    return  # 204 No Content
