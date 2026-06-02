<script setup lang="ts">
withDefaults(defineProps<{
  icon?: string
  title: string
  description?: string
  actionText?: string
  actionLink?: string
}>(), {
  icon: 'cart',
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 px-10 text-center">
    <!-- Large icon -->
    <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
      <!-- Cart icon (default) -->
      <svg
        v-if="icon === 'cart'"
        class="w-12 h-12 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
        />
      </svg>
      <!-- Search icon -->
      <svg
        v-else-if="icon === 'search'"
        class="w-12 h-12 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <!-- Box icon -->
      <svg
        v-else-if="icon === 'box'"
        class="w-12 h-12 text-gray-300"
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
      <!-- Inbox icon -->
      <svg
        v-else-if="icon === 'inbox'"
        class="w-12 h-12 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <!-- Generic/fallback icon -->
      <svg
        v-else
        class="w-12 h-12 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>

    <!-- Title -->
    <h3 class="text-lg font-bold text-gray-800">{{ title }}</h3>

    <!-- Description -->
    <p v-if="description" class="text-sm text-gray-400 mt-2 max-w-[240px]">
      {{ description }}
    </p>

    <!-- Action Button -->
    <a
      v-if="actionText"
      :href="actionLink || '#'"
      class="mt-6 bg-[#F7B500] text-black px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#e0a200] transition-colors inline-block"
    >
      {{ actionText }}
    </a>
  </div>
</template>
