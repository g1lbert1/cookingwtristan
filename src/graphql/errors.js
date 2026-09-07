//Apollo wraps GraphQL errors; the first one carries the server's
//BAD_USER_INPUT / FORBIDDEN / NOT_FOUND message, which is what the user needs.
export const getErrorMessage = (err) =>
  err?.graphQLErrors?.[0]?.message ??
  err?.cause?.errors?.[0]?.message ??
  err?.message ??
  "Something went wrong.";

export const isNotFound = (err) =>
  [err?.graphQLErrors?.[0], err?.cause?.errors?.[0]].some(
    (e) => e?.extensions?.code === "NOT_FOUND"
  );
