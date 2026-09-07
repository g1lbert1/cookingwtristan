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
* Auth0 tokens are held in memory with rotating refresh tokens instead of
  localStorage. For sessions to survive a reload without the iframe fallback,
  enable **Allow Offline Access** on the API and **Refresh Token Rotation** on
  the SPA application in the Auth0 dashboard.
