# backend/models.py
from sqlalchemy import Column, Integer, String, Float
from database import Base

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    type = Column(String)  # "single" or "multi"

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

class Balance(Base):
    __tablename__ = "balances"

    id = Column(Integer, primary_key=True, index=True)
    account_name = Column(String)
    asset_symbol = Column(String)
    amount = Column(Float, default=0.0)
