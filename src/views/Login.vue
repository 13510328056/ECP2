<script setup lang="ts">
import { ref, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '@/stores/language'
import { useUserStore } from '@/stores/user'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const langStore = useLanguageStore()
const userStore = useUserStore()
const showToast = inject<(message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) => void>('showToast')

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errors = ref<Record<string, string>>({})

function handleLogin() {
  errors.value = {}

  if (!email.value) {
    errors.value.email = t('validation.requiredField', { field: t('login.title') })
    if (showToast) showToast(errors.value.email, 'warning')
    return
  }

  if (!password.value) {
    errors.value.password = t('validation.requiredField', { field: t('login.title') })
    if (showToast) showToast(errors.value.password, 'warning')
    return
  }

  if (password.value.length < 6) {
    errors.value.password = t('validation.minLength', { length: 6 })
    if (showToast) showToast(errors.value.password, 'warning')
    return
  }

  const success = userStore.login(email.value, password.value)
  if (success) {
    if (showToast) showToast(t('common.success'), 'success')
    // Redirect to previous page or home
    const redirect = (route.query.redirect as string) || '/'
    router.replace(redirect)
  } else {
    if (showToast) showToast(t('login.error'), 'error')
  }
}
</script>

<template>
  <div class="max-w-[480px] mx-auto bg-gray-50 min-h-screen relative hide-scrollbar">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white px-4 py-4 flex items-center gap-4 shadow-sm">
      <button @click="router.push('/')" class="hover:opacity-70 transition">
        <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <router-link to="/">
        <img src="/images/logo.png" alt="Li's" class="h-8 w-auto" />
      </router-link>
      <h1 class="text-lg font-bold text-gray-800">{{ t('login.title') }}</h1>
    </header>

    <!-- Login Form -->
    <div class="p-6 pt-10">
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
        <!-- Email -->
        <div class="mb-5">
          <label class="block text-sm font-bold text-gray-700 mb-1.5">{{ t('login.title') }}</label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <input
              v-model="email"
              type="email"
              :placeholder="t('login.emailPlaceholder')"
              class="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 text-sm outline-none focus:border-[#F7B500] transition"
              :class="{ 'border-red-300': errors.email }"
              autocomplete="email"
            />
          </div>
          <p v-if="errors.email" class="text-xs text-red-500 mt-1">{{ errors.email }}</p>
        </div>

        <!-- Password -->
        <div class="mb-6">
          <label class="block text-sm font-bold text-gray-700 mb-1.5">{{ t('login.title') }}</label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              :placeholder="t('login.passwordPlaceholder')"
              class="w-full border border-gray-200 rounded-lg pl-10 pr-10 py-2.5 text-sm outline-none focus:border-[#F7B500] transition"
              :class="{ 'border-red-300': errors.password }"
              autocomplete="current-password"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              @click="showPassword = !showPassword"
            >
              <!-- Closed eye: password hidden -->
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              <!-- Open eye: password visible -->
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
          <p v-if="errors.password" class="text-xs text-red-500 mt-1">{{ errors.password }}</p>
        </div>

        <!-- Submit Button -->
        <button
          class="w-full h-12 bg-[#F7B500] text-black rounded-xl font-bold text-base flex items-center justify-center shadow-lg shadow-yellow-200 hover:bg-[#e0a200] transition"
          @click="handleLogin"
        >
          {{ t('login.submit') }}
        </button>

        <!-- Register Link -->
        <p class="text-center text-sm text-gray-500 mt-5">
          {{ t('login.noAccount') }}
          <router-link to="/register" class="text-[#006B3F] font-bold hover:underline">
            {{ t('login.registerLink') }}
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
