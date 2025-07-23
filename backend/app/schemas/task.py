from pydantic import BaseModel, Field, field_validator
from typing import Optional, Literal
from datetime import date, datetime

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500) # optional
    due_date: date
    status: Literal["todo", "in_progress", "done"] = "todo" 
    
    @field_validator("title")
    def no_whitespace_title(cls, value):
        if not value.strip():
            raise ValueError("Title must not be empty")
        return value # default status

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
