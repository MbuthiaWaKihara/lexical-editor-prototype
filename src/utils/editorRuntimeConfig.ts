export type EditorRuntimeConfig = {
  mentionsUrl?: string;
  accessToken?: string;
};

let runtimeConfig: EditorRuntimeConfig = {};

export function setEditorRuntimeConfig(
  partial: EditorRuntimeConfig
) {
  runtimeConfig = {
    ...runtimeConfig,
    ...partial,
  };
}

export function getEditorRuntimeConfig(): EditorRuntimeConfig {
  return ({
    mentionsUrl: "https://forge-api.stg.group.app/api/groups/16/memberships",
    accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMThkYzc0OThiYjQwMjk4NzBmZjMyZGQ4YTk0ODU4NGYzZmM3YmVkNzc4NDQ2ZGIwOWMxOWU4MjVlZWZhZmM1NmFkNGMyN2ZiODRiZjBhOTciLCJpYXQiOjE3NjkwNzA1MzEuNzg5MjY0LCJuYmYiOjE3NjkwNzA1MzEuNzg5MjY2LCJleHAiOjQ5MjQ3NDQxMzEuNzUzMzU4LCJzdWIiOiI5MDgiLCJzY29wZXMiOlsiKiJdfQ.FRnrCOT9uN0XaYfGxofXlE9gdl5pGHlhPGtY5xfQTfxi4g6oQRL6rwgBMCRMS9HRjaVzS2wtj1TjYA6hLgpBW-7Ye5Uj0qRK-W6ALoUKnENM5r6lYYB9Spx0ikt88Az_FSyYL5bqMg_rMvBC_1e_WIMejwc9BCfLQYXmgupqYrP_aMzYxtnqoz60bF8AewZcTwZW3aOOk5ck6NfNxwqord9j7_HEO22QxRYiR-oNeu2bjS1NPXFwJDJSculdNmtqtxKIRgBt6SmnexfbIjIC04MZ3RCuf8iE5p3w99ddaOniZEXk_GVaAvl2C1CQId9Z62vVt9SpVwdH6h-tIJndcV5150vOy34uSq12h7mvRw0bw0tjj6Ag5Mz90Xm7j78_uZTV5e9ZEc0Zo1wzrD4xiYLMWnk07k5Z4xMxwx8wYuuIGxtAjYRHCyUQmtKptoj54mdNfZmv_xacv8XncIX215n-W7LOllCD9w51M9FvBlolRSA9ypkCMcyo4zkjFuBaq-oJj9i4P7vcQwW6CfqY09lNvY1NDrPetERACFJpZqIdaI8FgF58dXgGc9cEmARziF1zaWJJnneShmfTkRNM9nqk-YylNOJ6VkJgBqcNwX4FDb0TFO3nJauzXXUamBnhlF1qfFqqa2HCoQ-G-w-v7WwA8GDvcLMIlQklxEj9Vjs",
  })
  // return runtimeConfig;
}