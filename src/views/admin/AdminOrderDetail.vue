<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { formatPrice } from '@/utils/format'

const router = useRouter()
const route = useRoute()
const { toast, showToast } = useToast()

// Mock order data
const order = ref({
  orderNumber: 'GH88293401',
  createdAt: '2024-05-30 14:20',
  paymentMethod: 'MTN MOMO',
  transactionId: 'TRX_99210023',
  status: 'pending' as 'pending_payment' | 'paid' | 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled',
  customer: {
    name: 'Kwame Mensah',
    phone: '+233 24 123 4567',
    address: 'House No. 45, Independence Avenue, Ridge, Accra, Ghana'
  },
  items: [
    { id: 1, name: 'Smartphone Pro 14', sku: 'GH-PH-14-256-GR', quantity: 1, price: 4250, image: '' },
    { id: 2, name: 'Wireless Headphones', sku: 'GH-AU-WL-BLK', quantity: 2, price: 850, image: '' }
  ],
  subtotal: 5950,
  shipping: 25,
  discount: 0,
  total: 5975,
  logistics: {
    company: '',
    trackingNumber: '',
    estimatedDelivery: ''
  }
})

const statusInfo = computed(() => {
  const statusMap: Record<string, { title: string; desc: string; icon: string; color: string }> = {
    pending_payment: { title: '待付款', desc: '客户尚未完成支付', icon: 'mdi:clock-outline', color: 'bg-yellow-500' },
    paid: { title: '已支付', desc: '客户已通过 MTN MOMO 完成支付', icon: 'mdi:check-circle-outline', color: 'bg-blue-500' },
    pending: { title: '待发货', desc: '客户已通过 MTN MOMO 完成支付', icon: 'mdi:truck-fast-outline', color: 'bg-[#006B3F]' },
    processing: { title: '配货中', desc: '订单正在配货处理', icon: 'mdi:package-variant-closed', color: 'bg-blue-600' },
    shipped: { title: '已发货', desc: '包裹已在运输途中', icon: 'mdi:truck-delivery', color: 'bg-cyan-600' },
    completed: { title: '已完成', desc: '订单已完成交付', icon: 'mdi:check-circle', color: 'bg-green-600' },
    cancelled: { title: '已取消', desc: '订单已被取消', icon: 'mdi:close-circle-outline', color: 'bg-gray-500' }
  }
  return statusMap[order.value.status] || statusMap.pending
})

const showActions = computed(() => {
  return ['pending', 'paid', 'processing'].includes(order.value.status)
})

function handleAction(action: string) {
  switch (action) {
    case 'confirm':
      order.value.status = 'paid'
      showToast('订单已确认', 'success')
      break
    case 'prepare':
      order.value.status = 'processing'
      showToast('已转为配货中', 'success')
      break
    case 'ship':
      if (!order.value.logistics.company || !order.value.logistics.trackingNumber) {
        showToast('请填写物流信息', 'error')
        return
      }
      order.value.status = 'shipped'
      showToast('已发货', 'success')
      break
    case 'cancel':
      order.value.status = 'cancelled'
      showToast('订单已取消', 'success')
      break
    case 'complete':
      order.value.status = 'completed'
      showToast('订单已完成', 'success')
      break
  }
}

const showLogistics = ref(false)
const logisticsSaving = ref(false)

const operationLogs = ref([
  { timestamp: '2024-05-30 14:20:00', action: '客户下单', operator: 'Kwame Mensah', icon: 'cart' },
  { timestamp: '2024-05-30 14:25:00', action: '订单已确认，等待配货', operator: '管理员', icon: 'check' },
  { timestamp: '2024-05-30 16:00:00', action: '配货中', operator: '仓库组', icon: 'package' },
  { timestamp: '2024-05-31 09:30:00', action: '已发货', operator: '物流组', icon: 'truck' },
])

function saveLogistics() {
  logisticsSaving.value = true
  setTimeout(() => {
    logisticsSaving.value = false
    showToast('物流信息已保存', 'success')
  }, 400)
}

function goBack() {
  router.push('/admin/orders')
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
        <h1 class="text-lg font-black text-gray-800">订单处理</h1>
      </div>
      <button class="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
        <svg class="text-xl text-gray-600" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
        </svg>
      </button>
    </header>

    <!-- Status Banner -->
    <div class="p-6 text-white" :class="statusInfo.color">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-black">{{ statusInfo.title }}</h2>
          <p class="text-white/70 text-[10px] mt-1">{{ statusInfo.desc }}</p>
        </div>
        <svg v-if="statusInfo.title === '待发货'" class="text-4xl text-white/30" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
        <svg v-else-if="statusInfo.title === '已支付'" class="text-4xl text-white/30" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <svg v-else-if="statusInfo.title === '待付款'" class="text-4xl text-white/30" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        <svg v-else class="text-4xl text-white/30" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      </div>
    </div>

    <!-- Info Cards -->
    <div class="p-4 space-y-4">
      <!-- Order Base Info -->
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">基本信息</h3>
        <div class="grid grid-cols-2 gap-y-4">
          <div>
            <p class="text-[10px] text-gray-400">订单号</p>
            <p class="text-xs font-bold text-gray-800">{{ order.orderNumber }}</p>
          </div>
          <div>
            <p class="text-[10px] text-gray-400">下单时间</p>
            <p class="text-xs font-bold text-gray-800">{{ order.createdAt }}</p>
          </div>
          <div>
            <p class="text-[10px] text-gray-400">支付方式</p>
            <p class="text-xs font-bold text-gray-800">{{ order.paymentMethod }}</p>
          </div>
          <div>
            <p class="text-[10px] text-gray-400">支付流水号</p>
            <p class="text-xs font-bold text-gray-800">{{ order.transactionId }}</p>
          </div>
        </div>
      </div>

      <!-- Customer Info -->
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">客户与配送</h3>
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="text-gray-400 text-xl" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <p class="text-sm font-bold text-gray-800">{{ order.customer.name }}</p>
              <a :href="'https://wa.me/' + order.customer.phone.replace(/[^0-9]/g, '')" target="_blank" class="text-[#006B3F] text-lg hover:opacity-80 transition-opacity">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 1.9.528 3.68 1.436 5.2L2 22l4.8-1.436A10 10 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18a8 8 0 0 1-4.08-1.12l-.3-.18-2.85.85.85-2.85-.18-.3A8 8 0 1 1 12 20z"/>
                </svg>
              </a>
            </div>
            <p class="text-xs text-gray-500 mt-0.5">{{ order.customer.phone }}</p>
            <p class="text-[11px] text-gray-400 mt-2 leading-tight">{{ order.customer.address }}</p>
          </div>
        </div>
      </div>

      <!-- Product Items -->
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">商品明细</h3>
        <div class="space-y-4">
          <div v-for="item in order.items" :key="item.id" class="flex gap-3">
            <div class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <svg class="text-gray-300" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              </svg>
            </div>
            <div class="flex-1">
              <h4 class="text-xs font-bold text-gray-800">{{ item.name }}</h4>
              <p class="text-[9px] text-gray-400">SKU: {{ item.sku }} &bull; x{{ item.quantity }}</p>
            </div>
            <span class="text-xs font-bold text-gray-800">{{ formatPrice(item.price) }}</span>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-50 space-y-2">
          <div class="flex justify-between text-[11px]">
            <span class="text-gray-400">商品小计</span>
            <span class="text-gray-800 font-bold">{{ formatPrice(order.subtotal) }}</span>
          </div>
          <div class="flex justify-between text-[11px]">
            <span class="text-gray-400">配送费</span>
            <span class="text-gray-800 font-bold">{{ formatPrice(order.shipping) }}</span>
          </div>
          <div v-if="order.discount > 0" class="flex justify-between text-[11px]">
            <span class="text-green-600">折扣</span>
            <span class="text-green-600 font-bold">-{{ formatPrice(order.discount) }}</span>
          </div>
          <div class="flex justify-between items-center pt-2">
            <span class="text-xs font-bold text-gray-800">实收金额</span>
            <span class="text-lg font-black text-[#F7B500]">{{ formatPrice(order.total) }}</span>
          </div>
        </div>
      </div>

      <!-- Logistics Management (Collapsible) -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
        <button
          class="w-full px-4 py-4 flex items-center justify-between"
          type="button"
          @click="showLogistics = !showLogistics"
        >
          <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            物流信息
          </h3>
          <svg
            class="text-gray-400 transition-transform"
            :class="{ 'rotate-180': showLogistics }"
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <Transition name="collapse">
          <div v-show="showLogistics" class="px-4 pb-4 border-t border-gray-50 space-y-4 pt-4">
            <div>
              <label class="text-[10px] font-bold text-gray-400 block mb-1">物流公司</label>
              <select
                v-model="order.logistics.company"
                class="w-full h-11 bg-gray-50 rounded-xl px-4 text-xs outline-none border border-transparent focus:border-[#F7B500] transition-colors"
              >
                <option value="">请选择物流公司</option>
                <option value="DHL">DHL</option>
                <option value="FedEx">FedEx</option>
                <option value="UPS">UPS</option>
                <option value="Ghana Post">Ghana Post</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label class="text-[10px] font-bold text-gray-400 block mb-1">运单号</label>
              <input
                v-model="order.logistics.trackingNumber"
                class="w-full h-11 bg-gray-50 rounded-xl px-4 text-xs outline-none border border-transparent focus:border-[#F7B500] transition-colors"
                placeholder="输入运单号..."
                type="text"
              />
            </div>
            <div>
              <label class="text-[10px] font-bold text-gray-400 block mb-1">预计送达日期</label>
              <input
                v-model="order.logistics.estimatedDelivery"
                class="w-full h-11 bg-gray-50 rounded-xl px-4 text-xs outline-none border border-transparent focus:border-[#F7B500] transition-colors"
                type="date"
              />
            </div>
            <button
              class="w-full h-11 bg-[#006B3F] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#005a35] transition-colors disabled:opacity-60"
              :disabled="logisticsSaving"
              @click="saveLogistics"
            >
              <svg v-if="logisticsSaving" class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {{ logisticsSaving ? '保存中...' : '保存物流信息' }}
            </button>
          </div>
        </Transition>
      </div>

      <!-- Operation Log -->
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          操作日志
        </h3>
        <div class="relative">
          <div class="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
          <div class="space-y-5">
            <div v-for="(log, idx) in operationLogs" :key="idx" class="flex gap-4 relative">
              <div class="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 mt-0.5"
                :class="idx === 0 ? 'bg-[#006B3F]' : 'bg-gray-200'"
              >
                <svg v-if="idx === 0" class="text-white" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <p class="text-xs font-bold text-gray-800">{{ log.action }}</p>
                  <span class="text-[9px] text-gray-400 whitespace-nowrap ml-2">{{ log.timestamp }}</span>
                </div>
                <p class="text-[9px] text-gray-400 mt-0.5">{{ log.operator }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fixed Bottom Actions -->
    <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-[480px] max-w-full bg-white border-t border-gray-100 px-4 py-4 flex gap-3 z-50 shadow-lg">
      <template v-if="order.status === 'pending_payment'">
        <button class="flex-1 h-12 bg-gray-100 text-red-500 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors" @click="handleAction('cancel')">取消订单</button>
        <button class="flex-1 h-12 bg-[#006B3F] text-white rounded-xl font-bold text-sm shadow-lg shadow-green-100 hover:bg-[#005a35] transition-colors" @click="handleAction('confirm')">确认订单</button>
      </template>
      <template v-else-if="order.status === 'paid'">
        <button class="flex-1 h-12 bg-gray-100 text-red-500 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors" @click="handleAction('cancel')">取消订单</button>
        <button class="flex-1 h-12 bg-[#006B3F] text-white rounded-xl font-bold text-sm shadow-lg shadow-green-100 hover:bg-[#005a35] transition-colors" @click="handleAction('prepare')">开始配货</button>
      </template>
      <template v-else-if="order.status === 'pending' || order.status === 'processing'">
        <button class="flex-1 h-12 bg-gray-100 text-red-500 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors" @click="handleAction('cancel')">取消订单</button>
        <button class="flex-1 h-12 bg-[#006B3F] text-white rounded-xl font-bold text-sm shadow-lg shadow-green-100 hover:bg-[#005a35] transition-colors" @click="handleAction('ship')">确认发货</button>
      </template>
      <template v-else-if="order.status === 'shipped'">
        <button class="flex-1 h-12 bg-[#10B981] text-white rounded-xl font-bold text-sm shadow-lg shadow-green-100 hover:bg-[#059669] transition-colors flex items-center justify-center gap-2" @click="handleAction('complete')">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          标记完成
        </button>
      </template>
      <template v-else>
        <div class="flex-1 text-center text-xs text-gray-400 py-4">该订单已{{ statusInfo.title }}</div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.toast-fade-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.toast-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.toast-fade-enter-from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
.toast-fade-leave-to { opacity: 0; transform: translateX(-50%) translateY(-10px); }

.collapse-enter-active, .collapse-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.collapse-enter-from, .collapse-leave-to {
  opacity: 0;
  max-height: 0;
}
.collapse-enter-to, .collapse-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
