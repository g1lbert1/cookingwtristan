//The shape rules for a username, matching usernames.js on the server so the
//form can explain a problem before asking the API. Reserved words and
//profanity are the server's call: the form asks it (checkUsername) while
//the user types, and the server runs every rule again on save.

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 30;
const SHAPE = /^[A-Za-z0-9](?:[A-Za-z0-9_-]*[A-Za-z0-9])?$/;

//A message for a name that cannot be valid, or null if it passes the shape.
export const usernameShapeProblem = (raw) => {
  const name = raw.trim();
  if (name.length < USERNAME_MIN) return `Usernames need at least ${USERNAME_MIN} characters.`;
  if (name.length > USERNAME_MAX) return `Usernames can be at most ${USERNAME_MAX} characters.`;
  if (!SHAPE.test(name)) {
    return "Usernames can only use letters, numbers, underscores and hyphens, and must start and end with a letter or number.";
  }
  return null;
};

export const profilePath = (username) => `/u/${encodeURIComponent(username)}`;
