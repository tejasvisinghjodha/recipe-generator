import fetch from "node-fetch";

export async function handler(event) {
  try {
    const { ingredients } = JSON.parse(event.body || "{}");

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No ingredients provided" }),
      };
    }

    // Backend env variable
    const HF_ACCESS_TOKEN = process.env.HF_ACCESS_TOKEN;
    console.log("HF_ACCESS_TOKEN exists:", !!HF_ACCESS_TOKEN);

    if (!HF_ACCESS_TOKEN) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing HF_ACCESS_TOKEN in environment" }),
      };
    }

    // Call Hugging Face API
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

    console.log("HF API response status:", response.status);

    const text = await response.text();
    console.log("HF API response text:", text);

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Hugging Face API error: ${text}` }),
      };
    }

    // Try to parse JSON safely
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to parse HF API response" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ recipe: data }),
    };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
