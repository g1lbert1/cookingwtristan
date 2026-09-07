//Photo per recipe, keyed by slug. Files live in /public, so the path is just
//"/<filename>". Recipes without an entry show a placeholder on their page.
//
//This is a stopgap until the schema gets an image field. To add a photo:
//  1. drop the file in public/ named after the slug, e.g. public/beef-chili.jpg
//  2. add a line here:  "beef-chili": "/beef-chili.jpg",
export const RECIPE_IMAGES = {
  "creamy-garlic-chicken": "/creamy-garlic-chicken.jpg",
};

export const recipeImage = (slug) => RECIPE_IMAGES[slug] ?? null;
