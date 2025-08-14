import fetch from "node-fetch";

export async function handler(event) {
  try {
    // Parse request body from frontend
    const { ingredients } = JSON.parse(event.body);

    // Backend env variable (set in Netlify dashboard)
    const HF_ACCESS_TOKEN = process.env.HF_ACCESS_TOKEN;

    if (!HF_ACCESS_TOKEN) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing HF_ACCESS_TOKEN in environment" }),
      };
    }

    // Call Hugging Face model (replace URL if different model)
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `Give me a recipe using the following ingredients: ${ingredients.join(", ")}.`,
        }),
      }
    );

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Model API error: ${await response.text()}` }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ recipe: data }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
