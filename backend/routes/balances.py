from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import exists
import models, schemas
from database import get_db

router = APIRouter()

# ────────────────────────────────
# GET all balances
# ────────────────────────────────
@router.get("/", response_model=list[schemas.Balance])
def get_balances(db: Session = Depends(get_db)):
    """Return all balances."""
    return db.query(models.Balance).all()


# ────────────────────────────────
# POST: Create or update a balance
# ────────────────────────────────
@router.post("/", response_model=schemas.Balance)
def add_or_update_balance(balance: schemas.BalanceCreate, db: Session = Depends(get_db)):
    """
    Create or update a balance for (account_name, asset_symbol).
    If it already exists, overwrite the amount.
    """
    # ensure account exists
    acc_exists = db.query(
        exists().where(models.Account.name == balance.account_name)
    ).scalar()
    if not acc_exists:
        raise HTTPException(status_code=404, detail="Account not found for this balance")

    existing = (
        db.query(models.Balance)
        .filter(
            models.Balance.account_name == balance.account_name,
            models.Balance.asset_symbol == balance.asset_symbol
        )
        .first()
    )

    if existing:
        existing.amount = balance.amount
        db.commit()
        db.refresh(existing)
        return existing

    new_bal = models.Balance(
        account_name=balance.account_name,
        asset_symbol=balance.asset_symbol,
        amount=balance.amount,
    )
    db.add(new_bal)
    db.commit()
    db.refresh(new_bal)
    return new_bal


# ────────────────────────────────
# POST: Add external funds (increment)
# ────────────────────────────────
@router.post("/add", response_model=schemas.Balance)
def add_external_funds(balance: schemas.BalanceCreate, db: Session = Depends(get_db)):
    """
    Add external money to an existing balance (e.g., income/top-up).
    """
    # ensure account exists
    acc_exists = db.query(
        exists().where(models.Account.name == balance.account_name)
    ).scalar()
    if not acc_exists:
        raise HTTPException(status_code=404, detail="Account not found for this balance")

    existing = (
        db.query(models.Balance)
        .filter(
            models.Balance.account_name == balance.account_name,
            models.Balance.asset_symbol == balance.asset_symbol
        )
        .first()
    )

    if not existing:
        raise HTTPException(status_code=404, detail="Balance entry not found")

    existing.amount = existing.amount + balance.amount
    db.commit()
    db.refresh(existing)
    return existing


# ────────────────────────────────
# DELETE: Prune orphan balances
# ────────────────────────────────
@router.delete("/prune")
def prune_orphan_balances(db: Session = Depends(get_db)):
    """
    Delete balances whose account_name does not exist in Accounts.
    Run this if balances are out of sync with accounts.
    """
    valid_accounts = {a.name for a in db.query(models.Account).all()}
    if not valid_accounts:
        deleted = db.query(models.Balance).delete()
        db.commit()
        return {"deleted": deleted, "note": "No accounts exist; all balances removed."}

    deleted = (
        db.query(models.Balance)
        .filter(~models.Balance.account_name.in_(list(valid_accounts)))
        .delete(synchronize_session=False)
    )
    db.commit()
    return {"deleted": deleted, "kept_accounts": sorted(list(valid_accounts))}
