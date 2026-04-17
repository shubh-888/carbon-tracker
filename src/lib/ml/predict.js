export async function getPrediction(data) {
  try {
    const res = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return result.prediction;

  } catch (err) {
    console.error("ML error:", err);
    return null;
  }
}