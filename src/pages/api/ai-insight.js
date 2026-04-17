import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_KEY,
});

export default async function handler(req, res) {
  try {
    const { prediction, avg, maxCategory } = req.body;

    const prompt = `
    User carbon data:
    Average: ${avg}
    Predicted: ${prediction}
    Highest impact: ${maxCategory}

    Give 1 short personalized eco-friendly suggestion.
    Max 18 words.
    Friendly tone.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.status(200).json({
      insight: response.choices[0].message.content,
    });
  } catch (err) {
    res.status(500).json({ error: "AI failed" });
  }
}