"""Transaction ORM model."""
from sqlalchemy import Column, Float, Integer, String

from app.db.base import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    from_account = Column(String)
    to_account = Column(String)
    from_asset = Column(String)
    to_asset = Column(String)
    amount = Column(Float)
    converted_amount = Column(Float)
    timestamp = Column(String)
