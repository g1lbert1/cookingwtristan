//Form-state helpers for RecipeForm, kept out of the component file so Vite's
//fast refresh keeps working (it wants component files to export only components).

export const UNIT_OPTIONS = [
  "GRAMS",
  "CUPS",
  "TABLESPOONS",
  "TEASPOONS",
  "PIECE",
  "ML",
  "LITER",
  "OUNCE",
  "POUND",
];

export const emptyIngredient = () => ({ name: "", amount: "", unit: "GRAMS", notes: "" });

export const emptyRecipe = () => ({
  title: "",
  prepTime: 0,
  content: "",
  ingredients: [emptyIngredient()],
  instructions: [""],
});

//Recipe from the API -> form state. Inputs want strings, never null.
export const recipeToForm = (recipe) => ({
  title: recipe.title ?? "",
  prepTime: recipe.prepTime ?? 0,
  content: recipe.content ?? "",
  ingredients: recipe.ingredients?.length
    ? recipe.ingredients.map((i) => ({
        name: i.name ?? "",
        amount: i.amount ?? "",
        unit: i.unit ?? "",
        notes: i.notes ?? "",
      }))
    : [emptyIngredient()],
  instructions: recipe.instructions?.length ? [...recipe.instructions] : [""],
});

//Form state -> RecipeInput. Blank rows are dropped here; the server rejects
//an empty list, so the user still gets a clear message if nothing is left.
export const formToInput = (form) => ({
  title: form.title.trim(),
  prepTime: Number(form.prepTime),
  content: form.content.trim() || null,
  ingredients: form.ingredients
    .filter((i) => i.name.trim() !== "")
    .map((i) => ({
      name: i.name.trim(),
      amount: i.amount === "" ? null : Number(i.amount),
      unit: i.unit || null,
      notes: i.notes?.trim() || null,
    })),
  instructions: form.instructions.map((s) => s.trim()).filter(Boolean),
});
