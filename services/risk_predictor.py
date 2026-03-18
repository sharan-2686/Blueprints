import joblib
import numpy as np
import os

MODEL_PATH = os.path.join("models", "supplier_risk_model.pkl")

model = joblib.load(MODEL_PATH)


def predict_risk(features):

    """
    features order:
    [
        
        availability_score,
        reliability_score,
        defect_rate,
        on_time_delivery_rate,
        avg_lead_time_days
    ]
    """

    vector = np.array(features).reshape(1, -1)

    prediction = model.predict(vector)[0]

    return float(prediction)