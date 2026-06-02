<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{
  show: boolean
  title?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function handleOverlayClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close')
  }
}

watch(
  () => props.show,
  (val) => {
    if (val) {
      document.addEventListener('keydown', handleKeydown)
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', handleKeydown)
      document.body.style.overflow = ''
    }
  },
  { immediate: false }
)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="modal-overlay fixed inset-0 z-100 flex items-center justify-center bg-black/40"
      @click="handleOverlayClick"
    >
      <div
        class="modal-box bg-white rounded-2xl p-6 w-[320px] max-w-[90vw] max-h-[80vh] overflow-y-auto shadow-xl"
        @click.stop
      >
        <div class="flex items-center justify-between mb-4">
          <h3 v-if="title" class="text-lg font-bold text-[#1E3A5F]">
            {{ title }}
          </h3>
          <button
            class="modal-close text-gray-400 hover:text-gray-600 transition-colors cursor-pointer ml-auto"
            @click="emit('close')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
