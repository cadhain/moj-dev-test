from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None

class TaskOut(BaseModel):
    id: int
    title: str
    description: str
    due_date: Optional[date] # makes the due date optional
    status: str
    created_at: datetime

    class Config:
        orm_mode = True
