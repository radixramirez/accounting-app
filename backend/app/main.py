"""FastAPI application factory and router wiring."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import api_router
from app.db.session import Base, engine

app = FastAPI(title="Finance Ledger API")

# Ensure database tables exist before handling requests
Base.metadata.create_all(bind=engine)

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with proper prefixes
app.include_router(api_router)


@app.get("/")
def root():
    return {"message": "Finance Ledger backend is running."}
