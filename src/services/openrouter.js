// OpenRouter API Service
// Replace OPENROUTER_API_KEY with your actual key from https://openrouter.ai/keys

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// Using GPT-4o via OpenRouter
const MODEL = 'openai/gpt-4o';

export async function generateTravelPlan(params, apiKey) {
  const { destination, duration, budget, travelers, interests, style } = params;

  const systemPrompt = `You are Wandr, an expert AI travel planner with deep knowledge of destinations worldwide. 
You create detailed, personalized, and inspiring travel itineraries. 
Your plans are practical yet poetic — combining logistical precision with genuine travel wisdom.
Always respond with valid JSON following the exact schema requested.
Never include markdown code blocks or extra text — only pure JSON.`;

  const userPrompt = `Create a comprehensive travel itinerary for:
- Destination: ${destination}
- Duration: ${duration} days
- Budget: ${budget}
- Travelers: ${travelers}
- Interests: ${interests.join(', ')}
- Travel Style: ${style}

Return ONLY valid JSON with this exact structure:
{
  "tripTitle": "Creative trip title",
  "tagline": "Inspiring one-line description",
  "overview": "2-3 sentence trip overview",
  "highlights": ["highlight1", "highlight2", "highlight3", "highlight4"],
  "bestTime": "Best time to visit info",
  "estimatedCost": "Budget breakdown",
  "days": [
    {
      "day": 1,
      "theme": "Day theme/title",
      "morning": {
        "activity": "Activity name",
        "description": "Detailed description",
        "tip": "Insider tip",
        "duration": "X hours"
      },
      "afternoon": {
        "activity": "Activity name", 
        "description": "Detailed description",
        "tip": "Insider tip",
        "duration": "X hours"
      },
      "evening": {
        "activity": "Activity name",
        "description": "Detailed description", 
        "tip": "Insider tip",
        "duration": "X hours"
      },
      "meals": {
        "breakfast": "Restaurant/food suggestion",
        "lunch": "Restaurant/food suggestion",
        "dinner": "Restaurant/food suggestion"
      },
      "accommodation": "Where to stay"
    }
  ],
  "packingEssentials": ["item1", "item2", "item3", "item4", "item5"],
  "localTips": ["tip1", "tip2", "tip3"],
  "emergencyInfo": {
    "emergency": "112",
    "touristHelpline": "Number if available",
    "nearestHospital": "General guidance"
  }
}
Generate for exactly ${duration} days.`;

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Wandr AI Travel Planner',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API Error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) throw new Error('No response from AI');

  try {
    return JSON.parse(content);
  } catch {
    // Try to extract JSON if wrapped
    const match = content.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Invalid JSON response from AI');
  }
}

export async function askTravelQuestion(question, context, apiKey) {
  const systemPrompt = `You are Wandr, a knowledgeable and friendly AI travel assistant. 
Answer travel questions concisely and helpfully. Be specific, practical, and inspiring.
Keep responses under 200 words unless a longer answer is clearly needed.`;

  const userPrompt = context 
    ? `Context: I'm planning a trip to ${context}.\n\nQuestion: ${question}`
    : question;

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Wandr AI Travel Planner',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API Error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'Unable to get response.';
}
