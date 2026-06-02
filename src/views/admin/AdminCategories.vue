<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { useCategoryStore } from '@/stores/categories'
import type { Category } from '@/data/categories'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const adminStore = useAdminStore()
const categoryStore = useCategoryStore()
const { toast, showToast } = useToast()

const treeData = categoryStore.tree

// Stats
const totalCount = computed(() => {
  function count(nodes: Category[]): number {
    let c = 0
    for (const n of nodes) {
      c++
      if (n.children.length) c += count(n.children)
    }
    return c
  }
  return count(treeData)
})

const activeCount = computed(() => {
  function count(nodes: Category[]): number {
    let c = 0
    for (const n of nodes) {
      if (n.status === 'active') c++
      if (n.children.length) c += count(n.children)
    }
    return c
  }
  return count(treeData)
})

const hiddenCount = computed(() => totalCount.value - activeCount.value)

// Tree expand/collapse
const expandedNodes = ref<Set<string>>(new Set())

function toggleExpand(id: string) {
  if (expandedNodes.value.has(id)) {
    expandedNodes.value.delete(id)
  } else {
    expandedNodes.value.add(id)
  }
}

// Modal state
const showFormModal = ref(false)
const showDeleteModal = ref(false)
const editingId = ref<string | null>(null)
const deleteTargetId = ref<string | null>(null)
const deleteConfirmMsg = ref('')

// Form state
const formNameZh = ref('')
const formNameEn = ref('')
const formParent = ref('')
const formSort = ref(0)
const formStatus = ref<'active' | 'inactive'>('active')
const selectedIcon = ref('mdi:tag-text-outline')

const iconOptions = [
  'mdi:tag-text-outline', 'mdi:tshirt-crew', 'mdi:laptop',
  'mdi:food-apple', 'mdi:sofa', 'mdi:lipstick'
]

function resetForm() {
  formNameZh.value = ''
  formNameEn.value = ''
  formParent.value = ''
  formSort.value = 0
  formStatus.value = 'active'
  selectedIcon.value = 'mdi:tag-text-outline'
  editingId.value = null
}

function openAddModal() {
  resetForm()
  showFormModal.value = true
}

function openAddChildModal(parentId: string) {
  resetForm()
  formParent.value = parentId
  showFormModal.value = true
}

function openEditModal(id: string) {
  const node = categoryStore.findNode(id)
  if (!node) return
  editingId.value = id
  formNameZh.value = node.nameZh
  formNameEn.value = node.nameEn
  formParent.value = ''
  formSort.value = node.sort
  formStatus.value = node.status
  selectedIcon.value = node.icon || 'mdi:tag-text-outline'
  showFormModal.value = true
}

function openDeleteModal(id: string) {
  const node = categoryStore.findNode(id)
  if (!node) return
  deleteTargetId.value = id
  deleteConfirmMsg.value = `确定要删除分类「${node.nameZh}」吗？该操作不可撤销。`
  showDeleteModal.value = true
}

function executeDelete() {
  if (!deleteTargetId.value) return
  const node = categoryStore.findNode(deleteTargetId.value)
  if (node) {
    categoryStore.deleteCategory(deleteTargetId.value)
    showToast(`分类「${node.nameZh}」已删除`, 'success')
  }
  showDeleteModal.value = false
  deleteTargetId.value = null
}

function saveForm() {
  if (!formNameZh.value.trim()) {
    showToast('请输入分类名称（中文）', 'error')
    return
  }
  if (!formNameEn.value.trim()) {
    showToast('请输入分类名称（英文）', 'error')
    return
  }

  if (editingId.value) {
    categoryStore.updateCategory(editingId.value, {
      nameZh: formNameZh.value,
      nameEn: formNameEn.value,
      name: formNameEn.value,
      sort: formSort.value,
      status: formStatus.value,
      icon: selectedIcon.value
    })
    showToast(`分类「${formNameZh.value}」已更新`, 'success')
  } else {
    const newNode: Category = {
      id: 'cat-' + Date.now(),
      name: formNameEn.value,
      nameZh: formNameZh.value,
      nameEn: formNameEn.value,
      status: formStatus.value,
      sort: formSort.value,
      icon: selectedIcon.value,
      productCount: 0,
      children: []
    }
    categoryStore.addCategory(newNode, formParent.value || undefined)
    showToast(`分类「${formNameZh.value}」已创建`, 'success')
  }

  showFormModal.value = false
}

// Drag & drop state
const dragId = ref<string | null>(null)
const dragOverId = ref<string | null>(null)

function onDragStart(id: string) {
  dragId.value = id
}

function onDragOver(id: string) {
  if (id !== dragId.value) {
    dragOverId.value = id
  }
}

function onDragLeave() {
  dragOverId.value = null
}

function onDrop(id: string) {
  if (dragId.value && dragId.value !== id) {
    showToast('排序已更新', 'success')
  }
  dragId.value = null
  dragOverId.value = null
}

function onDragEnd() {
  dragId.value = null
  dragOverId.value = null
}

// Get all categories for parent dropdown (flat list)
function flattenTree(nodes: Category[]): { id: string; name: string; depth: number }[] {
  const result: { id: string; name: string; depth: number }[] = []
  function walk(list: Category[], d: number) {
    for (const n of list) {
      result.push({ id: n.id, name: n.nameZh, depth: d })
      if (n.children.length) walk(n.children, d + 1)
    }
  }
  walk(nodes, 0)
  return result
}
const parentOptions = computed(() => {
  return flattenTree(treeData)
})

// Render helper
function renderNode(node: Category, depth: number) {
  const hasChildren = node.children.length > 0
  const isExpanded = expandedNodes.value.has(node.id)

  return {
    node,
    depth,
    hasChildren,
    isExpanded
  }
}

const flatTree = computed(() => {
  const result: { node: Category; depth: number; hasChildren: boolean; isExpanded: boolean }[] = []
  function walk(nodes: Category[], depth: number) {
    const sorted = [...nodes].sort((a, b) => b.sort - a.sort)
    for (const n of sorted) {
      const isExpanded = expandedNodes.value.has(n.id)
      result.push({ node: n, depth, hasChildren: n.children.length > 0, isExpanded })
      if (isExpanded && n.children.length > 0) {
        walk(n.children, depth + 1)
      }
    }
  }
  walk(treeData, 0)
  return result
})
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

    <!-- Form Modal -->
    <Teleport to="body">
      <div
        v-if="showFormModal"
        class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center"
        @click="showFormModal = false"
      >
        <div class="bg-white rounded-2xl mx-4 p-6 max-w-sm w-full shadow-2xl max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-base font-black text-gray-800">{{ editingId ? '编辑分类' : '新增分类' }}</h3>
            <button type="button" @click="showFormModal = false">
              <svg class="text-2xl text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="space-y-4">
            <div>
              <label class="required">分类名称（中文）</label>
              <input v-model="formNameZh" class="form-input" placeholder="请输入中文名称" type="text" />
            </div>
            <div>
              <label class="required">分类名称（英文）</label>
              <input v-model="formNameEn" class="form-input" placeholder="Please enter English name" type="text" />
            </div>
            <div>
              <label>上级分类</label>
              <select v-model="formParent" class="form-input" :disabled="!!editingId">
                <option value="">无（顶级分类）</option>
                <option v-for="opt in parentOptions" :key="opt.id" :value="opt.id">{{ '--'.repeat(opt.depth) }} {{ opt.name }}</option>
              </select>
            </div>
            <div>
              <label>分类图标</label>
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="icon in iconOptions"
                  :key="icon"
                  class="w-10 h-10 rounded-xl border flex items-center justify-center transition-all"
                  :class="selectedIcon === icon ? 'border-[#F7B500] bg-[#fffbeb] text-gray-700' : 'border-gray-200 text-gray-500 hover:border-[#F7B500] hover:bg-[#fffbeb]'"
                  type="button"
                  @click="selectedIcon = icon"
                >
                  <svg v-if="icon === 'mdi:tag-text-outline'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
                  </svg>
                  <svg v-else-if="icon === 'mdi:tshirt-crew'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                  </svg>
                  <svg v-else-if="icon === 'mdi:laptop'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="20" x2="22" y2="20"/>
                  </svg>
                  <svg v-else-if="icon === 'mdi:food-apple'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 4-4 4-7 0-1.5-.5-2.5-1-3 1-1 1.5-2.5 1.5-4 0-2-1-3-3-3-1.5 0-2.5.5-4 1.5-1.5-1-2.5-1.5-4-1.5-2 0-3 1-3 3 0 1.5.5 3 1.5 4-.5.5-1 1.5-1 3 0 3 1 7 4 7 1.25 0 2.5-1.06 4-1.06z"/>
                  </svg>
                  <svg v-else-if="icon === 'mdi:sofa'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/>
                    <path d="M4 11v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z"/>
                  </svg>
                  <svg v-else-if="icon === 'mdi:lipstick'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="8" y="3" width="8" height="5" rx="1"/><path d="M6 12h12v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8z"/>
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <label>排序权重</label>
              <input v-model.number="formSort" class="form-input" min="0" placeholder="值越大越靠前" type="number" />
            </div>
            <div>
              <label>状态</label>
              <div class="flex items-center gap-3 mt-1">
                <span class="text-xs text-gray-500 font-medium">隐藏</span>
                <button
                  class="relative w-12 h-6 rounded-full transition-colors"
                  :class="formStatus === 'active' ? 'bg-[#1E3A5F]' : 'bg-gray-300'"
                  type="button"
                  @click="formStatus = formStatus === 'active' ? 'inactive' : 'active'"
                >
                  <span
                    class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                    :class="formStatus === 'active' ? 'translate-x-6' : ''"
                  ></span>
                </button>
                <span class="text-xs text-green-600 font-medium">显示</span>
              </div>
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button class="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors" type="button" @click="showFormModal = false">取消</button>
            <button class="flex-1 h-11 rounded-xl bg-[#1E3A5F] text-sm font-bold text-white shadow-md hover:bg-[#162c49] transition-colors" type="button" @click="saveForm">保存</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete Modal -->
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
            <p class="text-xs text-gray-500 mb-6">{{ deleteConfirmMsg }}</p>
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
        <h1 class="text-lg font-black text-gray-800">分类管理</h1>
      </div>
      <button
        class="bg-[#1E3A5F] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md hover:bg-[#162c49] transition-colors"
        @click="openAddModal"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        新增分类
      </button>
    </header>

    <!-- Stats Cards -->
    <div class="p-4 grid grid-cols-3 gap-3">
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
        <div class="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mb-2">
          <svg class="text-blue-500 text-lg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
          </svg>
        </div>
        <p class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">全部分类</p>
        <span class="text-xl font-black text-gray-800">{{ totalCount }}</span>
      </div>
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
        <div class="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mb-2">
          <svg class="text-green-500 text-lg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <p class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">显示中</p>
        <span class="text-xl font-black text-gray-800">{{ activeCount }}</span>
      </div>
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
        <div class="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center mb-2">
          <svg class="text-gray-400 text-lg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <p class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">已隐藏</p>
        <span class="text-xl font-black text-gray-800">{{ hiddenCount }}</span>
      </div>
    </div>

    <!-- Category Tree -->
    <div class="px-4 mt-1 space-y-2">
      <div v-for="{ node, depth, hasChildren, isExpanded } in flatTree" :key="node.id">
        <div
          class="bg-white rounded-2xl shadow-sm border border-gray-50 p-4 mb-2 transition-all"
          :class="{ 'opacity-50': dragId === node.id, 'ring-2 ring-[#1E3A5F] ring-opacity-30': dragOverId === node.id }"
          :style="{ marginLeft: depth * 16 + 'px' }"
          :draggable="true"
          @dragstart="onDragStart(node.id)"
          @dragover.prevent="onDragOver(node.id)"
          @dragleave="onDragLeave"
          @drop="onDrop(node.id)"
          @dragend="onDragEnd"
        >
          <div class="flex items-center justify-between">
            <!-- Left: expand + name -->
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <button
                v-if="hasChildren"
                class="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-[#1E3A5F] flex-shrink-0 transition-colors"
                @click="toggleExpand(node.id)"
              >
                <svg
                  class="text-sm transition-transform"
                  :class="{ 'rotate-90': isExpanded }"
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                >
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
              <span v-else class="w-5 flex-shrink-0"></span>
              <div class="min-w-0">
                <span class="text-sm font-bold text-gray-800">{{ node.nameZh }}</span>
                <span class="text-[10px] text-gray-400 ml-2">{{ node.nameEn }}</span>
              </div>
            </div>
            <!-- Right: badges + actions -->
            <div class="flex items-center gap-2 flex-shrink-0">
              <span
                class="px-2 py-0.5 text-[9px] font-bold rounded"
                :class="node.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'"
              >{{ node.status === 'active' ? '显示' : '隐藏' }}</span>
              <span class="text-[9px] text-gray-300 font-medium">{{ node.sort }}</span>
              <span class="px-2 py-0.5 bg-blue-50 text-[#1E3A5F] text-[9px] font-bold rounded whitespace-nowrap">{{ node.productCount }}件商品</span>
            </div>
          </div>
          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-gray-50">
            <button
              class="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:text-blue-700 transition-colors"
              @click="openEditModal(node.id)"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              编辑
            </button>
            <button
              class="text-[10px] font-bold text-gray-500 flex items-center gap-1 hover:text-[#006B3F] transition-colors"
              @click="openAddChildModal(node.id)"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              子分类
            </button>
            <button
              class="text-[10px] font-bold text-red-400 flex items-center gap-1 hover:text-red-500 transition-colors"
              @click="openDeleteModal(node.id)"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              删除
            </button>
          </div>
        </div>
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

.toast-fade-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.toast-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.toast-fade-enter-from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
.toast-fade-leave-to { opacity: 0; transform: translateX(-50%) translateY(-10px); }
</style>
