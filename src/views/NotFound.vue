<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-6">
    <div class="text-center max-w-sm">
      <!-- 404 Icon -->
      <div class="mb-8">
        <svg class="mx-auto w-32 h-32 text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
          <line x1="9" y1="9" x2="9.01" y2="9"/>
          <line x1="15" y1="9" x2="15.01" y2="9"/>
        </svg>
      </div>

      <h1 class="text-6xl font-black text-gray-800 mb-2">404</h1>
      <p class="text-sm text-gray-400 mb-8">页面未找到 / Page Not Found</p>
      <p class="text-xs text-gray-300 mb-8 leading-relaxed">
        您访问的页面不存在，可能已被移除或地址输入有误。<br>
        The page you are looking for does not exist or has been moved.
      </p>

      <button
        class="w-full h-12 bg-[#006B3F] text-white rounded-xl font-bold text-sm hover:bg-[#005A36] transition-colors shadow-lg shadow-green-900/20"
        @click="goHome"
      >
        返回首页 / Back to Home
      </button>
    </div>
  </div>
</template>
