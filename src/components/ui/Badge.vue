<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  type?: 'success' | 'warning' | 'error' | 'info' | 'default'
  size?: 'sm' | 'md'
}>(), {
  type: 'default',
  size: 'sm',
})

const styleClasses = computed(() => {
  const base = 'rounded-full font-medium inline-flex items-center'
  const sizeClass = props.size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'

  const typeColors: Record<string, string> = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-orange-100 text-orange-600',
    error: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-700',
    default: 'bg-gray-100 text-gray-600',
  }

  return `${base} ${sizeClass} ${typeColors[props.type]}`
})
</script>

<template>
  <span :class="styleClasses">
    <slot />
  </span>
</template>
