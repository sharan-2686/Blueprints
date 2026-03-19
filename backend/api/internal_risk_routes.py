from fastapi import APIRouter, HTTPException
from db.supabase_client import supabase
from services.internal_risk_service import (
    get_all_predictions,
    get_prediction_by_component,
    get_high_risk_components,
    get_risk_summary
)

router = APIRouter(prefix="/api/risk", tags=["Internal Risk"])


@router.get("/predictions")
async def all_predictions():
    try:
        data = get_all_predictions(supabase)
        return {"status": "success", "count": len(data), "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/predictions/{component_id}")
async def component_prediction(component_id: int):
    try:
        data = get_prediction_by_component(supabase, component_id)
        if not data:
            raise HTTPException(status_code=404, detail=f"No prediction for component {component_id}")
        return {"status": "success", "data": data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/high-risk")
async def high_risk():
    try:
        data = get_high_risk_components(supabase)
        return {"status": "success", "count": len(data), "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/summary")
async def risk_summary():
    try:
        summary = get_risk_summary(supabase)
        return {"status": "success", "summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))