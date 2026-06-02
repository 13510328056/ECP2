<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

const props = withDefaults(
  defineProps<{
    pageTitle?: string
    pageSubtitle?: string
  }>(),
  {
    pageTitle: '管理中心',
    pageSubtitle: '',
  }
)

const route = useRoute()
const adminStore = useAdminStore()

interface AdminTab {
  name: string
  path: string
  label: string
  icon: string
}

const tabs: AdminTab[] = [
  { name: 'dashboard', path: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { name: 'products', path: '/admin/products', label: 'Products', icon: 'products' },
  { name: 'orders', path: '/admin/orders', label: 'Orders', icon: 'orders' },
  { name: 'categories', path: '/admin/categories', label: 'Categories', icon: 'categories' },
]

function isTabActive(tab: AdminTab): boolean {
  return route.path === tab.path || route.path.startsWith(tab.path + '/')
}
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc]">
    <!-- ===== Admin Header ===== -->
    <header
      class="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm"
    >
      <div class="mx-auto w-full max-w-[480px] px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <!-- Logo -->
          <router-link to="/admin/dashboard">
            <img
              src="/images/logo.png"
              alt="Li's Industrial Mart"
              class="h-9 w-auto"
            />
          </router-link>
          <div>
            <h1 class="text-sm font-black text-gray-800 leading-tight">
              {{ pageTitle }}
            </h1>
            <p
              v-if="pageSubtitle"
              class="text-[10px] text-gray-400 leading-tight mt-0.5"
            >
              {{ pageSubtitle }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <!-- Notification Bell -->
          <button
            class="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center relative hover:bg-gray-100 transition"
            aria-label="Notifications"
          >
            <svg
              class="w-5 h-5 text-gray-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span
              class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"
            ></span>
          </button>

          <!-- Admin Avatar -->
          <div
            class="w-9 h-9 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-200 flex items-center justify-center"
          >
            <svg
              class="w-5 h-5 text-gray-500"
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
          </div>
        </div>
      </div>

      <!-- ===== Admin Tab Navigation ===== -->
      <div class="mx-auto w-full max-w-[480px] px-4">
        <nav class="flex -mb-px">
          <router-link
            v-for="tab in tabs"
            :key="tab.name"
            :to="tab.path"
            class="flex-1 text-center py-2.5 text-[11px] font-bold border-b-2 transition-colors no-underline"
            :class="
              isTabActive(tab)
                ? 'text-[#006B3F] border-[#006B3F]'
                : 'text-gray-400 border-transparent hover:text-gray-600 hover:border-gray-300'
            "
          >
            {{ tab.label }}
          </router-link>
        </nav>
      </div>
    </header>

    <!-- ===== Page Content ===== -->
    <main class="mx-auto w-full max-w-[480px] px-4 py-4 pb-24">
      <slot />
    </main>
  </div>
</template>
