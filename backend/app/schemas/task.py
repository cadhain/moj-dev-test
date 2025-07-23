from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None # optional
    due_date: date
    status: str

class TaskOut(BaseModel):
    id: int
    title: str
    description: Optional[str] = None # optional
    due_date: date
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True,
    }
