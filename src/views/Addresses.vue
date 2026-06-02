<script setup lang="ts">
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { useAddressStore } from '@/stores/address'
import BottomNav from '@/components/layout/BottomNav.vue'
import Modal from '@/components/ui/Modal.vue'
import { isValidPhone } from '@/utils/validation'
import type { ShippingInfo } from '@/types/order'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const addressStore = useAddressStore()
const showToast = inject<(message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) => void>('showToast')

const showForm = ref(false)
const editingIndex = ref<number | null>(null)
const deletingIndex = ref<number | null>(null)
const showDeleteConfirm = ref(false)

const cities = ['Accra', 'Kumasi', 'Takoradi', 'Cape Coast', 'Other']
const regions = ['Greater Accra', 'Ashanti', 'Western', 'Central', 'Other']

const form = ref<ShippingInfo>({
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  region: '',
})

function openAddForm() {
  editingIndex.value = null
  form.value = { fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', region: '' }
  showForm.value = true
}

function openEditForm(index: number) {
  editingIndex.value = index
  form.value = { ...addressStore.addresses[index] }
  showForm.value = true
}

function saveAddress() {
  // Validation
  if (!form.value.fullName.trim()) {
    if (showToast) showToast(t('validation.required', { field: t('address.fullName') }), 'warning')
    return
  }
  if (!form.value.phone.trim()) {
    if (showToast) showToast(t('validation.required', { field: t('address.phone') }), 'warning')
    return
  }
  if (!isValidPhone(form.value.phone)) {
    if (showToast) showToast(t('validation.invalidPhone'), 'warning')
    return
  }
  if (!form.value.addressLine1.trim()) {
    if (showToast) showToast(t('validation.required', { field: t('address.addressLine1') }), 'warning')
    return
  }
  if (!form.value.city.trim()) {
    if (showToast) showToast(t('validation.required', { field: t('address.city') }), 'warning')
    return
  }

  if (editingIndex.value !== null) {
    addressStore.updateAddress(editingIndex.value, { ...form.value })
  } else {
    addressStore.addAddress({ ...form.value })
  }

  showForm.value = false
  editingIndex.value = null
}

function confirmDelete(index: number) {
  deletingIndex.value = index
  showDeleteConfirm.value = true
}

function doDelete() {
  if (deletingIndex.value !== null) {
    addressStore.deleteAddress(deletingIndex.value)
    deletingIndex.value = null
  }
  showDeleteConfirm.value = false
}

function getDisplayAddress(addr: ShippingInfo): string {
  const parts = [addr.addressLine1]
  if (addr.addressLine2) parts.push(addr.addressLine2)
  parts.push(addr.city)
  if (addr.region) parts.push(addr.region)
  return parts.join(', ')
}
</script>

<template>
  <div class="max-w-[480px] mx-auto bg-gray-50 min-h-screen relative pb-24 hide-scrollbar">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white px-4 py-4 flex items-center gap-4 shadow-sm">
      <button @click="router.push('/account')" class="hover:opacity-70 transition">
        <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <router-link to="/">
        <img src="/images/logo.png" alt="Li's" class="h-8 w-auto" />
      </router-link>
      <h1 class="text-lg font-bold text-gray-800">{{ t('address.title') }}</h1>
    </header>

    <!-- Not Logged In -->
    <div v-if="!userStore.isLoggedIn" class="p-6 pt-20">
      <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-50 text-center">
        <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <h2 class="text-xl font-bold text-gray-800 mb-2">{{ t('account.notLoggedIn') }}</h2>
        <p class="text-sm text-gray-400 mb-6">{{ t('account.loginPrompt') }}</p>
        <router-link
          to="/login"
          class="inline-block w-full h-12 bg-[#F7B500] text-black rounded-xl font-bold text-base leading-[48px] shadow-lg shadow-yellow-200 hover:bg-[#e0a200] transition"
        >
          {{ t('account.loginButton') }}
        </router-link>
      </div>
    </div>

    <!-- Logged In -->
    <div v-else class="p-4 space-y-3">
      <!-- Add Button -->
      <button
        class="w-full h-12 bg-white border-2 border-dashed border-gray-200 rounded-2xl text-sm font-bold text-[#006B3F] hover:border-[#006B3F] hover:bg-green-50 transition flex items-center justify-center gap-2"
        @click="openAddForm"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ t('address.add') }}
      </button>

      <!-- Empty State -->
      <div
        v-if="addressStore.addresses.length === 0"
        class="bg-white rounded-2xl p-8 shadow-sm border border-gray-50 text-center"
      >
        <svg class="w-16 h-16 mx-auto text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p class="text-sm font-medium text-gray-500">{{ t('address.empty') }}</p>
        <p class="text-xs text-gray-400 mt-1">{{ t('address.emptyMessage') }}</p>
      </div>

      <!-- Address Cards -->
      <div
        v-for="(addr, index) in addressStore.addresses"
        :key="index"
        class="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 relative"
      >
        <!-- Default Badge -->
        <div
          v-if="index === addressStore.defaultIndex"
          class="absolute top-0 right-4 bg-[#006B3F] text-white text-[10px] font-bold px-2 py-0.5 rounded-b-md"
        >
          {{ t('address.default') }}
        </div>

        <div class="flex items-start gap-3">
          <!-- Pin Icon -->
          <div class="w-10 h-10 rounded-full bg-[#1E3A5F]/10 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-[#1E3A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-gray-800">{{ addr.fullName }}</span>
              <span class="text-xs text-gray-400">{{ addr.phone }}</span>
            </div>
            <p class="text-xs text-gray-500 mt-1 leading-relaxed">{{ getDisplayAddress(addr) }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-gray-50">
          <button
            v-if="index !== addressStore.defaultIndex"
            class="text-[11px] text-[#006B3F] font-bold hover:underline"
            @click="addressStore.setDefault(index)"
          >
            {{ t('address.setDefault') }}
          </button>
          <button
            class="text-[11px] text-gray-500 font-bold hover:underline"
            @click="openEditForm(index)"
          >
            {{ t('address.edit') }}
          </button>
          <button
            class="text-[11px] text-red-500 font-bold hover:underline"
            @click="confirmDelete(index)"
          >
            {{ t('address.delete') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Address Modal -->
    <Modal :show="showForm" :title="editingIndex !== null ? t('address.edit') : t('address.add')" @close="showForm = false">
      <div class="space-y-3 p-1">
        <div>
          <label class="text-xs font-bold text-gray-600 mb-1 block">{{ t('address.fullName') }}</label>
          <input
            v-model="form.fullName"
            type="text"
            :placeholder="t('address.fullNamePlaceholder')"
            class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F7B500] transition"
          />
        </div>
        <div>
          <label class="text-xs font-bold text-gray-600 mb-1 block">{{ t('address.phone') }}</label>
          <input
            v-model="form.phone"
            type="tel"
            :placeholder="t('address.phonePlaceholder')"
            class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F7B500] transition"
          />
        </div>
        <div>
          <label class="text-xs font-bold text-gray-600 mb-1 block">{{ t('address.addressLine1') }}</label>
          <input
            v-model="form.addressLine1"
            type="text"
            :placeholder="t('address.addressLine1Placeholder')"
            class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F7B500] transition"
          />
        </div>
        <div>
          <label class="text-xs font-bold text-gray-600 mb-1 block">{{ t('address.addressLine2') }}</label>
          <input
            v-model="form.addressLine2"
            type="text"
            :placeholder="t('address.addressLine2Placeholder')"
            class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F7B500] transition"
          />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs font-bold text-gray-600 mb-1 block">{{ t('address.city') }}</label>
            <select
              v-model="form.city"
              class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F7B500] transition bg-white"
            >
              <option value="" disabled>{{ t('address.cityPlaceholder') }}</option>
              <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-bold text-gray-600 mb-1 block">{{ t('address.region') }}</label>
            <select
              v-model="form.region"
              class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F7B500] transition bg-white"
            >
              <option value="" disabled>{{ t('address.regionPlaceholder') }}</option>
              <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
            </select>
          </div>
        </div>
        <div class="flex gap-3 pt-2">
          <button
            class="flex-1 h-11 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition"
            @click="showForm = false"
          >
            {{ t('address.cancel') }}
          </button>
          <button
            class="flex-1 h-11 bg-[#F7B500] text-black rounded-xl font-bold text-sm hover:bg-[#e0a200] transition"
            @click="saveAddress"
          >
            {{ t('address.save') }}
          </button>
        </div>
      </div>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal :show="showDeleteConfirm" title="" @close="showDeleteConfirm = false">
      <div class="text-center p-2">
        <svg class="w-14 h-14 mx-auto text-red-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p class="text-sm text-gray-600 mb-6">{{ t('address.deleteConfirm') }}</p>
        <div class="flex gap-3">
          <button
            class="flex-1 h-11 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition"
            @click="showDeleteConfirm = false"
          >
            {{ t('address.cancel') }}
          </button>
          <button
            class="flex-1 h-11 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition"
            @click="doDelete"
          >
            {{ t('address.delete') }}
          </button>
        </div>
      </div>
    </Modal>

    <BottomNav />
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
