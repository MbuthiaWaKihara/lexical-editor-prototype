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
  //   hashtagsUrl: `https://forge-api.stg.group.app/api/groups/16/channels?limit=10`,
  //   mentionsUrl: `https://forge-api.stg.group.app/api/groups/16/memberships`,
  //   accessToken: `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzYwMTE5MDA3N2U1ZjYxNTRmYzRmMTQ4MDU1NmNhYTNiN2M5ZTQ0OTkzM2U4OGVmYTU4Y2M5ZWQ0NDY1ZDJkNGE3OGRhZGE5NDhkNWIzZjgiLCJpYXQiOjE3NzIwOTY0MjkuNzM3NTM0LCJuYmYiOjE3NzIwOTY0MjkuNzM3NTM2LCJleHAiOjQ5Mjc3NzAwMjkuNjg4NDM4LCJzdWIiOiI5MDgiLCJzY29wZXMiOlsiKiJdfQ.HanrO2MmkynH4tQFHGNFAaKe_Rl2jmtxpwuAlHpB55NOgCC4qggziG5T5LhEZXfzNYLWUmq5bsaGywitvDu7RASubyXx2-pEIkjDyHFG8WQlWyVpytdPkAx-x4kXHik07wiNaSP6bHf5UdWacMeAO61pv45seelU_ie4ustaCu8XDqagFVXyY-VynJO7Y1mdCYzhQKuHUUCQqitur2FkgGcNnQv7aNBF96Ek3YBasj2ngG3KZpxZXxHlvGYGHXdtF816otRNAjpxoC2m-ekF_KWV9pu8_OaQMdt6Olyt0g3R-4lSIZljlobM_gNgVMZQse34CVv34CUMsIVQHryt96Mx-sLKHGO4kdQsY7_6E7kcThGwtk--DV2CDQYjo3hDYoYiySjaJhSalGW84goUv1MNln0yU5ZStWSuG8GWgKkZP2y0BuVAeDO5qBUd3C-nI-NI70e4-qUyIroS0mB4QMQn7vypqXsOx3jOmreVNzArSxACCWV5vDz93F6AXIq2xkiSXtX1oMaJCcElc527fke5cJLVAv3JscOUloEggwf3j-6G6RQDKuzbyWrCgL1JEunnygy-6xZbTyneh4el6RVLm_zbkr0l-TpufvkFOhMyJEOuN14BGDskpr7eXHDTgPVGgC03iEaIkfg55cZvkhcgYiDReS1_4kH_3IefaV8`,
  // })
  return runtimeConfig;
}