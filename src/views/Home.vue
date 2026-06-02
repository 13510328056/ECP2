<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '@/stores/language'
import { useCartStore } from '@/stores/cart'
import { useCategoryStore } from '@/stores/categories'
import { products } from '@/data/products'
import { formatPrice } from '@/utils/format'
import { CONTACT_EMAIL } from '@/data/contact'

import AppHeader from '@/components/layout/AppHeader.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import HeroCarousel from '@/components/home/HeroCarousel.vue'
import CategoryGrid from '@/components/home/CategoryGrid.vue'
import ProductCard from '@/components/ui/ProductCard.vue'

const { t } = useI18n()
const langStore = useLanguageStore()
const cartStore = useCartStore()
const categoryStore = useCategoryStore()

const showToast = inject<(message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) => void>('showToast')

const hotProducts = computed(() => {
  return [...products].sort((a, b) => b.rating - a.rating).slice(0, 8)
})

const showSearchSuggest = ref(false)
const searchQuery = ref('')

const hotSearchTerms = ['Drill Bits', 'Work Gloves', 'Safety Helmet', 'Welding Machine', 'Cable Wire', 'Measuring Tape']

function getIconBg(catId: string): string {
  const map: Record<string, string> = {
    'cat-mining': 'bg-blue-50',
    'cat-safety': 'bg-green-50',
    'cat-tools': 'bg-yellow-50',
    'cat-parts': 'bg-gray-100',
  }
  return map[catId] || 'bg-gray-50'
}

function onSearchInput() {
  showSearchSuggest.value = searchQuery.value.length > 0
}

function selectSearchTerm(term: string) {
  searchQuery.value = term
  showSearchSuggest.value = false
}

function hideSearchSuggest() {
  setTimeout(() => {
    showSearchSuggest.value = false
  }, 200)
}

function addToCart(product: any) {
  cartStore.addItem(product)
  if (showToast) {
    showToast(t('product.addToCart') + ' ✅', 'success')
  }
}

// Testimonial
const currentTestimonial = ref(0)
const totalTestimonials = 3

const testimonials = computed(() => [
  {
    stars: 5,
    text: t('home.testimonial1'),
    name: t('home.testimonial1Name'),
    title: t('home.testimonial1Title'),
    initials: 'SK',
  },
  {
    stars: 5,
    text: t('home.testimonial2'),
    name: t('home.testimonial2Name'),
    title: t('home.testimonial2Title'),
    initials: 'AM',
  },
  {
    stars: 4,
    text: t('home.testimonial3'),
    name: t('home.testimonial3Name'),
    title: t('home.testimonial3Title'),
    initials: 'KO',
  },
])

function goToTestimonial(index: number) {
  currentTestimonial.value = index
}

// Inquiry modal
const showInquiryModal = ref(false)
const inquiryForm = ref({ name: '', phone: '+233 ', company: '', description: '' })

function openInquiryModal() {
  showInquiryModal.value = true
}

function closeInquiryModal() {
  showInquiryModal.value = false
}

function submitInquiry() {
  if (!inquiryForm.value.name.trim()) {
    if (showToast) showToast(t('validation.requiredField', { field: t('inquiry.form.fullName') }), 'warning')
    return
  }
  if (!inquiryForm.value.description.trim()) {
    if (showToast) showToast(t('validation.requiredField', { field: t('inquiry.form.message') }), 'warning')
    return
  }
  closeInquiryModal()
  inquiryForm.value = { name: '', phone: '+233 ', company: '', description: '' }
  if (showToast) showToast(t('inquiry.successMessage'), 'success')
}

// Newsletter
const newsletterEmail = ref('')

function subscribeNewsletter() {
  if (!newsletterEmail.value.trim()) {
    if (showToast) showToast(t('validation.requiredField', { field: t('common.email') || 'email' }), 'warning')
    return
  }
  newsletterEmail.value = ''
  if (showToast) showToast(t('footer.newsletter.success'), 'success')
}
</script>

<template>
  <div class="max-w-[480px] mx-auto bg-white min-h-screen relative pb-20 hide-scrollbar">
    <!-- Header -->
    <AppHeader />

    <!-- Hero Banner Carousel -->
    <HeroCarousel />

    <!-- Category Grid -->
    <section class="px-3 pt-5 pb-2">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-base text-gray-800">{{ t('home.categoriesTitle') }}</h3>
        <router-link to="/products" class="text-xs text-[#1E3A5F] font-medium hover:underline">
          {{ t('home.viewAll') }}
        </router-link>
      </div>
      <div class="grid grid-cols-4 gap-3">
        <div
          v-for="cat in categoryStore.tree.slice(0, 8)"
          :key="cat.id"
          class="cat-card flex flex-col items-center gap-1.5 bg-white rounded-xl py-3 shadow-sm cursor-pointer"
          @click="$router.push('/products?category=' + encodeURIComponent(cat.name))"
        >
          <div
            class="w-11 h-11 rounded-2xl flex items-center justify-center"
            :class="getIconBg(cat.id)"
          >
            <svg
              v-if="cat.id === 'cat-mining'"
              class="w-5 h-5 text-[#1E3A5F]"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <circle cx="12" cy="12" r="2" stroke-width="1.5" fill="none" />
            </svg>
            <svg
              v-else-if="cat.id === 'cat-safety'"
              class="w-5 h-5 text-[#1E3A5F]"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <svg
              v-else-if="cat.id === 'cat-tools'"
              class="w-5 h-5 text-[#1E3A5F]"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
            <svg
              v-else-if="cat.id === 'cat-parts'"
              class="w-5 h-5 text-[#1E3A5F]"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="3" stroke-width="1.5" fill="none" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0 2 2 0 00-2-2 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4 2 2 0 002-2 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68V3a2 2 0 014 0v1.68a1.65 1.65 0 001.51 1H14.82a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4z" />
            </svg>
            <svg
              v-else
              class="w-5 h-5 text-[#1E3A5F]"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span class="text-[10px] text-gray-600 text-center leading-tight">
            {{ langStore.locale === 'zh' ? cat.nameZh : cat.name }}
          </span>
        </div>
      </div>
    </section>

    <!-- Hot Products / Best Sellers -->
    <section class="px-3 pt-5 pb-2">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-base text-gray-800">{{ t('home.bestSellers') }}</h3>
        <router-link to="/products" class="text-xs text-[#1E3A5F] font-medium hover:underline">
          {{ t('home.viewAll') }}
        </router-link>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <ProductCard
          v-for="product in hotProducts"
          :key="product.id"
          :product="product"
          @add-to-cart="addToCart"
        />
      </div>
    </section>

    <!-- Inquiry Entry Banner -->
    <section class="px-3 pt-5">
      <div class="bg-[#FFF8E7] border-l-4 border-[#F7B500] rounded-xl p-4 flex items-start gap-3 shadow-sm">
        <div class="w-10 h-10 bg-[#F7B500]/20 rounded-full flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-[#D4A017]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="font-bold text-sm text-gray-800">{{ t('home.needBulk') }}</h4>
          <p class="text-xs text-gray-500 mt-1 leading-relaxed">{{ t('home.needBulkDesc') }}</p>
          <button
            class="mt-2 bg-[#1E3A5F] text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-[#152d4a] transition"
            @click="openInquiryModal"
          >
            {{ t('home.sendInquiry') }}
          </button>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="px-3 pt-5 pb-2">
      <h3 class="font-bold text-base text-gray-800 mb-4">{{ t('home.whatCustomersSay') }}</h3>
      <div class="relative bg-gradient-to-br from-[#1E3A5F] to-[#2d4a7a] rounded-2xl p-5 text-white min-h-[200px]">
        <div
          v-for="(testimonial, idx) in testimonials"
          :key="idx"
          class="transition-all duration-400"
          :class="currentTestimonial === idx ? 'block animate-fadeIn' : 'hidden'"
        >
          <div class="flex items-center gap-1 mb-3">
            <svg v-for="s in 5" :key="s" class="w-4 h-4" :class="s <= testimonial.stars ? 'text-[#F7B500]' : 'text-white/40'" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <p class="text-sm leading-relaxed italic text-white/90">{{ testimonial.text }}</p>
          <div class="mt-3 flex items-center gap-2">
            <div class="w-8 h-8 bg-[#F7B500] rounded-full flex items-center justify-center text-[#1E3A5F] font-bold text-sm">
              {{ testimonial.initials }}
            </div>
            <div>
              <p class="text-sm font-semibold">{{ testimonial.name }}</p>
              <p class="text-[10px] text-white/60">{{ testimonial.title }}</p>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-center gap-2 mt-4">
          <button
            v-for="idx in totalTestimonials"
            :key="idx"
            class="h-2 rounded-full transition-all duration-300 border-0 cursor-pointer"
            :class="currentTestimonial === idx - 1 ? 'w-5 bg-[#F7B500]' : 'w-2 bg-white/40'"
            @click="goToTestimonial(idx - 1)"
          />
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="px-3 pt-5 pb-2">
      <h3 class="font-bold text-base text-gray-800 mb-4">{{ t('home.whyChooseUs') }}</h3>
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-gray-50 rounded-xl p-4 flex flex-col items-center text-center">
          <svg class="w-8 h-8 text-[#1E3A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h5 class="text-sm font-bold text-gray-800 mt-2">{{ t('home.features.quality.title') }}</h5>
          <p class="text-[11px] text-gray-500 mt-1">{{ t('home.features.quality.description') }}</p>
        </div>
        <div class="bg-gray-50 rounded-xl p-4 flex flex-col items-center text-center">
          <svg class="w-8 h-8 text-[#1E3A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1 2 1 2-1 2 1 2-1 2 1z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12v4a1 1 0 01-1 1h-2" />
            <circle cx="7" cy="18" r="2" fill="none" stroke="currentColor" />
            <circle cx="17" cy="18" r="2" fill="none" stroke="currentColor" />
          </svg>
          <h5 class="text-sm font-bold text-gray-800 mt-2">{{ t('home.features.shipping.title') }}</h5>
          <p class="text-[11px] text-gray-500 mt-1">{{ t('home.features.shipping.description') }}</p>
        </div>
        <div class="bg-gray-50 rounded-xl p-4 flex flex-col items-center text-center">
          <svg class="w-8 h-8 text-[#1E3A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18 10c0 3.5-4 7-6 7s-6-3.5-6-7a6 6 0 1112 0z" />
            <circle cx="12" cy="10" r="2" fill="none" stroke="currentColor" />
          </svg>
          <h5 class="text-sm font-bold text-gray-800 mt-2">{{ t('home.features.support.title') }}</h5>
          <p class="text-[11px] text-gray-500 mt-1">{{ t('home.features.support.description') }}</p>
        </div>
        <div class="bg-gray-50 rounded-xl p-4 flex flex-col items-center text-center">
          <svg class="w-8 h-8 text-[#1E3A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h5 class="text-sm font-bold text-gray-800 mt-2">{{ t('home.features.secure.title') }}</h5>
          <p class="text-[11px] text-gray-500 mt-1">{{ t('home.features.secure.description') }}</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="mx-3 mt-6 rounded-2xl overflow-hidden" style="background: #1E3A5F;">
      <div class="px-6 py-8 text-center">
        <h3 class="text-white text-xl font-bold">{{ t('home.bottomCta.title') }}</h3>
        <p class="text-white/70 text-sm mt-2 leading-relaxed">{{ t('home.bottomCta.subtitle') }}</p>
        <div class="flex items-center justify-center gap-3 mt-5">
          <router-link
            to="/products"
            class="bg-[#F7B500] text-[#1E3A5F] px-5 py-2 rounded-full text-sm font-bold transition inline-block hover:bg-[#e0a200]"
          >
            {{ t('home.bottomCta.button1') }}
          </router-link>
          <a
            href="tel:+233501234567"
            class="px-5 py-2 rounded-full text-sm font-bold transition inline-block text-white border-2 border-white/60 hover:bg-white/10"
          >
            {{ t('home.bottomCta.button2') }}
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="px-4 pt-6 pb-4 mt-6 border-t border-gray-200 bg-white">
      <div class="text-center">
        <img src="/images/logo.png" alt="Li's Industrial Mart" class="h-8 w-auto mx-auto mb-3" />
        <p class="text-xs text-gray-500 leading-relaxed max-w-[280px] mx-auto">
          {{ t('footer.companyInfo.description') }}
        </p>
        <div class="mt-4 space-y-1.5 text-xs text-gray-500">
          <p>
            <svg class="inline w-4 h-4 text-[#1E3A5F] mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {{ t('footer.contact.phone') }}
          </p>
          <p>
            <svg class="inline w-4 h-4 text-[#1E3A5F] mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {{ CONTACT_EMAIL }}
          </p>
          <p>
            <svg class="inline w-4 h-4 text-[#1E3A5F] mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {{ t('footer.contact.address') }}
          </p>
        </div>
        <div class="flex items-center justify-center gap-4 mt-4">
          <a class="w-8 h-8 bg-[#1E3A5F] rounded-full flex items-center justify-center text-white hover:bg-[#152d4a] transition" href="#">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
          </a>
          <a class="w-8 h-8 bg-[#1E3A5F] rounded-full flex items-center justify-center text-white hover:bg-[#152d4a] transition" href="#">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
          </a>
          <a class="w-8 h-8 bg-[#1E3A5F] rounded-full flex items-center justify-center text-white hover:bg-[#152d4a] transition" href="#">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.998 12c0-6.628-5.372-12-11.999-12C5.372 0 0 5.372 0 12c0 5.99 4.388 10.954 10.124 11.854v-8.385H7.078v-3.47h3.046V9.356c0-3.008 1.792-4.669 4.532-4.669 1.313 0 2.686.234 2.686.234v2.953H15.83c-1.49 0-1.955.925-1.955 1.874V12h3.328l-.532 3.469h-2.796v8.385c5.736-.9 10.124-5.864 10.124-11.854z" /></svg>
          </a>
        </div>
      </div>

      <!-- Quick Links + Customer Service -->
      <div class="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
        <div>
          <h6 class="text-xs font-bold text-gray-800 mb-2">{{ t('footer.quickLinks.title') }}</h6>
          <ul class="space-y-1.5 text-[11px] text-gray-500">
            <li><router-link to="/" class="hover:text-[#1E3A5F]">{{ t('footer.quickLinks.home') }}</router-link></li>
            <li><router-link to="/products" class="hover:text-[#1E3A5F]">{{ t('footer.quickLinks.products') }}</router-link></li>
            <li><router-link to="/products" class="hover:text-[#1E3A5F]">{{ t('footer.quickLinks.categories') }}</router-link></li>
            <li><router-link to="/contact" class="hover:text-[#1E3A5F]">{{ t('footer.quickLinks.contact') }}</router-link></li>
          </ul>
        </div>
        <div>
          <h6 class="text-xs font-bold text-gray-800 mb-2">{{ t('footer.quickLinks.title') }}</h6>
          <ul class="space-y-1.5 text-[11px] text-gray-500">
            <li><a class="hover:text-[#1E3A5F] cursor-pointer">{{ t('footer.quickLinks.faq') }}</a></li>
            <li><a class="hover:text-[#1E3A5F] cursor-pointer">{{ t('checkout.shipping') }}</a></li>
            <li><a class="hover:text-[#1E3A5F] cursor-pointer">{{ t('home.features.returns.title') }}</a></li>
            <li><a class="hover:text-[#1E3A5F] cursor-pointer">{{ t('footer.quickLinks.privacy') }}</a></li>
          </ul>
        </div>
      </div>

      <!-- Newsletter -->
      <div class="mt-4 border-t border-gray-100 pt-4">
        <h6 class="text-xs font-bold text-gray-800 mb-2">{{ t('footer.newsletter.title') }}</h6>
        <div class="flex gap-2">
          <input
            v-model="newsletterEmail"
            type="email"
            :placeholder="t('footer.newsletter.placeholder')"
            class="flex-1 h-9 bg-gray-100 rounded-lg px-3 text-xs outline-none focus:ring-1 focus:ring-[#F7B500]"
          />
          <button
            class="bg-[#1E3A5F] text-white px-4 h-9 rounded-lg text-xs font-medium hover:bg-[#152d4a] transition"
            @click="subscribeNewsletter"
          >
            {{ t('footer.newsletter.button') }}
          </button>
        </div>
      </div>

      <p class="text-[10px] text-gray-400 mt-4 text-center">{{ t('footer.copyright') }}</p>
    </footer>

    <!-- Bottom Tab Navigation -->
    <BottomNav />

    <!-- Inquiry Modal -->
    <Teleport to="body">
      <div
        v-if="showInquiryModal"
        class="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center"
        @click.self="closeInquiryModal"
      >
        <div class="bg-white rounded-2xl p-6 w-[320px] max-w-[90vw] max-h-[80vh] overflow-y-auto shadow-xl">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-[#1E3A5F]">{{ t('inquiry.title') }}</h3>
            <button class="text-gray-400 hover:text-gray-600 text-xl leading-none" @click="closeInquiryModal">&times;</button>
          </div>
          <input
            v-model="inquiryForm.name"
            type="text"
            :placeholder="t('inquiry.form.fullName') + ' *'"
            class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none mb-3 focus:border-[#F7B500]"
          />
          <input
            v-model="inquiryForm.phone"
            type="text"
            :placeholder="t('inquiry.form.phone')"
            class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none mb-3 focus:border-[#F7B500]"
          />
          <input
            v-model="inquiryForm.company"
            type="text"
            :placeholder="t('inquiry.form.company')"
            class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none mb-3 focus:border-[#F7B500]"
          />
          <textarea
            v-model="inquiryForm.description"
            :placeholder="t('inquiry.form.message') + ' *'"
            class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none mb-3 focus:border-[#F7B500] resize-y min-h-[80px]"
          />
          <button
            class="w-full bg-[#1E3A5F] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#152d4a] transition"
            @click="submitInquiry"
          >
            {{ t('inquiry.submit') }}
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
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
.animate-fadeIn {
  animation: fadeIn 0.4s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>
