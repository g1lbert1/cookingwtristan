import { gql } from "@apollo/client";
import { RECIPE_FIELDS } from "./queries";

export const CREATE_RECIPE = gql`
  ${RECIPE_FIELDS}
  mutation CreateRecipe($input: RecipeInput!) {
    createRecipe(input: $input) {
      ...RecipeFields
    }
  }
`;

export const UPDATE_RECIPE = gql`
  ${RECIPE_FIELDS}
  mutation UpdateRecipe($_id: String!, $input: RecipeInput!) {
    updateRecipe(_id: $_id, input: $input) {
      ...RecipeFields
    }
  }
`;

export const DELETE_RECIPE = gql`
  mutation DeleteRecipe($_id: String!) {
    deleteRecipe(_id: $_id)
  }
`;
