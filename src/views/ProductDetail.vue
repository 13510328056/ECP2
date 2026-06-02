<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '@/stores/language'
import { useCartStore } from '@/stores/cart'
import { products } from '@/data/products'
import { formatPrice } from '@/utils/format'
import QuantitySelector from '@/components/ui/QuantitySelector.vue'

interface Review {
  id: string
  userName: string
  rating: number
  date: string
  comment: string
}

const mockReviews: Review[] = [
  { id: 'r1', userName: 'Kwame A.', rating: 5, date: '2026-05-15', comment: 'Excellent product quality, fast delivery to Kumasi. Very satisfied with the purchase.' },
  { id: 'r2', userName: 'John M.', rating: 4, date: '2026-05-10', comment: 'Good quality for the price. Works well for our mining operations.' },
  { id: 'r3', userName: 'Sarah O.', rating: 5, date: '2026-04-28', comment: 'Genuine product, exactly as described. Will order again.' },
]

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const langStore = useLanguageStore()
const cartStore = useCartStore()
const showToast = inject<(message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) => void>('showToast')

const productId = computed(() => route.params.id as string)
const product = computed(() => products.find((p) => p.id === productId.value))

const selectedImage = ref(0)
const quantity = ref(1)
const activeTab = ref(0)

// Image zoom modal
const showImageModal = ref(false)
const modalIndex = ref(0)

const tabs = computed(() => [
  { key: 'description', label: t('product.description') },
  { key: 'specs', label: t('product.specs') },
  { key: 'reviews', label: t('product.reviews') },
])

const hasDiscount = computed(() => {
  if (!product.value?.bulkPricing?.length) return false
  return product.value.bulkPricing.some((bp) => bp.discount > 0)
})

const maxDiscount = computed(() => {
  if (!product.value?.bulkPricing?.length) return 0
  return Math.max(...product.value.bulkPricing.map((bp) => bp.discount))
})

const originalPrice = computed(() => {
  if (!product.value || !hasDiscount.value) return null
  return product.value.price * (1 + maxDiscount.value / 100)
})

function goBack() {
  router.push('/')
}

function addToCart() {
  if (!product.value) return
  cartStore.addItem(product.value, quantity.value)
  if (showToast) {
    showToast(t('product.addToCart') + ' ✅', 'success')
  }
}

function buyNow() {
  if (!product.value) return
  cartStore.addItem(product.value, quantity.value)
  router.push('/checkout')
}

function toggleFavorite() {
  if (showToast) {
    showToast(langStore.locale === 'zh' ? '已收藏' : 'Added to favorites', 'info')
  }
}

function contactService() {
  if (showToast) {
    showToast(langStore.locale === 'zh' ? '联系客服: +233 50 123 4567' : 'Customer service: +233 50 123 4567', 'info')
  }
}

function openImageModal(index: number) {
  modalIndex.value = index
  showImageModal.value = true
}

function closeImageModal() {
  showImageModal.value = false
}

function prevImage() {
  if (modalIndex.value > 0) modalIndex.value--
}

function nextImage() {
  if (!product.value) return
  if (modalIndex.value < product.value.images.length - 1) modalIndex.value++
}

const reviewAverage = computed(() => {
  if (mockReviews.length === 0) return 0
  const total = mockReviews.reduce((sum, r) => sum + r.rating, 0)
  return (total / mockReviews.length).toFixed(1)
})

function relativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return langStore.locale === 'zh' ? '今天' : 'Today'
  if (diffDays === 1) return langStore.locale === 'zh' ? '昨天' : 'Yesterday'
  if (diffDays < 7) return langStore.locale === 'zh' ? `${diffDays}天前` : `${diffDays} days ago`
  if (diffDays < 30) return langStore.locale === 'zh' ? `${Math.floor(diffDays / 7)}周前` : `${Math.floor(diffDays / 7)} weeks ago`
  return langStore.locale === 'zh' ? `${Math.floor(diffDays / 30)}个月前` : `${Math.floor(diffDays / 30)} months ago`
}

function getInitials(name: string): string {
  return name.charAt(0)
}

// Star rating display
function renderStars(rating: number): string[] {
  const stars: string[] = []
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) stars.push('full')
    else if (i === Math.ceil(rating) && rating % 1 >= 0.3) stars.push('half')
    else stars.push('empty')
  }
  return stars
}
</script>

<template>
  <div class="max-w-[480px] mx-auto bg-white min-h-screen relative">
    <div v-if="product" class="pb-24 hide-scrollbar">
    <!-- Top Nav -->
    <div class="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-50">
      <button class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition" @click="goBack">
        <svg class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <router-link to="/">
        <img src="/images/logo.png" alt="Li's" class="h-8 w-auto" />
      </router-link>
      <span class="font-bold text-gray-800 text-sm">{{ t('product.detail') }}</span>
      <div class="flex gap-2">
        <button class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition">
          <svg class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Image Gallery -->
    <div class="relative w-full aspect-square bg-gray-100">
      <img
        :src="product.images[selectedImage] || product.images[0]"
        :alt="product.name"
        class="w-full h-full object-cover cursor-pointer"
        @click="openImageModal(selectedImage)"
      />
      <div class="absolute bottom-4 right-4 bg-black/40 text-white text-[10px] px-2 py-1 rounded-full">
        {{ selectedImage + 1 }}/{{ product.images.length }}
      </div>
      <!-- Thumbnails -->
      <div v-if="product.images.length > 1" class="absolute bottom-4 left-4 flex gap-2">
        <button
          v-for="(img, idx) in product.images"
          :key="idx"
          class="w-8 h-8 rounded-lg overflow-hidden border-2 transition"
          :class="selectedImage === idx ? 'border-[#F7B500]' : 'border-white/60'"
          @click="selectedImage = idx"
        >
          <img :src="img" alt="" class="w-full h-full object-cover" />
        </button>
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-baseline gap-2 flex-wrap">
          <span class="text-3xl font-bold text-[#F7B500]">{{ formatPrice(product.price) }}</span>
          <span v-if="originalPrice" class="text-gray-400 line-through text-sm">{{ formatPrice(originalPrice) }}</span>
          <span
            v-if="hasDiscount"
            class="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded font-bold"
          >
            {{ maxDiscount }}% OFF
          </span>
        </div>
        <div class="flex items-center gap-1">
          <svg class="w-5 h-5 text-[#F7B500]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span class="text-gray-800 text-sm font-bold">{{ product.rating }}</span>
        </div>
      </div>
      <h1 class="text-lg font-bold mt-2 text-gray-800 leading-tight">
        {{ langStore.locale === 'zh' ? product.nameZh : product.name }}
      </h1>
      <p class="text-gray-400 text-xs mt-2">
        {{ t('product.sold') }} {{ product.reviewCount }} {{ t('product.reviewCount') }} | {{ t('product.fromWarehouse') }}
      </p>
    </div>

    <!-- SKU / Spec Selection -->
    <div class="px-4 py-3 border-t border-gray-100">
      <h3 class="text-sm font-bold text-gray-800 mb-3">{{ t('product.sku') }}: {{ product.id.toUpperCase() }}</h3>

      <!-- Specifications as selectable options -->
      <div
        v-for="(value, key) in (langStore.locale === 'zh' ? product.specificationsZh : product.specifications)"
        :key="key"
        class="mb-4"
      >
        <h3 class="text-sm font-bold text-gray-800 mb-3">{{ key }}</h3>
        <div class="flex gap-3 flex-wrap">
          <span class="px-4 py-2 rounded-lg border-2 border-[#F7B500] bg-orange-50 text-xs font-medium">
            {{ value }}
          </span>
        </div>
      </div>

      <h3 class="text-sm font-bold text-gray-800 mb-3">{{ t('product.quantity') }}</h3>
      <div class="flex items-center gap-4">
        <QuantitySelector v-model="quantity" :min="product.minOrderQuantity" :max="product.stockCount" />
        <span class="text-xs text-gray-400">{{ t('product.stock') }}: {{ product.stockCount }} {{ t('product.inStock' ).toLowerCase() }}</span>
      </div>

      <!-- Bulk Pricing Section -->
      <div v-if="product.bulkPricing && product.bulkPricing.length > 0" class="mt-5 bg-amber-50 rounded-2xl p-4 border border-amber-100">
        <div class="flex items-center gap-2 mb-3">
          <svg class="w-5 h-5 text-[#F7B500]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clip-rule="evenodd" />
          </svg>
          <h3 class="text-sm font-bold text-gray-800">{{ t('bulkPricing.title') }}</h3>
        </div>
        <table class="w-full text-xs">
          <thead>
            <tr class="text-gray-500 border-b border-amber-200">
              <th class="py-2 text-left font-medium">{{ t('bulkPricing.quantity') }}</th>
              <th class="py-2 text-center font-medium">{{ t('bulkPricing.discount') }}</th>
              <th class="py-2 text-right font-medium">{{ t('bulkPricing.unitPrice') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(bp, idx) in product.bulkPricing" :key="idx" class="border-b border-amber-100 last:border-0">
              <td class="py-2 text-left font-bold text-gray-800">{{ t('product.qty') }} ≥ {{ bp.quantity }}</td>
              <td class="py-2 text-center">
                <span class="inline-block bg-[#F7B500] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{{ bp.discount }}% OFF</span>
              </td>
              <td class="py-2 text-right font-bold text-[#F7B500]">{{ formatPrice(product.price * (1 - bp.discount / 100)) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Min Order Quantity Info -->
      <div v-if="product.minOrderQuantity > 1" class="mt-3 text-xs text-gray-400 flex items-center gap-1">
        <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ t('bulkPricing.moqValue', { qty: product.minOrderQuantity }) }}
      </div>
    </div>

    <!-- Tabs: Description / Specifications / Reviews -->
    <div class="mt-4">
      <div class="flex border-b border-gray-100">
        <button
          v-for="(tab, idx) in tabs"
          :key="idx"
          class="flex-1 py-3 text-sm transition-colors"
          :class="activeTab === idx ? 'border-b-2 border-[#F7B500] text-[#F7B500] font-bold' : 'text-gray-400'"
          @click="activeTab = idx"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content: Description -->
      <div v-if="activeTab === 0" class="p-4">
        <p class="text-sm text-gray-600 leading-relaxed">
          {{ langStore.locale === 'zh' ? product.descriptionZh : product.description }}
        </p>
        <div v-if="product.applicationScenarios.length" class="mt-4">
          <h4 class="text-sm font-bold text-gray-800 mb-2">{{ t('product.applicationScenarios') }}</h4>
          <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li v-for="(scenario, idx) in product.applicationScenarios" :key="idx">
              {{ scenario }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Tab Content: Specifications -->
      <div v-if="activeTab === 1" class="p-4">
        <table class="w-full text-sm">
          <tbody>
            <tr
              v-for="(value, key) in (langStore.locale === 'zh' ? product.specificationsZh : product.specifications)"
              :key="key"
              class="border-b border-gray-50"
            >
              <td class="py-2.5 text-gray-500 w-1/3">{{ key }}</td>
              <td class="py-2.5 text-gray-800 font-medium">{{ value }}</td>
            </tr>
            <tr class="border-b border-gray-50">
              <td class="py-2.5 text-gray-500">{{ t('product.shippingInfo') }}</td>
              <td class="py-2.5 text-gray-800 font-medium">
                {{ t('product.weight') }}: {{ product.shippingInfo.weight }}{{ product.shippingInfo.dimensions ? ' | ' + t('product.dimensions') + ': ' + product.shippingInfo.dimensions : '' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Tab Content: Reviews -->
      <div v-if="activeTab === 2" class="p-4">
        <!-- Average Rating Summary -->
        <div class="bg-amber-50 rounded-2xl p-4 mb-4 flex items-center gap-4">
          <div class="text-center flex-shrink-0">
            <span class="text-4xl font-black text-[#F7B500]">{{ reviewAverage }}</span>
            <span class="text-[10px] text-gray-400 block">{{ mockReviews.length }} {{ t('product.reviewCount', { count: mockReviews.length }) }}</span>
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-0.5 mb-1">
              <svg v-for="s in 5" :key="s" class="w-4 h-4" :class="s <= Math.round(Number(reviewAverage)) ? 'text-[#F7B500]' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <p class="text-xs text-gray-500">{{ langStore.locale === 'zh' ? '客户综合评价' : 'Customer reviews' }}</p>
          </div>
        </div>

        <!-- Review Cards -->
        <div v-for="review in mockReviews" :key="review.id" class="flex items-start gap-3 mb-4 pb-4 border-b border-gray-50 last:border-0 last:mb-0 last:pb-0">
          <div class="w-10 h-10 rounded-full bg-[#1E3A5F] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {{ getInitials(review.userName) }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-gray-800">{{ review.userName }}</span>
              <span class="text-[10px] text-gray-400">{{ relativeDate(review.date) }}</span>
            </div>
            <div class="flex items-center gap-0.5 mt-1">
              <svg v-for="s in 5" :key="s" class="w-3.5 h-3.5" :class="s <= review.rating ? 'text-[#F7B500]' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <p class="text-sm text-gray-600 mt-1.5 leading-relaxed">{{ review.comment }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Fixed Bottom Action Bar -->
    <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-3 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div class="flex gap-4 px-2">
        <button class="flex flex-col items-center gap-1 text-gray-400 hover:text-red-400 transition" @click="toggleFavorite">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span class="text-[9px]">{{ t('product.favorite') }}</span>
        </button>
        <button class="flex flex-col items-center gap-1 text-gray-400 hover:text-[#1E3A5F] transition" @click="contactService">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span class="text-[9px]">{{ t('product.customerService') }}</span>
        </button>
      </div>
      <button
        class="flex-1 h-12 bg-[#006B3F] text-white rounded-xl font-bold text-sm hover:bg-[#005A35] transition"
        @click="addToCart"
      >
        {{ t('product.addToCart') }}
      </button>
      <button
        class="flex-1 h-12 bg-[#F7B500] text-black rounded-xl font-bold text-sm hover:bg-[#e0a200] transition"
        @click="buyNow"
      >
        {{ t('product.buyNow') }}
      </button>
    </div>

    <!-- Image Zoom Modal -->
    <Teleport to="body" v-if="showImageModal">
      <div class="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center" @click="closeImageModal">
        <button class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition z-10" @click.stop="closeImageModal">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button v-if="modalIndex > 0" class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition z-10" @click.stop="prevImage">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button v-if="product && modalIndex < product.images.length - 1" class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition z-10" @click.stop="nextImage">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <img v-if="product" :src="product.images[modalIndex]" class="max-w-[90vw] max-h-[90vh] object-contain select-none" @click.stop draggable="false" />
        <div v-if="product" class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-4 py-2 rounded-full">
          {{ modalIndex + 1 }}/{{ product.images.length }}
        </div>
      </div>
    </Teleport>
    </div>  <!-- end v-if="product" -->

    <!-- Not Found -->
    <div v-else class="flex flex-col items-center justify-center p-8 min-h-screen">
      <svg class="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <p class="text-gray-500 text-lg font-bold">{{ t('errors.notFound') }}</p>
      <router-link to="/" class="mt-4 bg-[#1E3A5F] text-white px-6 py-2 rounded-lg text-sm font-medium">
        {{ t('errors.goHome') }}
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
