"""Tests for account creation and retrieval endpoints without HTTP layer."""
from pathlib import Path
import sys

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.api.routers import accounts
from app.db.base import Base
from app.schemas.account import AccountCreate


@pytest.fixture()
def session() -> Session:
    engine = create_engine(
        "sqlite:///:memory:", connect_args={"check_same_thread": False}
    )
    TestingSessionLocal = sessionmaker(
        autocommit=False, autoflush=False, bind=engine
    )
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


def test_create_and_list_accounts(session: Session):
    """Applying the router functions should persist and return accounts."""
    payload = AccountCreate(name="Test Account", type="single")

    created = accounts.create_account(payload, db=session)
    assert created.name == payload.name
    assert created.type == payload.type
    assert created.id is not None

    all_accounts = accounts.get_accounts(db=session)
    assert any(account.name == payload.name for account in all_accounts)
