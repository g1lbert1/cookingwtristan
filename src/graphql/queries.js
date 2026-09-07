import { gql } from "@apollo/client";

export const GET_ME = gql`
  query GetMe {
    me {
      _id
      username
      email
      avatar
      role
      createdAt
    }
  }
`;

export const GET_RECIPES = gql`
  query GetRecipes {
    recipes {
      _id
      title
      slug
      prepTime
      ingredients {
        name
      }
    }
  }
`;
