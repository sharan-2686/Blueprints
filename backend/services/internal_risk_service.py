import math

def clean(val, default=0):
    try:
        if val is None:
            return default
        if isinstance(val, float) and (math.isnan(val) or math.isinf(val)):
            return default
        return val
    except:
        return default

def get_all_predictions(supabase):
    response = supabase.table("internal_risk_predictions").select("*").execute()
    return response.data

def get_prediction_by_component(supabase, component_id: int):
    response = (
        supabase.table("internal_risk_predictions")
        .select("*")
        .eq("component_id", component_id)
        .execute()
    )
    return response.data[0] if response.data else None

def get_high_risk_components(supabase):
    response = (
        supabase.table("internal_risk_predictions")
        .select("*")
        .eq("risk_level", "HIGH")
        .order("days_until_stockout", desc=False)
        .execute()
    )
    return response.data

def get_risk_summary(supabase):
    data   = supabase.table("internal_risk_predictions").select("*").execute().data
    high   = [r for r in data if r["risk_level"] == "HIGH"]
    medium = [r for r in data if r["risk_level"] == "MEDIUM"]
    low    = [r for r in data if r["risk_level"] == "LOW"]

    total_exposure = sum(
        float(r["total_risk_cost"] or 0)
        for r in data
        if r["risk_level"] in ["HIGH", "MEDIUM"]
    )

    return {
        "total_components":  len(data),
        "high_risk_count":   len(high),
        "medium_risk_count": len(medium),
        "low_risk_count":    len(low),
        "total_exposure":    round(total_exposure, 2),
        "last_predicted_at": data[0]["predicted_at"] if data else None
    }