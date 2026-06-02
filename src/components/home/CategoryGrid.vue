<script setup lang="ts">
import { useRouter } from 'vue-router'

export interface Category {
  id: string
  name: string
  icon: string
  iconBg: string
}

withDefaults(defineProps<{
  categories?: Category[]
}>(), {
  categories: () => [
    { id: 'clothing', name: 'Clothing', icon: 'clothing', iconBg: 'bg-blue-50' },
    { id: 'electronics', name: 'Electronics', icon: 'electronics', iconBg: 'bg-purple-50' },
    { id: 'food', name: 'Food', icon: 'food', iconBg: 'bg-green-50' },
    { id: 'home', name: 'Home', icon: 'home', iconBg: 'bg-yellow-50' },
    { id: 'beauty', name: 'Beauty', icon: 'beauty', iconBg: 'bg-pink-50' },
    { id: 'baby', name: 'Baby', icon: 'baby', iconBg: 'bg-orange-50' },
    { id: 'auto-parts', name: 'Auto Parts', icon: 'auto', iconBg: 'bg-teal-50' },
    { id: 'industrial', name: 'Industrial', icon: 'industrial', iconBg: 'bg-gray-100' },
  ],
})

const router = useRouter()

function navigateToCategory(category: Category) {
  router.push({ path: '/products', query: { category: category.name } })
}

function getCategoryIcon(category: Category): string {
  // Return the SVG path or icon identifier
  return category.icon
}
</script>

<template>
  <section class="px-3 pt-5 pb-2">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-bold text-base text-gray-800">Shop by Category</h3>
      <a
        class="text-xs text-[#1E3A5F] font-medium hover:underline cursor-pointer"
        @click="router.push('/products')"
      >
        View All
      </a>
    </div>
    <div class="grid grid-cols-4 gap-3">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="cat-card flex flex-col items-center gap-1.5 bg-white rounded-xl py-3 shadow-sm cursor-pointer"
        @click="navigateToCategory(cat)"
      >
        <div
          class="w-11 h-11 rounded-2xl flex items-center justify-center"
          :class="cat.iconBg"
        >
          <!-- Clothing icon -->
          <svg
            v-if="cat.icon === 'clothing'"
            class="w-5 h-5 text-[#1E3A5F]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M7 4L3 8v4l2 2v6h4v-4h6v4h4v-6l2-2V8l-4-4H7z"
            />
          </svg>
          <!-- Electronics icon -->
          <svg
            v-else-if="cat.icon === 'electronics'"
            class="w-5 h-5 text-[#1E3A5F]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="5" y="2" width="14" height="20" rx="2" stroke-width="1.5" stroke="currentColor" fill="none" />
            <line x1="12" y1="18" x2="12" y2="19" stroke-width="1.5" stroke="currentColor" />
          </svg>
          <!-- Food icon -->
          <svg
            v-else-if="cat.icon === 'food'"
            class="w-5 h-5 text-[#1E3A5F]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M12 2C8 2 4 6 4 10c0 5 8 12 8 12s8-7 8-12c0-4-4-8-8-8z"
            />
          </svg>
          <!-- Home icon -->
          <svg
            v-else-if="cat.icon === 'home'"
            class="w-5 h-5 text-[#1E3A5F]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <!-- Beauty icon -->
          <svg
            v-else-if="cat.icon === 'beauty'"
            class="w-5 h-5 text-[#1E3A5F]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 3l3 6-3 6M15 3l-3 6 3 6M5 21h14"
            />
          </svg>
          <!-- Baby icon -->
          <svg
            v-else-if="cat.icon === 'baby'"
            class="w-5 h-5 text-[#1E3A5F]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="8" r="4" stroke-width="1.5" stroke="currentColor" fill="none" />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M20 21a8 8 0 10-16 0"
            />
          </svg>
          <!-- Auto Parts icon -->
          <svg
            v-else-if="cat.icon === 'auto'"
            class="w-5 h-5 text-[#1E3A5F]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="6" cy="17" r="3" stroke-width="1.5" stroke="currentColor" fill="none" />
            <circle cx="18" cy="17" r="3" stroke-width="1.5" stroke="currentColor" fill="none" />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M4 17h14M6 11l2-4h8l2 4M2 11h20"
            />
          </svg>
          <!-- Industrial icon -->
          <svg
            v-else-if="cat.icon === 'industrial'"
            class="w-5 h-5 text-[#1E3A5F]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <circle cx="12" cy="12" r="2" stroke-width="1.5" stroke="currentColor" fill="none" />
          </svg>
          <!-- Fallback icon -->
          <svg
            v-else
            class="w-5 h-5 text-[#1E3A5F]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <span class="text-[10px] text-gray-600 text-center leading-tight">
          {{ cat.name }}
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cat-card {
  transition: transform 0.2s, box-shadow 0.2s;
}
.cat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.cat-card:active {
  transform: translateY(0);
}
</style>
