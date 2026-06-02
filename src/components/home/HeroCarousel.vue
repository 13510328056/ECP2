<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

export interface CarouselSlide {
  label: string
  title: string
  titleLine2: string
  description: string
  cta: string
  gradientFrom: string
  gradientTo: string
  accentColor: string
  action?: () => void
}

const props = withDefaults(defineProps<{
  slides?: CarouselSlide[]
  autoPlayInterval?: number
}>(), {
  autoPlayInterval: 5000,
})

const defaultSlides: CarouselSlide[] = [
  {
    label: 'BIG SALE',
    title: 'Industrial Supplies',
    titleLine2: 'at Wholesale Prices',
    description: 'Top quality tools & equipment for your business',
    cta: 'Shop Now',
    gradientFrom: '#1E3A5F',
    gradientTo: '#D4A017',
    accentColor: '#F7B500',
  },
  {
    label: 'NEW',
    title: 'New Arrivals',
    titleLine2: 'Just Landed',
    description: 'Latest industrial products in stock now',
    cta: 'Explore',
    gradientFrom: '#1E3A5F',
    gradientTo: '#2d8a4e',
    accentColor: '#F7B500',
  },
  {
    label: 'FREE SHIPPING',
    title: 'Free Delivery',
    titleLine2: 'in Accra',
    description: 'On all orders above GHS 200',
    cta: 'Learn More',
    gradientFrom: '#1E3A5F',
    gradientTo: '#D4A017',
    accentColor: '#F7B500',
  },
]

const slides = computed(() => props.slides ?? defaultSlides)
const currentSlide = ref(0)
let autoTimer: number | null = null

function showSlide(index: number) {
  const total = slides.value.length
  currentSlide.value = ((index % total) + total) % total
}

function nextSlide() {
  resetAuto()
  showSlide(currentSlide.value + 1)
}

function prevSlide() {
  resetAuto()
  showSlide(currentSlide.value - 1)
}

function goToSlide(index: number) {
  resetAuto()
  showSlide(index)
}

function resetAuto() {
  if (autoTimer) clearInterval(autoTimer)
  autoTimer = window.setInterval(() => {
    showSlide(currentSlide.value + 1)
  }, props.autoPlayInterval)
}

onMounted(() => {
  resetAuto()
})

onUnmounted(() => {
  if (autoTimer) clearInterval(autoTimer)
})
</script>

<template>
  <section class="px-3 pt-3">
    <div
      class="relative h-44 rounded-2xl overflow-hidden shadow-md"
    >
      <!-- Slides -->
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="absolute inset-0 transition-opacity duration-500 ease-in-out"
        :class="currentSlide === index ? 'opacity-100' : 'opacity-0'"
      >
        <div
          class="w-full h-full flex flex-col justify-center px-6"
          :style="{ background: `linear-gradient(135deg, ${slide.gradientFrom}, ${slide.gradientTo})` }"
        >
          <span
            class="font-bold text-xs uppercase tracking-widest"
            :style="{ color: slide.accentColor }"
          >
            {{ slide.label }}
          </span>
          <h2 class="text-white text-xl font-bold mt-2 leading-tight">
            {{ slide.title }}<br />{{ slide.titleLine2 }}
          </h2>
          <p class="text-white/70 text-xs mt-2">
            {{ slide.description }}
          </p>
          <button
            class="mt-3 px-5 py-1.5 rounded-full text-xs font-bold w-max transition-colors"
            :style="{
              backgroundColor: slide.accentColor,
              color: slide.gradientFrom,
            }"
            @click="slide.action"
          >
            {{ slide.cta }}
          </button>
        </div>
      </div>

      <!-- Prev/Next -->
      <button
        class="absolute top-1/2 left-2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center text-white border-none cursor-pointer transition-all hover:bg-white/40 active:scale-92"
        @click="prevSlide"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        class="absolute top-1/2 right-2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center text-white border-none cursor-pointer transition-all hover:bg-white/40 active:scale-92"
        @click="nextSlide"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Dots -->
      <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        <button
          v-for="(_, index) in slides"
          :key="index"
          class="border-0 cursor-pointer transition-all duration-200"
          :class="
            currentSlide === index
              ? 'w-4 h-1.5 rounded-full bg-[#F7B500]'
              : 'w-1.5 h-1.5 rounded-full bg-white/50'
          "
          @click="goToSlide(index)"
        />
      </div>
    </div>
  </section>
</template>
