"""Account Pydantic schemas."""
from pydantic import BaseModel


class AccountBase(BaseModel):
    name: str
    type: str


class AccountCreate(AccountBase):
    pass


class Account(AccountBase):
    id: int

    class Config:
        from_attributes = True
