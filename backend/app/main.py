"""FastAPI application factory and router wiring."""
from __future__ import annotations

import os
from typing import Iterable

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import api_router
from app.db.session import Base, engine

app = FastAPI(title="Finance Ledger API")

# Ensure database tables exist before handling requests
Base.metadata.create_all(bind=engine)

def _build_allowed_origins(extra_origins: Iterable[str] | None = None) -> list[str]:
    """Combine default dev origins with any extra origins provided via env."""

    defaults = {
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    }

    if extra_origins:
        defaults.update(o.strip() for o in extra_origins if o.strip())

    return sorted(defaults)


additional_origins = os.getenv("BACKEND_CORS_ORIGINS")
allow_origins = _build_allowed_origins(
    additional_origins.split(",") if additional_origins else None
)

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with proper prefixes
app.include_router(api_router)


@app.get("/")
def root():
    return {"message": "Finance Ledger backend is running."}
