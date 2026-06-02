import { defineStore } from 'pinia'
import { ref } from 'vue'
import { i18n } from '@/i18n'

export type SupportedLocale = 'zh' | 'en'

export const useLanguageStore = defineStore('language', () => {
  const locale = ref<SupportedLocale>('zh')

  function setLocale(lang: SupportedLocale) {
    locale.value = lang
    i18n.global.locale.value = lang
  }

  function toggleLocale() {
    const next = locale.value === 'zh' ? 'en' : 'zh'
    locale.value = next
    i18n.global.locale.value = next
  }

  return { locale, setLocale, toggleLocale }
}, {
  persist: true,
})
