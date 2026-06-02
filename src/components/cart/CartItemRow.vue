<script setup lang="ts">
import type { CartItem } from '@/types/cart'
import { formatPrice } from '@/utils/format'
import { computed } from 'vue'
import QuantitySelector from '@/components/ui/QuantitySelector.vue'

const props = defineProps<{
  item: CartItem
}>()

const emit = defineEmits<{
  (e: 'update-quantity', item: CartItem, quantity: number): void
  (e: 'remove', item: CartItem): void
  (e: 'toggle-select', item: CartItem): void
}>()

const isOutOfStock = computed(() => props.item.product.stock === 'out_of_stock')
const itemSubtotal = computed(() => props.item.product.price * props.item.quantity)
</script>

<template>
  <div
    class="bg-white rounded-2xl p-3 flex gap-3 shadow-sm border border-gray-50 transition-all"
    :class="{ 'opacity-60': isOutOfStock }"
  >
    <!-- Checkbox -->
    <div class="flex items-center" @click="emit('toggle-select', item)">
      <div
        class="w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors"
        :class="
          isOutOfStock
            ? 'border-gray-200'
            : item.selectedSku
              ? 'bg-[#F7B500] border-[#F7B500]'
              : 'border-gray-300'
        "
      >
        <svg
          v-if="!isOutOfStock && item.selectedSku"
          class="w-3 h-3 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>

    <!-- Product Image -->
    <div class="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
      <img
        :src="item.product.images[0]"
        :alt="item.product.name"
        class="w-full h-full object-cover"
        loading="lazy"
      />
    </div>

    <!-- Product Info -->
    <div class="flex-1 flex flex-col justify-between min-w-0">
      <div>
        <h3 class="text-sm font-bold text-gray-800 line-clamp-1">
          {{ item.product.name }}
        </h3>
        <p class="text-[10px] text-gray-400 mt-1">
          {{ item.product.category }}
          <template v-if="item.selectedSku">
            / {{ item.selectedSku }}
          </template>
        </p>
        <!-- Out of stock label -->
        <p v-if="isOutOfStock" class="text-[10px] text-red-500 mt-1 font-medium">
          库存不足
        </p>
      </div>

      <div class="flex items-center justify-between mt-1">
        <span class="text-base font-bold text-[#F7B500]">
          {{ formatPrice(item.product.price) }}
        </span>

        <div v-if="!isOutOfStock" class="flex items-center gap-2">
          <div class="scale-90 origin-right">
            <QuantitySelector
              :model-value="item.quantity"
              :min="1"
              :max="item.product.stockCount || 999"
              @update:model-value="emit('update-quantity', item, $event)"
            />
          </div>
        </div>

        <button
          v-else
          class="text-xs text-red-500 font-medium hover:underline"
          @click="emit('remove', item)"
        >
          删除
        </button>
      </div>
    </div>
  </div>
</template>
