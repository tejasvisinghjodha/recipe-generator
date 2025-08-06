import { useState } from "react"
import { getRecipeFromMistral } from "./getRecipeFromMistral"
import ReactMarkdown from "react-markdown";
export default function Body() {
    const [list, change] = useState([])
    const [recipe, setRecipe] = useState("")
    function addIngredient(formData) {
        let input = formData.get("ingredients")
        change(prev => [...prev, input])
    }
    async function getRecipe() {
        const recipeMarkdown = await getRecipeFromMistral(list)
        setRecipe(recipeMarkdown)
    }
    return (
        <>
            <form action={addIngredient}>
                <input type="text" id='ingredients' name="ingredients" placeholder="eg.oregano" />
                <button>+Add ingredient</button>
            </form>
            {list.length > 0 && <section>
                <h2>Ingredient on hand:</h2>
                <ul>
                    {list.map((item, index) => (<li key={index}>{item}</li>))}
                </ul>
                {list.length > 3 && <div>
                    <h3>Ready for a recipe?</h3>
                    <p>Generate a recipe from your list of  ingredients</p>
                    <button onClick={getRecipe}>Get a recipe</button>
                </div>}
                {recipe && <ReactMarkdown>{recipe}</ReactMarkdown>}
            </section>}
        </>
    )
}