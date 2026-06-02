<script setup lang="ts">
withDefaults(defineProps<{
  type?: 'card' | 'line' | 'image'
  count?: number
}>(), {
  type: 'line',
  count: 1,
})
</script>

<template>
  <div class="space-y-4">
    <!-- Card Skeleton -->
    <div v-if="type === 'card'" class="space-y-4">
      <div
        v-for="i in count"
        :key="i"
        class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
      >
        <div class="aspect-square skeleton" />
        <div class="p-3 space-y-2">
          <div class="h-3 skeleton w-3/4" />
          <div class="h-3 skeleton w-1/2" />
          <div class="h-5 skeleton w-1/3 mt-2" />
          <div class="h-3 skeleton w-1/4 mt-1" />
          <div class="h-8 skeleton w-full mt-2 rounded-lg" />
        </div>
      </div>
    </div>

    <!-- Line Skeleton -->
    <div v-if="type === 'line'" class="space-y-3">
      <div v-for="i in count" :key="i" class="flex items-center gap-3">
        <div class="skeleton h-4" :class="i % 2 === 0 ? 'w-3/4' : 'w-1/2'" />
      </div>
    </div>

    <!-- Image Skeleton -->
    <div v-if="type === 'image'" class="space-y-3">
      <div
        v-for="i in count"
        :key="i"
        class="skeleton aspect-video w-full rounded-xl"
      />
    </div>
  </div>
</template>

<style scoped>
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}
</style>
