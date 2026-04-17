export async function getAIInsight(data) {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `
User average emission: ${data.avg}
Predicted emission: ${data.prediction}

Give 1 short eco-friendly suggestion under 18 words.
`,
          },
        ],
      }),
    });

    const result = await res.json();

    return result?.choices?.[0]?.message?.content || 
    "Try reducing transport usage and electricity consumption.";

  } catch (err) {
    console.error("AI error:", err);
    return "Try reducing high-impact activities like transport and diet.";
  }
}