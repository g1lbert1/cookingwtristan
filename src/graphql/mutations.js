import { gql } from "@apollo/client";

export const CREATE_RECIPE = gql`
mutation CreateRecipe($input: RecipeInput!) {
    createRecipe(input: $input) {
        _id
        title
        slug
    }
}
`;
