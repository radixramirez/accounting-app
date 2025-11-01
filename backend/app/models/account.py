"""Account ORM model."""
from sqlalchemy import Column, Integer, String

from app.db.base import Base


class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    type = Column(String)  # "single" or "multi"
