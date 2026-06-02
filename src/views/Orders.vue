<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { useLanguageStore } from '@/stores/language'
import { orders as mockOrders } from '@/data/orders'
import { formatDate, formatPrice } from '@/utils/format'
import { useOrderStore } from '@/stores/orders'
import BottomNav from '@/components/layout/BottomNav.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import type { OrderStatus } from '@/types/order'

const orderStore = useOrderStore()

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const langStore = useLanguageStore()
const showToast = inject<(message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) => void>('showToast')

const loading = ref(false)
const PAGE_SIZE = 10
const visibleCount = ref(PAGE_SIZE)

// Merge mock orders + persisted orders, dedup by id
const userOrders = computed(() => {
  if (!userStore.userEmail) return []
  const userEmail = userStore.userEmail.toLowerCase()

  // Filter mock orders by email
  const matched = mockOrders.filter((o) => {
    const shippingEmail = o.shippingInfo.email?.toLowerCase() || ''
    return shippingEmail === userEmail
  })

  // Persisted orders belong to the current user (created via checkout)
  const persisted = orderStore.orders

  // Dedup by id, persisted overrides mock
  const seen = new Set<string>()
  const merged: (typeof mockOrders[0])[] = []

  for (const o of [...persisted, ...matched]) {
    if (!seen.has(o.id)) {
      seen.add(o.id)
      merged.push(o)
    }
  }

  return merged
})

const visibleOrders = computed(() => {
  return userOrders.value.slice(0, visibleCount.value)
})

const hasMore = computed(() => {
  return visibleCount.value < userOrders.value.length
})

function loadMore() {
  visibleCount.value += PAGE_SIZE
}

// Status badge colors
const statusBadge = (status: OrderStatus): { color: string; bg: string } => {
  const map: Record<OrderStatus, { color: string; bg: string }> = {
    pending_payment: { color: '#D97706', bg: '#FEF3C7' },
    paid: { color: '#2563EB', bg: '#DBEAFE' },
    processing: { color: '#7C3AED', bg: '#EDE9FE' },
    shipped: { color: '#0891B2', bg: '#CFFAFE' },
    delivered: { color: '#16A34A', bg: '#DCFCE7' },
    completed: { color: '#16A34A', bg: '#DCFCE7' },
    cancelled: { color: '#DC2626', bg: '#FEE2E2' },
    refunding: { color: '#EA580C', bg: '#FED7AA' },
    refunded: { color: '#6B7280', bg: '#F3F4F6' },
  }
  return map[status] || { color: '#6B7280', bg: '#F3F4F6' }
}
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
      <h1 class="text-lg font-bold text-gray-800">{{ t('orders.title') }}</h1>
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
    <div v-else class="p-4 space-y-3">
      <!-- Loading -->
      <LoadingSkeleton v-if="loading" type="card" :count="3" />

      <!-- Empty State -->
      <EmptyState
        v-else-if="userOrders.length === 0"
        icon="box"
        :title="t('orders.empty')"
        :description="t('orders.emptyMessage')"
        :actionText="t('orders.startShopping')"
        actionLink="/products"
      />

      <!-- Order List -->
      <template v-else>
        <div
          v-for="order in visibleOrders"
          :key="order.id"
          class="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 cursor-pointer hover:border-gray-200 transition"
          @click="router.push('/order/' + order.id)"
        >
          <!-- Header: Order Number + Status -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2 min-w-0">
              <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span class="text-xs font-mono text-gray-500 truncate">{{ order.orderNumber }}</span>
            </div>
            <span
              class="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
              :style="{ color: statusBadge(order.status).color, backgroundColor: statusBadge(order.status).bg }"
            >
              {{ t('order.statuses.' + order.status) }}
            </span>
          </div>

          <!-- Product Thumbnails & Info -->
          <div class="flex items-center gap-3">
            <div class="flex -space-x-2">
              <div
                v-for="(item, i) in order.items.slice(0, 3)"
                :key="i"
                class="w-10 h-10 rounded-lg border border-gray-100 bg-white overflow-hidden flex-shrink-0"
                :style="{ zIndex: 3 - i }"
              >
                <img
                  :src="item.product.images?.[0] || (item.product as any).image || ''"
                  :alt="langStore.locale === 'zh' ? item.product.nameZh : item.product.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-if="order.items.length > 3"
                class="w-10 h-10 rounded-lg border border-gray-100 bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 flex-shrink-0"
              >
                +{{ order.items.length - 3 }}
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs text-gray-500">
                {{ order.items.length }} {{ t('order.item') }}(s)
              </p>
              <p class="text-[11px] text-gray-400 mt-0.5">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div class="text-right flex-shrink-0">
              <p class="text-sm font-bold text-[#1E3A5F]">{{ formatPrice(order.total) }}</p>
            </div>
          </div>
        </div>

        <!-- Load More -->
        <button
          v-if="hasMore"
          class="w-full py-3 text-xs text-[#006B3F] font-bold hover:underline text-center bg-white rounded-2xl shadow-sm border border-gray-50 transition hover:bg-gray-50"
          @click="loadMore"
        >
          {{ t('orders.loadMore') }} ({{ userOrders.length - visibleCount }})
        </button>
      </template>
    </div>

    <BottomNav />
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
