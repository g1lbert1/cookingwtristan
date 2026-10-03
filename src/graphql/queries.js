import { gql } from "@apollo/client";

//Every field the forms and pages need. Shared with the mutations so the
//results write straight into the Apollo cache.
export const RECIPE_FIELDS = gql`
  fragment RecipeFields on Recipe {
    _id
    title
    slug
    prepTime
    content
    imageUrl
    ingredients {
      name
      amount
      unit
      notes
    }
    instructions
    likeCount
    createdAt
    author {
      _id
      username
      avatar
    }
  }
`;

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
      imageUrl
      likeCount
      author {
        _id
        username
      }
      ingredients {
        name
      }
    }
  }
`;

export const GET_RECIPE_BY_SLUG = gql`
  ${RECIPE_FIELDS}
  query GetRecipeBySlug($slug: String!) {
    getRecipeBySlug(slug: $slug) {
      ...RecipeFields
    }
  }
`;
