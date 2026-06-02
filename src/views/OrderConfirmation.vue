<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/utils/format'

const { t } = useI18n()
const router = useRouter()
const cartStore = useCartStore()

const orderData = ref<any>(null)

onMounted(() => {
  const stored = sessionStorage.getItem('lastOrder')
  if (stored) {
    try {
      orderData.value = JSON.parse(stored)
    } catch {
      // fallback
    }
  }
  // Clear cart on successful order
  cartStore.clearCart()
})

const orderNumber = computed(() => orderData.value?.orderNumber || 'GH88293401')
const total = computed(() => orderData.value?.total || 5975)
const paymentMethod = computed(() => orderData.value?.paymentMethod || 'momo')
const shippingCity = computed(() => orderData.value?.shippingInfo?.city || 'Accra')

const paymentMethodName = computed(() => {
  if (paymentMethod.value === 'momo') return t('checkout.momo')
  return t('checkout.cod')
})

function viewOrderDetail() {
  router.push('/order/ord-001')
}

function continueShopping() {
  router.push('/')
}
</script>

<template>
  <div class="max-w-[480px] mx-auto bg-white min-h-screen flex flex-col">
    <!-- Header with Logo -->
    <header class="bg-white px-4 py-3 flex items-center shadow-sm">
      <router-link to="/">
        <img src="/images/logo.png" alt="Li's Industrial Mart" class="h-8 w-auto" />
      </router-link>
    </header>

    <!-- Success Banner -->
    <div class="bg-[#006B3F] pt-8 pb-12 px-8 text-center relative overflow-hidden">
      <!-- Decorative circles -->
      <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
      <div class="absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full"></div>
      <div class="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center mb-6 shadow-xl">
        <svg class="w-10 h-10 text-[#006B3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 class="text-2xl font-black text-white">{{ t('orderConfirmation.success') }}</h1>
      <p class="text-white/70 text-sm mt-2">{{ t('orderConfirmation.desc') }}</p>
    </div>

    <!-- Order Summary Card -->
    <div class="px-6 -mt-6 z-10">
      <div class="bg-white rounded-3xl shadow-xl p-6 border border-gray-50">
        <div class="flex justify-between items-center pb-4 border-b border-gray-100">
          <span class="text-gray-400 text-xs uppercase font-bold tracking-widest">{{ t('orderConfirmation.orderNumber') }}</span>
          <span class="text-gray-800 font-bold">{{ orderNumber }}</span>
        </div>
        <div class="py-6 space-y-4">
          <div class="flex justify-between">
            <span class="text-gray-400 text-sm">{{ t('orderConfirmation.paymentAmount') }}</span>
            <span class="text-gray-800 font-black text-base">{{ formatPrice(total) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400 text-sm">{{ t('orderConfirmation.paymentMethod') }}</span>
            <span class="text-gray-800 font-medium text-sm">{{ paymentMethodName }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400 text-sm">{{ t('orderConfirmation.shippingMethod') }}</span>
            <span class="text-gray-800 font-medium text-sm">{{ t('orderConfirmation.standardShipping') }} ({{ shippingCity }})</span>
          </div>
        </div>

        <!-- Estimated Delivery -->
        <div class="bg-orange-50 rounded-2xl p-4 flex gap-3">
          <svg class="w-5 h-5 text-[#F7B500] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <div>
            <h4 class="text-xs font-bold text-gray-800">{{ t('orderConfirmation.estimatedDelivery') }}</h4>
            <p class="text-[10px] text-gray-500 mt-1">{{ t('orderConfirmation.estimatedDesc') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Next Steps -->
    <div class="p-8 space-y-4 mt-auto pb-12">
      <button
        class="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-center hover:bg-gray-800 transition"
        @click="viewOrderDetail"
      >
        {{ t('orderConfirmation.viewDetail') }}
      </button>
      <button
        class="w-full py-4 bg-white border-2 border-gray-100 text-gray-800 rounded-2xl font-bold text-center hover:bg-gray-50 transition"
        @click="continueShopping"
      >
        {{ t('orderConfirmation.continueShopping') }}
      </button>
    </div>

    <!-- Quick Help -->
    <div class="px-8 pb-8 text-center">
      <p class="text-[10px] text-gray-400">{{ t('orderConfirmation.help') }}</p>
      <div class="flex justify-center gap-4 mt-2">
        <a href="https://wa.me/233501234567" target="_blank" rel="noopener noreferrer" class="hover:scale-110 transition">
          <svg class="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.9.528 3.68 1.436 5.2L2 22l4.8-1.436A10 10 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18a8 8 0 01-4.08-1.12l-.3-.18-2.85.85.85-2.85-.18-.3A8 8 0 1112 20z" />
          </svg>
        </a>
        <a href="tel:+233501234567" class="hover:scale-110 transition">
          <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
