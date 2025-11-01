"""Transaction Pydantic schemas."""
from pydantic import BaseModel


class TransactionBase(BaseModel):
    from_account: str
    to_account: str
    from_asset: str
    to_asset: str
    amount: float
    converted_amount: float
    timestamp: str


class TransactionCreate(TransactionBase):
    pass


class Transaction(TransactionBase):
    id: int

    class Config:
        from_attributes = True
