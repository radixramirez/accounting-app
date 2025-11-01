"""Balance Pydantic schemas."""
from pydantic import BaseModel


class BalanceBase(BaseModel):
    account_name: str
    asset_symbol: str
    amount: float


class BalanceCreate(BalanceBase):
    pass


class Balance(BalanceBase):
    id: int

    class Config:
        from_attributes = True
