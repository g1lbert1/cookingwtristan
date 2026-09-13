//Per-page <head> tags. React 19 hoists <title> and <meta> rendered anywhere
//in the tree into the document head, so no helmet library is needed.
//
//Caveat: this runs in the browser. Google executes JS and sees these; most
//social-link scrapers (Instagram, iMessage, Discord) do not and will fall
//back to the static defaults in index.html.

export const SITE_NAME = "Cooking with Tristan";
const DEFAULT_DESCRIPTION = "Recipes I actually cook, with photos and step-by-step instructions.";

export default function Seo({ title, description = DEFAULT_DESCRIPTION, image, noindex = false }) {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
  //Open Graph wants absolute URLs. VITE_SITE_URL is the deployed origin.
  const siteUrl = (import.meta.env.VITE_SITE_URL || "").replace(/\/$/, "");
  const url = typeof window !== "undefined" ? siteUrl + window.location.pathname : undefined;
  const absImage = image && image.startsWith("/") ? siteUrl + image : image;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={image ? "article" : "website"} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {url && <meta property="og:url" content={url} />}
      {absImage && <meta property="og:image" content={absImage} />}

      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {absImage && <meta name="twitter:image" content={absImage} />}
    </>
  );
}
