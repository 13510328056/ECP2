<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import BottomNav from '@/components/layout/BottomNav.vue'
import { isValidPhone, isValidEmail } from '@/utils/validation'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const showToast = inject<(message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) => void>('showToast')

const isEditing = ref(false)

const form = ref({
  name: '',
  email: '',
  phone: '',
})

const initials = computed(() => {
  if (!userStore.userName) return '?'
  const parts = userStore.userName.split(' ').filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return userStore.userName.substring(0, 2).toUpperCase()
})

function startEditing() {
  form.value = {
    name: userStore.userName,
    email: userStore.userEmail,
    phone: userStore.userPhone,
  }
  isEditing.value = true
}

function cancelEditing() {
  isEditing.value = false
}

function saveProfile() {
  if (!form.value.name.trim()) {
    if (showToast) showToast(t('validation.requiredField', { field: t('profile.name') }), 'warning')
    return
  }
  if (!form.value.email.trim()) {
    if (showToast) showToast(t('validation.requiredField', { field: t('profile.email') }), 'warning')
    return
  }
  if (!isValidEmail(form.value.email)) {
    if (showToast) showToast(t('validation.invalidEmail'), 'warning')
    return
  }
  if (!form.value.phone.trim()) {
    if (showToast) showToast(t('validation.requiredField', { field: t('profile.phone') }), 'warning')
    return
  }
  if (!isValidPhone(form.value.phone)) {
    if (showToast) showToast(t('validation.invalidPhone'), 'warning')
    return
  }

  userStore.userName = form.value.name
  userStore.userEmail = form.value.email
  userStore.userPhone = form.value.phone
  isEditing.value = false
  if (showToast) showToast(t('profile.saved'), 'success')
}

// Member since date
const memberSince = '2026-01-15'
</script>

<template>
  <div class="max-w-[480px] mx-auto bg-gray-50 min-h-screen relative pb-24 hide-scrollbar">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white px-4 py-4 flex items-center gap-4 shadow-sm">
      <button @click="router.push('/account')" class="hover:opacity-70 transition">
        <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <router-link to="/">
        <img src="/images/logo.png" alt="Li's" class="h-8 w-auto" />
      </router-link>
      <h1 class="text-lg font-bold text-gray-800">{{ t('profile.title') }}</h1>
    </header>

    <!-- Not Logged In -->
    <div v-if="!userStore.isLoggedIn" class="p-6 pt-20">
      <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-50 text-center">
        <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <h2 class="text-xl font-bold text-gray-800 mb-2">{{ t('account.notLoggedIn') }}</h2>
        <p class="text-sm text-gray-400 mb-6">{{ t('account.loginPrompt') }}</p>
        <router-link
          to="/login"
          class="inline-block w-full h-12 bg-[#F7B500] text-black rounded-xl font-bold text-base leading-[48px] shadow-lg shadow-yellow-200 hover:bg-[#e0a200] transition"
        >
          {{ t('account.loginButton') }}
        </router-link>
      </div>
    </div>

    <!-- Logged In -->
    <div v-else class="p-4 space-y-4">
      <!-- Avatar & Basic Info -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 text-center">
        <!-- Avatar Circle -->
        <div class="w-20 h-20 rounded-full bg-[#1E3A5F] flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-2xl font-bold">{{ initials }}</span>
        </div>

        <!-- View Mode -->
        <template v-if="!isEditing">
          <h2 class="text-xl font-bold text-gray-800">{{ userStore.userName }}</h2>
          <div class="mt-3 space-y-1">
            <p class="text-sm text-gray-500">
              <span class="font-medium text-gray-600">{{ t('profile.email') }}:</span> {{ userStore.userEmail }}
            </p>
            <p class="text-sm text-gray-400">
              <span class="font-medium text-gray-600">{{ t('profile.phone') }}:</span> {{ userStore.userPhone }}
            </p>
          </div>
          <p class="text-xs text-gray-400 mt-3">
            {{ t('profile.memberSince') }}: {{ memberSince }}
          </p>
          <button
            class="mt-4 h-10 px-6 bg-[#F7B500] text-black rounded-xl font-bold text-sm shadow-lg shadow-yellow-200 hover:bg-[#e0a200] transition"
            @click="startEditing"
          >
            {{ t('profile.edit') }}
          </button>
        </template>

        <!-- Edit Mode -->
        <template v-else>
          <div class="space-y-3 text-left">
            <div>
              <label class="text-xs font-bold text-gray-600 mb-1 block">{{ t('profile.name') }}</label>
              <input
                v-model="form.name"
                type="text"
                :placeholder="t('profile.namePlaceholder')"
                class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F7B500] transition"
              />
            </div>
            <div>
              <label class="text-xs font-bold text-gray-600 mb-1 block">{{ t('profile.email') }}</label>
              <input
                v-model="form.email"
                type="email"
                class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F7B500] transition"
              />
            </div>
            <div>
              <label class="text-xs font-bold text-gray-600 mb-1 block">{{ t('profile.phone') }}</label>
              <input
                v-model="form.phone"
                type="tel"
                :placeholder="t('profile.phonePlaceholder')"
                class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F7B500] transition"
              />
            </div>
          </div>
          <div class="flex gap-3 mt-4">
            <button
              class="flex-1 h-10 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition"
              @click="cancelEditing"
            >
              {{ t('profile.cancel') }}
            </button>
            <button
              class="flex-1 h-10 bg-[#F7B500] text-black rounded-xl font-bold text-sm shadow-lg shadow-yellow-200 hover:bg-[#e0a200] transition"
              @click="saveProfile"
            >
              {{ t('profile.save') }}
            </button>
          </div>
        </template>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
