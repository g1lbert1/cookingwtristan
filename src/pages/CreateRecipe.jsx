import { useMutation } from "@apollo/client/react";
import { CREATE_RECIPE } from "../graphql/mutations";
import { useState } from "react";

const UNIT_OPTIONS = [
    "GRAMS",
    "CUPS",
    "TABLESPOONS",
    "TEASPOONS",
    "PIECE",
    "ML",
    "LITER",
    "OUNCE",
    "POUND"
];

export default function CreateRecipe() {
    const [recipe, setRecipe] = useState({
        title: "",
        prepTime: 0,
        content: "",
        ingredients: [
          { name: "", amount: "", unit: "GRAMS", notes: ""}  
        ],
        instructions: [""]
    });

    const [createRecipe] = useMutation(CREATE_RECIPE);

    // INGREDIENT HANDLERS
    // -------------------------
    const updateIngredient = (index, field, value) => {
        const updated = [...recipe.ingredients];
        //Replace the row rather than mutating the object still held in state.
        updated[index] = { ...updated[index], [field]: value };

        setRecipe({ ...recipe, ingredients: updated });
    };

    const addIngredient = () => {
        setRecipe({
            ...recipe,
            ingredients: [
                ...recipe.ingredients,
                { name: "", amount: "", unit: "GRAMS", notes: "" }
            ]
        });
    };

    const removeIngredient = (index) => {
        const updated = recipe.ingredients.filter(
            (_, i) => i !== index
        );

        setRecipe({ ...recipe, ingredients: updated });
    };

    // INSTRUCTION HANDLERS
    // -------------------------
    const updateInstruction = (index, value) => {
        const updated = [...recipe.instructions];
        updated[index] = value;

        setRecipe({ ...recipe, instructions: updated });
    };

    const addInstruction = () => {
        setRecipe({
            ...recipe,
            instructions: [...recipe.instructions, ""]
        });
    };

    const removeInstruction = (index) => {
        const updated = recipe.instructions.filter(
            (_, i) => i !== index
        );

        setRecipe({ ...recipe, instructions: updated });
    };

    //HANDLE SUBMIT
    //-------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedRecipe = {
            title: recipe.title.trim(),
            prepTime: Number(recipe.prepTime),
            content: recipe.content.trim(),

            ingredients: recipe.ingredients
                .filter(i => i.name.trim() !== "")
                .map(i => ({
                    name: i.name.trim(),
                    amount: i.amount === "" ? null : Number(i.amount),
                    unit: i.unit,
                    notes: i.notes?.trim() || null
                })),

            instructions: recipe.instructions
                .map(i => i.trim())
                .filter(Boolean)
        };

        try {
            await createRecipe({
                variables: {
                    input: formattedRecipe
                }
            });

            alert("Recipe created!");

            setRecipe({
                title: "",
                prepTime: 0,
                content: "",
                ingredients: [
                    { name: "", amount: "", unit: "GRAMS", notes: "" }
                ],
                instructions: [""]
            });
        } catch (err) {
            console.error(err);
        }
    };

    // -------------------------
    // UI
    // -------------------------
    return (
        <form onSubmit={handleSubmit}>

            {/* TITLE */}
            <input
                placeholder="Title"
                value={recipe.title}
                onChange={(e) =>
                    setRecipe({
                        ...recipe,
                        title: e.target.value
                    })
                }
            />

            {/* PREP TIME */}
            <input
                type="number"
                placeholder="Prep time (minutes)"
                value={recipe.prepTime}
                onChange={(e) =>
                    setRecipe({
                        ...recipe,
                        prepTime: e.target.value
                    })
                }
            />

            {/* CONTENT */}
            <textarea
                placeholder="Description"
                value={recipe.content}
                onChange={(e) =>
                    setRecipe({
                        ...recipe,
                        content: e.target.value
                    })
                }
            />

            {/* INGREDIENTS */}
            <h3>Ingredients</h3>

            {recipe.ingredients.map((ing, index) => (
                <div key={index} style={{ marginBottom: 10 }}>

                    <input
                        placeholder="Name"
                        value={ing.name}
                        onChange={(e) =>
                            updateIngredient(
                                index,
                                "name",
                                e.target.value
                            )
                        }
                    />

                    <input
                        placeholder="Amount"
                        type="number"
                        value={ing.amount}
                        onChange={(e) =>
                            updateIngredient(
                                index,
                                "amount",
                                e.target.value
                            )
                        }
                    />

                    {/* ENUM DROPDOWN */}
                    <select
                        value={ing.unit}
                        onChange={(e) =>
                            updateIngredient(
                                index,
                                "unit",
                                e.target.value
                            )
                        }
                    >
                        {UNIT_OPTIONS.map((unit) => (
                            <option key={unit} value={unit}>
                                {unit}
                            </option>
                        ))}
                    </select>

                    <input
                        placeholder="Notes"
                        value={ing.notes}
                        onChange={(e) =>
                            updateIngredient(
                                index,
                                "notes",
                                e.target.value
                            )
                        }
                    />

                    <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                    >
                        Remove
                    </button>
                </div>
            ))}

            <button type="button" onClick={addIngredient}>
                + Add Ingredient
            </button>

            {/* INSTRUCTIONS */}
            <h3>Instructions</h3>

            {recipe.instructions.map((step, index) => (
                <div key={index}>
                    <textarea
                        value={step}
                        onChange={(e) =>
                            updateInstruction(
                                index,
                                e.target.value
                            )
                        }
                    />

                    <button
                        type="button"
                        onClick={() =>
                            removeInstruction(index)
                        }
                    >
                        Remove
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={addInstruction}
            >
                + Add Step
            </button>

            <br />

            {/* SUBMIT */}
            <button type="submit">
                Create Recipe
            </button>
        </form>
    );
    

}
