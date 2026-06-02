<script setup lang="ts">
import { ref, computed, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '@/stores/language'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/utils/format'

import BottomNav from '@/components/layout/BottomNav.vue'

const { t } = useI18n()
const router = useRouter()
const langStore = useLanguageStore()
const cartStore = useCartStore()
const showToast = inject<(message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) => void>('showToast')

const isEditing = ref(false)
const showStaleWarning = ref(false)

onMounted(() => {
  const staleItems = cartStore.items.filter(
    (item) => item.product.stockCount === 0 || item.product.stock === 'out_of_stock'
  )
  if (staleItems.length > 0) {
    staleItems.forEach((item) => {
      cartStore.removeItem(item.productId)
      selectedIds.value.delete(item.productId)
    })
    showStaleWarning.value = true
    if (showToast) {
      showToast(
        langStore.locale === 'zh' ? '部分商品已缺货，已自动移除' : 'Some items are out of stock and have been removed',
        'warning'
      )
    }
  }
})
const selectedIds = ref<Set<string>>(new Set())

// Coupon state
const couponCode = ref('')
const discount = ref(0)
const couponApplied = ref(false)
const showCouponInput = ref(false)

const allSelected = computed(() => {
  return cartStore.items.length > 0 && cartStore.items.every((item) => selectedIds.value.has(item.productId))
})

const selectedItems = computed(() => {
  return cartStore.items.filter((item) => selectedIds.value.has(item.productId))
})

const selectedTotal = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
})

const selectedCount = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

const discountAmount = computed(() => {
  return selectedTotal.value * discount.value
})

const discountedTotal = computed(() => {
  return selectedTotal.value - discountAmount.value
})

function toggleSelect(productId: string) {
  if (selectedIds.value.has(productId)) {
    selectedIds.value.delete(productId)
  } else {
    selectedIds.value.add(productId)
  }
}

function toggleSelectAll() {
  if (allSelected.value) {
    selectedIds.value.clear()
  } else {
    cartStore.items.forEach((item) => selectedIds.value.add(item.productId))
  }
}

function increment(item: any) {
  cartStore.updateQuantity(item.productId, item.quantity + 1)
}

function decrement(item: any) {
  if (item.quantity <= 1) return
  cartStore.updateQuantity(item.productId, item.quantity - 1)
}

function removeItem(productId: string) {
  if (showToast) {
    showToast(t('cart.deleteConfirm'), 'warning')
  }
  cartStore.removeItem(productId)
  selectedIds.value.delete(productId)
}

// Coupon functions
function applyCoupon() {
  if (couponCode.value.trim().toUpperCase() === 'SAVE10') {
    discount.value = 0.1
    couponApplied.value = true
    if (showToast) showToast(langStore.locale === 'zh' ? '优惠码已应用，享受10%折扣' : 'Coupon applied! 10% off', 'success')
  } else {
    if (showToast) showToast(langStore.locale === 'zh' ? '无效优惠码' : 'Invalid coupon code', 'warning')
  }
}

function clearCoupon() {
  couponCode.value = ''
  discount.value = 0
  couponApplied.value = false
  if (showToast) showToast(langStore.locale === 'zh' ? '优惠码已清除' : 'Coupon cleared', 'info')
}

function goToCheckout() {
  if (selectedItems.value.length === 0) {
    if (showToast) showToast(langStore.locale === 'zh' ? '请选择商品' : 'Please select items', 'warning')
    return
  }
  router.push('/checkout')
}

function goHome() {
  router.push('/')
}

// Initialize all selected
cartStore.items.forEach((item) => selectedIds.value.add(item.productId))
</script>

<template>
  <div class="max-w-[480px] mx-auto bg-gray-50 min-h-screen relative pb-32 hide-scrollbar">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white px-4 py-4 flex items-center justify-between shadow-sm">
      <div class="flex items-center gap-2">
        <router-link to="/">
          <img src="/images/logo.png" alt="Li's" class="h-8 w-auto" />
        </router-link>
        <h1 class="text-xl font-bold text-gray-800">
          {{ t('cart.title') }} ({{ cartStore.totalItems }})
        </h1>
      </div>
      <button
        class="text-sm font-medium transition"
        :class="isEditing ? 'text-[#006B3F]' : 'text-gray-500'"
        @click="isEditing = !isEditing"
      >
        {{ isEditing ? t('cart.done') : t('cart.edit') }}
      </button>
    </header>

    <!-- Stale Items Warning Banner -->
    <div
      v-if="showStaleWarning"
      class="mx-4 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3"
    >
      <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p class="text-sm text-red-700 font-medium">
        {{ langStore.locale === 'zh' ? '部分商品已缺货，已自动移除' : 'Some items are out of stock and have been removed' }}
      </p>
      <button class="ml-auto text-red-500 hover:text-red-700 transition" @click="showStaleWarning = false">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Cart Items -->
    <div v-if="cartStore.items.length > 0" class="p-4 space-y-4">
      <div
        v-for="item in cartStore.items"
        :key="item.productId"
        class="bg-white rounded-2xl p-3 flex gap-3 shadow-sm border border-gray-50"
        :class="{ 'opacity-60': item.product.stock === 'out_of_stock' }"
      >
        <!-- Checkbox -->
        <div class="flex items-center">
          <button
            class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition"
            :class="selectedIds.has(item.productId) ? 'border-[#F7B500] bg-[#F7B500]' : 'border-gray-300'"
            @click="toggleSelect(item.productId)"
          >
            <svg v-if="selectedIds.has(item.productId)" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>

        <!-- Product Image -->
        <div class="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
          <img
            :src="item.product.images[0]"
            :alt="item.product.name"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Product Info -->
        <div class="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <h3 class="text-sm font-bold text-gray-800 line-clamp-1">
              {{ langStore.locale === 'zh' ? item.product.nameZh : item.product.name }}
            </h3>
            <p v-if="item.selectedSku" class="text-[10px] text-gray-400 mt-1">
              {{ t('product.specs') }}: {{ item.selectedSku }}
            </p>
            <!-- Out of stock tag -->
            <p v-if="item.product.stock === 'out_of_stock'" class="text-[10px] text-red-500 mt-1 font-medium">
              {{ t('cart.outOfStock') }}
            </p>
          </div>
          <div class="flex items-center justify-between mt-1">
            <span class="text-lg font-bold text-[#F7B500]">{{ formatPrice(item.product.price) }}</span>
            <div v-if="item.product.stock !== 'out_of_stock'" class="flex items-center border border-gray-100 rounded-lg overflow-hidden scale-90">
              <button
                class="w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-gray-100 transition"
                :disabled="item.quantity <= 1"
                :class="{ 'opacity-40 cursor-not-allowed': item.quantity <= 1 }"
                @click="decrement(item)"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
              </button>
              <span class="w-8 text-center text-xs font-bold">{{ item.quantity }}</span>
              <button
                class="w-8 h-8 flex items-center justify-center bg-gray-50 text-[#F7B500] hover:bg-gray-100 transition"
                :disabled="item.quantity >= item.product.stockCount"
                :class="{ 'opacity-40 cursor-not-allowed': item.quantity >= item.product.stockCount }"
                @click="increment(item)"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <button
              v-if="isEditing || item.product.stock === 'out_of_stock'"
              class="text-xs text-red-500 font-medium hover:text-red-700 transition"
              @click="removeItem(item.productId)"
            >
              {{ t('cart.delete') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Coupon Section -->
    <div v-if="cartStore.items.length > 0" class="px-4 pb-3">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
        <button
          class="w-full px-4 py-3 flex items-center justify-between text-sm"
          @click="showCouponInput = !showCouponInput"
        >
          <span class="flex items-center gap-2 text-gray-600 font-medium">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {{ langStore.locale === 'zh' ? '输入优惠码' : 'Enter Coupon Code' }}
          </span>
          <svg
            class="w-4 h-4 text-gray-400 transition-transform duration-200"
            :class="showCouponInput ? 'rotate-180' : ''"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-if="showCouponInput" class="px-4 pb-4">
          <div class="flex gap-2">
            <input
              v-model="couponCode"
              :placeholder="langStore.locale === 'zh' ? '请输入优惠码' : 'Enter coupon code'"
              class="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F7B500] transition"
              :disabled="couponApplied"
            />
            <button
              v-if="!couponApplied"
              class="px-6 py-2.5 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold hover:bg-[#162d4a] transition disabled:opacity-50"
              :disabled="!couponCode.trim()"
              @click="applyCoupon"
            >
              {{ langStore.locale === 'zh' ? '应用' : 'Apply' }}
            </button>
            <button
              v-if="couponApplied"
              class="px-4 py-2.5 bg-red-100 text-red-600 rounded-lg text-sm font-bold hover:bg-red-200 transition"
              @click="clearCoupon"
            >
              {{ langStore.locale === 'zh' ? '清除' : 'Clear' }}
            </button>
          </div>
          <p v-if="couponApplied" class="text-xs text-green-600 mt-2 flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ langStore.locale === 'zh' ? '优惠码 SAVE10 已应用，享10%折扣' : 'Coupon SAVE10 applied - 10% off' }}
          </p>
          <p v-if="!couponApplied && !couponCode.trim()" class="text-[10px] text-gray-400 mt-2">
            {{ langStore.locale === 'zh' ? '提示：输入 SAVE10 可享10%折扣' : 'Hint: Enter SAVE10 for 10% off' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-20 px-10 text-center">
      <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
        </svg>
      </div>
      <h3 class="text-lg font-bold text-gray-800">{{ t('cart.empty') }}</h3>
      <p class="text-sm text-gray-400 mt-2">{{ t('cart.emptyDesc') }}</p>
      <button
        class="mt-6 bg-[#F7B500] text-black px-8 py-3 rounded-xl font-bold hover:bg-[#e0a200] transition"
        @click="goHome"
      >
        {{ t('cart.goShopping') }}
      </button>
    </div>

    <!-- Fixed Bottom Checkout Bar -->
    <div
      v-if="cartStore.items.length > 0"
      class="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-100 px-4 py-3 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]"
    >
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <button
            class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition"
            :class="allSelected ? 'border-[#F7B500] bg-[#F7B500]' : 'border-gray-300'"
            @click="toggleSelectAll"
          >
            <svg v-if="allSelected" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <span class="text-sm font-medium text-gray-600">{{ t('cart.selectAll') }}</span>
        </div>
        <div class="flex flex-col items-end gap-0.5">
          <div v-if="couponApplied" class="flex items-center gap-1">
            <span class="text-[10px] text-red-500 line-through">{{ formatPrice(selectedTotal) }}</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-xs text-gray-400">{{ t('cart.total') }}:</span>
            <span class="text-xl font-black text-[#F7B500]">{{ formatPrice(couponApplied ? discountedTotal : selectedTotal) }}</span>
          </div>
          <span v-if="couponApplied" class="text-[10px] text-green-600">
            {{ langStore.locale === 'zh' ? `已优惠 ${formatPrice(discountAmount)}` : `Saved ${formatPrice(discountAmount)}` }}
          </span>
        </div>
      </div>
      <button
        class="w-full h-12 bg-[#006B3F] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#005A35] transition"
        @click="goToCheckout"
      >
        {{ t('cart.checkout') }} ({{ selectedCount }})
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Bottom Tab Navigation -->
    <BottomNav />
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
