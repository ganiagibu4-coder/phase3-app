import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function getFallbackRecommendations(interests, events) {
  const keywords = interests
    .toLowerCase()
    .split(/[,\s]+/)
    .filter((word) => word.length > 2);

  const matches = events
    .map((event) => {
      const text =
        `${event.title} ${event.category} ${event.description}`.toLowerCase();

      const score = keywords.reduce(
        (total, keyword) => total + (text.includes(keyword) ? 1 : 0),
        0
      );

      return { event, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return matches.map(({ event }) => ({
    title: event.title,
    reason: `This event matches your interest in ${interests}.`,
  }));
}

export async function POST(request) {
  // Read the request body ONCE
  const { interests, events } = await request.json();

  if (!interests || !events || events.length === 0) {
    return Response.json(
      { error: "Missing interests or events" },
      { status: 400 }
    );
  }

  try {
    const prompt = `
You are a campus event recommendation assistant.

Student interests:
${interests}

Available campus events:
${JSON.stringify(events)}

Recommend up to 3 events that best match the student's interests.

Only recommend events from the provided list.
Give a short, clear reason for each recommendation.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,

      config: {
        responseMimeType: "application/json",

        responseSchema: {
          type: Type.OBJECT,

          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,

                properties: {
                  title: {
                    type: Type.STRING,
                  },

                  reason: {
                    type: Type.STRING,
                  },
                },

                required: ["title", "reason"],
              },
            },
          },

          required: ["recommendations"],
        },
      },
    });

    const result = JSON.parse(response.text);

    return Response.json(result);
  } catch (error) {
    console.error("Gemini API error:", error);

    // Use local recommendations if Gemini is unavailable
    const recommendations = getFallbackRecommendations(interests, events);

    return Response.json({
      recommendations,
      fallback: true,
    });
  }
}