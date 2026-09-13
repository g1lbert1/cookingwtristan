import { useState } from "react";
import { getErrorMessage } from "../graphql/errors";
import ImageUpload from "./ImageUpload";
import {
  UNIT_OPTIONS,
  emptyIngredient,
  emptyRecipe,
  formToInput,
} from "./recipeFormState";

//Shared by the create and edit pages. The page owns the mutation: onSubmit
//receives a ready-to-send RecipeInput and returns a success message, or
//throws. The form owns the field state, submit state, and the status line.

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none";
const smallButtonClass =
  "rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";

export default function RecipeForm({
  initialValues,
  onSubmit,
  submitLabel = "Save",
  submittingLabel = "Saving...",
  resetAfterSubmit = false,
}) {
  const [recipe, setRecipe] = useState(() => initialValues ?? emptyRecipe());
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { kind: "success" | "error", message }

  const setField = (field, value) => setRecipe({ ...recipe, [field]: value });

  const updateIngredient = (index, field, value) => {
    const updated = [...recipe.ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setField("ingredients", updated);
  };
  const addIngredient = () =>
    setField("ingredients", [...recipe.ingredients, emptyIngredient()]);
  const removeIngredient = (index) =>
    setField("ingredients", recipe.ingredients.filter((_, i) => i !== index));

  const updateInstruction = (index, value) => {
    const updated = [...recipe.instructions];
    updated[index] = value;
    setField("instructions", updated);
  };
  const addInstruction = () => setField("instructions", [...recipe.instructions, ""]);
  const removeInstruction = (index) =>
    setField("instructions", recipe.instructions.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setSubmitting(true);
    try {
      const message = await onSubmit(formToInput(recipe));
      setStatus({ kind: "success", message });
      if (resetAfterSubmit) setRecipe(emptyRecipe());
    } catch (err) {
      setStatus({ kind: "error", message: getErrorMessage(err) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label htmlFor="recipe-title" className={labelClass}>Title</label>
        <input
          id="recipe-title"
          className={inputClass}
          placeholder="e.g. Garlic butter pasta"
          value={recipe.title}
          onChange={(e) => setField("title", e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="recipe-prep" className={labelClass}>Prep time (minutes)</label>
        <input
          id="recipe-prep"
          className={inputClass}
          type="number"
          min="0"
          step="1"
          value={recipe.prepTime}
          onChange={(e) => setField("prepTime", e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="recipe-content" className={labelClass}>Description</label>
        <textarea
          id="recipe-content"
          className={inputClass}
          rows={3}
          placeholder="Optional notes about the dish"
          value={recipe.content}
          onChange={(e) => setField("content", e.target.value)}
        />
      </div>

      <div>
        <p className={labelClass}>Photo</p>
        <ImageUpload
          value={recipe.imageUrl}
          onChange={(url) => setField("imageUrl", url)}
          disabled={submitting}
        />
      </div>

      <fieldset>
        <legend className="mb-2 text-lg font-semibold text-gray-900">Ingredients</legend>
        <div className="space-y-3">
          {recipe.ingredients.map((ing, index) => (
            <div key={index} className="grid grid-cols-1 gap-2 sm:grid-cols-[2fr_1fr_1fr_2fr_auto]">
              <input
                className={inputClass}
                placeholder="Name"
                aria-label={`Ingredient ${index + 1} name`}
                value={ing.name}
                onChange={(e) => updateIngredient(index, "name", e.target.value)}
              />
              <input
                className={inputClass}
                placeholder="Amount"
                aria-label={`Ingredient ${index + 1} amount`}
                type="number"
                min="0"
                step="any"
                value={ing.amount}
                onChange={(e) => updateIngredient(index, "amount", e.target.value)}
              />
              <select
                className={inputClass}
                aria-label={`Ingredient ${index + 1} unit`}
                value={ing.unit}
                onChange={(e) => updateIngredient(index, "unit", e.target.value)}
              >
                <option value="">(no unit)</option>
                {UNIT_OPTIONS.map((unit) => (
                  <option key={unit} value={unit}>{unit.toLowerCase()}</option>
                ))}
              </select>
              <input
                className={inputClass}
                placeholder="Notes"
                aria-label={`Ingredient ${index + 1} notes`}
                value={ing.notes}
                onChange={(e) => updateIngredient(index, "notes", e.target.value)}
              />
              <button
                type="button"
                className={smallButtonClass}
                onClick={() => removeIngredient(index)}
                disabled={recipe.ingredients.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button type="button" className={`${smallButtonClass} mt-3`} onClick={addIngredient}>
          + Add ingredient
        </button>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-lg font-semibold text-gray-900">Instructions</legend>
        <ol className="space-y-3">
          {recipe.instructions.map((step, index) => (
            <li key={index} className="flex gap-2">
              <span className="pt-2 text-sm font-medium text-gray-500">{index + 1}.</span>
              <textarea
                className={inputClass}
                rows={2}
                aria-label={`Step ${index + 1}`}
                value={step}
                onChange={(e) => updateInstruction(index, e.target.value)}
              />
              <button
                type="button"
                className={`${smallButtonClass} self-start`}
                onClick={() => removeInstruction(index)}
                disabled={recipe.instructions.length === 1}
              >
                Remove
              </button>
            </li>
          ))}
        </ol>
        <button type="button" className={`${smallButtonClass} mt-3`} onClick={addInstruction}>
          + Add step
        </button>
      </fieldset>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {submitting ? submittingLabel : submitLabel}
        </button>
        {status && (
          <p
            role={status.kind === "error" ? "alert" : "status"}
            className={status.kind === "error" ? "text-sm text-red-600" : "text-sm text-green-700"}
          >
            {status.message}
          </p>
        )}
      </div>
    </form>
  );
}
