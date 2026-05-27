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

