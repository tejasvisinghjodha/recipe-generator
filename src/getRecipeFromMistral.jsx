export async function getRecipeFromMistral(ingredientsArr) {
  try {
    const res = await fetch("/.netlify/functions/getrecipe", {
      method: "POST",
      body: JSON.stringify({ ingredients: ingredientsArr }),
    });

    const data = await res.json();
    return data.recipe || "Sorry, I couldn't fetch a recipe right now.";
  } catch (err) {
    console.error("Error:", err);
    return "Sorry, something went wrong.";
  }
}
