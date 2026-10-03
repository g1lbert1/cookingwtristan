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
    likedByMe
    favoritedByMe
    createdAt
    author {
      _id
      username
      avatar
    }
  }
`;

//What a card in any grid needs: the recipes page and the profile tabs.
export const RECIPE_CARD_FIELDS = gql`
  fragment RecipeCardFields on Recipe {
    _id
    title
    slug
    prepTime
    imageUrl
    likeCount
    likedByMe
    favoritedByMe
    author {
      _id
      username
    }
    ingredients {
      name
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
  ${RECIPE_CARD_FIELDS}
  query GetRecipes {
    recipes {
      ...RecipeCardFields
    }
  }
`;

//The profile tabs. Fetched only on the profile page; the reaction buttons
//evict these fields from the cached User after a change so the tabs refetch.
export const GET_MY_RECIPES = gql`
  ${RECIPE_CARD_FIELDS}
  query GetMyRecipes {
    me {
      _id
      recipes {
        ...RecipeCardFields
      }
      likedRecipes {
        ...RecipeCardFields
      }
      favoriteRecipes {
        ...RecipeCardFields
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
