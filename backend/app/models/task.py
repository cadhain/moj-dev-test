from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from datetime import datetime, timezone


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)  # mandatory field
    description = Column(String, nullable=True)  # optional field
    due_date = Column(
        DateTime(timezone=True), nullable=False
    )  # mandatory date and time
    status = Column(
        String, nullable=False, default="todo"
    )  # e.g. "todo", "in_progress", "done"
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
