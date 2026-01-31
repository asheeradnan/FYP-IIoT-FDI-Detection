from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import PredictionRequest, PredictionResponse, AnomalyResponse
from app.utils.model_loader import model_inference
from app.models import Anomaly
from datetime import datetime
from typing import List

router = APIRouter(prefix="/model", tags=["Model"])

@router.post("/predict", response_model=PredictionResponse)
async def predict_anomalies(request: PredictionRequest, db: Session = Depends(get_db)):
    """
    Make predictions using the trained DQN-GNN model
    """
    try:
        # Get predictions from model
        result = model_inference.predict(request.sensor_data)
        
        # Store detected anomalies in database
        for anomaly_data in result["anomalies"]:
            anomaly = Anomaly(
                node_id=anomaly_data["node_id"],
                confidence=anomaly_data["confidence"],
                severity=anomaly_data.get("severity", "medium")
            )
            db.add(anomaly)
        
        db.commit()
        
        return {
            "anomalies": result["anomalies"],
            "topology": result["topology"],
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/anomalies", response_model=List[AnomalyResponse])
async def get_anomalies(
    limit: int = 50,
    resolved: bool = False,
    db: Session = Depends(get_db)
):
    """Get recent anomalies"""
    query = db.query(Anomaly)
    
    if not resolved:
        query = query.filter(Anomaly.is_resolved == False)
    
    anomalies = query.order_by(Anomaly.detected_at.desc()).limit(limit).all()
    return anomalies

@router.post("/anomalies/{anomaly_id}/resolve")
async def resolve_anomaly(anomaly_id: int, db: Session = Depends(get_db)):
    """Mark an anomaly as resolved"""
    anomaly = db.query(Anomaly).filter(Anomaly.id == anomaly_id).first()
    
    if not anomaly:
        raise HTTPException(status_code=404, detail="Anomaly not found")
    
    anomaly.is_resolved = True
    db.commit()
    
    return {"message": "Anomaly resolved", "anomaly_id": anomaly_id}

@router.get("/topology")
async def get_current_topology():
    """Get current IIoT network topology"""
    # Return a demo topology
    topology = {
        "nodes": [
            {"id": f"node_{i}", "label": f"Sensor {i}", "status": "normal", "x": (i % 5) * 100, "y": (i // 5) * 100}
            for i in range(10)
        ],
        "edges": [
            {"source": "node_0", "target": "node_1"},
            {"source": "node_1", "target": "node_2"},
            {"source": "node_2", "target": "node_3"},
            {"source": "node_3", "target": "node_4"},
            {"source": "node_0", "target": "node_5"},
            {"source": "node_5", "target": "node_6"},
        ]
    }
    
    return topology
