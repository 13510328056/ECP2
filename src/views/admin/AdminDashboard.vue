<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { formatPrice } from '@/utils/format'

const router = useRouter()
const adminStore = useAdminStore()

// Mock recent orders
const recentOrders = ref([
  {
    id: '1',
    orderNumber: 'GH88293401',
    customerName: 'Kwame Mensah',
    phone: '+233 24 123 4567',
    total: 5975,
    status: 'paid',
    statusText: '已支付',
    statusColor: 'text-green-600 bg-green-100'
  },
  {
    id: '2',
    orderNumber: 'GH88293402',
    customerName: 'Abena Appiah',
    phone: '+233 55 987 6543',
    total: 1250,
    status: 'pending',
    statusText: '待发货',
    statusColor: 'text-yellow-600 bg-yellow-100'
  },
  {
    id: '3',
    orderNumber: 'GH88293403',
    customerName: 'Kofi Boateng',
    phone: '+233 20 456 7890',
    total: 850,
    status: 'pending_payment',
    statusText: '待付款',
    statusColor: 'text-blue-600 bg-blue-100'
  },
  {
    id: '4',
    orderNumber: 'GH88293404',
    customerName: 'Ama Serwaa',
    phone: '+233 50 321 6547',
    total: 3200,
    status: 'shipped',
    statusText: '已发货',
    statusColor: 'text-cyan-600 bg-cyan-100'
  }
])

// Mock sales chart data
const salesData = ref([12000, 18000, 15000, 25000, 22000, 32000, 42500])
const salesLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const maxSales = computed(() => Math.max(...salesData.value))

function goToOrders() {
  router.push('/admin/orders')
}

function goToProducts() {
  router.push('/admin/products')
}
</script>

<template>
  <div class="max-w-[480px] mx-auto min-h-screen bg-[#f8fafc] relative pb-24">
    <!-- Header -->
    <header class="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <router-link to="/admin/dashboard">
          <svg class="h-10 w-auto" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="#006B3F"/>
            <text x="20" y="26" text-anchor="middle" fill="white" font-size="14" font-weight="900" font-family="sans-serif">L</text>
          </svg>
        </router-link>
        <div>
          <h1 class="text-sm font-black text-gray-800">管理中心</h1>
          <p class="text-[10px] text-gray-400">欢迎回来, 管理员</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button class="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center relative">
          <svg class="text-xl text-gray-600" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div class="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-[#006B3F] flex items-center justify-center text-white text-sm font-bold overflow-hidden">
          A
        </div>
      </div>
    </header>

    <!-- Stats Cards -->
    <div class="p-4 grid grid-cols-2 gap-4">
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
        <div class="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
          <svg class="text-blue-500 text-lg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7"/>
          </svg>
        </div>
        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">今日订单</p>
        <div class="flex items-baseline gap-2 mt-1">
          <span class="text-xl font-black text-gray-800">128</span>
          <span class="text-[10px] text-green-500 font-bold">+12%</span>
        </div>
      </div>
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
        <div class="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center mb-3">
          <svg class="text-orange-500 text-lg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">今日销售额</p>
        <div class="flex items-baseline gap-1 mt-1">
          <span class="text-lg font-black text-gray-800">₵42.5k</span>
          <span class="text-[10px] text-green-500 font-bold">+8%</span>
        </div>
      </div>
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
        <div class="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center mb-3">
          <svg class="text-red-500 text-lg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">待处理订单</p>
        <div class="flex items-baseline gap-2 mt-1">
          <span class="text-xl font-black text-gray-800">24</span>
          <span class="text-[10px] text-gray-300 font-normal">需发货</span>
        </div>
      </div>
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
        <div class="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center mb-3">
          <svg class="text-purple-500 text-lg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16.5 9.4 7.55 4.24a1 1 0 0 0-1.1 0L2 6.5l9 5.2 9-5.2Z"/>
            <path d="M21 12v5.5a1 1 0 0 1-.5.87l-8 4.63a1 1 0 0 1-1 0l-8-4.63A1 1 0 0 1 3 17.5V12"/>
            <path d="M12 17.5V12"/>
          </svg>
        </div>
        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">库存预警</p>
        <div class="flex items-baseline gap-2 mt-1">
          <span class="text-xl font-black text-gray-800">15</span>
          <span class="text-[10px] text-red-500 font-bold">急需补货</span>
        </div>
      </div>
    </div>

    <!-- Sales Chart Area -->
    <div class="px-4 mb-4">
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-gray-800">销售趋势 (最近7天)</h3>
          <svg class="text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
          </svg>
        </div>
        <!-- Inline SVG Bar Chart -->
        <div class="w-full h-48 flex items-end gap-3 px-2">
          <div
            v-for="(val, idx) in salesData"
            :key="idx"
            class="flex-1 flex flex-col items-center gap-1"
          >
            <div class="w-full rounded-md relative" :style="{ height: (val / maxSales) * 100 + '%', background: 'linear-gradient(to top, #F7B500, #FFD700)', minHeight: '8px', opacity: 0.85 }">
            </div>
            <span class="text-[9px] text-gray-400 mt-1">{{ salesLabels[idx] }}</span>
          </div>
          <!-- Smooth line overlay -->
          <svg class="absolute inset-0 w-full h-full pointer-events-none" style="left:0;top:0;width:100%;height:100%">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#F7B500" stop-opacity="0.15"/>
                <stop offset="100%" stop-color="#F7B500" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <path
              d="M 32,168 Q 64,96 96,120 Q 128,60 160,96 Q 192,60 224,24 L 224,168 Z"
              fill="url(#areaGrad)"
              opacity="0.4"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="px-4 mb-4">
      <div class="flex gap-2 flex-wrap">
        <router-link
          class="flex-1 bg-[#10B981] text-white py-3 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 hover:bg-[#059669] transition-colors no-underline"
          to="/admin/categories"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/>
            <rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/>
          </svg>
          分类管理
        </router-link>
        <button
          class="flex-1 bg-[#1E3A5F] text-white py-3 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 hover:bg-[#162c49] transition-colors"
          @click="goToProducts"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          新增商品
        </button>
        <button
          class="flex-1 bg-[#006B3F] text-white py-3 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 hover:bg-[#005a35] transition-colors"
          @click="goToOrders"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="9 11 12 14 22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          处理订单
        </button>
        <button class="flex-1 bg-[#F59E0B] text-white py-3 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 hover:bg-[#d97706] transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          回复询盘
        </button>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="px-4 mb-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-gray-800">最近订单</h3>
        <router-link class="text-xs text-[#006B3F] font-bold" to="/admin/orders">全部订单</router-link>
      </div>
      <div class="space-y-3">
        <div
          v-for="order in recentOrders"
          :key="order.id"
          class="bg-white p-3 rounded-xl border border-gray-50 flex items-center justify-between cursor-pointer hover:shadow-sm transition-shadow"
          @click="router.push('/admin/orders/' + order.id)"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg class="text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-800">{{ order.customerName }}</p>
              <p class="text-[10px] text-gray-400">{{ order.orderNumber }} &bull; {{ formatPrice(order.total) }}</p>
            </div>
          </div>
          <span class="px-2 py-1 text-[9px] font-bold rounded" :class="order.statusColor">{{ order.statusText }}</span>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-1/2 -translate-x-1/2 w-[480px] max-w-full bg-white border-t border-gray-100 px-4 py-2 flex items-center justify-between z-50">
      <router-link class="flex flex-col items-center gap-1 text-[#006B3F]" to="/admin/dashboard">
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
