from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import accounts, balances, transactions

app = FastAPI(title="Finance Ledger API")

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with proper prefixes
app.include_router(accounts.router, prefix="/accounts", tags=["accounts"])
app.include_router(balances.router, prefix="/balances", tags=["balances"])
app.include_router(transactions.router, prefix="/transactions", tags=["transactions"])

@app.get("/")
def root():
    return {"message": "Finance Ledger backend is running."}
