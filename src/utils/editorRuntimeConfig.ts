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
  return runtimeConfig;
}