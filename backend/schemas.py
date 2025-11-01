from pydantic import BaseModel

# ------------------------
#  ACCOUNT SCHEMAS
# ------------------------
class AccountBase(BaseModel):
    name: str
    type: str


class AccountCreate(AccountBase):
    pass


class Account(AccountBase):
    id: int

    class Config:
        from_attributes = True  # Pydantic v2 replacement for orm_mode


# ------------------------
#  BALANCE SCHEMAS
# ------------------------
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


# ------------------------
#  TRANSACTION SCHEMAS
# ------------------------
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
