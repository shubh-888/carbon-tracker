import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib

data = {
    "transport": [100,200,50,300,150,400,250,180],
    "electricity": [80,150,40,200,100,300,200,120],
    "diet": [120,180,60,250,130,350,220,140],
    "total": [300,530,150,750,380,1050,670,440]
}

df = pd.DataFrame(data)

X = df[["transport","electricity","diet"]]
y = df["total"]

model = RandomForestRegressor()
model.fit(X, y)

joblib.dump(model, "model.pkl")

print("✅ Model trained!")