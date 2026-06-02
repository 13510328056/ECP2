<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { formatPrice } from '@/utils/format'

const { t } = useI18n()
const router = useRouter()

const pin = ref('')
const showLoading = ref(false)
const showSuccess = ref(false)
const showFailed = ref(false)
const orderData = ref<any>(null)

const amount = computed(() => orderData.value?.total || 5975)

onMounted(() => {
  const stored = sessionStorage.getItem('pendingOrder')
  if (stored) {
    try {
      orderData.value = JSON.parse(stored)
    } catch {
      // fallback
    }
  }
})

function addPin(num: number) {
  if (pin.value.length >= 4) return
  pin.value += String(num)
  if (pin.value.length === 4) {
    processPayment()
  }
}

function removePin() {
  pin.value = pin.value.slice(0, -1)
}

function processPayment() {
  showLoading.value = true
  setTimeout(() => {
    showLoading.value = false
    const success = Math.random() < 0.8
    if (success) {
      showSuccess.value = true
      if (orderData.value) {
        sessionStorage.setItem('lastOrder', JSON.stringify(orderData.value))
        sessionStorage.removeItem('pendingOrder')
      }
    } else {
      showFailed.value = true
    }
  }, 2000)
}

function retryPayment() {
  pin.value = ''
  showFailed.value = false
}

function goBackToCheckout() {
  router.push('/checkout')
}

function goBack() {
  if (showSuccess.value) {
    router.push('/')
  } else {
    router.push('/checkout')
  }
}

function viewOrderDetail() {
  router.push('/order-confirmation')
}

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="max-w-[480px] mx-auto bg-white h-screen relative flex flex-col overflow-hidden">
    <!-- Header -->
    <header class="p-4 flex items-center justify-between border-b border-gray-50 flex-shrink-0">
      <button @click="goBack" class="hover:opacity-70 transition">
        <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <router-link to="/">
        <img src="/images/logo.png" alt="Li's" class="h-8 w-auto" />
      </router-link>
      <span class="font-bold text-gray-800 text-sm">{{ t('payment.title') }}</span>
      <div class="w-6"></div>
    </header>

    <!-- Payment Info -->
    <div class="p-8 text-center flex-shrink-0">
      <div class="w-16 h-16 bg-yellow-400 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-sm">
        <span class="font-black text-xl text-black">MTN</span>
      </div>
      <p class="text-gray-400 text-sm">{{ t('payment.payTo') }}</p>
      <h2 class="text-4xl font-black text-gray-900 mt-2">{{ formatPrice(amount) }}</h2>
    </div>

    <!-- PIN Entry Screen -->
    <div v-if="!showLoading && !showSuccess" class="flex-1 flex flex-col px-8" id="pin-screen">
      <p class="text-center text-sm font-medium text-gray-600 mb-6">{{ t('payment.enterPin') }}</p>

      <!-- PIN Dot Indicators -->
      <div class="flex justify-center gap-6 mb-12">
        <div
          v-for="i in 4"
          :key="i"
          class="w-3 h-3 rounded-full border-2 transition-all duration-150"
          :class="i <= pin.length ? 'bg-gray-900 border-gray-900' : 'border-gray-300'"
        ></div>
      </div>

      <!-- Number Pad -->
      <div class="grid grid-cols-3 gap-4 mt-auto pb-12">
        <button
          v-for="num in [1, 2, 3, 4, 5, 6, 7, 8, 9]"
          :key="num"
          class="h-[60px] text-2xl font-bold rounded-xl transition-all active:bg-gray-100 active:scale-95 hover:bg-gray-50"
          @click="addPin(num)"
        >
          {{ num }}
        </button>
        <button class="h-[60px] flex items-center justify-center text-sm text-gray-400 rounded-xl hover:bg-gray-50 transition">
          {{ t('payment.forgot') }}
        </button>
        <button
          class="h-[60px] text-2xl font-bold rounded-xl transition-all active:bg-gray-100 active:scale-95 hover:bg-gray-50"
          @click="addPin(0)"
        >
          0
        </button>
        <button
          class="h-[60px] flex items-center justify-center text-gray-400 rounded-xl hover:bg-gray-50 transition"
          @click="removePin"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Processing Screen (Overlay) -->
    <div
      v-if="showLoading"
      class="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 text-center"
    >
      <div class="w-16 h-16 border-4 border-yellow-100 border-t-yellow-400 rounded-full animate-spin mb-6"></div>
      <h3 class="text-lg font-bold text-gray-800">{{ t('payment.processing') }}</h3>
      <p class="text-sm text-gray-400 mt-2">{{ t('payment.processingDesc') }}</p>
    </div>

    <!-- Success Screen (Overlay) -->
    <div
      v-if="showSuccess"
      class="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 text-center"
    >
      <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100 animate-bounce">
        <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 class="text-2xl font-black text-gray-800">{{ t('payment.success') }}</h3>
      <p class="text-sm text-gray-400 mt-2">{{ t('payment.successDesc') }}</p>
      <div class="w-full mt-10 space-y-3">
        <button
          class="w-full py-4 bg-[#006B3F] text-white rounded-2xl font-bold hover:bg-[#005A35] transition"
          @click="viewOrderDetail"
        >
          {{ t('payment.viewOrder') }}
        </button>
        <button
          class="w-full py-4 text-gray-400 font-medium hover:text-gray-600 transition"
          @click="goHome"
        >
          {{ t('payment.backHome') }}
        </button>
      </div>
    </div>

    <!-- Failed Screen (Overlay) -->
    <div
      v-if="showFailed"
      class="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 text-center"
    >
      <div class="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-red-100">
        <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h3 class="text-2xl font-black text-gray-800">{{ t('payment.failure') }}</h3>
      <p class="text-sm text-gray-400 mt-2">{{ t('payment.failureMessage') }}</p>
      <div class="w-full mt-10 space-y-3">
        <button
          class="w-full py-4 bg-[#F7B500] text-black rounded-2xl font-bold hover:bg-[#e0a200] transition"
          @click="retryPayment"
        >
          {{ t('payment.retry') }}
        </button>
        <button
          class="w-full py-4 text-gray-400 font-medium hover:text-gray-600 transition"
          @click="goBackToCheckout"
        >
          {{ t('payment.backToCheckout') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
