import { Navigate } from "react-router-dom";

//The landing page is the recipe list now. Keep /recipes working for any
//existing links by sending it home.
const Recipes = () => <Navigate to="/" replace />;
export default Recipes;
