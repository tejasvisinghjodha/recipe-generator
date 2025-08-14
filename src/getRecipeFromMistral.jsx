export async function getRecipeFromMistral(ingredientsArr) {
    try {
        const response = await fetch("/.netlify/functions/getrecipe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ingredients: ingredientsArr })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching recipe:", error);
        return { error: "Failed to fetch recipe" };
    }
}
