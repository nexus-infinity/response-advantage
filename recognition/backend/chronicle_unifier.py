#!/usr/bin/env python3
"""
▼ TATA Chronicle Unifier
Consolidates scattered JSONL files into unified Chronicle
Run once to migrate existing logs, then use chronicle_writer for new events
"""

from pathlib import Path
import json
import time
from datetime import datetime
from typing import List, Dict

FIELD_ROOT = Path.home() / "FIELD"
UNIFIED_CHRONICLE = FIELD_ROOT / "▼TATA" / "chronicle" / "unified_events.jsonl"

# Scattered JSONL files to consolidate
SOURCE_FILES = [
    "●OBI-WAN/_pulse/2025-11-10.jsonl",
    "●OBI-WAN/password_memory_sync.jsonl",
    "●OBI-WAN/●_memory/password_compliance_log.jsonl",
    "◼︎DOJO/enhanced_manifest_record.jsonl",
    "◼︎DOJO/manifestation_events.jsonl",
    "◼︎DOJO/_memory_systems/_pulse/execution_pulse.jsonl",
    "◼︎DOJO/⬢_execution_core/execution_20251110.jsonl",
    "◼︎DOJO/biometric_log.jsonl",
    "◼︎DOJO/◼︎active_session_log.jsonl",
    "◼︎DOJO/oliver/response_decisions.jsonl",
]


def parse_event(line: str, source_file: str) -> Dict:
    """Parse JSONL line and add metadata"""
    try:
        event = json.loads(line.strip())
        # Add source tracking
        event["_source"] = source_file
        event["_unified_at"] = time.time()
        
        # Ensure timestamp field exists and is numeric
        if "timestamp" not in event:
            event["timestamp"] = event.get("dojo_timestamp") or event.get("ts") or time.time()
        
        # Normalize timestamp to float
        ts = event["timestamp"]
        if isinstance(ts, str):
            # Parse ISO timestamp
            try:
                dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
                event["timestamp"] = dt.timestamp()
            except:
                event["timestamp"] = time.time()
        
        return event
    except json.JSONDecodeError:
        return None


def consolidate_chronicles():
    """Consolidate all scattered JSONL files"""
    print("▼ TATA Chronicle Unifier")
    print("=" * 60)
    print(f"Target: {UNIFIED_CHRONICLE}")
    print()
    
    # Create target directory
    UNIFIED_CHRONICLE.parent.mkdir(parents=True, exist_ok=True)
    
    total_events = 0
    consolidated_events = []
    
    for source in SOURCE_FILES:
        source_path = FIELD_ROOT / source
        if not source_path.exists():
            print(f"⚠️  SKIP: {source} (not found)")
            continue
        
        event_count = 0
        with open(source_path, "r") as f:
            for line in f:
                event = parse_event(line, source)
                if event:
                    consolidated_events.append(event)
                    event_count += 1
        
        total_events += event_count
        print(f"✅ {event_count:4d} events from {source}")
    
    # Sort by timestamp
    consolidated_events.sort(key=lambda e: e.get("timestamp", 0))
    
    # Write to unified Chronicle
    with open(UNIFIED_CHRONICLE, "w") as f:
        for event in consolidated_events:
            f.write(json.dumps(event) + "\n")
    
    print()
    print("=" * 60)
    print(f"✅ Consolidated {total_events} events into unified Chronicle")
    print(f"   File: {UNIFIED_CHRONICLE}")
    print(f"   Size: {UNIFIED_CHRONICLE.stat().st_size / 1024:.1f} KB")
    print()
    print("🌀 Chronicle operational. Psychohistory engine initialized.")


def verify_chronicle():
    """Verify unified Chronicle integrity"""
    if not UNIFIED_CHRONICLE.exists():
        print("❌ Unified Chronicle does not exist yet")
        return
    
    with open(UNIFIED_CHRONICLE, "r") as f:
        lines = f.readlines()
    
    print(f"📊 Chronicle Statistics:")
    print(f"   Total events: {len(lines)}")
    
    # Parse all events
    events = []
    for line in lines:
        try:
            events.append(json.loads(line))
        except json.JSONDecodeError:
            print(f"⚠️  Malformed line: {line[:50]}...")
    
    if events:
        # Analyze sources
        sources = {}
        for event in events:
            source = event.get("_source", "unknown")
            sources[source] = sources.get(source, 0) + 1
        
        print(f"   Sources:")
        for source, count in sorted(sources.items(), key=lambda x: x[1], reverse=True):
            print(f"      {count:4d} events from {source}")
        
        # Time range
        timestamps = [e.get("timestamp", 0) for e in events]
        if timestamps:
            earliest = datetime.fromtimestamp(min(timestamps))
            latest = datetime.fromtimestamp(max(timestamps))
            print(f"   Time range: {earliest} → {latest}")


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "--verify":
        verify_chronicle()
    else:
        consolidate_chronicles()
        print()
        verify_chronicle()
