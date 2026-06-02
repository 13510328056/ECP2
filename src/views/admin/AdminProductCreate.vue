<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useCategoryStore } from '@/stores/categories'
import { useLanguageStore } from '@/stores/language'
import type { Category } from '@/data/categories'
import { products as dataProducts } from '@/data/products'

const router = useRouter()
const route = useRoute()
const categoryStore = useCategoryStore()
const { toast, showToast } = useToast()
const langStore = useLanguageStore()

const editId = computed(() => route.params.id as string | undefined)
const isEdit = computed(() => !!editId.value)

// ===== Form State =====
const form = reactive({
  nameCn: '',
  nameEn: '',
  sku: '',
  category: '',
  categoryDisplay: '',
  brand: '',
  price: null as number | null,
  oldPrice: null as number | null,
  stock: null as number | null,
  stockAlert: null as number | null,
  weight: null as number | null,
  description: '',
  seoTitle: '',
  seoDesc: ''
})

interface SpecRow {
  name: string
  value: string
}

interface TierRow {
  quantity: string
  price: number | null
  discount: number | null
}

const specs = ref<SpecRow[]>([
  { name: '材质', value: '纯棉' },
  { name: '颜色', value: '黑色' }
])

const tiers = ref<TierRow[]>([
  { quantity: '10+', price: 108.00, discount: 10 },
  { quantity: '20+', price: 96.00, discount: 20 }
])

const errors = reactive<Record<string, boolean>>({
  nameCn: false,
  nameEn: false,
  sku: false,
  category: false,
  price: false,
  stock: false
})

const uploadedImages = ref<string[]>([])
const showSeo = ref(false)
const showTree = ref(false)

// Category tree data from store
const treeCategories = computed(() => categoryStore.tree)

const expandedCategories = ref<Set<string>>(new Set())

function openTree() {
  expandedCategories.value.clear()
  showTree.value = true
}

function closeTree() {
  showTree.value = false
}

function toggleCategoryExpand(name: string) {
  if (expandedCategories.value.has(name)) {
    expandedCategories.value.delete(name)
  } else {
    expandedCategories.value.add(name)
  }
}

function selectCategory(name: string, fullPath: string) {
  form.category = fullPath
  form.categoryDisplay = fullPath.replace(/>/g, ' > ')
  errors.category = false
  closeTree()
}
function findNodeByEnglishName(nodes: Category[], engName: string): Category | null {
  for (const n of nodes) {
    if (n.name === engName || n.nameEn === engName) return n
    if (n.children.length) {
      const found = findNodeByEnglishName(n.children, engName)
      if (found) return found
    }
  }
  return null
}

function catDisplayName(catName: string): string {
  const node = findNodeByEnglishName(categoryStore.tree, catName)
  return node ? (langStore.locale === 'zh' ? node.nameZh : node.name) : catName
}

function selectCategoryLeaf(name: string, parentPath: string) {
  const fullPath = parentPath ? parentPath + '>' + name : name
  form.category = fullPath
  const parts = fullPath.split('>')
  form.categoryDisplay = parts.map(p => catDisplayName(p.trim())).join(' > ')
  errors.category = false
  closeTree()
}

// ===== SKU Auto Generate =====
function autoGenerateSku() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'SKU-2026-'
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  form.sku = code
  errors.sku = false
  showToast('SKU 已自动生成: ' + code, 'success')
}

// ===== Specs =====
function addSpec() {
  specs.value.push({ name: '', value: '' })
}

function removeSpec(index: number) {
  specs.value.splice(index, 1)
}

// ===== Pricing Tiers =====
function addTier() {
  tiers.value.push({ quantity: '', price: null, discount: null })
}

function removeTier(index: number) {
  tiers.value.splice(index, 1)
}

// ===== Image Upload =====
function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files) return
  const remaining = 9 - uploadedImages.value.length
  const files = Array.from(input.files).slice(0, remaining)
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        uploadedImages.value.push(e.target.result)
      }
    }
    reader.readAsDataURL(file)
  })
  input.value = ''
}

function removeImage(index: number) {
  uploadedImages.value.splice(index, 1)
}

// ===== Validation =====
function validate(): boolean {
  let valid = true

  if (!form.nameCn.trim()) { errors.nameCn = true; valid = false } else errors.nameCn = false
  if (!form.nameEn.trim()) { errors.nameEn = true; valid = false } else errors.nameEn = false
  if (!form.sku.trim()) { errors.sku = true; valid = false } else errors.sku = false
  if (!form.category) { errors.category = true; valid = false } else errors.category = false
  if (form.price === null || form.price <= 0) { errors.price = true; valid = false } else errors.price = false
  if (form.stock === null || form.stock < 0) { errors.stock = true; valid = false } else errors.stock = false

  return valid
}

function clearError(field: string) {
  (errors as Record<string, boolean>)[field] = false
}

// ===== Save / Publish =====
function saveAsDraft() {
  showToast('草稿已保存', 'success')
}

function publish() {
  if (validate()) {
    showToast('商品已成功上架！', 'success')
  } else {
    showToast('请检查表单中的必填字段', 'error')
  }
}

function goBack() {
  router.push('/admin/products')
}

// ===== Load existing product for editing =====
onMounted(() => {
  const id = editId.value
  if (!id) return

  const product = dataProducts.find(p => p.id === id)
  if (!product) {
    showToast('未找到该商品', 'error')
    return
  }

  form.nameCn = product.nameZh || ''
  form.nameEn = product.name
  form.sku = product.id
  form.category = product.category
  form.categoryDisplay = product.category + (product.subcategory ? ' > ' + product.subcategory : '')
  form.brand = product.brand || ''
  form.price = product.price
  form.stock = product.stockCount
  form.description = product.description || ''

  if (product.images && product.images.length > 0) {
    product.images.forEach(img => uploadedImages.value.push(img))
  }
})
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

    <!-- Tree Category Selector Overlay -->
    <Teleport to="body">
      <div
        v-if="showTree"
        class="fixed inset-0 bg-black/40 z-[200] flex items-end justify-center"
        @click="showTree = false"
      >
        <div class="bg-white rounded-[20px] rounded-b-none w-full max-w-[480px] max-h-[70vh] overflow-y-auto p-5" style="animation: slideUp 0.25s ease" @click.stop>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-black text-gray-800">选择分类</h3>
            <button @click="showTree = false">
              <svg class="text-2xl text-gray-400" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div>
            <template v-for="(cat, idx) in treeCategories" :key="idx">
              <div
                class="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                :class="form.category === cat.name ? 'bg-blue-50 font-bold text-[#1E3A5F]' : ''"
                @click="toggleCategoryExpand(cat.name)"
              >
                <span class="text-sm">{{ langStore.locale === 'zh' ? cat.nameZh : cat.name }}</span>
                <svg
                  v-if="cat.children.length > 0"
                  class="text-gray-300 transition-transform"
                  :class="{ 'rotate-90': expandedCategories.has(cat.name) }"
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                >
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
              <div v-if="expandedCategories.has(cat.name) && cat.children.length > 0" class="pl-5">
                <div
                  v-for="(child, cIdx) in cat.children"
                  :key="cIdx"
                  class="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                  :class="form.category === (cat.name + '>' + child.name) ? 'bg-blue-50 font-bold text-[#1E3A5F]' : ''"
                  @click="selectCategoryLeaf(child.name, cat.name)"
                >
                  <span class="text-sm">{{ langStore.locale === 'zh' ? child.nameZh : child.name }}</span>
                  <svg
                    v-if="child.children.length > 0"
                    class="text-gray-300 transition-transform"
                    :class="{ 'rotate-90': expandedCategories.has(cat.name + '>' + child.name) }"
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    @click.stop="toggleCategoryExpand(cat.name + '>' + child.name)"
                  >
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                  <!-- Third-level children (inside v-for scope so child is defined) -->
                  <div v-if="expandedCategories.has(cat.name + '>' + child.name) && child.children.length > 0" class="pl-5 mt-2">
                    <div
                      v-for="(sub, sIdx) in child.children"
                      :key="sIdx"
                      class="px-4 py-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors text-sm"
                      :class="form.category === (cat.name + '>' + child.name + '>' + sub.name) ? 'bg-blue-50 font-bold text-[#1E3A5F]' : ''"
                      @click="selectCategoryLeaf(sub.name, cat.name + '>' + child.name)"
                    >
                      {{ langStore.locale === 'zh' ? sub.nameZh : sub.name }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div class="mt-4">
            <button
              class="w-full h-11 bg-[#1E3A5F] text-white rounded-xl font-bold text-sm hover:bg-[#162c49] transition-colors"
              @click="showTree = false"
            >确认选择</button>
          </div>
        </div>
      </div>
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
        <h1 class="text-lg font-black text-gray-800">{{ isEdit ? '编辑商品' : '新增商品' }}</h1>
      </div>
      <button class="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors" @click="saveAsDraft">保存草稿</button>
    </header>

    <!-- Form -->
    <form class="p-5 space-y-6" novalidate @submit.prevent="publish">
      <!-- === 1. Basic Info === -->
      <div class="space-y-4">
        <h2 class="text-sm font-black text-[#1E3A5F] flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          基础信息
        </h2>
        <!-- 商品名称（中文） -->
        <div>
          <label class="required">商品名称 (中文)</label>
          <input
            v-model="form.nameCn"
            class="form-input"
            :class="{ error: errors.nameCn }"
            placeholder="例如: 旗舰智能手机 Pro 14"
            type="text"
            @input="clearError('nameCn')"
          />
          <div v-if="errors.nameCn" class="error-msg show">请输入商品中文名称</div>
        </div>
        <!-- 商品名称（英文） -->
        <div>
          <label class="required">商品名称 (英文)</label>
          <input
            v-model="form.nameEn"
            class="form-input"
            :class="{ error: errors.nameEn }"
            placeholder="e.g. Smartphone Pro 14"
            type="text"
            @input="clearError('nameEn')"
          />
          <div v-if="errors.nameEn" class="error-msg show">请输入商品英文名称</div>
        </div>
        <!-- SKU -->
        <div>
          <label class="required">SKU 编码</label>
          <div class="flex gap-2">
            <input
              v-model="form.sku"
              class="form-input flex-1"
              :class="{ error: errors.sku }"
              placeholder="GH-PH-001"
              type="text"
              @input="clearError('sku')"
            />
            <button
              class="h-11 px-4 bg-gray-100 text-gray-600 rounded-xl text-[10px] font-bold whitespace-nowrap hover:bg-gray-200 transition-colors"
              type="button"
              @click="autoGenerateSku"
            >自动生成</button>
          </div>
          <div v-if="errors.sku" class="error-msg show">请输入SKU编码</div>
        </div>
        <!-- Category -->
        <div>
          <label class="required">商品分类</label>
          <div class="relative">
            <input
              v-model="form.categoryDisplay"
              class="form-input cursor-pointer"
              :class="{ error: errors.category }"
              placeholder="点击选择分类"
              readonly
              type="text"
              @click="openTree()"
            />
            <svg class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
          <div v-if="errors.category" class="error-msg show">请选择商品分类</div>
        </div>
        <!-- Brand -->
        <div>
          <label>品牌</label>
          <select v-model="form.brand" class="form-input">
            <option value="">请选择品牌</option>
            <option value="Li's">Li's</option>
            <option value="Nike">Nike</option>
            <option value="Adidas">Adidas</option>
            <option value="三星">三星</option>
            <option value="华为">华为</option>
            <option value="本地品牌">本地品牌</option>
          </select>
        </div>
      </div>

      <!-- === 2. Pricing & Stock === -->
      <div class="pt-4 border-t border-gray-100 space-y-4">
        <h2 class="text-sm font-black text-[#1E3A5F] flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          价格与库存
        </h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="required">价格 (₵)</label>
            <input
              v-model.number="form.price"
              class="form-input"
              :class="{ error: errors.price }"
              placeholder="0.00"
              step="0.01"
              type="number"
              @input="clearError('price')"
            />
            <div v-if="errors.price" class="error-msg show">请输入销售价格</div>
          </div>
          <div>
            <label>原价 (₵)</label>
            <input
              v-model.number="form.oldPrice"
              class="form-input"
              placeholder="0.00"
              step="0.01"
              type="number"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="required">库存数量</label>
            <input
              v-model.number="form.stock"
              class="form-input"
              :class="{ error: errors.stock }"
              min="0"
              placeholder="0"
              type="number"
              @input="clearError('stock')"
            />
            <div v-if="errors.stock" class="error-msg show">请输入库存数量</div>
          </div>
          <div>
            <label>库存预警值</label>
            <input
              v-model.number="form.stockAlert"
              class="form-input"
              min="0"
              placeholder="10"
              type="number"
            />
          </div>
        </div>
        <div>
          <label>商品重量 (kg)</label>
          <input
            v-model.number="form.weight"
            class="form-input"
            min="0"
            placeholder="0.00"
            step="0.01"
            type="number"
          />
        </div>
      </div>

      <!-- === 3. Images === -->
      <div class="pt-4 border-t border-gray-100">
        <h2 class="text-sm font-black text-[#1E3A5F] flex items-center gap-2 mb-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
          商品图片
          <span class="text-[10px] font-normal text-gray-400">(最多9张)</span>
        </h2>
        <div class="grid grid-cols-3 gap-3">
          <div
            v-for="(img, idx) in uploadedImages"
            :key="idx"
            class="aspect-square bg-gray-100 rounded-2xl relative overflow-hidden group"
          >
            <img :src="img" class="w-full h-full object-cover" alt="Uploaded product image" />
            <button
              class="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              type="button"
              @click="removeImage(idx)"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <label
            v-if="uploadedImages.length < 9"
            class="upload-zone aspect-square rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#F7B500] hover:bg-[#fffbeb] transition-all"
          >
            <svg class="text-3xl text-gray-300" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            <span class="text-[9px] text-gray-400 mt-1">点击上传</span>
            <input
              accept="image/*"
              class="hidden"
              multiple
              type="file"
              @change="handleFileUpload"
            />
          </label>
        </div>
      </div>

      <!-- === 4. Description === -->
      <div class="pt-4 border-t border-gray-100">
        <h2 class="text-sm font-black text-[#1E3A5F] flex items-center gap-2 mb-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          商品详情
        </h2>
        <div class="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
          <div class="flex items-center gap-1 px-3 py-2 border-b border-gray-100 bg-white">
            <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 font-bold" type="button" title="加粗">B</button>
            <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 italic" type="button" title="斜体">I</button>
            <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 underline" type="button" title="下划线">U</button>
            <span class="w-px h-5 bg-gray-200 mx-1"></span>
            <button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600" type="button" title="列表">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>
          </div>
          <textarea
            v-model="form.description"
            class="w-full bg-white text-sm p-4 outline-none border-none min-h-[200px] resize-y"
            placeholder="输入商品详细介绍，支持图文混排..."
          ></textarea>
        </div>
      </div>

      <!-- === 5. Specifications === -->
      <div class="pt-4 border-t border-gray-100">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-sm font-black text-[#1E3A5F] flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            规格参数
          </h2>
          <button
            class="text-[11px] font-bold text-[#1E3A5F] flex items-center gap-1 hover:underline"
            type="button"
            @click="addSpec"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            添加规格
          </button>
        </div>
        <div class="space-y-2">
          <div v-for="(spec, idx) in specs" :key="idx" class="spec-row">
            <input
              v-model="spec.name"
              class="form-input flex-1"
              placeholder="规格名称，如：材质"
              type="text"
            />
            <input
              v-model="spec.value"
              class="form-input flex-1"
              placeholder="规格值，如：纯棉"
              type="text"
            />
            <button
              class="w-9 h-9 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg flex-shrink-0"
              type="button"
              @click="removeSpec(idx)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- === 6. Bulk Pricing === -->
      <div class="pt-4 border-t border-gray-100">
        <div class="flex items-center justify-between mb-1">
          <h2 class="text-sm font-black text-[#1E3A5F] flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
            批量定价
          </h2>
          <button
            class="text-[11px] font-bold text-[#1E3A5F] flex items-center gap-1 hover:underline"
            type="button"
            @click="addTier"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            添加阶梯
          </button>
        </div>
        <p class="text-[10px] text-gray-400 mb-3 ml-1">Buy More, Save More</p>
        <div class="bg-gray-50 rounded-2xl p-3 space-y-2">
          <div class="grid grid-cols-3 gap-2 text-[9px] font-bold text-gray-400 uppercase text-center mb-2">
            <div>数量区间</div>
            <div>折扣价 (₵)</div>
            <div>折扣率</div>
          </div>
          <div v-for="(tier, idx) in tiers" :key="idx" class="pricing-row">
            <input
              v-model="tier.quantity"
              class="form-input h-9 text-center px-1 text-xs"
              placeholder="10+"
              type="text"
            />
            <input
              v-model.number="tier.price"
              class="form-input h-9 text-center px-1 text-xs"
              placeholder="108.00"
              step="0.01"
              type="number"
            />
            <div class="flex items-center gap-1">
              <input
                v-model.number="tier.discount"
                class="form-input h-9 text-center px-1 text-xs"
                placeholder="10"
                type="number"
              />
              <span class="text-[10px] text-gray-400 whitespace-nowrap">% off</span>
              <button
                class="w-7 h-7 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg flex-shrink-0"
                type="button"
                @click="removeTier(idx)"
              >
                <svg class="text-sm" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- === 7. SEO === -->
      <div class="pt-4 border-t border-gray-100">
        <button
          class="w-full flex items-center justify-between"
          type="button"
          @click="showSeo = !showSeo"
        >
          <h2 class="text-sm font-black text-[#1E3A5F] flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            SEO 信息
          </h2>
          <svg
            class="text-gray-400 text-xl transition-transform"
            :class="{ 'rotate-180': showSeo }"
            width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <Transition name="collapse">
          <div v-show="showSeo" class="mt-3 space-y-4">
            <div>
              <label>SEO Title</label>
              <input v-model="form.seoTitle" class="form-input" placeholder="搜索引擎显示的标题" type="text" />
            </div>
            <div>
              <label>SEO Description</label>
              <textarea v-model="form.seoDesc" class="form-input !h-24 resize-none" placeholder="搜索引擎显示的描述..." rows="3"></textarea>
            </div>
          </div>
        </Transition>
      </div>
    </form>

    <!-- Fixed Bottom Actions -->
    <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-[480px] max-w-full bg-white border-t border-gray-100 px-4 py-4 flex gap-3 z-50 shadow-lg">
      <button
        class="flex-1 h-12 border-2 border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
        @click="saveAsDraft"
      >保存草稿</button>
      <button
        class="flex-1 h-12 bg-[#16a34a] text-white rounded-xl font-bold text-sm shadow-lg shadow-green-100 hover:bg-[#15803d] transition-colors"
        @click="publish"
      >保存并上架</button>
    </div>
  </div>
</template>

<style scoped>
.form-input {
  width: 100%;
  height: 44px;
  background-color: #f9fafb;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 13px;
  outline: none;
  border: 1px solid #f1f5f9;
  transition: border-color 0.2s, background-color 0.2s;
}
.form-input:focus {
  border-color: #F7B500;
  background-color: white;
}
.form-input.error {
  border-color: #ef4444;
  background-color: #fef2f2;
}
textarea.form-input {
  height: 100px;
  padding: 12px 16px;
  resize: vertical;
}
label {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
  display: block;
  margin-left: 4px;
}
label.required::after {
  content: ' *';
  color: #ef4444;
}
.error-msg {
  font-size: 10px;
  color: #ef4444;
  margin-top: 4px;
  margin-left: 4px;
  display: none;
}
.error-msg.show {
  display: block;
}
.spec-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.pricing-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  align-items: center;
}
.upload-zone {
  border: 2px dashed #d1d5db;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
}
.upload-zone:hover {
  border-color: #F7B500;
  background-color: #fffbeb;
}

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
  max-height: 400px;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
</style>
