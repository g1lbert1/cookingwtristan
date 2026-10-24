import { Suspense, lazy, useState } from "react";
import { getErrorMessage } from "../graphql/errors";
import ImageUpload from "./ImageUpload";
import GalleryUpload from "./GalleryUpload";

//Only loaded when the author opens the story preview.
const Markdown = lazy(() => import("./Markdown"));
import {
  UNIT_OPTIONS,
  emptyIngredient,
  emptyRecipe,
  formToInput,
  hasPageSettings,
} from "./recipeFormState";
import { ACCENTS, LAYOUTS, STORY_MAX } from "../recipeOptions";

//Shared by the create and edit pages. The page owns the mutation: onSubmit
//receives a ready-to-send RecipeInput and returns a success message, or
//throws. The form owns the field state, submit state, and the status line.
//
//The plain form is the whole experience for most recipes. "Make it yours"
//below it folds away a story in Markdown, extra photos, a page layout and
//an accent; it opens itself for a recipe that already uses any of them.

const inputClass = "field";
const smallButtonClass = "btn btn-secondary btn-sm";
const labelClass = "mb-1 block text-sm font-medium text-white/80";

const ChevronIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 ${className}`} aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

//A tiny wireframe of each layout so the choice reads at a glance.
const LayoutSketch = ({ value }) => {
  const block = "rounded-sm bg-current";
  if (value === "EDITORIAL") {
    return (
      <div className="grid h-14 w-20 grid-rows-[2fr_1fr_1fr] gap-1 text-white/70" aria-hidden="true">
        <div className={`${block} opacity-90`} />
        <div className={`${block} mx-3 opacity-50`} />
        <div className={`${block} mx-3 opacity-50`} />
      </div>
    );
  }
  if (value === "GALLERY") {
    return (
      <div className="grid h-14 w-20 grid-cols-3 grid-rows-3 gap-1 text-white/70" aria-hidden="true">
        <div className={`${block} col-span-2 row-span-2 opacity-90`} />
        <div className={`${block} opacity-70`} />
        <div className={`${block} opacity-70`} />
        <div className={`${block} col-span-3 opacity-40`} />
      </div>
    );
  }
  return (
    <div className="grid h-14 w-20 grid-cols-3 grid-rows-[1fr_2fr] gap-1 text-white/70" aria-hidden="true">
      <div className={`${block} col-span-3 opacity-90`} />
      <div className={`${block} opacity-50`} />
      <div className={`${block} col-span-2 opacity-40`} />
    </div>
  );
};

const choiceClass =
  "flex cursor-pointer gap-4 rounded-xl border border-white/15 p-4 transition-colors hover:border-white/40 has-checked:border-white has-checked:bg-white/5 has-focus-visible:outline-2 has-focus-visible:outline-white";

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
  const [extrasOpen] = useState(() => hasPageSettings(recipe));
  const [storyTab, setStoryTab] = useState("write"); // "write" | "preview"

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

  const storyLeft = STORY_MAX - recipe.story.length;

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
        <legend className="mb-3 font-display text-2xl text-white">Ingredients</legend>
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
        <legend className="mb-3 font-display text-2xl text-white">Instructions</legend>
        <ol className="space-y-3">
          {recipe.instructions.map((step, index) => (
            <li key={index} className="flex gap-2">
              <span className="w-5 pt-2 text-sm font-medium tabular-nums text-white/50">{index + 1}.</span>
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

      {/* OPTIONAL PAGE SETTINGS */}
      <details className="group rounded-2xl border border-white/15 open:border-white/30" open={extrasOpen}>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
          <span>
            <span className="font-display block text-2xl text-white">Make it yours</span>
            <span className="mt-1 block text-sm text-white/60">
              Optional. A story, more photos, a page layout and an accent colour.
            </span>
          </span>
          <ChevronIcon className="shrink-0 text-white/70 transition-transform group-open:rotate-180" />
        </summary>

        <div className="space-y-8 border-t border-white/15 px-5 py-6">
          {/* Story */}
          <div>
            <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
              <label htmlFor="recipe-story" className="block text-sm font-medium text-white/80">Story</label>
              <div role="tablist" aria-label="Story editor" className="flex gap-1 text-xs">
                {["write", "preview"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={storyTab === tab}
                    onClick={() => setStoryTab(tab)}
                    className={`rounded-md px-2.5 py-1 font-medium capitalize transition-colors ${
                      storyTab === tab ? "bg-white text-plum" : "text-white/60 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            {storyTab === "write" ? (
              <textarea
                id="recipe-story"
                className={inputClass}
                rows={10}
                maxLength={STORY_MAX}
                placeholder={"Where this dish comes from, what to watch for, who you make it for.\n\n# A heading\nSome **bold** and *italic* text, a - list, a [link](https://example.com)."}
                value={recipe.story}
                onChange={(e) => setField("story", e.target.value)}
              />
            ) : (
              <div className="min-h-40 rounded-lg border border-white/20 bg-white/[0.03] px-4 py-3" aria-live="polite">
                {recipe.story.trim() ? (
                  <Suspense fallback={<p className="text-sm text-white/50">Loading preview...</p>}>
                    <Markdown>{recipe.story}</Markdown>
                  </Suspense>
                ) : (
                  <p className="text-sm text-white/50">Nothing to preview yet.</p>
                )}
              </div>
            )}
            <p className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-white/50">
              <span>Markdown: # heading, **bold**, *italic*, - list, [link](https://…). Plain HTML is not rendered.</span>
              <span className={storyLeft < 500 ? "text-amber-300" : ""}>{storyLeft.toLocaleString()} characters left</span>
            </p>
          </div>

          {/* More photos */}
          <div>
            <p className={labelClass}>More photos</p>
            <GalleryUpload
              value={recipe.gallery}
              onChange={(urls) => setField("gallery", urls)}
              disabled={submitting}
            />
          </div>

          {/* Layout */}
          <fieldset>
            <legend className={labelClass}>Page layout</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {LAYOUTS.map((layout) => (
                <label key={layout.value} className={`${choiceClass} flex-col`}>
                  <input
                    type="radio"
                    name="recipe-layout"
                    value={layout.value}
                    checked={recipe.layout === layout.value}
                    onChange={() => setField("layout", layout.value)}
                    className="sr-only"
                  />
                  <LayoutSketch value={layout.value} />
                  <span>
                    <span className="block text-sm font-semibold text-white">{layout.label}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-white/60">{layout.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Accent */}
          <fieldset>
            <legend className={labelClass}>Accent colour</legend>
            <p className="mb-3 text-xs text-white/50">Colours the ingredients panel and the step numbers.</p>
            <div className="flex flex-wrap gap-3">
              {ACCENTS.map((accent) => (
                <label key={accent.value} className={`${choiceClass} items-center py-2.5 pr-5`}>
                  <input
                    type="radio"
                    name="recipe-accent"
                    value={accent.value}
                    checked={recipe.accent === accent.value}
                    onChange={() => setField("accent", accent.value)}
                    className="sr-only"
                  />
                  <span
                    className="h-7 w-7 shrink-0 rounded-full border border-white/40"
                    style={{ backgroundColor: accent.color }}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-white">{accent.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </details>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary"
        >
          {submitting ? submittingLabel : submitLabel}
        </button>
        {status && (
          <p
            role={status.kind === "error" ? "alert" : "status"}
            className={status.kind === "error" ? "text-sm text-red-300" : "text-sm text-emerald-300"}
          >
            {status.message}
          </p>
        )}
      </div>
    </form>
  );
}
