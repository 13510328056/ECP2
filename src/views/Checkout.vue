<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '@/stores/language'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { formatPrice, generateOrderNumber } from '@/utils/format'
import { isValidPhone, isValidEmail, isRequired } from '@/utils/validation'
import { useAddressStore } from '@/stores/address'
import { useOrderStore } from '@/stores/orders'
import type { OrderStatus } from '@/types/order'

const { t } = useI18n()
const router = useRouter()
const langStore = useLanguageStore()
const cartStore = useCartStore()
const userStore = useUserStore()
const showToast = inject<(message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) => void>('showToast')

const addressStore = useAddressStore()
const orderStore = useOrderStore()

const notLoggedIn = computed(() => !userStore.isLoggedIn)

// Form data
const showAddressForm = ref(false)
const shippingAddress = ref({
  fullName: '',
  phone: '',
  email: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  region: '',
})

const savedAddress = ref<typeof shippingAddress.value | null>(null)
const paymentMethod = ref<'momo' | 'cod'>('momo')
const momoPhoneNumber = ref('')
const momoPhoneError = ref(false)

const cities = ['Accra', 'Kumasi', 'Takoradi', 'Cape Coast', 'Other']
const regions = ['Greater Accra', 'Ashanti', 'Western', 'Central', 'Other']

// Computed
const hasItems = computed(() => cartStore.items.length > 0)

const orderSubtotal = computed(() => cartStore.subtotal)
const shippingCost = computed(() => {
  if (orderSubtotal.value >= 200) return 0
  const city = savedAddress.value?.city || ''
  return city === 'Accra' ? 15 : 25
})
const total = computed(() => orderSubtotal.value + shippingCost.value)

const validationErrors = ref<Record<string, string>>({})
const isEditingAddress = ref(false)

// Load default address from addressStore on init
if (addressStore.defaultAddress) {
  const d = addressStore.defaultAddress
  savedAddress.value = {
    fullName: d.fullName,
    phone: d.phone,
    email: d.email || '',
    addressLine1: d.addressLine1,
    addressLine2: d.addressLine2 || '',
    city: d.city,
    region: d.region,
  }
}

// Actions
function selectAddress(index: number) {
  const addr = addressStore.addresses[index]
  savedAddress.value = {
    fullName: addr.fullName,
    phone: addr.phone,
    email: addr.email || '',
    addressLine1: addr.addressLine1,
    addressLine2: addr.addressLine2 || '',
    city: addr.city,
    region: addr.region,
  }
}

function addNewAddress() {
  shippingAddress.value = { fullName: '', phone: '', email: '', addressLine1: '', addressLine2: '', city: '', region: '' }
  isEditingAddress.value = false
  showAddressForm.value = true
}

function cancelAddress() {
  showAddressForm.value = false
  // If we were adding a new address and cancel, savedAddress stays unchanged
}

function saveAddress() {
  validationErrors.value = {}

  const errs: Record<string, string> = {}
  if (!isRequired(shippingAddress.value.fullName)) {
    errs.fullName = t('validation.requiredField', { field: t('checkout.fullName') })
  }
  if (!isRequired(shippingAddress.value.phone)) {
    errs.phone = t('validation.requiredField', { field: t('checkout.phone') })
  } else if (!isValidPhone(shippingAddress.value.phone)) {
    errs.phone = t('validation.invalidPhone')
  }
  if (shippingAddress.value.email && !isValidEmail(shippingAddress.value.email)) {
    errs.email = t('validation.invalidEmail')
  }
  if (!isRequired(shippingAddress.value.addressLine1)) {
    errs.addressLine1 = t('validation.requiredField', { field: t('checkout.addressLine1') })
  }
  if (!isRequired(shippingAddress.value.city)) {
    errs.city = t('validation.requiredSelect')
  }

  validationErrors.value = errs

  if (Object.keys(errs).length > 0) {
    if (showToast) showToast(Object.values(errs)[0], 'warning')
    return
  }

  savedAddress.value = { ...shippingAddress.value }
  showAddressForm.value = false

  // Save new address to addressStore for future use
  if (!isEditingAddress.value) {
    const newAddr: import('@/types/order').ShippingInfo = {
      fullName: shippingAddress.value.fullName,
      phone: shippingAddress.value.phone,
      email: shippingAddress.value.email || undefined,
      addressLine1: shippingAddress.value.addressLine1,
      addressLine2: shippingAddress.value.addressLine2 || undefined,
      city: shippingAddress.value.city,
      region: shippingAddress.value.region,
    }
    addressStore.addAddress(newAddr)
  }
}

function editAddress() {
  if (savedAddress.value) {
    shippingAddress.value = { ...savedAddress.value }
  }
  isEditingAddress.value = true
  showAddressForm.value = true
}

function submitOrder() {
  if (!savedAddress.value) {
    if (showToast) showToast(t('checkout.addAddress'), 'warning')
    showAddressForm.value = true
    return
  }

  if (cartStore.items.length === 0) {
    if (showToast) showToast(t('cart.empty'), 'warning')
    router.push('/')
    return
  }

  // Build order
  const now = new Date().toISOString()
  const orderNumber = generateOrderNumber()
  const orderId = 'ord-' + Date.now().toString(36)

  const orderData = {
    orderNumber,
    items: cartStore.items.map((item) => ({
      ...item,
      product: {
        id: item.product.id,
        name: item.product.name,
        nameZh: item.product.nameZh,
        price: item.product.price,
        images: [item.product.images[0]],
      },
    })),
    shippingInfo: savedAddress.value,
    paymentMethod: paymentMethod.value,
    subtotal: orderSubtotal.value,
    shippingCost: shippingCost.value,
    total: total.value,
    createdAt: now,
  }

  // Save to persistent order store
  const fullOrder: import('@/types/order').Order = {
    id: orderId,
    orderNumber,
    items: orderData.items as any,
    shippingInfo: savedAddress.value as import('@/types/order').ShippingInfo,
    paymentMethod: paymentMethod.value,
    paymentStatus: paymentMethod.value === 'cod' ? 'pending' : 'pending',
    subtotal: orderSubtotal.value,
    shippingCost: shippingCost.value,
    total: total.value,
    status: 'pending_payment',
    createdAt: now,
    updatedAt: now,
  }
  orderStore.addOrder(fullOrder)

  sessionStorage.setItem('pendingOrder', JSON.stringify(orderData))

  if (paymentMethod.value === 'momo') {
    router.push('/payment')
  } else {
    // COD: direct to confirmation
    sessionStorage.setItem('lastOrder', JSON.stringify(orderData))
    cartStore.clearCart()
    router.push('/order-confirmation')
  }
}

function selectPayment(method: 'momo' | 'cod') {
  paymentMethod.value = method
}
</script>

<template>
  <div class="max-w-[480px] mx-auto bg-gray-50 min-h-screen relative pb-24 hide-scrollbar">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white px-4 py-4 flex items-center gap-4 shadow-sm">
      <button @click="router.push('/cart')" class="hover:opacity-70 transition">
        <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <router-link to="/">
        <img src="/images/logo.png" alt="Li's" class="h-8 w-auto" />
      </router-link>
      <h1 class="text-lg font-bold text-gray-800">{{ t('checkout.title') }}</h1>
    </header>

    <!-- Login Prompt Banner -->
    <div
      v-if="notLoggedIn"
      class="mx-4 mt-4 px-4 py-3 bg-[#FFF8E1] border border-[#F7B500] rounded-2xl flex items-center gap-3"
    >
      <svg class="w-5 h-5 text-[#F7B500] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.364-7.364A9 9 0 1112 3a9 9 0 017.364 4.636z" />
      </svg>
      <p class="text-sm text-[#1E3A5F] font-medium flex-1">
        {{ langStore.locale === 'zh' ? '请登录后继续结算' : 'Please login to continue checkout' }}
      </p>
      <router-link
        to="/login"
        class="px-4 py-1.5 bg-[#F7B500] text-black rounded-lg text-xs font-bold hover:bg-[#e0a200] transition flex-shrink-0"
      >
        {{ langStore.locale === 'zh' ? '立即登录' : 'Login' }}
      </router-link>
    </div>

    <!-- Shipping Address -->
    <div class="p-4">
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-bold text-gray-800 flex items-center gap-2">
            <svg class="w-5 h-5 text-[#006B3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {{ t('checkout.shippingAddress') }}
          </h3>
          <button
            v-if="savedAddress"
            class="text-xs text-[#006B3F] font-bold hover:underline"
            @click="editAddress"
          >
            {{ t('checkout.modify') }}
          </button>
        </div>

        <!-- Saved Address Display -->
        <div v-if="savedAddress && !showAddressForm">
          <div class="space-y-1">
            <p class="text-sm font-bold text-gray-800">
              {{ savedAddress.fullName }}
              <span class="text-gray-400 font-normal ml-2">{{ savedAddress.phone }}</span>
            </p>
            <p class="text-xs text-gray-500 leading-tight">
              {{ savedAddress.addressLine1 }}{{ savedAddress.addressLine2 ? ', ' + savedAddress.addressLine2 : '' }},
              {{ savedAddress.city }}, {{ savedAddress.region }}, Ghana
            </p>
          </div>

          <!-- Address Switcher (multiple saved addresses) -->
          <div v-if="addressStore.addresses.length > 1" class="mt-3">
            <label class="text-[11px] font-medium text-gray-500 block mb-1">{{ t('checkout.savedAddresses') }}</label>
            <select
              class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F7B500] transition bg-white"
              @change="selectAddress(Number(($event.target as HTMLSelectElement).value))"
            >
              <option v-for="(addr, idx) in addressStore.addresses" :key="idx" :value="idx"
                :selected="savedAddress === addressStore.addresses[idx]">
                {{ addr.fullName }} — {{ addr.addressLine1 }}, {{ addr.city }}
              </option>
            </select>
          </div>

          <!-- Add New Address -->
          <button
            class="mt-2 w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-xs text-gray-400 font-medium hover:border-[#006B3F] hover:text-[#006B3F] transition"
            @click="addNewAddress"
          >
            + {{ t('checkout.addAnother') }}
          </button>
        </div>

        <!-- Add First Address Button -->
        <button
          v-if="!showAddressForm && !savedAddress"
          class="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 font-medium hover:border-[#F7B500] hover:text-[#F7B500] transition"
          @click="addNewAddress"
        >
          + {{ t('checkout.addAddress') }}
        </button>

        <!-- Address Form (Inline) -->
        <div v-if="showAddressForm" class="space-y-3 mt-2">
          <input
            v-model="shippingAddress.fullName"
            :placeholder="t('checkout.fullName') + ' *'"
            class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F7B500] transition"
            :class="{ 'border-red-300': validationErrors.fullName }"
          />
          <div>
            <input
              v-model="shippingAddress.phone"
              :placeholder="t('checkout.phonePlaceholder')"
              type="tel"
              class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F7B500] transition"
              :class="{ 'border-red-300': validationErrors.phone }"
            />
          </div>
          <input
            v-model="shippingAddress.email"
            :placeholder="t('checkout.email')"
            type="email"
            class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F7B500] transition"
            :class="{ 'border-red-300': validationErrors.email }"
          />
          <input
            v-model="shippingAddress.addressLine1"
            :placeholder="t('checkout.addressLine1') + ' *'"
            class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F7B500] transition"
            :class="{ 'border-red-300': validationErrors.addressLine1 }"
          />
          <input
            v-model="shippingAddress.addressLine2"
            :placeholder="t('checkout.addressLine2')"
            class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F7B500] transition"
          />
          <div class="flex gap-2">
            <select
              v-model="shippingAddress.city"
              class="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F7B500] transition bg-white"
              :class="{ 'border-red-300': validationErrors.city }"
            >
              <option value="">{{ t('checkout.selectCity') }}</option>
              <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
            </select>
            <select
              v-model="shippingAddress.region"
              class="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F7B500] transition bg-white"
            >
              <option value="">{{ t('checkout.selectRegion') }}</option>
              <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
            </select>
          </div>
          <div class="flex gap-2 pt-1">
            <button
              class="flex-1 bg-[#006B3F] text-white py-2.5 rounded-lg text-sm font-bold hover:bg-[#005A35] transition"
              @click="saveAddress"
            >
              {{ t('checkout.saveAddress') }}
            </button>
            <button
              class="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
              @click="cancelAddress"
            >
              {{ t('checkout.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Items -->
    <div v-if="hasItems" class="px-4 space-y-3">
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        <h3 class="text-sm font-bold text-gray-800 mb-4">{{ t('checkout.orderItems') }}</h3>
        <div class="space-y-4">
          <div v-for="item in cartStore.items" :key="item.productId" class="flex gap-3">
            <img
              :src="item.product.images[0]"
              :alt="item.product.name"
              class="w-16 h-16 rounded-lg object-cover bg-gray-50 flex-shrink-0"
            />
            <div class="flex-1 min-w-0">
              <h4 class="text-xs font-bold text-gray-800 line-clamp-1">
                {{ langStore.locale === 'zh' ? item.product.nameZh : item.product.name }}
              </h4>
              <p v-if="item.selectedSku" class="text-[10px] text-gray-400 mt-0.5">{{ item.selectedSku }}</p>
              <div class="flex justify-between items-center mt-2">
                <span class="text-sm font-bold text-gray-800">{{ formatPrice(item.product.price) }}</span>
                <span class="text-xs text-gray-400">x{{ item.quantity }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Methods -->
    <div class="p-4">
      <h3 class="text-sm font-bold text-gray-800 mb-3">{{ t('checkout.paymentMethods') }}</h3>
      <div class="space-y-3">
        <!-- MTN Mobile Money -->
        <div
          class="flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition"
          :class="paymentMethod === 'momo' ? 'border-[#F7B500] bg-[#FFFBEB]' : 'border-transparent bg-white'"
          @click="selectPayment('momo')"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center font-black text-xs text-black">
              MTN
            </div>
            <div>
              <p class="text-sm font-bold text-gray-800">{{ t('checkout.momo') }}</p>
              <p class="text-[10px] text-gray-400">{{ t('checkout.momoDesc') }}</p>
            </div>
          </div>
          <svg
            class="w-5 h-5"
            :class="paymentMethod === 'momo' ? 'text-[#F7B500]' : 'text-gray-200'"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" />
            <circle v-if="paymentMethod === 'momo'" cx="12" cy="12" r="5" fill="currentColor" />
          </svg>
        </div>

        <!-- MOMO Phone Input -->
        <div v-if="paymentMethod === 'momo'" class="mt-3 transition-all duration-300">
          <label class="text-xs font-medium text-gray-600 mb-1.5 ml-1 block">
            MTN Mobile Number <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">+233</span>
            <input
              v-model="momoPhoneNumber"
              type="tel"
              placeholder="XX XXX XXXX"
              class="w-full h-12 bg-gray-50 rounded-xl pl-14 pr-4 text-sm outline-none border-2 transition"
              :class="momoPhoneError ? 'border-red-400 bg-red-50' : 'border-gray-100 focus:border-[#F7B500] focus:bg-white'"
              @input="momoPhoneError = false"
            />
          </div>
          <p class="text-[10px] text-gray-400 mt-1 ml-1">
            You'll receive a prompt on your phone to confirm payment
          </p>
          <p v-if="momoPhoneError" class="text-[10px] text-red-500 mt-0.5 ml-1">
            Please enter a valid MTN phone number
          </p>
        </div>

        <!-- Cash on Delivery -->
        <div
          class="flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition"
          :class="paymentMethod === 'cod' ? 'border-[#F7B500] bg-[#FFFBEB]' : 'border-transparent bg-white'"
          @click="selectPayment('cod')"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-bold text-gray-800">{{ t('checkout.cod') }}</p>
              <p class="text-[10px] text-gray-400">{{ t('checkout.codDesc') }}</p>
            </div>
          </div>
          <svg
            class="w-5 h-5"
            :class="paymentMethod === 'cod' ? 'text-[#F7B500]' : 'text-gray-200'"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" />
            <circle v-if="paymentMethod === 'cod'" cx="12" cy="12" r="5" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Order Summary -->
    <div class="p-4 pb-24">
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 space-y-3">
        <div class="flex justify-between text-sm">
          <span class="text-gray-400">{{ t('checkout.subtotal') }}</span>
          <span class="text-gray-800 font-medium">{{ formatPrice(orderSubtotal) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-400">{{ t('checkout.shippingFee') }} {{ savedAddress ? '(' + savedAddress.city + ')' : '' }}</span>
          <span class="text-gray-800 font-medium">{{ shippingCost === 0 ? t('checkout.shippingFree') : formatPrice(shippingCost) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-400">{{ t('checkout.couponDiscount') }}</span>
          <span class="text-red-500 font-medium">-{{ formatPrice(0) }}</span>
        </div>
        <div class="pt-3 border-t border-dashed border-gray-100 flex justify-between items-center">
          <span class="font-bold text-gray-800">{{ t('checkout.total') }}</span>
          <span class="text-2xl font-black text-[#F7B500]">{{ formatPrice(total) }}</span>
        </div>
      </div>
    </div>

    <!-- Fixed Bottom Submit Button -->
    <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-100 px-4 py-4 z-50">
      <button
        class="w-full h-14 bg-[#F7B500] text-black rounded-2xl font-black text-lg flex items-center justify-center shadow-lg shadow-yellow-200 hover:bg-[#e0a200] transition"
        @click="submitOrder"
      >
        {{ t('checkout.submitOrder') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
