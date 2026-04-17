export async function ecoAssistant(emissionData, question, history = []) {

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  if (!API_KEY) {
    console.error("Gemini API key missing");
    return "AI service not configured.";
  }

  try {

    const context = `
You are EcoTrack AI, a sustainability assistant helping users reduce carbon emissions.

User carbon emission data:
Transport: ${emissionData.transport} kg
Electricity: ${emissionData.electricity} kg
Diet: ${emissionData.diet} kg
Total: ${emissionData.total} kg

Guidelines:
- Give practical suggestions
- Use bullet points when helpful
- Keep answers short (under 120 words)
- Focus on sustainability and carbon reduction
`;

    const conversation = history
      .map((m) => `${m.role}: ${m.text}`)
      .join("\n");

    const prompt = `
${context}

Conversation History:
${conversation}

User Question:
${question}

Answer:
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", errorText);
      return "⚠️ AI service temporarily unavailable.";
    }

    const data = await response.json();

    const aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI could not respond.";

    return aiText;

  } catch (error) {

    console.error("Eco AI Error:", error);
    return "⚠️ Something went wrong while contacting the AI.";

  }
}