<script setup lang="ts">
import { reactive, ref, computed } from 'vue'

interface FilterState {
  categories: string[]
  priceMin: string
  priceMax: string
  stockStatus: string
  brands: string[]
}

const emit = defineEmits<{
  (e: 'filter-change', filters: FilterState): void
  (e: 'close'): void
}>()

const show = defineModel<boolean>('show')

// Categories from store (dynamically editable)
import { useCategoryStore } from '@/stores/categories'
const categoryStore = useCategoryStore()
const categories = computed(() =>
  categoryStore.tree.map((c) => ({ label: c.name, value: c.name }))
)

const stockOptions = [
  { label: 'All', value: '' },
  { label: 'In Stock', value: 'in_stock' },
  { label: 'Low Stock', value: 'low_stock' },
  { label: 'Out of Stock', value: 'out_of_stock' },
]

const brands = [
  { label: 'Caterpillar', value: 'Caterpillar' },
  { label: 'Bosch', value: 'Bosch' },
  { label: '3M', value: '3M' },
  { label: 'Stanley', value: 'Stanley' },
  { label: 'Makita', value: 'Makita' },
]

const filters = reactive<FilterState>({
  categories: [],
  priceMin: '',
  priceMax: '',
  stockStatus: '',
  brands: [],
})

function toggleCategory(value: string) {
  const idx = filters.categories.indexOf(value)
  if (idx >= 0) {
    filters.categories.splice(idx, 1)
  } else {
    filters.categories.push(value)
  }
}

function toggleBrand(value: string) {
  const idx = filters.brands.indexOf(value)
  if (idx >= 0) {
    filters.brands.splice(idx, 1)
  } else {
    filters.brands.push(value)
  }
}

function clearAll() {
  filters.categories = []
  filters.priceMin = ''
  filters.priceMax = ''
  filters.stockStatus = ''
  filters.brands = []
}

function apply() {
  emit('filter-change', { ...filters })
  show.value = false
}

function close() {
  show.value = false
}
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <div
      v-if="show"
      class="fixed inset-0 bg-black/40 z-50 transition-opacity"
      @click="close"
    />
    <!-- Drawer -->
    <div
      v-if="show"
      class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white rounded-t-2xl z-50 max-h-[85vh] overflow-y-auto shadow-xl transition-transform duration-300 ease-out"
    >
      <!-- Handle bar -->
      <div class="flex items-center justify-center pt-3 pb-1">
        <div class="w-10 h-1 bg-gray-300 rounded-full" />
      </div>

      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <h3 class="text-lg font-bold text-gray-800">Filters</h3>
        <button class="text-sm text-[#1E3A5F] font-medium hover:underline" @click="clearAll">
          Clear All
        </button>
      </div>

      <div class="px-5 py-4 space-y-6">
        <!-- Category -->
        <div>
          <h4 class="text-sm font-bold text-gray-800 mb-3">Category</h4>
          <div class="space-y-2.5">
            <label
              v-for="cat in categories"
              :key="cat.value"
              class="flex items-center gap-3 cursor-pointer"
            >
              <div
                class="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors"
                :class="
                  filters.categories.includes(cat.value)
                    ? 'bg-[#1E3A5F] border-[#1E3A5F]'
                    : 'border-gray-300'
                "
              >
                <svg
                  v-if="filters.categories.includes(cat.value)"
                  class="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span class="text-sm text-gray-700">{{ cat.label }}</span>
            </label>
          </div>
        </div>

        <!-- Price Range -->
        <div>
          <h4 class="text-sm font-bold text-gray-800 mb-3">Price Range</h4>
          <div class="flex items-center gap-3">
            <input
              v-model="filters.priceMin"
              type="number"
              placeholder="Min"
              class="flex-1 h-10 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-[#F7B500] transition-colors"
            />
            <span class="text-gray-400 text-sm">-</span>
            <input
              v-model="filters.priceMax"
              type="number"
              placeholder="Max"
              class="flex-1 h-10 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-[#F7B500] transition-colors"
            />
          </div>
        </div>

        <!-- Stock Status -->
        <div>
          <h4 class="text-sm font-bold text-gray-800 mb-3">Stock Status</h4>
          <div class="space-y-2.5">
            <label
              v-for="opt in stockOptions"
              :key="opt.value"
              class="flex items-center gap-3 cursor-pointer"
            >
              <div
                class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                :class="
                  filters.stockStatus === opt.value
                    ? 'border-[#1E3A5F]'
                    : 'border-gray-300'
                "
              >
                <div
                  v-if="filters.stockStatus === opt.value"
                  class="w-2.5 h-2.5 rounded-full bg-[#1E3A5F]"
                />
              </div>
              <span class="text-sm text-gray-700">{{ opt.label }}</span>
            </label>
          </div>
        </div>

        <!-- Brand -->
        <div>
          <h4 class="text-sm font-bold text-gray-800 mb-3">Brand</h4>
          <div class="space-y-2.5">
            <label
              v-for="brand in brands"
              :key="brand.value"
              class="flex items-center gap-3 cursor-pointer"
            >
              <div
                class="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors"
                :class="
                  filters.brands.includes(brand.value)
                    ? 'bg-[#1E3A5F] border-[#1E3A5F]'
                    : 'border-gray-300'
                "
              >
                <svg
                  v-if="filters.brands.includes(brand.value)"
                  class="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span class="text-sm text-gray-700">{{ brand.label }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4 flex gap-3">
        <button
          class="flex-1 h-12 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          @click="clearAll"
        >
          Clear All
        </button>
        <button
          class="flex-1 h-12 bg-[#1E3A5F] text-white rounded-xl text-sm font-bold hover:bg-[#152d4a] transition-colors"
          @click="apply"
        >
          Apply
        </button>
      </div>
    </div>
  </Teleport>
</template>
