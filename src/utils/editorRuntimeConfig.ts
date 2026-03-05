export type EditorRuntimeConfig = {
  hashtagsUrl?: string;
  mentionsUrl?: string;
  accessToken?: string;
  placeholder?: string;
  css?: string;
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
  // return ({
  //   placeholder: 'Create post. Use @ for members and # for channels',
  //   hashtagsUrl: 'https://forge-api.stg.group.app/api/groups/16/channels?limit=10',
  //   mentionsUrl: 'https://forge-api.stg.group.app/api/groups/16/memberships',
  //   accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzc5YTRmMGQ0Y2VhNzdmYzViNjc5N2EyNDRiNTExMDFiZDE0Mzk3ZmFhMGExYTc2MDc2ODMzOGRhMGY2ZTU0NDVhYTAwYzVhODA5NzMzMjUiLCJpYXQiOjE3NzI3MjM5NDcuODc0NTA1LCJuYmYiOjE3NzI3MjM5NDcuODc0NTA4LCJleHAiOjQ5MjgzOTc1NDcuODMwMjEzLCJzdWIiOiI5MDgiLCJzY29wZXMiOlsiKiJdfQ.M0LbuC9dcYmikftxo2xEbjgRybs4wcQPTqrGM24_Y7Y0PjqGzYL-81sEQaELMFBi9WmLoN4JOjMSiTw8MS6l7R97pkODzmovIRYYDAIeV7f3kO0CKX6YwCcIN-MwGLyR9Gi-O7PJtNCZs1y_W0Ul9kGM4EUahCDB83TXRoHiCn-tiAAtHQzVrDR5dQtKOXFgN_kqlJdnN_eBelvcPCHC0JVYhWkmMu-_5ZktVe9MBNhc_4ppCFXJOpN28hROOMwlSk_wEqco71oBYqzGhKWh4gW1qzFZLAIw4r-b44r4AsZc305SQAG7G3bSPIoMPFpI3q4FW3Qz7CZGI1P286bqS5ybu7KYMmKRuy8qt6_kr24RffPgbZWbLIpSt2qhP6jN8xhvsTIPl9PZBAmdksBl6b67barJ4Zhx_NQGAIdMMeIcTDdpqRA8CWSAVY5MqIaRITEFPPdWsyP19L8TR-Duo1ftaPk_b47PxeUmo-4tLcVcE0jL0iFmGj7Al-v_UOxqmu3138sYDMI6Vrtzc9pPp1pFx52qSjni3252MNljtn_gV9HhIRV7fDCyHr9u8-XoRLJhNQ7ALrxpWZ42Ev3epLr-CrQ7Jy5I4PTZRnPlPHeFhTJ2nY85q7nN4DP3Yf2xTAeMMgEm4UnNj8iab1XwacMSt_9k6co1Ci-ISZhOWj0',
  // })
  return runtimeConfig;
}