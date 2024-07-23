/// <reference types="vitest" />

import { UserConfig as ViteUserConfig } from 'vite';
import { UserConfig as VitestUserConfig } from 'vitest/config';

declare module 'vite' {
  interface UserConfig extends ViteUserConfig, VitestUserConfig {}
}
