#!/usr/bin/env python3
"""
◼ DOJO Recognition API — FastAPI Bridge
Connects response-advantage-app to FIELD backend
Port: 9630 (●OBI-WAN frequency)
"""

from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import json
import time
import sys
from datetime import datetime
from typing import Dict, Any, Optional
import shutil

# Import FIELD systems
sys.path.insert(0, str(Path.home() / "FIELD"))
from spinning_top_conductor import HelicalCoherenceTracker

app = FastAPI(title="FIELD Recognition API", version="1.0.0")

# CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
FIELD_ROOT = Path.home() / "FIELD"
INTAKE_DIR = FIELD_ROOT / "●OBI-WAN" / "_intake"
CHRONICLE_FILE = FIELD_ROOT / "▼TATA" / "chronicle" / "unified_events.jsonl"
PROCESSING_STATE = {}  # In-memory state (could use Redis)

# Initialize systems
coherence_tracker = HelicalCoherenceTracker()

# Ensure directories exist
INTAKE_DIR.mkdir(parents=True, exist_ok=True)
CHRONICLE_FILE.parent.mkdir(parents=True, exist_ok=True)


def log_chronicle_event(case_id: str, stage: str, **data):
    """Append event to unified Chronicle (psychohistory principle)"""
    event = {
        "timestamp": time.time(),
        "iso_time": datetime.now().isoformat(),
        "case_id": case_id,
        "stage": stage,
        "vertex": stage_to_vertex(stage),
        **data
    }
    with open(CHRONICLE_FILE, "a") as f:
        f.write(json.dumps(event) + "\n")
    return event


def stage_to_vertex(stage: str) -> str:
    """Map S0-S7 stages to vertices"""
    mapping = {
        "S0": "●OBI-WAN",
        "S1": "▼TATA",
        "S2": "▲ATLAS",
        "S3": "▲ATLAS",
        "S4": "◼DOJO",
        "S5": "◼DOJO",
        "S6": "◼DOJO",
        "S7": "●OBI-WAN"
    }
    return mapping.get(stage, "●OBI-WAN")


def generate_case_id() -> str:
    """Generate unique case ID"""
    return f"case_{int(time.time())}_{hash(time.time()) % 10000:04d}"


def calculate_coherence(file_path: Path) -> float:
    """Calculate S1 coherence score (simplified)"""
    # Real implementation would analyze document structure
    # For now, basic heuristics
    if not file_path.exists():
        return 0.0
    
    size_kb = file_path.stat().st_size / 1024
    
    # PDFs > 10KB = structured document = higher coherence
    if file_path.suffix.lower() == '.pdf' and size_kb > 10:
        return 0.87  # Bank Austria-level coherence
    elif size_kb > 5:
        return 0.72
    else:
        return 0.55


@app.get("/")
async def root():
    """API health check"""
    return {
        "service": "FIELD Recognition API",
        "status": "operational",
        "port": 9630,
        "vertex": "◼DOJO",
        "chronicle": str(CHRONICLE_FILE),
        "intake": str(INTAKE_DIR)
    }


@app.post("/api/field/intake")
async def intake_document(file: UploadFile):
    """
    S0: Intake document to ●OBI-WAN
    Returns processing ID for status tracking
    """
    try:
        # Generate case ID
        case_id = generate_case_id()
        
        # Save file to intake
        file_path = INTAKE_DIR / f"{case_id}_{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Log S0 intake to Chronicle
        log_chronicle_event(
            case_id=case_id,
            stage="S0",
            action="intake",
            filename=file.filename,
            file_size=file_path.stat().st_size,
            content_type=file.content_type
        )
        
        # Calculate initial coherence (S1)
        coherence = calculate_coherence(file_path)
        
        # Log S1 validation
        log_chronicle_event(
            case_id=case_id,
            stage="S1",
            action="validation",
            coherence=coherence,
            threshold=0.70,
            passed=coherence >= 0.70
        )
        
        # Record in coherence tracker
        coherence_tracker.record_cycle(coherence, cycle_type="S0-S1")
        
        # Initialize processing state
        PROCESSING_STATE[case_id] = {
            "status": "processing" if coherence >= 0.70 else "validation_failed",
            "current_stage": "S1" if coherence >= 0.70 else "S0",
            "coherence": coherence,
            "filename": file.filename,
            "file_path": str(file_path),
            "started_at": time.time()
        }
        
        return {
            "case_id": case_id,
            "status": "accepted",
            "coherence": coherence,
            "validation_passed": coherence >= 0.70,
            "message": "Document accepted for processing" if coherence >= 0.70 else "Coherence below threshold (0.70)"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/field/status/{case_id}")
async def get_status(case_id: str):
    """
    Get current processing status for case
    Returns S0→S7 progress + Chronicle events
    """
    if case_id not in PROCESSING_STATE:
        raise HTTPException(status_code=404, detail="Case not found")
    
    state = PROCESSING_STATE[case_id]
    
    # Read Chronicle events for this case
    events = []
    if CHRONICLE_FILE.exists():
        with open(CHRONICLE_FILE, "r") as f:
            for line in f:
                try:
                    event = json.loads(line)
                    if event.get("case_id") == case_id:
                        events.append(event)
                except json.JSONDecodeError:
                    continue
    
    return {
        "case_id": case_id,
        "status": state["status"],
        "current_stage": state["current_stage"],
        "coherence": state["coherence"],
        "filename": state["filename"],
        "processing_time": time.time() - state["started_at"],
        "events": events,
        "event_count": len(events)
    }


@app.get("/api/field/result/{case_id}")
async def get_result(case_id: str):
    """
    S6: Get manifest/results for completed case
    """
    if case_id not in PROCESSING_STATE:
        raise HTTPException(status_code=404, detail="Case not found")
    
    state = PROCESSING_STATE[case_id]
    
    # In full implementation, would read structured extraction
    # For now, return basic manifest
    return {
        "case_id": case_id,
        "status": "completed",
        "manifest": {
            "filename": state["filename"],
            "coherence": state["coherence"],
            "file_path": state["file_path"],
            "processed_at": datetime.now().isoformat(),
            "extraction": {
                "note": "Full extraction pipeline pending integration with existing FIELD orchestrators"
            }
        }
    }


@app.get("/api/field/chronicle/recent")
async def get_recent_chronicle(limit: int = 50):
    """
    Get recent Chronicle events (all cases)
    """
    events = []
    if CHRONICLE_FILE.exists():
        with open(CHRONICLE_FILE, "r") as f:
            lines = f.readlines()
            for line in lines[-limit:]:
                try:
                    events.append(json.loads(line))
                except json.JSONDecodeError:
                    continue
    
    return {
        "total_events": len(events),
        "events": events
    }


if __name__ == "__main__":
    import uvicorn
    print("◼ DOJO Recognition API starting on port 9630...")
    print(f"   Chronicle: {CHRONICLE_FILE}")
    print(f"   Intake: {INTAKE_DIR}")
    uvicorn.run(app, host="0.0.0.0", port=9630, log_level="info")
