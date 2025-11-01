"""Transaction API routes."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import app.models as models
import app.schemas as schemas
from app.api.deps import get_db
from app.services.ledger_service import apply_transaction

router = APIRouter()


@router.get("/", response_model=list[schemas.Transaction])
def get_transactions(db: Session = Depends(get_db)):
    """Return all transactions."""
    return db.query(models.Transaction).all()


@router.post("/", response_model=schemas.Transaction)
def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    """Create and apply a new transaction."""
    tx = models.Transaction(**transaction.dict())
    db.add(tx)
    try:
        apply_transaction(db, tx)
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    db.commit()
    db.refresh(tx)
    return tx


@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    """Delete a transaction by its ID."""
    tx = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    db.delete(tx)
    db.commit()
    return {"message": f"Transaction {transaction_id} deleted"}
