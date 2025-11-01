"""Balance ORM model."""
from sqlalchemy import Column, Float, Integer, String

from app.db.base import Base


class Balance(Base):
    __tablename__ = "balances"

    id = Column(Integer, primary_key=True, index=True)
    account_name = Column(String)
    asset_symbol = Column(String)
    amount = Column(Float, default=0.0)
