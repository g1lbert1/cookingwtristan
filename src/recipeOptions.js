//The optional page settings a recipe can carry, mirrored from the API's
//RecipeLayout and RecipeAccent enums. The form offers these and nothing
//else; the server refuses anything outside the lists.

export const LAYOUTS = [
  {
    value: "CLASSIC",
    label: "Classic",
    description: "Photo up top, ingredients beside the steps. The site's own layout.",
  },
  {
    value: "EDITORIAL",
    label: "Editorial",
    description: "Your photo fills the width with the title over it, then one wide reading column.",
  },
  {
    value: "GALLERY",
    label: "Gallery",
    description: "Every photo first, in a mosaic, then the recipe.",
  },
];

//Dark surfaces; white text clears each at 9:1 or better, and each as text on
//white clears 9:1 too. Plum is the site colour and the default.
export const ACCENTS = [
  { value: "PLUM", label: "Plum", color: "#2b0042" },
  { value: "VIOLET", label: "Violet", color: "#5a1f86" },
  { value: "BERRY", label: "Berry", color: "#7a1748" },
  { value: "TEAL", label: "Teal", color: "#0b4f4a" },
];

export const DEFAULT_LAYOUT = LAYOUTS[0].value;
export const DEFAULT_ACCENT = ACCENTS[0].value;

export const accentColor = (value) =>
  (ACCENTS.find((a) => a.value === value) ?? ACCENTS[0]).color;

//Same limits as the server, for messages before the request goes out.
export const GALLERY_MAX = 8;
export const STORY_MAX = 20000;
