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
  // return runtimeConfig;
  return ({
    mentionsUrl: 'https://forge-api.stg.group.app/api/groups/16/memberships',
    accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiY2RhYTQxYTcxNDIwNmNkZTMzMDUxOGZiNWNhNTAyN2FiZDc2MWMxNDdmZDhlODY0Y2FiNjljMzAzYjI0YjBmYWZlYzcxMmNkNmM0YmQyMjMiLCJpYXQiOjE3Njk0OTcyMTAuNzE1OTI5LCJuYmYiOjE3Njk0OTcyMTAuNzE1OTMxLCJleHAiOjQ5MjUxNzA4MTAuNTU1NzM2LCJzdWIiOiI5MDgiLCJzY29wZXMiOlsiKiJdfQ.CnzL6dSg75H-LFEnSUbPFOzTKyIXfwtqLolOFIjZbtxzf2iUeFc8xKD3drKfg0eB2k0sEvsv094rEaunuZfPHO21tgt7VACQtVr074at3ffXJYffTwDTw4CNNlhLRy7HQLZ1TpcPbCZCrsfygmA7zCycIuB03xoSeydDz2aNzvgoNjM26kvlJpVgsQtppmqNvJFipcWDc1eGJrlimGotoZ9GkvL7S7FF46ZrhFH26tGx8wrW6sATKUv0gWN8CLclbQheI1L7b4s0udo38ZwMjzzCAXR4tld-TGzJ77g4mNdPJ0v3WjIaICzJ9_mqV1ObBluWaDyuDLtN3PPpBs8_4zK9PUE4XZc1BJzgKJ42Y-FXM3jLpyE55PG3iwGDu4rSdfaq8wTbsaeyJLI1BJWz84Y3DFZ-eiKQsyBg3xMtL2UO_KYsFC1MtqhTNQWM_SxJKFF3H1ypGE0RmrB-RUegjAO-yahG0Yl1jfsW4r-gmkr_KApse3zQYr1qWN5qYUFF1AC16dPqTfmcHDW1AgaJssHiy6MCjoT_gfUsJWtElvSFBQ8ZrXFM3m-uK2nuoQI15URNz_3BEhsJtJQH8s2ygy8o7BvyRaEuOw4dot9GJzuGrjQsau18oGp4PZDcTbnzfEX7lj1PEz5NBX2h5ZPxT-PycpYLLhX6uDU_Ua2S9M8',
  })
}