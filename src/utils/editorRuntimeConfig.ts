export type EditorRuntimeConfig = {
  hashtagsUrl?: string;
  mentionsUrl?: string;
  accessToken?: string;
  placeholder?: string;
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
  return runtimeConfig;
}