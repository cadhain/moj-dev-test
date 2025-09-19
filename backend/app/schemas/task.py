from pydantic import BaseModel, Field, field_validator
from typing import Optional, Literal
from datetime import datetime


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=60)
    description: Optional[str] = Field(None, max_length=2000)
    due_date: datetime
    status: Literal["todo", "in_progress", "done"] = "todo"

    @field_validator("title")
    def no_whitespace_title(cls, value):
        if not value.strip():
            raise ValueError("Title must not be empty")
        return value

    @field_validator("due_date")
    def validate_due_date(cls, value):
        now = datetime.now(value.tzinfo) if value.tzinfo else datetime.now()
        if value < now:
            raise ValueError("Due date must be today or in the future.")
        return value


class TaskOut(BaseModel):
    id: int
    title: str
    description: Optional[str] = None  # optional
    due_date: datetime
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True,
    }


class TaskUpdate(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: datetime
    status: str
