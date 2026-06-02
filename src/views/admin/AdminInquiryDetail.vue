<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { inquiries as staticInquiries } from '@/data/inquiries'
import type { Inquiry } from '@/types'

const router = useRouter()
const route = useRoute()
const { toast, showToast } = useToast()

const inquiryId = route.params.id as string

// Merge static mock data with localStorage inquiries
function loadLocalInquiries(): Inquiry[] {
  const stored = JSON.parse(localStorage.getItem('inquiries') || '[]') as Partial<Inquiry>[]
  return stored.map(item => ({
    id: String(item.id || Date.now()),
    name: item.name || '',
    email: item.email || '',
    phone: item.phone || '',
    subject: (item.subject as Inquiry['subject']) || 'general',
    productInterest: item.productInterest,
    message: item.message || '',
    status: (item.status as Inquiry['status']) || 'new',
    createdAt: item.createdAt || new Date().toISOString(),
    attachments: item.attachments,
  }))
}

const allInquiries = computed(() => [...loadLocalInquiries(), ...staticInquiries])

const inquiry = ref<Inquiry | null>(allInquiries.value.find(i => i.id === inquiryId) || null)
const selectedStatus = ref<Inquiry['status']>(inquiry.value?.status ?? 'new')
const replyText = ref('')
const replyMethod = ref<'whatsapp' | 'email' | 'phone'>('whatsapp')

interface ReplyEntry {
  id: string
  type: 'received' | 'sent'
  content: string
  method?: 'whatsapp' | 'email' | 'phone'
  timestamp: string
}

const replies = ref<ReplyEntry[]>([
  {
    id: 'r-1',
    type: 'received',
    content: (inquiry.value?.message || ''),
    timestamp: (inquiry.value?.createdAt || new Date().toISOString()),
  },
])

const found = computed(() => inquiry.value !== null)

function getStatusInfo(status: Inquiry['status']) {
  const map: Record<Inquiry['status'], { label: string; color: string; banner: string }> = {
    new: { label: '待回复', color: 'bg-orange-50 text-orange-600', banner: 'bg-orange-500' },
    contacted: { label: '处理中', color: 'bg-blue-50 text-blue-600', banner: 'bg-blue-500' },
    resolved: { label: '已报价', color: 'bg-green-50 text-green-600', banner: 'bg-green-600' },
    closed: { label: '已关闭', color: 'bg-gray-100 text-gray-500', banner: 'bg-gray-500' },
  }
  return map[status]
}

function getSubjectLabel(subject: Inquiry['subject']) {
  const map: Record<Inquiry['subject'], string> = {
    general: '一般咨询',
    product: '产品咨询',
    bulk_order: '批量询价',
    custom: '定制需求',
    other: '其他',
  }
  return map[subject]
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const mins = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${mins}`
}

function saveStatus() {
  if (inquiry.value) {
    inquiry.value.status = selectedStatus.value
    showToast('状态已更新', 'success')
  }
}

function openWhatsApp() {
  if (inquiry.value) {
    const phone = inquiry.value.phone.replace(/[^0-9]/g, '')
    window.open(`https://wa.me/${phone}`, '_blank')
  }
}

async function copyEmail() {
  if (inquiry.value) {
    try {
      await navigator.clipboard.writeText(inquiry.value.email)
      showToast('邮箱地址已复制', 'success')
    } catch {
      showToast('复制失败', 'error')
    }
  }
}

function goBack() {
  router.push('/admin/inquiries')
}

function getMethodLabel(method?: 'whatsapp' | 'email' | 'phone') {
  const map: Record<string, string> = {
    whatsapp: 'WhatsApp',
    email: 'Email',
    phone: '电话',
  }
  return method ? map[method] : ''
}

function sendReply() {
  if (!replyText.value.trim()) {
    showToast('请输入回复内容', 'error')
    return
  }

  const now = new Date()
  const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  replies.value.push({
    id: 'r-' + Date.now(),
    type: 'sent',
    content: replyText.value,
    method: replyMethod.value,
    timestamp: ts,
  })

  replyText.value = ''
  showToast('回复已发送', 'success')
}
</script>

<template>
  <div class="max-w-[480px] mx-auto min-h-screen bg-[#f8fafc] relative pb-32">
    <!-- Toast -->
    <Teleport to="body">
      <Transition name="toast-fade">
        <div
          v-if="toast.show"
          class="fixed top-5 left-1/2 -translate-x-1/2 z-[999] px-6 py-3 rounded-xl text-sm font-bold shadow-lg text-white"
          :class="toast.type === 'error' ? 'bg-red-500' : 'bg-[#006B3F]'"
        >
          {{ toast.message }}
        </div>
      </Transition>
    </Teleport>

    <!-- Not Found State -->
    <template v-if="!found">
      <div class="p-4">
        <button @click="goBack" class="flex items-center gap-2 text-sm text-[#006B3F] font-bold mb-8">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          返回
        </button>
        <div class="text-center py-20">
          <svg class="mx-auto text-gray-300 mb-3" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p class="text-sm font-bold text-gray-400">未找到询盘信息</p>
          <p class="text-xs text-gray-300 mt-1">ID: {{ inquiryId }}</p>
        </div>
      </div>
    </template>

    <!-- Detail Content -->
    <template v-if="inquiry">
      <!-- Header -->
      <header class="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <button @click="goBack">
            <svg class="text-2xl text-gray-800" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
          </button>
          <router-link to="/admin/dashboard">
            <svg class="h-8 w-auto" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="#006B3F"/>
              <text x="20" y="27" text-anchor="middle" fill="white" font-size="16" font-weight="900" font-family="sans-serif">L</text>
            </svg>
          </router-link>
          <h1 class="text-lg font-black text-gray-800">询盘详情</h1>
        </div>
        <span class="text-[9px] text-gray-400 font-bold">#{{ inquiry.id }}</span>
      </header>

      <!-- Status Banner -->
      <div class="p-4 text-white" :class="getStatusInfo(inquiry.status).banner">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-black">{{ getStatusInfo(inquiry.status).label }}</h2>
            <p class="text-white/70 text-[10px] mt-1">询盘编号: {{ inquiry.id }}</p>
          </div>
          <svg class="text-white/30" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
      </div>

      <!-- Content Cards -->
      <div class="p-4 space-y-4">
        <!-- Customer Info -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">客户信息</h3>
          <div class="flex items-start gap-3">
            <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="text-gray-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-base font-bold text-gray-800">{{ inquiry.name }}</h4>
              <p class="text-xs text-gray-500 mt-1">{{ inquiry.email }}</p>
              <a :href="'tel:' + inquiry.phone" class="text-xs text-[#006B3F] font-bold hover:underline inline-flex items-center gap-1 mt-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                {{ inquiry.phone }}
              </a>
            </div>
          </div>
        </div>

        <!-- Inquiry Details -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">询盘内容</h3>
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold text-gray-400">咨询类型:</span>
              <span class="text-[10px] px-2 py-0.5 rounded bg-gray-50 text-gray-500 font-medium">{{ getSubjectLabel(inquiry.subject) }}</span>
            </div>
            <div v-if="inquiry.productInterest" class="flex items-center gap-2">
              <span class="text-[10px] font-bold text-gray-400">感兴趣产品:</span>
              <span class="text-[10px] px-2 py-0.5 rounded bg-green-50 text-[#006B3F] font-medium">{{ inquiry.productInterest }}</span>
            </div>
            <div class="pt-3 border-t border-gray-50">
              <p class="text-[10px] font-bold text-gray-400 mb-2">客户留言:</p>
              <p class="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">{{ inquiry.message }}</p>
            </div>
            <div class="pt-3 border-t border-gray-50">
              <p class="text-[10px] text-gray-400">提交时间: {{ formatDate(inquiry.createdAt) }}</p>
            </div>
          </div>
        </div>

        <!-- Status Update -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">更新状态</h3>
          <div class="flex items-center gap-3">
            <select
              v-model="selectedStatus"
              class="flex-1 h-11 bg-gray-50 rounded-xl px-4 text-xs outline-none border border-transparent focus:border-[#F7B500] transition-colors"
            >
              <option value="new">待回复</option>
              <option value="contacted">处理中</option>
              <option value="resolved">已报价</option>
              <option value="closed">已关闭</option>
            </select>
            <button
              class="h-11 px-6 bg-[#006B3F] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-[#005a35] transition-colors flex items-center gap-1.5"
              @click="saveStatus"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              保存
            </button>
          </div>
        </div>

        <!-- Communication Timeline -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            沟通记录
          </h3>
          <div class="relative">
            <div class="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
            <div class="space-y-5">
              <div v-for="(reply, idx) in replies" :key="reply.id" class="flex gap-4 relative">
                <div
                  class="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 mt-0.5"
                  :class="reply.type === 'received' ? 'bg-gray-200' : 'bg-[#006B3F]'"
                >
                  <svg v-if="reply.type === 'sent'" class="text-white" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <svg v-else class="text-gray-500" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <p class="text-[10px] font-bold" :class="reply.type === 'received' ? 'text-gray-600' : 'text-[#006B3F]'">
                      {{ reply.type === 'received' ? '客户咨询' : '我方回复' }}
                      <span v-if="reply.method" class="font-normal text-gray-400 ml-1">({{ getMethodLabel(reply.method) }})</span>
                    </p>
                    <span class="text-[9px] text-gray-400 whitespace-nowrap">{{ reply.timestamp }}</span>
                  </div>
                  <p class="text-xs text-gray-700 mt-1 leading-relaxed">{{ reply.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-2 gap-3">
          <button
            class="bg-[#25D366] text-white rounded-xl py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-[#20bd5a] transition-colors"
            @click="openWhatsApp"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.9.528 3.68 1.436 5.2L2 22l4.8-1.436A10 10 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18a8 8 0 0 1-4.08-1.12l-.3-.18-2.85.85.85-2.85-.18-.3A8 8 0 1 1 12 20z"/>
            </svg>
            Send WhatsApp
          </button>
          <button
            class="bg-gray-100 text-gray-700 rounded-xl py-3 text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
            @click="copyEmail"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            复制邮箱
          </button>
        </div>

        <!-- Reply Form -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">发送回复</h3>
          <textarea
            v-model="replyText"
            class="w-full h-28 bg-gray-50 rounded-xl p-4 text-xs outline-none border border-transparent focus:border-[#F7B500] transition-colors resize-none"
            placeholder="输入回复内容..."
          ></textarea>
          <div class="mt-3">
            <label class="text-[10px] font-bold text-gray-400 block mb-2">回复方式</label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="replyMethod"
                  class="w-4 h-4 text-[#006B3F] focus:ring-[#006B3F]"
                  type="radio"
                  value="whatsapp"
                />
                <span class="text-xs text-gray-600">WhatsApp</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="replyMethod"
                  class="w-4 h-4 text-[#006B3F] focus:ring-[#006B3F]"
                  type="radio"
                  value="email"
                />
                <span class="text-xs text-gray-600">Email</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="replyMethod"
                  class="w-4 h-4 text-[#006B3F] focus:ring-[#006B3F]"
                  type="radio"
                  value="phone"
                />
                <span class="text-xs text-gray-600">电话</span>
              </label>
            </div>
          </div>
          <button
            class="w-full mt-4 h-11 bg-[#006B3F] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-[#005a35] transition-colors"
            @click="sendReply"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            发送回复
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.toast-fade-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.toast-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.toast-fade-enter-from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
.toast-fade-leave-to { opacity: 0; transform: translateX(-50%) translateY(-10px); }
</style>
