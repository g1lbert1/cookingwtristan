## my cooking website!
### first commit:
* initializing react project
* installing tailwind
### second commit (routes)
* implementing routes for the website 
    * /landing
    * /recipes
    * /recipes/:id

### Third commit (Auth0)
* integrating auth0 to the frontend
    * wrapped app with auth0provider (in main.jsx)
    * just make sure you use the right clientid and domain tag
    * then, use the auth0hook in app.jsx (or wherever you are serving the login/logout button)
    * just finished finalizing apolloclient, sending jwt to backend for verification, frontend setup of auth0! (02/17)
    * Lowkey need to work on redirecting/email verification when a user CREATES an account using auth0. since when they first create an account, it responds with ERROR getting user data
    * make sure you make a .env file and move hardcoded stuff out of there!


### Setup
```
cp .env.example .env
npm install
npm run dev
```

Auth0 config now comes from `VITE_*` env vars instead of being hardcoded in
`main.jsx`. Note that Vite **inlines these into the client bundle** — they are
public by design (an Auth0 domain and clientId are meant to be), so never put a
real secret behind a `VITE_` prefix.

The "ERROR getting user data" on account creation was a backend issue — see the
Required Auth0 Action section in the cookingwdatabase README.

### Audit follow-ups (medium)
* `/admin/createRecipe` is gated on `me.role === "admin"`, not just on being
  logged in. Non-admins see an "Admins only" notice instead of a form that
  fails at submit time.
* The create form shows the server's error message inline (validation,
  FORBIDDEN, network) and a success line with the new slug; no more silent
  failures or `alert()`.
* Auth0 uses rotating refresh tokens. Enable **Allow Offline Access** on the
  API and **Refresh Token Rotation** on the SPA application in the Auth0
  dashboard so expired access tokens renew without the iframe flow.
  (Tokens were briefly moved to an in-memory cache; see the 09/07/26 fix
  below for why that was reverted to localStorage.)

### Landing, recipe list, nav (09/07/26)
* Nav bar is now Home (top left), Profile (right), and an About-me person
  icon (far right). Profile shows as "Log in" until there's a session.
* `/` is the landing page and renders the recipe list from the `recipes`
  query. `/recipes` redirects to `/` so old links keep working.
* New `/profile` (login required) shows username, email, role, join date,
  a log-out button, and a "Create a recipe" link for admins.
* New `/about` placeholder page. Replace the copy in `src/pages/About.jsx`.
* Shared queries live in `src/graphql/queries.js`.

### Login fixes (09/07/26)
* **Profile showed "User must be logged in" right after login.** Auth0 sends
  you back to `/`, where the landing page fires the recipes query while the
  login callback is still being processed. That asked the SDK for a token with
  an empty cache, so it tried the hidden-iframe check, got `login_required`
  (browser blocks third-party cookies), and the SDK wiped its token cache,
  including the token the login had just stored. The Apollo auth link now only
  asks for a token once Auth0 reports a signed-in user, and it warns in the
  console if a token cannot be produced.
* **Consent screen on every refresh.** With the in-memory token cache, every
  reload started empty and hit the same failing iframe check, so
  `withAuthenticationRequired` sent you through a full login each time. Tokens
  are back in `localStorage`. Note that Auth0 always shows the consent screen
  for `localhost` callback URLs, so it will still appear on real logins in dev;
  it goes away on a deployed hostname.

### Edit / delete UI (09/07/26)
* Admins see **Edit** and **Delete** on each card on the landing page, plus a
  **+ New recipe** button above the list.
* `/admin/editRecipe/:slug` loads the recipe and reuses the create form.
  Saving a new title changes the slug and the page follows it. A delete
  section sits at the bottom of the edit page.
* Delete is a two-step inline confirmation (no browser dialog). On success the
  recipe is evicted from the Apollo cache so it disappears from the list
  without a refetch.
* The form lives in `src/components/RecipeForm.jsx`; create and edit pages
  only own their mutation. Error text comes from `src/graphql/errors.js`.
* `useMe()` in `src/hooks/useMe.js` is the one place that reads the signed-in
  user's role.
