<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLanguageStore } from '@/stores/language'

const route = useRoute()
const langStore = useLanguageStore()

const isAdminRoute = computed(() => route.path.startsWith('/admin'))

const t = (zh: string, en: string) =>
  langStore.locale === 'en' ? en : zh

const year = computed(() => new Date().getFullYear())
</script>

<template>
  <footer
    v-if="!isAdminRoute"
    class="px-4 pt-6 pb-4 mt-6 border-t border-gray-200 bg-white"
  >
    <!-- Company Info -->
    <div class="text-center">
      <router-link to="/">
        <img
          src="/images/logo.png"
          alt="Li's Industrial Mart"
          class="h-8 w-auto mx-auto mb-3"
        />
      </router-link>
      <p
        class="text-xs text-gray-500 leading-relaxed max-w-[280px] mx-auto"
      >
        {{ t(
          '您信赖的加纳工业用品与设备合作伙伴。优质产品，可靠服务。',
          'Your trusted partner for industrial supplies and equipment across Ghana. Quality products, reliable service.'
        ) }}
      </p>

      <!-- Contact Info -->
      <div class="mt-4 space-y-1.5 text-xs text-gray-500">
        <p class="flex items-center justify-center gap-1.5">
          <svg
            class="w-3.5 h-3.5 text-[#1E3A5F] flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          +233 XX XXX XXXX
        </p>
        <p class="flex items-center justify-center gap-1.5">
          <svg
            class="w-3.5 h-3.5 text-[#1E3A5F] flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          info@lisindustrialmart.com
        </p>
        <p class="flex items-center justify-center gap-1.5">
          <svg
            class="w-3.5 h-3.5 text-[#1E3A5F] flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Accra, Ghana
        </p>
        <p class="flex items-center justify-center gap-1.5">
          <svg
            class="w-3.5 h-3.5 text-[#25D366] flex-shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          +233 50 123 4567
        </p>
      </div>

      <!-- Social Icons -->
      <div class="flex items-center justify-center gap-4 mt-4">
        <a
          href="#"
          class="w-8 h-8 bg-[#1E3A5F] rounded-full flex items-center justify-center text-white hover:bg-[#152d4a] transition"
          aria-label="Facebook"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        </a>
        <a
          href="#"
          class="w-8 h-8 bg-[#1E3A5F] rounded-full flex items-center justify-center text-white hover:bg-[#152d4a] transition"
          aria-label="Instagram"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </a>
        <a
          href="#"
          class="w-8 h-8 bg-[#1E3A5F] rounded-full flex items-center justify-center text-white hover:bg-[#152d4a] transition"
          aria-label="WhatsApp"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>
    </div>

    <!-- Quick Links + Customer Service -->
    <div class="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
      <!-- Quick Links -->
      <div>
        <h6 class="text-xs font-bold text-gray-800 mb-2">
          {{ t('快速链接', 'Quick Links') }}
        </h6>
        <ul class="space-y-1.5 text-[11px] text-gray-500">
          <li>
            <router-link to="/" class="hover:text-[#1E3A5F] transition">
              {{ t('首页', 'Home') }}
            </router-link>
          </li>
          <li>
            <router-link to="/products" class="hover:text-[#1E3A5F] transition">
              {{ t('商品列表', 'Products') }}
            </router-link>
          </li>
          <li>
            <router-link to="/cart" class="hover:text-[#1E3A5F] transition">
              {{ t('购物车', 'Cart') }}
            </router-link>
          </li>
          <li>
            <router-link to="/contact" class="hover:text-[#1E3A5F] transition">
              {{ t('联系我们', 'Contact Us') }}
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Customer Service -->
      <div>
        <h6 class="text-xs font-bold text-gray-800 mb-2">
          {{ t('客户服务', 'Customer Service') }}
        </h6>
        <ul class="space-y-1.5 text-[11px] text-gray-500">
          <li>
            <router-link to="/faq" class="hover:text-[#1E3A5F] transition">
              {{ t('常见问题', 'FAQ') }}
            </router-link>
          </li>
          <li>
            <router-link to="/shipping" class="hover:text-[#1E3A5F] transition">
              {{ t('配送信息', 'Shipping Info') }}
            </router-link>
          </li>
          <li>
            <router-link to="/returns" class="hover:text-[#1E3A5F] transition">
              {{ t('7天退换政策', '7-Day Return Policy') }}
            </router-link>
          </li>
          <li>
            <router-link to="/privacy" class="hover:text-[#1E3A5F] transition">
              {{ t('隐私政策', 'Privacy Policy') }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>

    <!-- Payment Methods -->
    <div class="mt-4 border-t border-gray-100 pt-4">
      <h6 class="text-xs font-bold text-gray-800 mb-3 text-center">
        {{ t('支付方式', 'Payment Methods') }}
      </h6>
      <div class="flex items-center justify-center gap-3">
        <!-- MTN MOMO -->
        <div class="flex items-center gap-1.5 bg-yellow-50 rounded-lg px-3 py-1.5">
          <span class="text-[10px] font-bold text-yellow-700">MTN</span>
          <span class="text-[10px] font-medium text-yellow-600">MoMo</span>
        </div>
        <!-- Visa -->
        <div class="flex items-center gap-1.5 bg-blue-50 rounded-lg px-3 py-1.5">
          <svg class="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.5 3H4.5A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3zM8.1 15.3l1.2-4.9h1.5l-1.2 4.9H8.1zm5.2-4.9c.4-.2.9-.3 1.5-.3 1.1 0 1.6.4 1.6 1 0 .2-.1.4-.2.6l-.2.4c-.2.4-.3.8-.2 1.2.1.4.4.8.8 1 .4.3.8.4 1.2.4.6 0 1.1-.2 1.5-.5l-.3 1.1c-.4.2-.8.3-1.3.3-.7 0-1.3-.2-1.8-.6-.5-.4-.8-.9-.9-1.5-.1-.6 0-1.1.3-1.6s.6-.8 1.1-1c.4-.2.9-.3 1.5-.3.4 0 .7.1 1 .2l-.3 1.1c-.2-.1-.5-.1-.8-.1-.6 0-1.1.2-1.4.5-.3.3-.5.7-.4 1.2 0 .3.1.5.3.7.2.2.4.3.6.4.3.1.5.2.7.2.3 0 .6-.1.9-.2l-.3 1.1c-.3.1-.7.2-1.2.2-.7 0-1.4-.2-1.9-.7-.5-.4-.8-1-.9-1.7-.1-.7 0-1.3.3-1.8.3-.5.8-.9 1.4-1.2z" />
          </svg>
          <span class="text-[10px] font-bold text-blue-700">Visa</span>
        </div>
        <!-- Mastercard -->
        <div class="flex items-center gap-1.5 bg-orange-50 rounded-lg px-3 py-1.5">
          <svg class="w-4 h-4 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="8" cy="12" r="6" />
            <circle cx="16" cy="12" r="6" />
          </svg>
          <span class="text-[10px] font-bold text-orange-700">MC</span>
        </div>
        <!-- Cash -->
        <div class="flex items-center gap-1.5 bg-green-50 rounded-lg px-3 py-1.5">
          <svg class="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <circle cx="12" cy="12" r="2" />
          </svg>
          <span class="text-[10px] font-bold text-green-700">{{ t('现金', 'Cash') }}</span>
        </div>
      </div>
    </div>

    <!-- Newsletter -->
    <div class="mt-4 border-t border-gray-100 pt-4">
      <h6 class="text-xs font-bold text-gray-800 mb-2">
        {{ t('订阅资讯', 'Newsletter') }}
      </h6>
      <div class="flex gap-2">
        <input
          type="email"
          :placeholder="langStore.locale === 'zh' ? 'your@email.com' : 'your@email.com'"
          class="flex-1 h-9 bg-gray-100 rounded-lg px-3 text-xs outline-none focus:ring-1 focus:ring-[#F7B500]"
        />
        <button class="bg-[#1E3A5F] text-white px-4 h-9 rounded-lg text-xs font-medium hover:bg-[#152d4a] transition">
          {{ t('订阅', 'Subscribe') }}
        </button>
      </div>
    </div>

    <!-- Copyright -->
    <p class="text-[10px] text-gray-400 mt-4 text-center">
      &copy; {{ year }} Li's Industrial Mart. All rights reserved.
    </p>
  </footer>
</template>
