from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from datetime import datetime, timezone


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    due_date = Column(DateTime, nullable=True)
    status = Column(
        String, nullable=False, default="todo"
    )  # e.g. "todo", "in_progress", "done"
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
