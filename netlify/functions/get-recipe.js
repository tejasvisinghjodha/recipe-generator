export async function handler(event) {
  try {
    const { ingredients } = JSON.parse(event.body || "{}");

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No ingredients provided" }),
      };
    }

    const HF_ACCESS_TOKEN = process.env.HF_ACCESS_TOKEN;
    if (!HF_ACCESS_TOKEN) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing Hugging Face API token" }),
      };
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `I have ${ingredients.join(", ")}. Please give me a recipe!`,
        }),
      }
    );

    const result = await response.json();

    let recipeText = "";
    if (Array.isArray(result) && result[0]?.generated_text) {
      recipeText = result[0].generated_text;
    } else {
      recipeText = JSON.stringify(result);
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipe: recipeText }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
