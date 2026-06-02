<script setup lang="ts">
import { ref, computed, inject, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { useCartStore } from '@/stores/cart'
import { products } from '@/data/products'
import type { Product } from '@/types'

import ProductCard from '@/components/ui/ProductCard.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import ProductFilter from '@/components/product/ProductFilter.vue'

const { t } = useI18n()
const route = useRoute()
const langStore = useLanguageStore()
const cartStore = useCartStore()

const showToast = inject<(message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) => void>('showToast')

const isScrolled = ref(false)

function handleScroll() {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // Read category from query param on mount
  const catParam = route.query.category as string
  if (catParam) {
    const found = categories.value.find((c) => c.key === catParam)
    if (found) {
      activeCategory.value = found.key
    }
  }
  // Read search query param
  const searchParam = route.query.search as string
  if (searchParam) {
    searchQuery.value = searchParam
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// ── Search ──
const searchQuery = ref('')

// ── Categories ──
interface CategoryTab {
  key: string
  labelZh: string
  labelEn: string
}

const categories = computed<CategoryTab[]>(() => [
  { key: 'all', labelZh: '全部', labelEn: 'All' },
  { key: 'Mining Machinery', labelZh: '矿产机械', labelEn: 'Mining Machinery' },
  { key: 'Safety Equipment', labelZh: '劳保用品', labelEn: 'Safety Equipment' },
  { key: 'Industrial Tools', labelZh: '工业工具', labelEn: 'Industrial Tools' },
  { key: 'Spare Parts', labelZh: '备件配件', labelEn: 'Spare Parts' },
])

const activeCategory = ref('all')

function categoryLabel(cat: CategoryTab): string {
  return langStore.locale === 'en' ? cat.labelEn : cat.labelZh
}

// ── Sort ──
const sortOptions = [
  { value: 'featured', key: 'sortFeatured' as const },
  { value: 'price-asc', key: 'sortPriceLow' as const },
  { value: 'price-desc', key: 'sortPriceHigh' as const },
  { value: 'newest', key: 'sortNewest' as const },
  { value: 'rating', key: 'sortRating' as const },
]

const activeSort = ref('featured')
const showSortDropdown = ref(false)

function selectSort(value: string) {
  activeSort.value = value
  showSortDropdown.value = false
}

function getSortLabel(value: string): string {
  const opt = sortOptions.find((o) => o.value === value)
  if (!opt) return t('productsPage.sortFeatured')
  return t(`productsPage.${opt.key}`)
}

// ── Filter Drawer ──
const showFilterDrawer = ref(false)
const activeFilters = ref<{
  categories: string[]
  priceMin: string
  priceMax: string
  stockStatus: string
  brands: string[]
}>({
  categories: [],
  priceMin: '',
  priceMax: '',
  stockStatus: '',
  brands: [],
})

function onFilterChange(filters: any) {
  activeFilters.value = filters
}

// ── Filtered & Sorted Products ──
const filteredProducts = computed<Product[]>(() => {
  let result = [...products]

  // Search filter
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.nameZh.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q) ||
        p.categoryZh.toLowerCase().includes(q),
    )
  }

  // Category tab filter
  if (activeCategory.value !== 'all') {
    result = result.filter((p) => p.category === activeCategory.value)
  }

  // Advance filter: categories
  if (activeFilters.value.categories.length > 0) {
    result = result.filter((p) =>
      activeFilters.value.categories.some(
        (c) => p.category.toLowerCase() === c.toLowerCase(),
      ),
    )
  }

  // Advance filter: price range
  if (activeFilters.value.priceMin) {
    const min = parseFloat(activeFilters.value.priceMin)
    if (!isNaN(min)) {
      result = result.filter((p) => p.price >= min)
    }
  }
  if (activeFilters.value.priceMax) {
    const max = parseFloat(activeFilters.value.priceMax)
    if (!isNaN(max)) {
      result = result.filter((p) => p.price <= max)
    }
  }

  // Advance filter: stock status
  if (activeFilters.value.stockStatus) {
    result = result.filter((p) => p.stock === activeFilters.value.stockStatus)
  }

  // Advance filter: brands
  if (activeFilters.value.brands.length > 0) {
    result = result.filter((p) =>
      p.brand && activeFilters.value.brands.some(
        (b) => p.brand!.toLowerCase() === b.toLowerCase(),
      ),
    )
  }

  // Sort
  switch (activeSort.value) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'newest':
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    case 'featured':
    default:
      // Keep original order
      break
  }

  return result
})

// ── Pagination (Load More) ──
const pageSize = 4
const visibleCount = ref(pageSize)

const visibleProducts = computed<Product[]>(() => {
  return filteredProducts.value.slice(0, visibleCount.value)
})

const hasMore = computed(() => {
  return visibleCount.value < filteredProducts.value.length
})

function loadMore() {
  visibleCount.value += pageSize
}

// Reset visible count when filters change
function resetPagination() {
  visibleCount.value = pageSize
}

// Watch for filter changes to reset pagination
watch([searchQuery, activeCategory, activeSort, activeFilters], () => {
  resetPagination()
})

// ── Add to Cart ──
function addToCart(product: Product) {
  cartStore.addItem(product)
  if (showToast) {
    showToast(t('product.addToCart') + ' ✅', 'success')
  }
}
</script>

<template>
  <div class="max-w-[480px] mx-auto bg-white min-h-screen relative pb-20 hide-scrollbar">
    <!-- ── Sticky Header ── -->
    <header
      class="sticky top-0 z-50 bg-white px-3 py-2.5 flex items-center gap-2 border-b border-gray-100 transition-shadow duration-300"
      :class="{ 'shadow-[0_4px_12px_rgba(0,0,0,0.12)]': isScrolled }"
    >
      <!-- Back button -->
      <button
        class="flex-shrink-0 p-1 -ml-1 text-gray-700 hover:text-gray-900"
        @click="$router.push('/')"
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
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <!-- Logo -->
      <router-link to="/" class="flex-shrink-0">
        <img
          src="/images/logo.png"
          alt="Li's Industrial Mart"
          class="h-8 w-auto"
        />
      </router-link>

      <!-- Title -->
      <span class="flex-1 text-sm font-bold text-gray-800 text-center">
        {{ t('productsPage.title') }}
      </span>

      <!-- Cart Icon with Badge -->
      <router-link to="/cart" class="relative p-1 flex-shrink-0">
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
          v-if="cartStore.totalItems > 0"
          class="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none"
        >
          {{ cartStore.totalItems > 99 ? '99+' : cartStore.totalItems }}
        </span>
      </router-link>
    </header>

    <!-- ── Search Bar ── -->
    <div class="px-3 pt-3 pb-1">
      <div class="relative">
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
          :placeholder="t('productsPage.searchPlaceholder')"
          class="w-full h-9 bg-gray-100 rounded-xl pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#F7B500]/50"
        />
      </div>
    </div>

    <!-- ── Category Tabs ── -->
    <div class="px-3 pt-2 pb-1 overflow-x-auto hide-scrollbar">
      <div class="flex gap-2 whitespace-nowrap">
        <button
          v-for="cat in categories"
          :key="cat.key"
          class="px-4 py-1.5 rounded-full text-xs font-medium transition-colors border-0 cursor-pointer flex-shrink-0"
          :class="
            activeCategory === cat.key
              ? 'bg-[#F7B500] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          "
          @click="activeCategory = cat.key"
        >
          {{ categoryLabel(cat) }}
        </button>
      </div>
    </div>

    <!-- ── Filter & Sort Bar ── -->
    <div class="px-3 py-2 flex items-center justify-between border-b border-gray-50">
      <!-- Filter button -->
      <button
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors border-0 cursor-pointer"
        @click="showFilterDrawer = true"
      >
        <svg
          class="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="10" y1="18" x2="14" y2="18" />
        </svg>
        {{ t('productsPage.filter') }}
      </button>

      <!-- Sort dropdown -->
      <div class="relative">
        <button
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors border-0 cursor-pointer"
          @click="showSortDropdown = !showSortDropdown"
        >
          <svg
            class="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M11 5h10" />
            <path d="M11 9h7" />
            <path d="M11 13h4" />
            <path d="M3 17h18" />
            <circle cx="5" cy="5" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="7" cy="9" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="9" cy="13" r="1.5" fill="currentColor" stroke="none" />
          </svg>
          {{ getSortLabel(activeSort) }}
          <svg
            class="w-3 h-3 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <!-- Sort dropdown menu -->
        <div
          v-if="showSortDropdown"
          class="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-40 min-w-[180px] overflow-hidden"
        >
          <button
            v-for="opt in sortOptions"
            :key="opt.value"
            class="block w-full text-left px-4 py-2.5 text-xs border-0 cursor-pointer transition-colors"
            :class="
              activeSort === opt.value
                ? 'bg-[#F7B500]/10 text-[#1E3A5F] font-bold'
                : 'text-gray-600 hover:bg-gray-50'
            "
            @click="selectSort(opt.value)"
          >
            {{ t(`productsPage.${opt.key}`) }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── Product Grid ── -->
    <div class="px-3 pt-3 pb-2">
      <!-- Empty state -->
      <div
        v-if="filteredProducts.length === 0"
        class="flex flex-col items-center justify-center py-16 text-center"
      >
        <svg
          class="w-16 h-16 text-gray-300 mb-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
        <p class="text-sm text-gray-500 font-medium">{{ t('productsPage.noResults') }}</p>
        <p class="text-xs text-gray-400 mt-1">{{ t('productsPage.noResultsDesc') }}</p>
        <button
          class="mt-4 px-5 py-2 bg-[#1E3A5F] text-white rounded-lg text-xs font-medium hover:bg-[#152d4a] transition-colors border-0 cursor-pointer"
          @click="searchQuery = ''; activeCategory = 'all'; activeFilters = { categories: [], priceMin: '', priceMax: '', stockStatus: '', brands: [] }; activeSort = 'featured'"
        >
          {{ t('productsPage.clearFilter') }}
        </button>
      </div>

      <!-- Product grid -->
      <div
        v-else
        class="grid grid-cols-2 gap-3 md:grid-cols-4"
      >
        <ProductCard
          v-for="product in visibleProducts"
          :key="product.id"
          :product="product"
          @add-to-cart="addToCart"
        />
      </div>
    </div>

    <!-- ── Load More & Showing Count ── -->
    <div
      v-if="filteredProducts.length > 0"
      class="px-3 pb-4 flex flex-col items-center gap-3"
    >
      <!-- Load More button -->
      <button
        v-if="hasMore"
        class="w-full max-w-[200px] py-2.5 rounded-xl text-xs font-bold text-[#1E3A5F] border-2 border-[#1E3A5F] bg-white hover:bg-[#1E3A5F] hover:text-white transition-colors cursor-pointer"
        @click="loadMore"
      >
        {{ t('productsPage.loadMore') }}
      </button>

      <!-- Showing count -->
      <p class="text-xs text-gray-400">
        {{ t('productsPage.showing', { visible: visibleProducts.length, total: filteredProducts.length }) }}
      </p>
    </div>

    <!-- ── Filter Drawer ── -->
    <ProductFilter
      v-model:show="showFilterDrawer"
      @filter-change="onFilterChange"
    />

    <!-- ── Sort dropdown overlay (close on click outside) ── -->
    <div
      v-if="showSortDropdown"
      class="fixed inset-0 z-30"
      @click="showSortDropdown = false"
    />

    <!-- ── Bottom Navigation ── -->
    <BottomNav />
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
