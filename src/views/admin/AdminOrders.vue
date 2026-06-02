<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { formatPrice } from '@/utils/format'

const router = useRouter()
const adminStore = useAdminStore()

interface MockOrder {
  id: string
  orderNumber: string
  customerName: string
  phone: string
  city: string
  total: number
  itemsCount: number
  status: string
  statusText: string
  statusColor: string
  productImages: string[]
}

const activeTab = ref('all')
const searchTerm = ref('')
const dateStart = ref('')
const dateEnd = ref('')

const tabs = [
  { key: 'all', label: '全部', count: '' },
  { key: 'pending_payment', label: '待付款', count: '5' },
  { key: 'pending', label: '待发货', count: '12' },
  { key: 'shipped', label: '已发货', count: '84' },
  { key: 'completed', label: '已完成', count: '1.2k' }
]

const orders = ref<MockOrder[]>([
  {
    id: '1',
    orderNumber: 'GH88293401',
    customerName: 'Kwame Mensah',
    phone: '+233 24 123 4567',
    city: 'Accra',
    total: 5975,
    itemsCount: 3,
    status: 'paid',
    statusText: '已支付 / 待发货',
    statusColor: 'bg-green-50 text-green-600',
    productImages: []
  },
  {
    id: '2',
    orderNumber: 'GH88293402',
    customerName: 'Abena Appiah',
    phone: '+233 55 987 6543',
    city: 'Kumasi',
    total: 1250,
    itemsCount: 1,
    status: 'pending_payment',
    statusText: '待付款',
    statusColor: 'bg-yellow-50 text-yellow-600',
    productImages: []
  },
  {
    id: '3',
    orderNumber: 'GH88293390',
    customerName: 'Kofi Boateng',
    phone: '+233 20 456 7890',
    city: 'Takoradi',
    total: 320,
    itemsCount: 2,
    status: 'completed',
    statusText: '已完成',
    statusColor: 'bg-green-100 text-green-700',
    productImages: []
  },
  {
    id: '4',
    orderNumber: 'GH88293410',
    customerName: 'Ama Serwaa',
    phone: '+233 50 321 6547',
    city: 'Accra',
    total: 4200,
    itemsCount: 4,
    status: 'shipped',
    statusText: '已发货',
    statusColor: 'bg-cyan-50 text-cyan-600',
    productImages: []
  },
  {
    id: '5',
    orderNumber: 'GH88293385',
    customerName: 'Yaw Asante',
    phone: '+233 24 987 1234',
    city: 'Cape Coast',
    total: 1890,
    itemsCount: 2,
    status: 'pending',
    statusText: '待发货',
    statusColor: 'bg-orange-50 text-orange-600',
    productImages: []
  },
  {
    id: '6',
    orderNumber: 'GH88293415',
    customerName: 'Efia Osei',
    phone: '+233 54 765 4321',
    city: 'Tamale',
    total: 780,
    itemsCount: 1,
    status: 'cancelled',
    statusText: '已取消',
    statusColor: 'bg-gray-100 text-gray-500',
    productImages: []
  }
])

const filteredOrders = computed(() => {
  let result = orders.value

  // Status filter
  if (activeTab.value !== 'all') {
    result = result.filter(o => o.status === activeTab.value)
  }

  // Search filter (order number or customer name)
  if (searchTerm.value.trim()) {
    const q = searchTerm.value.trim().toLowerCase()
    result = result.filter(o =>
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q)
    )
  }

  // Date range filter (by order number prefix heuristic — mock date from order number)
  if (dateStart.value) {
    const start = new Date(dateStart.value)
    result = result.filter(o => {
      // Use a mock date derived from orderNumber's last 5 digits as day offset
      const dayOffset = parseInt(o.orderNumber.slice(-5), 10) % 30
      const mockDate = new Date(2025, 4, 1 + dayOffset)
      return mockDate >= start
    })
  }
  if (dateEnd.value) {
    const end = new Date(dateEnd.value)
    end.setHours(23, 59, 59, 999)
    result = result.filter(o => {
      const dayOffset = parseInt(o.orderNumber.slice(-5), 10) % 30
      const mockDate = new Date(2025, 4, 1 + dayOffset)
      return mockDate <= end
    })
  }

  return result
})

function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending_payment: 'bg-yellow-50 text-yellow-600',
    paid: 'bg-green-50 text-green-600',
    pending: 'bg-orange-50 text-orange-600',
    shipped: 'bg-cyan-50 text-cyan-600',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-gray-100 text-gray-500',
    processing: 'bg-blue-50 text-blue-600'
  }
  return map[status] || 'bg-gray-100 text-gray-500'
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
        <h1 class="text-lg font-black text-gray-800">订单管理</h1>
      </div>
      <button class="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
        <svg class="text-xl text-gray-600" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
        </svg>
      </button>
    </header>

    <!-- Status Tabs -->
    <div class="bg-white px-4 flex gap-6 overflow-x-auto hide-scrollbar border-b border-gray-50">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="py-4 text-xs font-bold whitespace-nowrap border-b-2 transition-colors"
        :class="activeTab === tab.key ? 'text-[#006B3F] border-[#006B3F]' : 'text-gray-400 border-transparent hover:text-gray-600'"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}<span v-if="tab.count" class="ml-1">({{ tab.count }})</span>
      </button>
    </div>

    <!-- Search & Filter Bar -->
    <div class="px-4 pt-4 pb-2">
      <div class="bg-white rounded-2xl p-3 shadow-sm border border-gray-50 space-y-3">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            v-model="searchTerm"
            class="w-full h-10 bg-gray-50 rounded-xl pl-10 pr-4 text-xs outline-none border border-gray-100 focus:border-[#F7B500] transition-colors"
            placeholder="搜索订单号或客户姓名..."
            type="text"
          />
        </div>
        <div class="flex items-center gap-2">
          <div class="flex-1">
            <input
              v-model="dateStart"
              class="w-full h-9 bg-gray-50 rounded-lg px-3 text-[10px] outline-none border border-gray-100 focus:border-[#F7B500] transition-colors"
              placeholder="开始日期"
              type="date"
            />
          </div>
          <span class="text-[10px] text-gray-400">至</span>
          <div class="flex-1">
            <input
              v-model="dateEnd"
              class="w-full h-9 bg-gray-50 rounded-lg px-3 text-[10px] outline-none border border-gray-100 focus:border-[#F7B500] transition-colors"
              placeholder="结束日期"
              type="date"
            />
          </div>
        </div>
        <div class="text-[10px] text-gray-400 text-right">
          共 {{ filteredOrders.length }} 条结果
        </div>
      </div>
    </div>

    <!-- Order List -->
    <div class="px-4 pb-4 space-y-4">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 cursor-pointer hover:shadow-md transition-shadow"
        @click="router.push('/admin/orders/' + order.id)"
      >
        <div class="flex justify-between items-center mb-3">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">#{{ order.orderNumber }}</span>
          <span class="px-2 py-0.5 text-[9px] font-bold rounded" :class="getStatusColor(order.status)">{{ order.statusText }}</span>
        </div>
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <svg class="text-gray-400 text-xl" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-800">{{ order.customerName }}</h3>
            <p class="text-[10px] text-gray-400">{{ order.phone }} &bull; {{ order.city }}</p>
          </div>
        </div>
        <div class="flex items-center justify-between pt-3 border-t border-gray-50">
          <div class="flex -space-x-2">
            <div
              v-for="n in Math.min(order.itemsCount, 3)"
              :key="n"
              class="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center"
            >
              <svg class="text-gray-400" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              </svg>
            </div>
            <div
              v-if="order.itemsCount > 3"
              class="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-400"
            >+{{ order.itemsCount - 3 }}</div>
          </div>
          <div class="text-right">
            <p class="text-[9px] text-gray-400">总计金额</p>
            <p class="text-sm font-black text-gray-800">{{ formatPrice(order.total) }}</p>
          </div>
        </div>
      </div>

      <div v-if="filteredOrders.length === 0" class="text-center py-12">
        <svg class="mx-auto text-gray-300 mb-3" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <p class="text-xs text-gray-400">暂无订单</p>
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
      <router-link class="flex flex-col items-center gap-1 text-[#006B3F]" to="/admin/orders">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        <span class="text-[10px] font-medium">订单</span>
      </router-link>
      <router-link class="flex flex-col items-center gap-1 text-gray-400" to="/admin/inquiries">
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
