/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// ── vue-i18n v10 type shim ──
// vue-tsc v2.2 has module-resolution issues with vue-i18n v10's dist exports map.
// This shim provides the functions and types that the real module exports.
declare module 'vue-i18n' {
  export function createI18n(options?: Record<string, any>): any
  export function useI18n(options?: Record<string, any>): {
    t: (key: string, ...args: any[]) => string
    locale: { value: string }
    tm: (key: string) => any
    rt: (key: string) => any
  }

  export interface DefineLocaleMessage {
    [key: string]: any
  }
}
