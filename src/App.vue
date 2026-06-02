<script setup lang="ts">
import { computed, ref, watch, provide } from 'vue'
import { useRoute } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { i18n } from '@/i18n'

const route = useRoute()
const languageStore = useLanguageStore()

// Sync language store locale to <html> lang attribute and vue-i18n
watch(
  () => languageStore.locale,
  (locale) => {
    document.documentElement.setAttribute('lang', locale)
    i18n.global.locale.value = locale
  },
  { immediate: true },
)

// Hide WhatsApp button on admin pages
const showWhatsApp = computed(() => !route.path.startsWith('/admin'))

// ---- Global Toast System ----
type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastState {
  show: boolean
  message: string
  type: ToastType
}

const toast = ref<ToastState>({
  show: false,
  message: '',
  type: 'info',
})

let toastTimer: ReturnType<typeof setTimeout> | null = null

function showToast(message: string, type: ToastType = 'info', duration = 3000) {
  if (toastTimer) {
    clearTimeout(toastTimer)
  }
  toast.value = { show: true, message, type }
  toastTimer = setTimeout(() => {
    toast.value.show = false
  }, duration)
}

function hideToast() {
  if (toastTimer) {
    clearTimeout(toastTimer)
    toastTimer = null
  }
  toast.value.show = false
}

// Provide toast so child components can use inject('showToast')
provide<(message: string, type?: ToastType, duration?: number) => void>('showToast', showToast)
provide<() => void>('hideToast', hideToast)
</script>

<template>
  <router-view v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" />
    </Transition>
  </router-view>

  <!-- WhatsApp Floating Button -->
  <a
    v-if="showWhatsApp"
    href="https://wa.me/233241234567"
    target="_blank"
    class="whatsapp-float"
    rel="noopener noreferrer"
    aria-label="Contact us on WhatsApp"
  >
    <div class="whatsapp-btn">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="28"
        height="28"
        fill="#ffffff"
      >
        <path
          d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
        />
        <path
          d="M12 2C6.48 2 2 6.48 2 12c0 1.9.528 3.68 1.436 5.2L2 22l4.8-1.436A10 10 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18a8 8 0 01-4.08-1.12l-.3-.18-2.85.85.85-2.85-.18-.3A8 8 0 1112 20z"
        />
      </svg>
    </div>
  </a>

  <!-- Global Toast Notification -->
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="'toast-' + toast.type">
        <span class="toast-icon">
          <svg
            v-if="toast.type === 'success'"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <svg
            v-else-if="toast.type === 'error'"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <svg
            v-else-if="toast.type === 'warning'"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </span>
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close" @click="hideToast" aria-label="Close notification">
          &times;
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* WhatsApp Floating Button */
.whatsapp-float {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
}

.whatsapp-btn {
  width: 56px;
  height: 56px;
  background-color: #25d366;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
  animation: whatsappPulse 2s infinite;
  transition: transform 0.2s, box-shadow 0.2s;
}

.whatsapp-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.6);
}

@keyframes whatsappPulse {
  0% {
    box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
  }
  50% {
    box-shadow: 0 4px 20px rgba(37, 211, 102, 0.7);
  }
  100% {
    box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
  }
}

/* Global Toast */
.toast {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 300px;
  max-width: 500px;
  padding: 14px 20px;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.5;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  color: #fff;
}

.toast-success {
  background-color: #10b981;
}

.toast-error {
  background-color: #ef4444;
}

.toast-warning {
  background-color: #f59e0b;
  color: #1f2937;
}

.toast-info {
  background-color: #3b82f6;
}

.toast-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.toast-message {
  flex: 1;
}

.toast-close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: inherit;
  font-size: 20px;
  cursor: pointer;
  opacity: 0.7;
  padding: 0 0 0 8px;
  line-height: 1;
}

.toast-close:hover {
  opacity: 1;
}

/* Toast transition */
.toast-enter-active {
  animation: toastIn 0.3s ease-out;
}

.toast-leave-active {
  animation: toastOut 0.2s ease-in;
}

@keyframes toastIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes toastOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
}
</style>
