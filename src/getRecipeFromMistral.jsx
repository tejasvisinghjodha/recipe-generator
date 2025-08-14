import { HfInference } from '@huggingface/inference'

const hf = new HfInference(import.meta.env.VITE_HF_ACCESS_TOKEN)

const SYSTEM_PROMPT = `You are an assistant that receives a list of ingredients that a user has 
and suggests a recipe. You don't have to use all the ingredients, but try not to add too many extras.
Format your response in markdown.`

export async function getRecipeFromMistral(ingredientsArr) {
    const ingredientsString = ingredientsArr.join(", ")

    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `I have ${ingredientsString}. Please give me a recipe!` }
            ],
            max_tokens: 1024,
        })

        return response.choices[0].message.content
    } catch (err) {
        console.error("Error fetching recipe:", err)
        return "Sorry, I couldn't fetch a recipe right now."
    }
}
