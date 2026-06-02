<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '@/stores/language'
import { useUserStore } from '@/stores/user'
import { formatDate, formatPrice } from '@/utils/format'
import { orders as allOrders } from '@/data/orders'
import { useOrderStore } from '@/stores/orders'
import BottomNav from '@/components/layout/BottomNav.vue'
import type { OrderStatus } from '@/types/order'

const { t } = useI18n()
const router = useRouter()
const langStore = useLanguageStore()
const userStore = useUserStore()
const showToast = inject<(message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) => void>('showToast')

const orderStore = useOrderStore()

// User avatar initials
const initials = computed(() => {
  if (!userStore.userName) return '?'
  const parts = userStore.userName.split(' ').filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return userStore.userName.substring(0, 2).toUpperCase()
})

// Filter orders by current user's email (mock + persisted)
const userOrders = computed(() => {
  if (!userStore.userEmail) return []
  const userEmail = userStore.userEmail.toLowerCase()

  // Filter mock orders by email
  const matched = allOrders.filter((o) => {
    const shippingEmail = o.shippingInfo.email?.toLowerCase() || ''
    return shippingEmail === userEmail
  })

  // Persisted orders (created via checkout)
  const persisted = orderStore.orders

  // Dedup by id, persisted overrides mock
  const seen = new Set<string>()
  const merged: (typeof allOrders[0])[] = []

  for (const o of [...persisted, ...matched]) {
    if (!seen.has(o.id)) {
      seen.add(o.id)
      merged.push(o)
    }
  }

  return merged
})

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

// Quick links
const quickLinks = computed(() => [
  {
    label: t('account.orders'),
    icon: 'orders',
    path: '/orders',
  },
  {
    label: t('account.addresses'),
    icon: 'address',
    path: '/addresses',
  },
  {
    label: t('account.contact'),
    icon: 'contact',
    path: '/contact',
  },
])

function handleLogout() {
  userStore.logout()
  if (showToast) showToast(t('common.success'), 'success')
  router.replace('/')
}
</script>

<template>
  <div class="max-w-[480px] mx-auto bg-gray-50 min-h-screen relative pb-24 hide-scrollbar">
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
      <h1 class="text-lg font-bold text-gray-800">{{ t('account.title') }}</h1>
    </header>

    <!-- Not Logged In State -->
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

    <!-- Logged In State -->
    <div v-else class="p-4 space-y-4">
      <!-- Profile Card -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
        <div class="flex items-center gap-4">
          <!-- Avatar Circle with Initials -->
          <div class="w-16 h-16 rounded-full bg-[#1E3A5F] flex items-center justify-center flex-shrink-0">
            <span class="text-white text-xl font-bold">{{ initials }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-lg font-bold text-gray-800 truncate">{{ userStore.userName }}</h2>
            <p class="text-sm text-gray-400 truncate">{{ userStore.userEmail }}</p>
            <p class="text-sm text-gray-400 truncate">{{ userStore.userPhone }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ t('account.memberSince') }}: 2026-01-15</p>
          </div>
          <button class="text-gray-300 hover:text-gray-500 transition" @click="router.push('/profile')">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Order History -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-gray-800 flex items-center gap-2">
            <svg class="w-5 h-5 text-[#006B3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {{ t('account.orders') }}
          </h3>
          <span class="text-xs text-gray-400">{{ userOrders.length }} {{ t('order.order') }}</span>
        </div>

        <!-- No Orders -->
        <div v-if="userOrders.length === 0" class="text-center py-6">
          <svg class="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="text-sm text-gray-400">{{ t('account.noOrders') }}</p>
        </div>

        <!-- Order Cards -->
        <div v-else class="space-y-3">
          <div
            v-for="order in userOrders.slice(0, 5)"
            :key="order.id"
            class="border border-gray-100 rounded-xl p-3 hover:border-gray-200 transition cursor-pointer"
            @click="router.push('/order/' + order.id)"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-mono text-gray-500 truncate max-w-[140px]">{{ order.orderNumber }}</span>
              <span
                class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                :style="{ color: statusBadge(order.status).color, backgroundColor: statusBadge(order.status).bg }"
              >
                {{ t('order.statuses.' + order.status) }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-400">{{ formatDate(order.createdAt) }}</span>
              <span class="text-xs text-gray-400">{{ order.items.length }} {{ t('order.item') }}(s)</span>
            </div>
            <div class="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-gray-50">
              <span class="text-xs text-gray-500">{{ t('order.totalAmount') }}</span>
              <span class="text-sm font-bold text-[#1E3A5F]">{{ formatPrice(order.total) }}</span>
            </div>
          </div>

          <!-- View All Orders -->
          <button
            v-if="userOrders.length > 5"
            class="w-full py-2 text-xs text-[#006B3F] font-bold hover:underline text-center"
            @click="router.push('/orders')"
          >
            {{ t('common.viewAll') }} ({{ userOrders.length }})
          </button>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="bg-white rounded-2xl p-2 shadow-sm border border-gray-50">
        <router-link
          v-for="(link, index) in quickLinks"
          :key="index"
          :to="link.path"
          class="flex items-center gap-3 px-3 py-3.5 hover:bg-gray-50 transition rounded-xl no-underline"
          :class="{ 'border-b border-gray-50': index < quickLinks.length - 1 }"
        >
          <!-- Orders Icon -->
          <svg v-if="link.icon === 'orders'" class="w-5 h-5 text-[#1E3A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <!-- Address Icon -->
          <svg v-else-if="link.icon === 'address'" class="w-5 h-5 text-[#1E3A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <!-- Contact Icon -->
          <svg v-else class="w-5 h-5 text-[#1E3A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span class="flex-1 text-sm font-medium text-gray-700">{{ link.label }}</span>
          <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>

      <!-- Logout Button -->
      <button
        class="w-full h-12 bg-white text-red-500 rounded-2xl font-bold text-sm border border-gray-100 shadow-sm hover:bg-red-50 transition flex items-center justify-center gap-2"
        @click="handleLogout"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        {{ t('account.logout') }}
      </button>
    </div>

    <!-- Bottom Navigation -->
    <BottomNav />
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
