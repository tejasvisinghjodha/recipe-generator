import fetch from "node-fetch";

export async function handler(event) {
  try {
    const { ingredients } = JSON.parse(event.body);
    const HF_ACCESS_TOKEN = process.env.HF_ACCESS_TOKEN;

    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `I have ${ingredients.join(", ")}. Please give me a recipe!`
      })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
