<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

const router = useRouter()
const adminStore = useAdminStore()

const email = ref('')
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const errorMsg = ref('')
const captchaCode = ref('')
const captchaInput = ref('')

function generateCaptcha() {
  captchaCode.value = Math.floor(1000 + Math.random() * 9000).toString()
}

function refreshCaptcha() {
  generateCaptcha()
}

onMounted(() => generateCaptcha())

function handleLogin() {
  if (!email.value.trim() || !password.value.trim()) {
    errorMsg.value = '请输入管理员账号和密码'
    return
  }

  if (captchaInput.value !== captchaCode.value) {
    errorMsg.value = '验证码错误，请重新输入'
    refreshCaptcha()
    return
  }

  loading.value = true
  errorMsg.value = ''

  // Simulate API call delay
  setTimeout(() => {
    const success = adminStore.login(email.value.trim(), password.value)
    loading.value = false
    if (success) {
      router.push('/admin/dashboard')
    } else {
      errorMsg.value = '账号或密码错误，请重试'
      refreshCaptcha()
    }
  }, 600)
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center p-4"
    style="background: linear-gradient(135deg, #006B3F 0%, #004d2e 100%)"
  >
    <div class="w-full max-w-[375px] bg-white rounded-[40px] p-8 flex flex-col shadow-2xl" style="min-height: 700px;">
      <!-- Logo & Title -->
      <div class="mt-10 mb-10 text-center">
        <div class="mb-6">
          <svg class="h-20 w-auto mx-auto" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="80" rx="12" fill="#006B3F"/>
            <text x="60" y="48" text-anchor="middle" fill="white" font-size="24" font-weight="900" font-family="sans-serif">Li's</text>
            <text x="60" y="66" text-anchor="middle" fill="#F7B500" font-size="10" font-weight="bold" font-family="sans-serif">INDUSTRIAL MART</text>
          </svg>
        </div>
        <h1 class="text-2xl font-black text-gray-900">Li's Industrial Mart</h1>
        <p class="text-gray-400 text-sm mt-2">后台管理系统</p>
      </div>

      <!-- Error Toast -->
      <div
        v-if="errorMsg"
        class="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-xs font-medium text-red-600 text-center"
      >
        {{ errorMsg }}
      </div>

      <!-- Login Form -->
      <div class="space-y-5">
        <!-- Email -->
        <div class="space-y-2">
          <label class="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">管理员账号</label>
          <div class="relative">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <input
              v-model="email"
              class="w-full h-14 bg-gray-50 rounded-2xl pl-12 pr-4 outline-none border-2 border-transparent focus:border-[#F7B500] transition-all text-sm"
              placeholder="admin@ghelite.com"
              type="text"
              @keyup.enter="handleLogin"
            />
          </div>
        </div>

        <!-- Password -->
        <div class="space-y-2">
          <label class="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">登录密码</label>
          <div class="relative">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <input
              v-model="password"
              class="w-full h-14 bg-gray-50 rounded-2xl pl-12 pr-12 outline-none border-2 border-transparent focus:border-[#F7B500] transition-all text-sm"
              placeholder="••••••••"
              :type="showPassword ? 'text' : 'password'"
              @keyup.enter="handleLogin"
            />
            <button
              type="button"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              @click="showPassword = !showPassword"
            >
              <!-- Closed eye: password hidden -->
              <svg v-if="!showPassword" class="text-xl" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
              <!-- Open eye: password visible -->
              <svg v-else class="text-xl" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Captcha -->
        <div class="space-y-2">
          <label class="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">验证码</label>
          <div class="flex items-center gap-3">
            <div class="flex-1 relative">
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              <input
                v-model="captchaInput"
                class="w-full h-14 bg-gray-50 rounded-2xl pl-12 pr-4 outline-none border-2 border-transparent focus:border-[#F7B500] transition-all text-sm uppercase tracking-widest"
                placeholder="输入验证码"
                maxlength="4"
                type="text"
                @keyup.enter="handleLogin"
              />
            </div>
            <div
              class="h-14 min-w-[100px] bg-gray-50 rounded-2xl flex items-center justify-center gap-1 px-3 select-none"
              @click="refreshCaptcha"
              style="cursor: pointer;"
            >
              <span
                v-for="(ch, idx) in captchaCode.split('')"
                :key="idx"
                class="text-lg font-black"
                :style="{
                  color: ['#006B3F', '#F7B500', '#1E3A5F', '#dc2626'][idx],
                  transform: `rotate(${[-8, 5, -5, 8][idx]}deg)`,
                  display: 'inline-block'
                }"
              >{{ ch }}</span>
              <button
                type="button"
                class="ml-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                title="刷新验证码"
                @click.stop="refreshCaptcha"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Remember me & Forgot -->
        <div class="flex items-center justify-between px-1">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="remember"
              class="w-4 h-4 rounded border-gray-300 text-[#006B3F] focus:ring-[#006B3F]"
              type="checkbox"
            />
            <span class="text-xs text-gray-500">记住我</span>
          </label>
          <a class="text-xs text-[#006B3F] font-bold" href="#">忘记密码?</a>
        </div>

        <!-- Login Button -->
        <button
          class="w-full h-14 bg-[#006B3F] text-white rounded-2xl font-bold flex items-center justify-center shadow-lg shadow-green-100 hover:bg-[#005a35] transition-all disabled:opacity-60"
          :disabled="loading"
          @click="handleLogin"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <span v-else>立即登录</span>
        </button>
      </div>

      <!-- Footer -->
      <div class="mt-auto pb-8 text-center">
        <p class="text-[10px] text-gray-400 uppercase tracking-widest">© 2024 Ghana Elite Store Management</p>
        <div class="flex justify-center gap-4 mt-4">
          <router-link class="text-xs text-gray-400 flex items-center gap-1 hover:text-gray-600" to="/">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            返回商城首页
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
