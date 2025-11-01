"""Account API routes."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import app.models as models
import app.schemas as schemas
from app.api.deps import get_db

router = APIRouter()

# ────────────────────────────────
# GET all accounts
# ────────────────────────────────
@router.get("/", response_model=list[schemas.Account])
def get_accounts(db: Session = Depends(get_db)):
    """
    Retrieve all accounts from the database.
    """
    return db.query(models.Account).all()


# ────────────────────────────────
# POST: create a new account
# ────────────────────────────────
@router.post("/", response_model=schemas.Account)
def create_account(account: schemas.AccountCreate, db: Session = Depends(get_db)):
    """
    Create a new account entry.
    """
    db_account = models.Account(**account.model_dump())
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account


# ────────────────────────────────
# DELETE: remove account by ID
# ────────────────────────────────
@router.delete("/{id}")
def delete_account(id: int, db: Session = Depends(get_db)):
    """
    Delete an account by ID if it exists.
    """
    account = db.query(models.Account).filter(models.Account.id == id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    db.delete(account)
    db.commit()
    return {"message": f"Deleted account {account.name}"}
