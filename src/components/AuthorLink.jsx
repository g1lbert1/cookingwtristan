import { Link } from "react-router-dom";
import { profilePath } from "../usernameRules";
import { SITE_AUTHOR } from "../content/site";

//A username that goes to its owner's public profile. Recipes posted by the
//site itself have no account behind them and show the site author as plain
//text; a deleted account shows the fallback the caller passes.
export default function AuthorLink({ author, fallback = SITE_AUTHOR, className = "" }) {
  if (!author?.username) return <span className={className}>{fallback}</span>;
  return (
    <Link to={profilePath(author.username)} className={`${className} hover:underline`}>
      {author.username}
    </Link>
  );
}
