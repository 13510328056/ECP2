<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { useToast } from '@/composables/useToast'
import { formatPrice } from '@/utils/format'

const router = useRouter()
const adminStore = useAdminStore()
const { toast, showToast } = useToast()

// Mock products data
interface MockProduct {
  id: number
  name: string
  sku: string
  category: string
  price: number
  stock: number
  stockStatus: '充足' | '不足' | '缺货'
  status: 'active' | 'inactive'
  image: string
  brand: string
}

const products = ref<MockProduct[]>([
  { id: 1, name: 'Smartphone Pro 14', sku: 'GH-PH-14-256-GR', category: '电子产品', price: 4250, stock: 48, stockStatus: '充足', status: 'active', image: '', brand: '国际品牌' },
  { id: 2, name: 'Traditional Kente Dress', sku: 'GH-CL-KT-DR-M', category: '服装', price: 320, stock: 2, stockStatus: '不足', status: 'active', image: '', brand: '加纳本土品牌' },
  { id: 3, name: 'Wireless Headphones X', sku: 'GH-AU-WL-HP-BLK', category: '配件', price: 850, stock: 156, stockStatus: '充足', status: 'inactive', image: '', brand: '国际品牌' },
  { id: 4, name: 'Organic Honey 500g', sku: 'GH-FD-OG-HN-500', category: '食品', price: 45, stock: 0, stockStatus: '缺货', status: 'active', image: '', brand: '加纳本土品牌' },
  { id: 5, name: 'Handcrafted Wooden Stool', sku: 'GH-HM-WD-STL-A', category: '家居', price: 1200, stock: 320, stockStatus: '充足', status: 'inactive', image: '', brand: '其他' },
  { id: 6, name: 'Moisture Cream 50ml', sku: 'GH-BT-MC-50', category: '美妆', price: 85, stock: 27, stockStatus: '充足', status: 'active', image: '', brand: '国际品牌' },
  { id: 7, name: 'Organic Baby Diapers', sku: 'GH-BB-DP-M36', category: '母婴', price: 65, stock: 120, stockStatus: '充足', status: 'active', image: '', brand: '其他' },
  { id: 8, name: 'Stainless Cookware Set', sku: 'GH-HM-CW-5PC', category: '家居', price: 450, stock: 8, stockStatus: '不足', status: 'active', image: '', brand: '加纳本土品牌' }
])

// Filters
const searchQuery = ref('')
const statusFilter = ref<'all' | 'active' | 'inactive'>('all')
const categoryFilter = ref('all')
const brandFilter = ref('all')
const stockFilter = ref('all')
const priceMin = ref<number | null>(null)
const priceMax = ref<number | null>(null)
const showAdvanced = ref(false)

// Categories list for filter
const categories = ['全部', '服装', '电子产品', '食品', '家居', '美妆', '母婴', '配件']
const brands = ['全部', '加纳本土品牌', '国际品牌', '其他']

// Selection
const selectedIds = ref<Set<number>>(new Set())
const selectAll = ref(false)

// Delete modal
const showDeleteModal = ref(false)
const deleteTarget = ref<MockProduct | null>(null)
const deleteMultiple = ref(false)
const deleteMsg = ref('')

// Pagination
const currentPage = ref(1)
const pageSize = 6

// Computed filtered products
const filteredProducts = computed(() => {
  return products.value.filter(p => {
    // Search
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      if (!p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false
    }
    // Status filter
    if (statusFilter.value !== 'all' && p.status !== statusFilter.value) return false
    // Category filter
    if (categoryFilter.value !== 'all' && p.category !== categoryFilter.value) return false
    // Brand filter
    if (brandFilter.value !== 'all' && p.brand !== brandFilter.value) return false
    // Stock filter
    if (stockFilter.value !== 'all' && p.stockStatus !== stockFilter.value) return false
    // Price range
    if (priceMin.value !== null && p.price < priceMin.value) return false
    if (priceMax.value !== null && p.price > priceMax.value) return false
    return true
  })
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredProducts.value.slice(start, start + pageSize)
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / pageSize))
const pageNumbers = computed(() => {
  const pages: (number | string)[] = []
  if (totalPages.value <= 7) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage.value > 3) pages.push('...')
    for (let i = Math.max(2, currentPage.value - 1); i <= Math.min(totalPages.value - 1, currentPage.value + 1); i++) {
      pages.push(i)
    }
    if (currentPage.value < totalPages.value - 2) pages.push('...')
    pages.push(totalPages.value)
  }
  return pages
})

const selectedCount = computed(() => selectedIds.value.size)

// Toggle single selection
function toggleSelect(id: number) {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id)
  } else {
    selectedIds.value.add(id)
  }
  selectAll.value = selectedIds.value.size === paginatedProducts.value.length && paginatedProducts.value.length > 0
}

function toggleSelectAll() {
  if (selectAll.value) {
    selectedIds.value.clear()
    selectAll.value = false
  } else {
    paginatedProducts.value.forEach(p => selectedIds.value.add(p.id))
    selectAll.value = true
  }
}

// Batch operations
function batchEnable() {
  const hasInactive = paginatedProducts.value.some(p => selectedIds.value.has(p.id) && p.status === 'inactive')
  if (!hasInactive) return
  products.value.forEach(p => {
    if (selectedIds.value.has(p.id) && p.status === 'inactive') {
      p.status = 'active'
    }
  })
  selectedIds.value.clear()
  selectAll.value = false
  showToast('批量上架成功', 'success')
}

function batchDisable() {
  const hasActive = paginatedProducts.value.some(p => selectedIds.value.has(p.id) && p.status === 'active')
  if (!hasActive) return
  products.value.forEach(p => {
    if (selectedIds.value.has(p.id) && p.status === 'active') {
      p.status = 'inactive'
    }
  })
  selectedIds.value.clear()
  selectAll.value = false
  showToast('批量下架成功', 'success')
}

function confirmBatchDelete() {
  deleteMultiple.value = true
  deleteTarget.value = null
  deleteMsg.value = `确定要删除所选 ${selectedIds.value.size} 项商品吗？此操作不可恢复。`
  showDeleteModal.value = true
}

function confirmDelete(product: MockProduct) {
  deleteMultiple.value = false
  deleteTarget.value = product
  deleteMsg.value = `确定要删除「${product.name}」吗？此操作不可恢复。`
  showDeleteModal.value = true
}

function executeDelete() {
  if (deleteMultiple.value) {
    products.value = products.value.filter(p => !selectedIds.value.has(p.id))
    selectedIds.value.clear()
    selectAll.value = false
    showToast('批量删除成功', 'success')
  } else if (deleteTarget.value) {
    products.value = products.value.filter(p => p.id !== deleteTarget.value!.id)
    showToast(`已删除「${deleteTarget.value.name}」`, 'success')
    deleteTarget.value = null
  }
  showDeleteModal.value = false
}

function setPage(page: number | string) {
  if (typeof page === 'number') {
    currentPage.value = page
  }
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function toggleStatus(product: MockProduct) {
  product.status = product.status === 'active' ? 'inactive' : 'active'
  showToast(product.status === 'active' ? '商品已上架' : '商品已下架', 'success')
}
</script>

<template>
  <div class="max-w-[480px] mx-auto min-h-screen bg-[#f8fafc] relative pb-24">
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

    <!-- Confirm Delete Modal -->
    <Teleport to="body">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center"
        @click="showDeleteModal = false"
      >
        <div class="bg-white rounded-2xl mx-4 p-6 max-w-xs w-full shadow-2xl" @click.stop>
          <div class="text-center">
            <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <svg class="text-3xl text-red-500" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h3 class="text-base font-black text-gray-800 mb-2">确认删除</h3>
            <p class="text-xs text-gray-500 mb-6">{{ deleteMsg }}</p>
            <div class="flex gap-3">
              <button class="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-bold text-gray-600" @click="showDeleteModal = false">取消</button>
              <button class="flex-1 h-11 rounded-xl bg-red-500 text-sm font-bold text-white" @click="executeDelete">确认删除</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Header -->
    <header class="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-gray-100">
      <div class="flex items-center gap-2">
        <router-link to="/admin/dashboard">
          <svg class="h-8 w-auto" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="#006B3F"/>
            <text x="20" y="27" text-anchor="middle" fill="white" font-size="16" font-weight="900" font-family="sans-serif">L</text>
          </svg>
        </router-link>
        <h1 class="text-lg font-black text-gray-800">商品管理</h1>
      </div>
      <div class="flex items-center gap-2">
        <router-link
          class="bg-white border border-gray-200 text-gray-600 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-gray-50 transition-colors no-underline"
          to="/admin/categories"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/>
            <rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/>
          </svg>
          分类管理
        </router-link>
        <router-link
          class="bg-[#006B3F] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md hover:bg-[#005a35] transition-colors no-underline"
          to="/admin/products/create"
        >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        新增商品
      </router-link>
      </div>
    </header>

    <!-- Filter Section -->
    <div class="p-4 bg-white mx-3 mt-3 rounded-2xl shadow-sm border border-gray-50">
      <!-- Search & Status -->
      <div class="space-y-3">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            v-model="searchQuery"
            class="w-full h-11 bg-gray-50 rounded-xl pl-10 pr-4 text-xs border border-gray-100 outline-none focus:border-[#F7B500] transition-colors"
            placeholder="搜索商品名称/SKU..."
            type="text"
          />
        </div>
        <div>
          <div class="flex gap-1 bg-gray-50 rounded-lg p-1">
            <button
              class="flex-1 py-2 px-3 text-[11px] font-bold rounded-lg transition-all"
              :class="statusFilter === 'all' ? 'bg-[#1E3A5F] text-white' : 'text-gray-500 font-medium'"
              @click="statusFilter = 'all'; currentPage = 1"
            >全部</button>
            <button
              class="flex-1 py-2 px-3 text-[11px] font-bold rounded-lg transition-all"
              :class="statusFilter === 'active' ? 'bg-[#1E3A5F] text-white' : 'text-gray-500 font-medium'"
              @click="statusFilter = 'active'; currentPage = 1"
            >上架</button>
            <button
              class="flex-1 py-2 px-3 text-[11px] font-bold rounded-lg transition-all"
              :class="statusFilter === 'inactive' ? 'bg-[#1E3A5F] text-white' : 'text-gray-500 font-medium'"
              @click="statusFilter = 'inactive'; currentPage = 1"
            >下架</button>
          </div>
        </div>
      </div>

      <!-- Toggle Advanced Filters -->
      <button
        class="w-full mt-3 flex items-center justify-center gap-1 text-[11px] font-bold text-[#1E3A5F] py-2"
        type="button"
        @click="showAdvanced = !showAdvanced"
      >
        <span>{{ showAdvanced ? '收起筛选' : '更多筛选' }}</span>
        <svg
          class="transition-transform"
          :class="{ 'rotate-180': showAdvanced }"
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      <!-- Advanced Filters -->
      <Transition name="collapse">
        <div v-show="showAdvanced" class="pt-3 border-t border-gray-100 space-y-4">
          <!-- Category -->
          <div>
            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">分类</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="cat in categories"
                :key="cat"
                class="px-3 py-1.5 rounded-lg text-[10px] transition-all"
                :class="categoryFilter === (cat === '全部' ? 'all' : cat) ? 'bg-[#1E3A5F] text-white font-bold' : 'bg-white text-gray-500 border border-gray-200 font-medium'"
                @click="categoryFilter = cat === '全部' ? 'all' : cat; currentPage = 1"
              >
                {{ cat }}
              </button>
            </div>
          </div>
          <!-- Brand -->
          <div>
            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">品牌</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="brand in brands"
                :key="brand"
                class="px-3 py-1.5 rounded-lg text-[10px] transition-all"
                :class="brandFilter === (brand === '全部' ? 'all' : brand) ? 'bg-[#1E3A5F] text-white font-bold' : 'bg-white text-gray-500 border border-gray-200 font-medium'"
                @click="brandFilter = brand === '全部' ? 'all' : brand; currentPage = 1"
              >
                {{ brand }}
              </button>
            </div>
          </div>
          <!-- Stock Status -->
          <div>
            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">库存状态</label>
            <div class="flex gap-1 bg-gray-50 rounded-lg p-1">
              <button
                class="flex-1 py-2 px-3 text-[10px] font-bold rounded-lg transition-all"
                :class="stockFilter === 'all' ? 'bg-[#1E3A5F] text-white' : 'text-gray-500 font-medium'"
                @click="stockFilter = 'all'; currentPage = 1"
              >全部</button>
              <button
                class="flex-1 py-2 px-3 text-[10px] font-bold rounded-lg transition-all"
                :class="stockFilter === '充足' ? 'bg-[#1E3A5F] text-white' : 'text-gray-500 font-medium'"
                @click="stockFilter = '充足'; currentPage = 1"
              >充足</button>
              <button
                class="flex-1 py-2 px-3 text-[10px] font-bold rounded-lg transition-all"
                :class="stockFilter === '不足' ? 'bg-[#1E3A5F] text-white' : 'text-gray-500 font-medium'"
                @click="stockFilter = '不足'; currentPage = 1"
              >不足</button>
              <button
                class="flex-1 py-2 px-3 text-[10px] font-bold rounded-lg transition-all"
                :class="stockFilter === '缺货' ? 'bg-[#1E3A5F] text-white' : 'text-gray-500 font-medium'"
                @click="stockFilter = '缺货'; currentPage = 1"
              >缺货</button>
            </div>
          </div>
          <!-- Price Range -->
          <div>
            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">价格区间 (₵)</label>
            <div class="flex items-center gap-2">
              <input
                v-model.number="priceMin"
                class="w-full h-9 bg-gray-50 rounded-lg px-3 text-xs border border-gray-100 outline-none focus:border-[#F7B500]"
                placeholder="最低价"
                type="number"
              />
              <span class="text-gray-300 text-xs">—</span>
              <input
                v-model.number="priceMax"
                class="w-full h-9 bg-gray-50 rounded-lg px-3 text-xs border border-gray-100 outline-none focus:border-[#F7B500]"
                placeholder="最高价"
                type="number"
              />
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Batch Operations Bar -->
    <div v-if="selectedCount > 0" class="mx-3 mt-3 bg-white rounded-2xl border border-gray-50 shadow-sm">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center gap-3">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              :checked="selectAll"
              class="w-4 h-4 rounded border-gray-300 text-[#1E3A5F] focus:ring-[#1E3A5F]"
              type="checkbox"
              @change="toggleSelectAll"
            />
            <span class="text-[10px] font-bold text-gray-500">全选</span>
          </label>
          <span class="text-[10px] text-gray-400">已选择 {{ selectedCount }} 项</span>
        </div>
        <div class="flex gap-2">
          <button
            class="px-3 py-1.5 rounded-lg text-[10px] font-bold"
            :class="selectedCount > 0 ? 'bg-green-50 text-green-600 hover:bg-green-100 cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
            :disabled="selectedCount === 0"
            @click="batchEnable"
          >批量上架</button>
          <button
            class="px-3 py-1.5 rounded-lg text-[10px] font-bold"
            :class="selectedCount > 0 ? 'bg-orange-50 text-orange-600 hover:bg-orange-100 cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
            :disabled="selectedCount === 0"
            @click="batchDisable"
          >批量下架</button>
          <button
            class="px-3 py-1.5 rounded-lg text-[10px] font-bold"
            :class="selectedCount > 0 ? 'bg-red-50 text-red-500 hover:bg-red-100 cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
            :disabled="selectedCount === 0"
            @click="confirmBatchDelete"
          >批量删除</button>
        </div>
      </div>
    </div>

    <!-- Product List -->
    <div class="px-4 mt-3 space-y-3">
      <div
        v-for="product in paginatedProducts"
        :key="product.id"
        class="bg-white p-3 rounded-2xl border border-gray-50 shadow-sm flex gap-3"
        :data-category="product.category"
        :data-price="product.price"
      >
        <!-- Thumbnail -->
        <div class="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden relative">
          <div class="w-full h-full flex items-center justify-center text-gray-300">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
          <div v-if="product.stockStatus === '不足'" class="absolute inset-0 bg-black/20 flex items-center justify-center">
            <span class="text-white text-[9px] font-bold bg-orange-500 px-2 py-0.5 rounded">库存不足</span>
          </div>
          <div v-if="product.stockStatus === '缺货'" class="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span class="text-white text-[9px] font-bold bg-red-500 px-2 py-0.5 rounded">缺货</span>
          </div>
        </div>
        <!-- Info -->
        <div class="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div class="flex items-center justify-between gap-1">
              <h3 class="text-xs font-bold text-gray-800 truncate">{{ product.name }}</h3>
              <span
                class="text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap"
                :class="product.status === 'active' ? 'text-green-600 bg-green-50' : 'text-gray-500 bg-gray-100'"
              >{{ product.status === 'active' ? '上架' : '下架' }}</span>
            </div>
            <p class="text-[9px] text-gray-400 mt-0.5 truncate">SKU: {{ product.sku }}</p>
            <div class="flex items-center gap-2 mt-1 flex-wrap">
              <span class="text-[9px] font-bold text-white bg-[#1E3A5F] px-1.5 py-0.5 rounded">{{ product.category }}</span>
              <span class="text-xs font-black text-[#F7B500]">{{ formatPrice(product.price) }}</span>
            </div>
            <div class="flex items-center gap-1 mt-1">
              <svg
                v-if="product.stockStatus === '充足'"
                class="text-green-500 text-xs"
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              >
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <svg
                v-else-if="product.stockStatus === '不足'"
                class="text-orange-500 text-xs"
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              >
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <svg
                v-else
                class="text-red-500 text-xs"
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              >
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <span
                class="text-[10px] font-medium"
                :class="product.stockStatus === '充足' ? 'text-green-600' : product.stockStatus === '不足' ? 'text-orange-600' : 'text-red-600'"
              >{{ product.stock }} 件 ({{ product.stockStatus }})</span>
            </div>
          </div>
          <div class="flex items-center justify-end gap-3 mt-2">
            <button
              class="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:text-blue-700 transition-colors"
              @click="router.push('/admin/products/' + product.id + '/edit')"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              编辑
            </button>
            <button
              class="text-[10px] font-bold text-red-400 flex items-center gap-1 hover:text-red-500 transition-colors"
              @click="confirmDelete(product)"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              删除
            </button>
          </div>
        </div>
      </div>

      <div v-if="paginatedProducts.length === 0" class="text-center py-10">
        <svg class="mx-auto text-gray-300 mb-3" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <p class="text-xs text-gray-400">没有找到匹配的商品</p>
      </div>
    </div>

    <!-- Pagination -->
    <div class="px-4 mt-4" v-if="totalPages > 1">
      <div class="bg-white rounded-2xl border border-gray-50 shadow-sm px-4 py-3 flex items-center justify-between">
        <button
          class="w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
          :class="currentPage === 1 ? 'text-gray-300' : 'text-gray-400'"
          :disabled="currentPage === 1"
          @click="prevPage"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div class="flex items-center gap-1">
          <template v-for="(page, idx) in pageNumbers" :key="idx">
            <button
              v-if="page === '...'"
              class="text-gray-300 text-xs px-1 cursor-default"
              disabled
            >...</button>
            <button
              v-else
              class="w-8 h-8 rounded-lg text-[11px] transition-all"
              :class="page === currentPage ? 'bg-[#1E3A5F] text-white font-bold' : 'text-gray-500 font-medium hover:bg-gray-50'"
              @click="setPage(page)"
            >{{ page }}</button>
          </template>
        </div>
        <button
          class="w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
          :class="currentPage === totalPages ? 'text-gray-300' : 'text-gray-400'"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
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
      <router-link class="flex flex-col items-center gap-1 text-[#006B3F]" to="/admin/products">
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
  max-height: 600px;
}
</style>
