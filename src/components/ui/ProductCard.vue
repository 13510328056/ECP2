<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import type { Product } from '@/types'
import { formatPrice, getStockStatusText } from '@/utils/format'

const props = withDefaults(defineProps<{
  product: Product
  showAddToCart?: boolean
}>(), {
  showAddToCart: true,
})

const emit = defineEmits<{
  (e: 'add-to-cart', product: Product): void
}>()

const router = useRouter()
const langStore = useLanguageStore()

const displayName = computed(() =>
  langStore.locale === 'zh' ? props.product.nameZh : props.product.name
)

const stockInfo = computed(() => getStockStatusText(props.product.stock))

const stockBadgeColors: Record<string, string> = {
  in_stock: 'bg-green-100 text-green-700',
  low_stock: 'bg-orange-100 text-orange-600',
  out_of_stock: 'bg-red-100 text-red-600',
}

const hasDiscount = computed(() => {
  if (!props.product.bulkPricing?.length) return false
  return props.product.bulkPricing.some((bp) => bp.discount > 0)
})

function handleClick() {
  router.push(`/product/${props.product.id}`)
}

function handleAddToCart(event: MouseEvent) {
  event.stopPropagation()
  emit('add-to-cart', props.product)
}
</script>

<template>
  <div
    class="product-card bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer flex flex-col"
    @click="handleClick"
  >
    <!-- Product Image -->
    <div class="relative aspect-square bg-gray-100 overflow-hidden">
      <img
        :src="product.images[0]"
        :alt="product.name"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <!-- Discount badge -->
      <span
        v-if="hasDiscount"
        class="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold"
      >
        -{{ Math.max(...product.bulkPricing.map((bp) => bp.discount)) }}%
      </span>
    </div>

    <!-- Card Body -->
    <div class="p-3 flex flex-col flex-1">
      <!-- Product Name (bilingual) -->
      <h4 class="text-sm font-bold text-gray-800 line-clamp-2 leading-tight min-h-[2.5rem]">
        {{ displayName }}
      </h4>

      <!-- Rating -->
      <div class="flex items-center gap-1 mt-1.5">
        <template v-for="i in 5" :key="i">
          <svg
            v-if="i <= Math.floor(product.rating)"
            class="w-3 h-3 text-[#F7B500]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <svg
            v-else-if="i === Math.ceil(product.rating) && product.rating % 1 >= 0.3"
            class="w-3 h-3 text-[#F7B500]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <defs>
              <linearGradient :id="'half-' + product.id">
                <stop offset="50%" stop-color="#F7B500" />
                <stop offset="50%" stop-color="#d1d5db" />
              </linearGradient>
            </defs>
            <path
              :fill="'url(#half-' + product.id + ')'"
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
          <svg
            v-else
            class="w-3 h-3 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </template>
        <span class="text-gray-400 text-[10px] ml-0.5">
          {{ product.rating }} ({{ product.reviewCount }})
        </span>
      </div>

      <!-- Price -->
      <div class="flex items-center gap-1.5 mt-2">
        <span class="text-[#F7B500] font-bold text-base">{{ formatPrice(product.price) }}</span>
        <span
          v-if="hasDiscount"
          class="text-gray-400 text-[10px] line-through"
        >
          {{ formatPrice(product.price * (1 + Math.max(...product.bulkPricing.map((bp) => bp.discount)) / 100)) }}
        </span>
      </div>

      <!-- Stock Status -->
      <div class="flex items-center gap-2 mt-1.5">
        <span
          class="text-[10px] px-1.5 py-0.5 rounded font-medium"
          :class="stockBadgeColors[product.stock]"
        >
          {{ langStore.locale === 'zh' ? stockInfo.textZh : stockInfo.text }}
        </span>
        <span
          v-if="product.minOrderQuantity > 1"
          class="text-[10px] text-gray-400"
        >
          Min: {{ product.minOrderQuantity }}
        </span>
      </div>

      <!-- Add to Cart Button -->
      <button
        v-if="showAddToCart"
        class="mt-auto pt-2 w-full py-1.5 rounded-lg text-xs font-medium text-white bg-[#1E3A5F] hover:bg-[#152d4a] active:bg-[#0f1f33] transition-colors"
        @click="handleAddToCart"
      >
        {{ langStore.locale === 'zh' ? '加入购物车' : 'Add to Cart' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  transition: transform 0.2s, box-shadow 0.2s;
}
.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}
.product-card:active {
  transform: translateY(-1px);
}
</style>
