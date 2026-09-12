import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_RECIPE_BY_SLUG } from "../graphql/queries";
import { UPDATE_RECIPE } from "../graphql/mutations";
import { getErrorMessage, isNotFound } from "../graphql/errors";
import RecipeForm from "../components/RecipeForm";
import { recipeToForm } from "../components/recipeFormState";
import DeleteRecipeButton from "../components/DeleteRecipeButton";

export default function EditRecipe() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_RECIPE_BY_SLUG, { variables: { slug } });

  const [updateRecipe] = useMutation(UPDATE_RECIPE, {
    //Changing the title changes the slug, and this page is addressed by slug.
    //Seed the cache for the new slug so the redirect below renders instantly
    //instead of unmounting the form behind a loading state.
    update(cache, { data: result }) {
      const updated = result?.updateRecipe;
      if (!updated) return;
      cache.writeQuery({
        query: GET_RECIPE_BY_SLUG,
        variables: { slug: updated.slug },
        data: { getRecipeBySlug: updated },
      });
    },
  });

  if (loading) return <p className="text-gray-600">Loading recipe...</p>;

  if (error) {
    return (
      <div role="alert">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNotFound(error) ? "Recipe not found" : "Couldn't load recipe"}
        </h1>
        <p className="mt-2 text-gray-600">{getErrorMessage(error)}</p>
        <Link to="/recipes" className="mt-4 inline-block text-sm font-medium text-gray-900 underline">
          Back to all recipes
        </Link>
      </div>
    );
  }

  const recipe = data.getRecipeBySlug;

  const handleSubmit = async (input) => {
    const { data: result } = await updateRecipe({ variables: { _id: recipe._id, input } });
    const updated = result.updateRecipe;
    if (updated.slug !== slug) {
      navigate(`/admin/editRecipe/${updated.slug}`, { replace: true });
    }
    return `Saved "${updated.title}".`;
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Edit recipe</h1>
        <Link to={`/recipes/${recipe.slug}`} className="text-sm font-medium text-gray-700 underline">
          View recipe
        </Link>
      </div>

      {/* Keyed by _id so a slug change keeps the form state; a different
          recipe at this route starts fresh. */}
      <RecipeForm
        key={recipe._id}
        initialValues={recipeToForm(recipe)}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
        submittingLabel="Saving..."
      />

      <section className="mt-12 max-w-2xl border-t border-gray-200 pt-6">
        <h2 className="text-lg font-semibold text-gray-900">Delete this recipe</h2>
        <p className="mb-3 mt-1 text-sm text-gray-600">This cannot be undone.</p>
        <DeleteRecipeButton recipe={recipe} onDeleted={() => navigate("/recipes")} />
      </section>
    </>
  );
}
