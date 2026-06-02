<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const langStore = useLanguageStore()
const cartStore = useCartStore()

const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const cartBadge = computed(() => {
  const count = cartStore.totalItems
  if (count === 0) return null
  return count > 99 ? '99+' : String(count)
})

interface Tab {
  name: string
  path: string
  labelZh: string
  labelEn: string
}

const tabs: Tab[] = [
  { name: 'home', path: '/', labelZh: '首页', labelEn: 'Home' },
  { name: 'categories', path: '/products', labelZh: '分类', labelEn: 'Categories' },
  { name: 'cart', path: '/cart', labelZh: '购物车', labelEn: 'Cart' },
  { name: 'account', path: '/account', labelZh: '我的', labelEn: 'Account' },
]

function isActive(tab: Tab): boolean {
  if (tab.path === '/') return route.path === '/'
  return route.path.startsWith(tab.path)
}

function tabLabel(tab: Tab): string {
  return langStore.locale === 'en' ? tab.labelEn : tab.labelZh
}
</script>

<template>
  <nav
    v-if="!isAdminRoute"
    class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-100 px-2 py-1.5 flex items-center justify-around z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
  >
    <!-- Home Tab -->
    <router-link
      :to="tabs[0].path"
      class="flex flex-col items-center gap-0.5 no-underline"
      :class="isActive(tabs[0]) ? 'text-[#F7B500]' : 'text-gray-400'"
    >
      <svg
        class="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
      <span class="text-[10px] font-medium">{{ tabLabel(tabs[0]) }}</span>
    </router-link>

    <!-- Categories Tab -->
    <router-link
      :to="tabs[1].path"
      class="flex flex-col items-center gap-0.5 no-underline"
      :class="isActive(tabs[1]) ? 'text-[#F7B500]' : 'text-gray-400'"
    >
      <svg
        class="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
      <span class="text-[10px] font-medium">{{ tabLabel(tabs[1]) }}</span>
    </router-link>

    <!-- Cart Tab -->
    <router-link
      :to="tabs[2].path"
      class="flex flex-col items-center gap-0.5 relative no-underline"
      :class="isActive(tabs[2]) ? 'text-[#F7B500]' : 'text-gray-400'"
    >
      <div class="relative">
        <svg
          class="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        <span
          v-if="cartBadge"
          class="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold leading-none"
        >
          {{ cartBadge }}
        </span>
      </div>
      <span class="text-[10px] font-medium">{{ tabLabel(tabs[2]) }}</span>
    </router-link>

    <!-- Account Tab -->
    <router-link
      :to="tabs[3].path"
      class="flex flex-col items-center gap-0.5 no-underline"
      :class="isActive(tabs[3]) ? 'text-[#F7B500]' : 'text-gray-400'"
    >
      <svg
        class="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
      <span class="text-[10px] font-medium">{{ tabLabel(tabs[3]) }}</span>
    </router-link>
  </nav>
</template>
