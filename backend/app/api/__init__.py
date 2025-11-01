"""API package that exposes application routers."""
from fastapi import APIRouter

from app.api.routers import accounts, balances, transactions

api_router = APIRouter()
api_router.include_router(accounts.router, prefix="/accounts", tags=["accounts"])
api_router.include_router(balances.router, prefix="/balances", tags=["balances"])
api_router.include_router(transactions.router, prefix="/transactions", tags=["transactions"])

__all__ = ["api_router"]
