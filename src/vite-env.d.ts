/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PIPER_PACKAGE_ID: string;
  readonly VITE_NETWORK: string;
  readonly VITE_SUI_RPC_URL: string;
  readonly VITE_SUI_WS_URL: string;
  readonly VITE_ZKLOGIN_CLIENT_ID: string;
  readonly VITE_ENOKI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
