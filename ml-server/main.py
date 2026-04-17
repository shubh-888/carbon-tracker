from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np

app = FastAPI()

# CORS fix
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("model.pkl")

@app.get("/")
def home():
    return {"message": "ML Server Running 🚀"}

@app.post("/predict")
def predict(data: dict):
    transport = data.get("transport", 0)
    electricity = data.get("electricity", 0)
    diet = data.get("diet", 0)

    X = np.array([[transport, electricity, diet]])

    prediction = model.predict(X)[0]

    return {"prediction": float(prediction)}