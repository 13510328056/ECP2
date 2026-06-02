<script setup lang="ts">
import type { PaymentMethod } from '@/types'

const props = defineProps<{
  modelValue: PaymentMethod
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: PaymentMethod): void
}>()

interface PaymentOption {
  value: PaymentMethod
  label: string
  description: string
  recommended?: boolean
}

const options: PaymentOption[] = [
  {
    value: 'momo',
    label: 'MTN Mobile Money',
    description: 'Pay with MTN MOMO wallet — fast & secure',
    recommended: true,
  },
  {
    value: 'cod',
    label: 'Cash on Delivery',
    description: 'Pay cash when your order arrives',
  },
]
</script>

<template>
  <div class="space-y-3">
    <h3 class="text-base font-bold text-gray-800">Payment Method</h3>

    <div
      v-for="option in options"
      :key="option.value"
      class="relative rounded-xl border-2 p-4 cursor-pointer transition-all"
      :class="
        modelValue === option.value
          ? 'border-[#F7B500] bg-[#FFF8E7]'
          : 'border-gray-200 bg-white hover:border-gray-300'
      "
      @click="emit('update:modelValue', option.value)"
    >
      <!-- Recommended badge -->
      <span
        v-if="option.recommended"
        class="absolute -top-2.5 right-3 text-[10px] font-bold text-white bg-[#F7B500] px-2 py-0.5 rounded-full"
      >
        Recommended
      </span>

      <div class="flex items-center gap-3">
        <!-- Radio circle -->
        <div
          class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
          :class="
            modelValue === option.value
              ? 'border-[#F7B500]'
              : 'border-gray-300'
          "
        >
          <div
            v-if="modelValue === option.value"
            class="w-2.5 h-2.5 rounded-full bg-[#F7B500]"
          />
        </div>

        <!-- MTN Icon Area -->
        <div
          v-if="option.value === 'momo'"
          class="w-10 h-10 bg-[#FFCC00] rounded-lg flex items-center justify-center flex-shrink-0"
        >
          <svg class="w-6 h-6 text-[#1E3A5F]" viewBox="0 0 24 24" fill="currentColor">
            <rect x="4" y="6" width="16" height="12" rx="2" />
            <text
              x="12"
              y="16"
              text-anchor="middle"
              font-size="6"
              font-weight="bold"
              fill="#1E3A5F"
            >
              MOMO
            </text>
          </svg>
        </div>

        <!-- Cash icon -->
        <div
          v-else
          class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0"
        >
          <svg class="w-5 h-5 text-[#006B3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>

        <!-- Label & Description -->
        <div>
          <p class="text-sm font-bold text-gray-800">{{ option.label }}</p>
          <p class="text-[11px] text-gray-500 mt-0.5">{{ option.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
