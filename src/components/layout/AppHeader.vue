<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const router = useRouter()
const langStore = useLanguageStore()
const cartStore = useCartStore()

const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const isScrolled = ref(false)
const showMobileSearch = ref(false)
const searchQuery = ref('')
const showSuggestions = ref(false)

const hotSearches = ['Drill Bits', 'Work Gloves', 'Safety Helmet', 'Welding Machine', 'Cable Wire', 'Measuring Tape']

const cartBadge = computed(() => {
  const count = cartStore.totalItems
  if (count === 0) return null
  return count > 99 ? '99+' : String(count)
})

function handleScroll() {
  isScrolled.value = window.scrollY > 10
}

function toggleLang() {
  langStore.toggleLocale()
}

function doSearch() {
  showSuggestions.value = false
  if (searchQuery.value.trim()) {
    router.push(`/products?search=${encodeURIComponent(searchQuery.value.trim())}`)
  } else {
    router.push('/products')
  }
}

function searchHot(term: string) {
  searchQuery.value = term
  showSuggestions.value = false
  router.push(`/products?search=${encodeURIComponent(term)}`)
}

function onSearchFocus() {
  showSuggestions.value = true
}

function onSearchBlur() {
  // Delay to allow click on suggestion
  setTimeout(() => { showSuggestions.value = false }, 200)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header
    v-if="!isAdminRoute"
    class="sticky top-0 z-50 bg-white px-3 py-2.5 flex items-center gap-2 border-b border-gray-100 transition-shadow duration-300"
    :class="{ 'shadow-[0_4px_12px_rgba(0,0,0,0.12)]': isScrolled }"
  >
    <!-- Logo -->
    <router-link to="/" class="flex-shrink-0">
      <img
        src="/images/logo.png"
        alt="Li's Industrial Mart"
        class="h-9 w-auto"
      />
    </router-link>

    <!-- Search bar - hidden on smallest screens when not focused -->
    <div
      class="flex-1 relative"
      :class="{ 'hidden': showMobileSearch, 'md:block': true }"
    >
      <div class="relative">
        <!-- Magnifying glass icon -->
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="langStore.locale === 'zh' ? '搜索商品...' : 'Search products...'"
          class="w-full h-9 bg-gray-100 rounded-xl pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#F7B500]/50"
          @focus="onSearchFocus"
          @blur="onSearchBlur"
          @keyup.enter="doSearch"
        />
      </div>

      <!-- Search Suggestions -->
      <div
        v-if="showSuggestions"
        class="absolute top-full left-0 right-0 bg-white rounded-b-2xl shadow-lg border border-gray-100 z-50 overflow-hidden"
      >
        <div class="px-4 py-3 text-sm text-gray-500 border-t border-gray-100">
          <p class="mb-2 font-medium text-gray-700">{{ langStore.locale === 'zh' ? '热门搜索' : 'Hot Searches' }}</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="term in hotSearches"
              :key="term"
              class="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 cursor-pointer hover:bg-[#F7B500]/20 transition"
              @mousedown.prevent="searchHot(term)"
            >
              {{ term }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right actions -->
    <div class="flex items-center gap-2 flex-shrink-0">
      <!-- Language Toggle -->
      <button
        @click="toggleLang"
        class="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-200 transition select-none"
        :title="langStore.locale === 'zh' ? 'Switch to English' : '切换到中文'"
      >
        <span
          class="transition-colors duration-150"
          :class="{ 'text-[#1E3A5F] font-bold': langStore.locale === 'zh' }"
        >中</span>
        <span class="text-gray-300">/</span>
        <span
          class="transition-colors duration-150"
          :class="{ 'text-[#1E3A5F] font-bold': langStore.locale === 'en' }"
        >EN</span>
      </button>

      <!-- Cart Icon with Badge -->
      <router-link to="/cart" class="relative p-1">
        <svg
          class="w-6 h-6 text-gray-700"
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
          class="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none"
        >
          {{ cartBadge }}
        </span>
      </router-link>
    </div>
  </header>
</template>
