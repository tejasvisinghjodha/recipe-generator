export async function getRecipeFromMistral(ingredientsArr) {
    try {
        const response = await fetch("/.netlify/functions/getrecipe", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ ingredients: ingredientsArr })
        });

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();

        if (!data || typeof data !== "object") {
            throw new Error("Invalid response format");
        }

        return data;

    } catch (error) {
        console.error("Error fetching recipe:", error.message);
        return { error: "Failed to fetch recipe" };
    }
}
