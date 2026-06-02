<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '@/stores/language'
import { isValidPhone, isValidEmail, isRequired } from '@/utils/validation'
import { CONTACT_EMAIL } from '@/data/contact'
import BottomNav from '@/components/layout/BottomNav.vue'

const { t } = useI18n()
const router = useRouter()
const langStore = useLanguageStore()
const showToast = inject<(message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) => void>('showToast')

// Form data
const form = ref({
  name: '',
  email: '',
  phone: '+233 ',
  subject: '',
  productInterest: '',
  message: '',
})

const validationErrors = ref<Record<string, string>>({})
const submitted = ref(false)
const submitting = ref(false)
const attachments = ref<{ name: string; size: number; type: string }[]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)

const totalAttachmentsSize = computed(() =>
  attachments.value.reduce((sum, f) => sum + f.size, 0)
)
const maxFileSize = 5 * 1024 * 1024 // 5MB

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  const newFiles: { name: string; size: number; type: string }[] = []
  for (const file of input.files) {
    if (file.size > maxFileSize) {
      if (showToast) showToast(`${file.name} exceeds 5MB limit`, 'warning')
      continue
    }
    newFiles.push({ name: file.name, size: file.size, type: file.type })
  }
  attachments.value = [...attachments.value, ...newFiles].slice(0, 3)
  input.value = ''
}

function removeAttachment(index: number) {
  attachments.value.splice(index, 1)
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const subjectOptions = computed(() => [
  { value: 'general', label: t('contactPage.subjects.general') },
  { value: 'product', label: t('contactPage.subjects.product') },
  { value: 'bulkOrder', label: t('contactPage.subjects.bulkOrder') },
  { value: 'custom', label: t('contactPage.subjects.custom') },
  { value: 'other', label: t('contactPage.subjects.other') },
])

function validateForm(): boolean {
  validationErrors.value = {}
  const errs: Record<string, string> = {}

  if (!isRequired(form.value.name)) {
    errs.name = t('validation.requiredField', { field: t('inquiry.form.fullName') })
  }
  if (!isRequired(form.value.email)) {
    errs.email = t('validation.requiredField', { field: t('inquiry.form.email') })
  } else if (!isValidEmail(form.value.email)) {
    errs.email = t('validation.invalidEmail')
  }
  if (!isRequired(form.value.phone.replace('+233 ', ''))) {
    errs.phone = t('validation.requiredField', { field: t('inquiry.form.phone') })
  } else if (!isValidPhone(form.value.phone)) {
    errs.phone = t('validation.invalidPhone')
  }
  if (!isRequired(form.value.subject)) {
    errs.subject = t('validation.requiredSelect')
  }
  if (!isRequired(form.value.message)) {
    errs.message = t('validation.requiredField', { field: t('inquiry.form.message') })
  }

  validationErrors.value = errs
  return Object.keys(errs).length === 0
}

function submitForm() {
  if (!validateForm()) {
    if (showToast) showToast(Object.values(validationErrors.value)[0], 'warning')
    return
  }

  submitting.value = true

  // Store inquiry in localStorage for admin access (MVP)
  const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]')
  inquiries.push({
    id: Date.now(),
    name: form.value.name,
    email: form.value.email,
    phone: form.value.phone,
    subject: form.value.subject,
    productInterest: form.value.productInterest,
    message: form.value.message,
    attachments: attachments.value.length > 0 ? attachments.value.map(a => ({ name: a.name, size: a.size, type: a.type })) : undefined,
    createdAt: new Date().toISOString(),
  })
  localStorage.setItem('inquiries', JSON.stringify(inquiries))

  submitting.value = false
  submitted.value = true
  if (showToast) showToast(t('inquiry.successMessage'), 'success')
}

function resetForm() {
  form.value = { name: '', email: '', phone: '+233 ', subject: '', productInterest: '', message: '' }
  validationErrors.value = {}
  attachments.value = []
  submitted.value = false
}

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="max-w-[480px] mx-auto bg-white min-h-screen relative pb-20 hide-scrollbar">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white px-4 py-4 flex items-center gap-4 shadow-sm">
      <button @click="goBack" class="hover:opacity-70 transition">
        <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <router-link to="/">
        <img src="/images/logo.png" alt="Li's" class="h-8 w-auto" />
      </router-link>
      <h1 class="text-lg font-bold text-gray-800">{{ t('contactPage.title') }}</h1>
    </header>

    <!-- Success State -->
    <div v-if="submitted" class="px-4 pt-8">
      <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-50 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-800 mb-2">{{ t('contactPage.successTitle') }}</h2>
        <p class="text-sm text-gray-500 mb-6">{{ t('contactPage.successMessage') }}</p>
        <button
          class="bg-[#1E3A5F] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-[#152d4a] transition"
          @click="goBack"
        >
          {{ t('contactPage.backHome') }}
        </button>
      </div>
    </div>

    <!-- Contact Content (shown when not submitted) -->
    <template v-if="!submitted">
      <!-- Contact Info Section -->
      <section class="px-4 pt-5">
        <h2 class="font-bold text-base text-gray-800 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-[#1E3A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ t('footer.contact.title') }}
        </h2>

        <div class="space-y-3">
          <!-- Address Card -->
          <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-start gap-3">
            <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-[#1E3A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-400">{{ langStore.locale === 'zh' ? '地址' : 'Address' }}</p>
              <p class="text-sm text-gray-800 font-medium mt-0.5">{{ t('contactPage.address') }}</p>
            </div>
          </div>

          <!-- Phone Card -->
          <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-start gap-3">
            <div class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-400">{{ langStore.locale === 'zh' ? '电话' : 'Phone' }}</p>
              <a :href="'tel:' + t('contactPage.phone')" class="text-sm text-gray-800 font-medium mt-0.5 block hover:text-[#1E3A5F] transition">
                {{ t('contactPage.phone') }}
              </a>
            </div>
          </div>

          <!-- Email Card -->
          <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-start gap-3">
            <div class="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-400">{{ langStore.locale === 'zh' ? '邮箱' : 'Email' }}</p>
              <a :href="'mailto:' + CONTACT_EMAIL" class="text-sm text-gray-800 font-medium mt-0.5 block hover:text-[#1E3A5F] transition">
                {{ CONTACT_EMAIL }}
              </a>
            </div>
          </div>

          <!-- WhatsApp Card -->
          <a
            href="https://wa.me/233241234567"
            target="_blank"
            rel="noopener noreferrer"
            class="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-start gap-3 hover:shadow-md transition block"
          >
            <div class="w-10 h-10 bg-[#DCF8C6] rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-400">{{ t('contactPage.whatsapp') }}</p>
              <p class="text-sm text-gray-800 font-medium mt-0.5">{{ t('contactPage.whatsappText') }}</p>
            </div>
          </a>

          <!-- Hours Card -->
          <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex items-start gap-3">
            <div class="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke-width="2" fill="none" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l4 2" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-400">{{ langStore.locale === 'zh' ? '营业时间' : 'Business Hours' }}</p>
              <p class="text-sm text-gray-800 font-medium mt-0.5">{{ t('contactPage.hours') }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Inquiry Form Section -->
      <section class="px-4 pt-6 pb-8">
        <h2 class="font-bold text-base text-gray-800 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-[#F7B500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          {{ t('contactPage.sendMessage') }}
        </h2>

        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
          <!-- Name -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ t('inquiry.form.fullName') }} <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              :placeholder="t('inquiry.form.fullNamePlaceholder')"
              class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F7B500] transition"
              :class="{ 'border-red-300': validationErrors.name }"
            />
            <p v-if="validationErrors.name" class="text-red-500 text-xs mt-1">{{ validationErrors.name }}</p>
          </div>

          <!-- Email -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ t('inquiry.form.email') }} <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              :placeholder="t('inquiry.form.emailPlaceholder')"
              class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F7B500] transition"
              :class="{ 'border-red-300': validationErrors.email }"
            />
            <p v-if="validationErrors.email" class="text-red-500 text-xs mt-1">{{ validationErrors.email }}</p>
          </div>

          <!-- Phone with +233 prefix -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ t('inquiry.form.phone') }} <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-2">
              <span class="flex items-center text-sm text-gray-500 bg-gray-100 px-3 rounded-lg select-none">+233</span>
              <input
                v-model="form.phone"
                type="text"
                placeholder="XX XXX XXXX"
                class="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F7B500] transition"
                :class="{ 'border-red-300': validationErrors.phone }"
              />
            </div>
            <p v-if="validationErrors.phone" class="text-red-500 text-xs mt-1">{{ validationErrors.phone }}</p>
          </div>

          <!-- Subject -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ t('inquiry.form.subject') }} <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.subject"
              class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F7B500] transition bg-white"
              :class="{ 'border-red-300': validationErrors.subject }"
            >
              <option value="">{{ t('contactPage.subjectDefault') }}</option>
              <option v-for="opt in subjectOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
            <p v-if="validationErrors.subject" class="text-red-500 text-xs mt-1">{{ validationErrors.subject }}</p>
          </div>

          <!-- Product Interest (optional) -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ t('contactPage.productInterest') }}
              <span class="text-gray-400 text-xs font-normal">({{ t('common.optional') }})</span>
            </label>
            <input
              v-model="form.productInterest"
              type="text"
              :placeholder="t('contactPage.productInterestPlaceholder')"
              class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F7B500] transition"
            />
          </div>

          <!-- Message -->
          <div class="mb-5">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ t('inquiry.form.message') }} <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.message"
              :placeholder="t('inquiry.form.messagePlaceholder')"
              class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#F7B500] transition resize-y min-h-[100px]"
              :class="{ 'border-red-300': validationErrors.message }"
            />
            <p v-if="validationErrors.message" class="text-red-500 text-xs mt-1">{{ validationErrors.message }}</p>
          </div>

          <!-- File Upload -->
          <div class="mb-5">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ langStore.locale === 'zh' ? '附件上传' : 'Attachments' }}
              <span class="text-gray-400 text-xs font-normal">({{ langStore.locale === 'zh' ? '选填，最多3个文件，每个不超过5MB' : 'Optional, max 3 files, 5MB each' }})</span>
            </label>

            <!-- Upload Zone -->
            <div
              v-if="attachments.length < 3"
              class="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-[#F7B500] hover:bg-[#FFF8E1] transition"
              @click="fileInputRef?.click()"
            >
              <input
                ref="fileInputRef"
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.zip"
                class="hidden"
                @change="handleFileUpload"
              />
              <svg class="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p class="text-xs text-gray-400">{{ langStore.locale === 'zh' ? '点击上传文件' : 'Click to upload files' }}</p>
              <p class="text-[10px] text-gray-300 mt-1">JPG, PNG, PDF, DOC, ZIP</p>
            </div>

            <!-- File List -->
            <div v-for="(file, idx) in attachments" :key="idx" class="flex items-center gap-3 mt-2 bg-gray-50 rounded-lg px-3 py-2">
              <svg class="w-5 h-5 text-[#1E3A5F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div class="flex-1 min-w-0">
                <p class="text-xs text-gray-700 truncate">{{ file.name }}</p>
                <p class="text-[10px] text-gray-400">{{ formatFileSize(file.size) }}</p>
              </div>
              <button class="text-red-400 hover:text-red-600 transition flex-shrink-0" @click="removeAttachment(idx)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Size warning -->
            <p v-if="totalAttachmentsSize > maxFileSize" class="text-red-500 text-[10px] mt-1">
              {{ langStore.locale === 'zh' ? '附件总大小超过限制' : 'Total attachment size exceeds limit' }}
            </p>
          </div>

          <!-- Submit Button -->
          <button
            class="w-full bg-[#F7B500] text-[#1E3A5F] py-3 rounded-xl text-sm font-bold hover:bg-[#e0a200] transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="submitting"
            @click="submitForm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            {{ submitting ? t('inquiry.sending') : t('inquiry.submit') }}
          </button>
        </div>
      </section>
    </template>

    <!-- Bottom Navigation -->
    <BottomNav />
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
