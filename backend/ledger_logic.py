# backend/ledger_logic.py
from sqlalchemy.orm import Session
import models
from datetime import datetime

# --- Static FX rates for now ---
FX_RATES = {
    "USD": 1.0,
    "AUD": 0.65,
    "GBP": 1.22,
    "IDR": 0.000065,
    "BTC": 68000.0,   # 1 BTC = 68,000 USD
    "ozAU": 2500.0,   # 1 oz gold = 2,500 USD
}

def get_rate(symbol: str) -> float:
    """Return FX rate vs USD."""
    return FX_RATES.get(symbol.upper(), 1.0)

def convert(amount: float, from_symbol: str, to_symbol: str) -> float:
    """Convert amount from one currency to another using static FX rates."""
    usd_value = amount * get_rate(from_symbol)
    return usd_value / get_rate(to_symbol)

# --- Ledger logic functions ---

def apply_transaction(db, tx):
    from_acc = db.query(models.Account).filter_by(name=tx.from_account).first()
    to_acc   = db.query(models.Account).filter_by(name=tx.to_account).first()

    if not from_acc or not to_acc:
        raise ValueError("One of the accounts in this transaction does not exist.")

    # Safely get or create balances
    from_bal = get_or_create_balance(db, from_acc.name, tx.from_asset)
    if from_bal is None:
        raise ValueError(f"No balance record found for {from_acc.name} ({tx.from_asset})")

    to_bal = get_or_create_balance(db, to_acc.name, tx.to_asset)
    if to_bal is None:
        raise ValueError(f"No balance record found for {to_acc.name} ({tx.to_asset})")

    # Currency conversion
    converted_amount = convert(tx.amount, tx.from_asset, tx.to_asset)

    # Funds check and transfer
    if from_acc.name != to_acc.name and from_bal.amount < tx.amount:
        raise ValueError(f"Insufficient funds in {from_acc.name} ({tx.from_asset})")

    from_bal.amount -= tx.amount
    to_bal.amount += converted_amount

    tx.converted_amount = converted_amount
    tx.timestamp = tx.timestamp or datetime.utcnow().isoformat()

    db.add(tx)
    db.commit()
    db.refresh(tx)
    return tx


def get_or_create_balance(db: Session, account_name: str, asset_symbol: str):
    """Fetch or create a balance record."""
    balance = db.query(models.Balance).filter_by(
        account_name=account_name,
        asset_symbol=asset_symbol
    ).first()

    if not balance:
        balance = models.Balance(account_name=account_name, asset_symbol=asset_symbol, amount=0.0)
        db.add(balance)
        db.commit()
        db.refresh(balance)

    return balance

def calculate_total_usd(db: Session):
    """Compute total system value in USD equivalent."""
    balances = db.query(models.Balance).all()
    total_usd = sum(b.amount * get_rate(b.asset_symbol) for b in balances)
    breakdown = {}
    for b in balances:
        breakdown[b.asset_symbol] = breakdown.get(b.asset_symbol, 0) + b.amount
    return {"total_usd": total_usd, "breakdown": breakdown}
