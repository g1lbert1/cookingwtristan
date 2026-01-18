import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Recipe from './pages/Recipe';
import Recipes from './pages/Recipes';
import Landing from './pages/Landing';

const App = () => {
  return(
    <Routes>
      <Route path = "/" element={<Landing />} />
      <Route path = "/recipes" element={<Recipes />} />
      <Route path = "/recipes/:slug" element={<Recipe />} />
    </Routes>
  );
};
export default App;

