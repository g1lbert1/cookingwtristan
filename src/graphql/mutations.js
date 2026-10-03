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

//Each returns the recipe with fresh likeCount and viewer flags. Apollo keys
//Recipe objects by _id, so every card and page showing it updates in place.
const REACTION_RESULT = `
  _id
  likeCount
  likedByMe
  favoritedByMe
`;

export const LIKE_RECIPE = gql`
  mutation LikeRecipe($_id: String!) {
    likeRecipe(_id: $_id) { ${REACTION_RESULT} }
  }
`;

export const UNLIKE_RECIPE = gql`
  mutation UnlikeRecipe($_id: String!) {
    unlikeRecipe(_id: $_id) { ${REACTION_RESULT} }
  }
`;

export const FAVORITE_RECIPE = gql`
  mutation FavoriteRecipe($_id: String!) {
    favoriteRecipe(_id: $_id) { ${REACTION_RESULT} }
  }
`;

export const UNFAVORITE_RECIPE = gql`
  mutation UnfavoriteRecipe($_id: String!) {
    unfavoriteRecipe(_id: $_id) { ${REACTION_RESULT} }
  }
`;

export const DELETE_RECIPE = gql`
  mutation DeleteRecipe($_id: String!) {
    deleteRecipe(_id: $_id)
  }
`;

//Any signed-in user. Everything the browser needs to upload one photo straight to
//Cloudinary; see components/ImageUpload.jsx.
export const CREATE_IMAGE_UPLOAD_SIGNATURE = gql`
  mutation CreateImageUploadSignature {
    createImageUploadSignature {
      cloudName
      apiKey
      timestamp
      signature
      folder
    }
  }
`;
