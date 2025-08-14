import fetch from "node-fetch";

export async function handler(event) {
  try {
    const { ingredients } = JSON.parse(event.body);
    const API_KEY = process.env.VITE_TMBD_API_KEY; 

    if (!API_KEY) {
      console.error("❌ API key not found in environment variables.");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "API key is missing on server." }),
      };
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`, 
        },
        body: JSON.stringify({
          inputs: `Give me a recipe using these ingredients: ${ingredients}`,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Hugging Face API error:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("❌ Server error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
}
