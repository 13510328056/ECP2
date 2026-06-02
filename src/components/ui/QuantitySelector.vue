<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: number
  min?: number
  max?: number
}>(), {
  min: 1,
  max: 999,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const isMin = computed(() => props.modelValue <= props.min)
const isMax = computed(() => props.modelValue >= props.max)

function decrease() {
  if (isMin.value) return
  emit('update:modelValue', props.modelValue - 1)
}

function increase() {
  if (isMax.value) return
  emit('update:modelValue', props.modelValue + 1)
}
</script>

<template>
  <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden">
    <button
      class="w-10 h-10 flex items-center justify-center bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      :class="isMin ? 'text-gray-300' : 'text-gray-400 hover:text-gray-600'"
      :disabled="isMin"
      @click="decrease"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
      </svg>
    </button>
    <span class="w-12 h-10 flex items-center justify-center text-sm font-bold text-gray-800 bg-white">
      {{ modelValue }}
    </span>
    <button
      class="w-10 h-10 flex items-center justify-center bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      :class="isMax ? 'text-gray-300' : 'text-[#F7B500] hover:text-[#e0a200]'"
      :disabled="isMax"
      @click="increase"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  </div>
</template>
