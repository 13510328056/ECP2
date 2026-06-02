<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '@/stores/language'
import { orders as ordersData } from '@/data/orders'
import { formatPrice, formatDate } from '@/utils/format'

import BottomNav from '@/components/layout/BottomNav.vue'

const orders = ref([...ordersData])
const showToast = inject<(message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) => void>('showToast')

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const langStore = useLanguageStore()

const orderId = computed(() => route.params.id as string)
const order = computed(() => orders.value.find((o) => o.id === orderId.value))

const statusLabel = computed(() => {
  if (!order.value) return ''
  const key = order.value.status
  return t(`order.statuses.${key}`)
})

const statusIcon = computed(() => {
  if (!order.value) return ''
  switch (order.value.status) {
    case 'pending_payment': return 'clock'
    case 'paid':
    case 'processing': return 'package'
    case 'shipped': return 'truck'
    case 'delivered':
    case 'completed': return 'check-circle'
    case 'cancelled': return 'x-circle'
    default: return 'package'
  }
})

interface TimelineStep {
  label: string
  description: string
  completed: boolean
  current: boolean
}

const timeline = computed<TimelineStep[]>(() => {
  if (!order.value) return []
  const status = order.value.status
  const createdAt = order.value.createdAt

  const steps: TimelineStep[] = [
    {
      label: t('orderDetail.submitted'),
      description: `${formatDate(createdAt)} - ${t('orderDetail.paidVia')}`,
      completed: true,
      current: false,
    },
    {
      label: t('orderDetail.paid'),
      description: order.value.paymentStatus === 'paid' ? `${formatDate(createdAt)} - ${t('checkout.momo')}` : '',
      completed: ['paid', 'processing', 'shipped', 'delivered', 'completed'].includes(status),
      current: status === 'paid' || status === 'pending_payment',
    },
    {
      label: t('orderDetail.packaging'),
      description: t('orderDetail.pendingShipment'),
      completed: ['processing', 'shipped', 'delivered', 'completed'].includes(status),
      current: status === 'processing',
    },
    {
      label: t('orderDetail.shipped'),
      description: order.value.logistics?.shippedAt ? formatDate(order.value.logistics.shippedAt) : '',
      completed: ['shipped', 'delivered', 'completed'].includes(status),
      current: status === 'shipped',
    },
    {
      label: t('orderDetail.delivered'),
      description: '',
      completed: ['delivered', 'completed'].includes(status),
      current: status === 'delivered' || status === 'completed',
    },
  ]
  return steps
})

function confirmReceived() {
  const o = orders.value.find(item => item.id === orderId.value)
  if (o) {
    o.status = 'completed'
    if (showToast) showToast(t('orderDetail.confirmed'), 'success')
  }
}

function goBack() {
  router.push('/')
}
</script>

<template>
  <div v-if="order" class="max-w-[480px] mx-auto bg-gray-50 min-h-screen relative pb-20 hide-scrollbar">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white px-4 py-4 flex items-center gap-4 shadow-sm">
      <button @click="goBack" class="hover:opacity-70 transition">
        <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <router-link to="/">
        <img src="/images/logo.png" alt="Li's" class="h-8 w-auto" />
      </router-link>
      <h1 class="text-lg font-bold text-gray-800">{{ t('orderDetail.title') }}</h1>
    </header>

    <!-- Order Status -->
    <div class="bg-white p-6 border-b border-gray-100">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-black text-gray-800">{{ statusLabel }}</h2>
          <p class="text-xs text-gray-400 mt-1">
            {{ t('orderDetail.orderNo') }}: {{ order.orderNumber }} | {{ formatDate(order.createdAt) }}
          </p>
        </div>
        <div class="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
          <!-- Package icon -->
          <svg class="w-6 h-6 text-[#F7B500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
      </div>

      <!-- Timeline -->
      <div class="space-y-2 ml-2">
        <div
          v-for="(step, idx) in timeline"
          :key="idx"
          class="flex gap-4 relative"
        >
          <!-- Dot -->
          <div
            class="w-2.5 h-2.5 rounded-full mt-1.5 z-10 flex-shrink-0"
            :class="step.completed ? 'bg-[#006B3F]' : step.current ? 'bg-[#F7B500]' : 'bg-gray-300'"
          ></div>
          <!-- Line (except last) -->
          <div
            v-if="idx < timeline.length - 1"
            class="absolute left-[4px] top-[14px] w-[2px] h-[34px]"
            :class="step.completed ? 'bg-[#006B3F]' : 'bg-gray-200'"
          ></div>
          <!-- Content -->
          <div class="flex-1 pb-5">
            <p
              class="text-sm font-bold"
              :class="step.completed ? 'text-[#006B3F]' : step.current ? 'text-[#F7B500]' : 'text-gray-400'"
            >
              {{ step.label }}
            </p>
            <p v-if="step.description" class="text-[10px] text-gray-400 mt-0.5">{{ step.description }}</p>
          </div>
        </div>
      </div>

      <!-- Confirm Received Button -->
      <button
        v-if="order.status === 'shipped'"
        class="w-full mt-4 py-3 bg-[#10B981] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#059669] transition shadow-lg shadow-green-100"
        @click="confirmReceived"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        {{ t('orderDetail.confirmReceived') }}
      </button>
    </div>

    <!-- Shipping Info -->
    <div class="p-4">
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{{ t('order.shippingAddress') }}</h3>
        <div class="flex gap-3">
          <svg class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div>
            <p class="text-sm font-bold text-gray-800">
              {{ order.shippingInfo.fullName }}
              <span class="font-normal text-gray-400 ml-2">{{ order.shippingInfo.phone }}</span>
            </p>
            <p class="text-xs text-gray-500 mt-1">
              {{ order.shippingInfo.addressLine1 }}
              {{ order.shippingInfo.addressLine2 ? ', ' + order.shippingInfo.addressLine2 : '' }}
              {{ order.shippingInfo.city ? ', ' + order.shippingInfo.city : '' }}, {{ order.shippingInfo.region ? order.shippingInfo.region + ',' : '' }} Ghana
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Product List -->
    <div class="px-4">
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{{ t('order.items') }}</h3>
        <div class="space-y-4">
          <div v-for="item in order.items" :key="item.productId" class="flex gap-3">
            <img
              :src="item.product.images[0]"
              :alt="item.product.name"
              class="w-16 h-16 rounded-lg object-cover bg-gray-50 flex-shrink-0"
            />
            <div class="flex-1 min-w-0">
              <h4 class="text-xs font-bold text-gray-800 line-clamp-1">
                {{ langStore.locale === 'zh' ? item.product.nameZh : item.product.name }}
              </h4>
              <p v-if="item.selectedSku" class="text-[10px] text-gray-400 mt-0.5">{{ item.selectedSku }}</p>
              <div class="flex justify-between items-center mt-2">
                <span class="text-sm font-bold text-gray-800">{{ formatPrice(item.product.price) }}</span>
                <span class="text-xs text-gray-400">x{{ item.quantity }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Billing Details -->
    <div class="p-4 pb-24">
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 space-y-3">
        <div class="flex justify-between text-xs">
          <span class="text-gray-400">{{ t('orderDetail.subtotal') }}</span>
          <span class="text-gray-800">{{ formatPrice(order.subtotal) }}</span>
        </div>
        <div class="flex justify-between text-xs">
          <span class="text-gray-400">{{ t('orderDetail.shippingFee') }}</span>
          <span class="text-gray-800">{{ formatPrice(order.shippingCost) }}</span>
        </div>
        <div class="pt-3 border-t border-dashed border-gray-100 flex justify-between items-center">
          <span class="font-bold text-gray-800">{{ t('orderDetail.total') }}</span>
          <span class="text-xl font-black text-[#F7B500]">{{ formatPrice(order.total) }}</span>
        </div>
      </div>
    </div>

    <!-- Bottom Tab Navigation -->
    <BottomNav />
  </div>

  <!-- Not Found -->
  <div v-else class="max-w-[480px] mx-auto bg-white min-h-screen flex flex-col items-center justify-center p-8">
    <svg class="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    <p class="text-gray-500 text-lg font-bold">{{ t('errors.notFound') }}</p>
    <router-link to="/" class="mt-4 bg-[#1E3A5F] text-white px-6 py-2 rounded-lg text-sm font-medium">
      {{ t('errors.goHome') }}
    </router-link>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
