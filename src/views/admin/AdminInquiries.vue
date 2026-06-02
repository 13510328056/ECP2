<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { inquiries as staticInquiries } from '@/data/inquiries'
import type { Inquiry } from '@/types'

const router = useRouter()
const adminStore = useAdminStore()

// Merge static mock data with localStorage inquiries from Contact.vue
function loadAllInquiries(): Inquiry[] {
  const stored = JSON.parse(localStorage.getItem('inquiries') || '[]') as Partial<Inquiry>[]
  const localInquiries: Inquiry[] = stored.map(item => ({
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
  // Local inquiries come first (newest), then static mock data
  return [...localInquiries, ...staticInquiries]
}

const inquiries = loadAllInquiries()

type TabKey = 'all' | Inquiry['status']

const activeTab = ref<TabKey>('all')
const searchTerm = ref('')

const tabs: { key: TabKey; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'new', label: '待回复' },
  { key: 'contacted', label: '处理中' },
  { key: 'resolved', label: '已报价' },
  { key: 'closed', label: '已关闭' },
]

const tabCounts = computed(() => {
  const counts: Record<string, number> = { all: inquiries.length }
  for (const status of ['new', 'contacted', 'resolved', 'closed']) {
    counts[status] = inquiries.filter(i => i.status === status).length
  }
  return counts
})

const filteredInquiries = computed(() => {
  let result = inquiries

  // Status filter
  if (activeTab.value !== 'all') {
    result = result.filter(i => i.status === activeTab.value)
  }

  // Search filter (customer name, phone, or message content)
  if (searchTerm.value.trim()) {
    const q = searchTerm.value.trim().toLowerCase()
    result = result.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.phone.toLowerCase().includes(q) ||
      i.message.toLowerCase().includes(q) ||
      (i.productInterest && i.productInterest.toLowerCase().includes(q))
    )
  }

  return result
})

function getStatusInfo(status: Inquiry['status']) {
  const map: Record<Inquiry['status'], { label: string; color: string }> = {
    new: { label: '待回复', color: 'bg-orange-50 text-orange-600' },
    contacted: { label: '处理中', color: 'bg-blue-50 text-blue-600' },
    resolved: { label: '已报价', color: 'bg-green-50 text-green-600' },
    closed: { label: '已关闭', color: 'bg-gray-100 text-gray-500' },
  }
  return map[status]
}

function getSubjectInfo(subject: Inquiry['subject']) {
  const map: Record<Inquiry['subject'], { label: string; color: string }> = {
    general: { label: '一般咨询', color: 'bg-gray-100 text-gray-500' },
    product: { label: '产品咨询', color: 'bg-blue-50 text-blue-600' },
    bulk_order: { label: '批量询价', color: 'bg-purple-50 text-purple-600' },
    custom: { label: '定制需求', color: 'bg-orange-50 text-orange-600' },
    other: { label: '其他', color: 'bg-gray-100 text-gray-500' },
  }
  return map[subject]
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const mins = String(d.getMinutes()).padStart(2, '0')
  return `${month}-${day} ${hours}:${mins}`
}

function goToDetail(id: string) {
  router.push(`/admin/inquiries/${id}`)
}
</script>

<template>
  <div class="max-w-[480px] mx-auto min-h-screen bg-[#f8fafc] relative pb-24">
    <!-- Header -->
    <header class="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-gray-100">
      <div class="flex items-center gap-2">
        <router-link to="/admin/dashboard">
          <svg class="h-8 w-auto" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="#006B3F"/>
            <text x="20" y="27" text-anchor="middle" fill="white" font-size="16" font-weight="900" font-family="sans-serif">L</text>
          </svg>
        </router-link>
        <h1 class="text-lg font-black text-gray-800">询盘管理</h1>
      </div>
      <button class="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
        <svg class="text-gray-600" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </button>
    </header>

    <!-- Status Tabs -->
    <div class="bg-white px-4 flex gap-4 overflow-x-auto hide-scrollbar border-b border-gray-50">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="py-4 text-xs font-bold whitespace-nowrap border-b-2 transition-colors"
        :class="activeTab === tab.key ? 'text-[#006B3F] border-[#006B3F]' : 'text-gray-400 border-transparent hover:text-gray-600'"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}<span class="ml-1">({{ tabCounts[tab.key] }})</span>
      </button>
    </div>

    <!-- Search Bar -->
    <div class="px-4 pt-4">
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          v-model="searchTerm"
          class="w-full h-11 bg-white rounded-xl pl-10 pr-4 text-xs border border-gray-100 outline-none focus:border-[#F7B500] transition-colors shadow-sm"
          placeholder="搜索客户姓名、电话或留言内容..."
          type="text"
        />
      </div>
    </div>

    <!-- Inquiry List -->
    <div class="p-4 space-y-4">
      <div
        v-for="inq in filteredInquiries"
        :key="inq.id"
        class="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 cursor-pointer hover:shadow-md transition-shadow"
        @click="goToDetail(inq.id)"
      >
        <div class="flex justify-between items-center mb-3">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">#{{ inq.id }}</span>
          <span class="px-2 py-0.5 text-[9px] font-bold rounded" :class="getStatusInfo(inq.status).color">{{ getStatusInfo(inq.status).label }}</span>
        </div>
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-bold text-gray-800">{{ inq.name }}</h3>
            <p class="text-[10px] text-gray-400">{{ inq.phone }}</p>
          </div>
          <span class="px-2 py-1 text-[9px] font-bold rounded whitespace-nowrap" :class="getSubjectInfo(inq.subject).color">
            {{ getSubjectInfo(inq.subject).label }}
          </span>
        </div>
        <div v-if="inq.productInterest" class="mb-2">
          <span class="text-[10px] text-[#006B3F] font-medium bg-green-50 px-2 py-0.5 rounded">
            {{ inq.productInterest }}
          </span>
        </div>
        <div class="flex items-center justify-between pt-3 border-t border-gray-50">
          <p class="text-[10px] text-gray-400 truncate flex-1 mr-2">{{ inq.message }}</p>
          <span class="text-[9px] text-gray-300 whitespace-nowrap">{{ formatDate(inq.createdAt) }}</span>
        </div>
      </div>

      <div v-if="filteredInquiries.length === 0" class="text-center py-12">
        <svg class="mx-auto text-gray-300 mb-3" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <p class="text-xs text-gray-400">暂无询盘</p>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-1/2 -translate-x-1/2 w-[480px] max-w-full bg-white border-t border-gray-100 px-4 py-2 flex items-center justify-between z-50">
      <router-link class="flex flex-col items-center gap-1 text-gray-400" to="/admin/dashboard">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
        <span class="text-[10px] font-medium">看板</span>
      </router-link>
      <router-link class="flex flex-col items-center gap-1 text-gray-400" to="/admin/products">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M16.5 9.4 7.55 4.24a1 1 0 0 0-1.1 0L2 6.5l9 5.2 9-5.2Z"/>
          <path d="M21 12v5.5a1 1 0 0 1-.5.87l-8 4.63a1 1 0 0 1-1 0l-8-4.63A1 1 0 0 1 3 17.5V12"/>
        </svg>
        <span class="text-[10px] font-medium">商品</span>
      </router-link>
      <router-link class="flex flex-col items-center gap-1 text-gray-400" to="/admin/orders">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        <span class="text-[10px] font-medium">订单</span>
      </router-link>
      <router-link class="flex flex-col items-center gap-1 text-[#006B3F]" to="/admin/inquiries">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span class="text-[10px] font-medium">询盘</span>
      </router-link>
      <router-link class="flex flex-col items-center gap-1 text-gray-400" to="/admin/settings">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        <span class="text-[10px] font-medium">设置</span>
      </router-link>
    </nav>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
