"""Local development scaffold. Agent execution and authentication are future milestones."""
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="OpsPilot API",
    version="0.1.0",
    description="Local development scaffold. Live AI and operational tools are not configured.",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "http://localhost:8080",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class InvestigationRequest(BaseModel):
    question: str = Field(min_length=1, max_length=2000)
    environment: Literal["dev", "test", "uat", "prod"]


@app.get("/health")
def health():
    return {"status": "ok", "mode": "scaffold", "version": "0.1.0"}


@app.get("/v1/capabilities")
def capabilities():
    return {
        "mode": "scaffold",
        "agent_execution": False,
        "retrieval": False,
        "operational_tools": False,
        "authentication": False,
    }


@app.post("/v1/investigations", status_code=202)
def create_investigation(request: InvestigationRequest):
    del request
    raise HTTPException(
        status_code=503,
        detail="Agent execution is not implemented. Use the frontend demo until the RAG and agent milestone.",
    )

