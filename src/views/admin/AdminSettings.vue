<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const adminStore = useAdminStore()
const { toast, showToast } = useToast()

const activeTab = ref<'profile' | 'users'>('profile')

const isSuperAdmin = computed(() => true)

// ── Profile ──
const profile = ref({
  name: adminStore.adminName || 'Administrator',
  email: adminStore.adminEmail || 'admin@lisindustrial.gh',
  phone: '+233 20 000 0000',
  department: 'Management',
  role: 'super_admin',
})

const passwordForm = ref({
  current: '',
  newPassword: '',
  confirm: '',
})

function saveProfile() {
  showToast('个人资料已更新', 'success')
}

function savePassword() {
  if (!passwordForm.value.current) {
    showToast('请输入当前密码', 'error')
    return
  }
  if (!passwordForm.value.newPassword) {
    showToast('请输入新密码', 'error')
    return
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirm) {
    showToast('两次密码输入不一致', 'error')
    return
  }
  showToast('密码已更新', 'success')
  passwordForm.value = { current: '', newPassword: '', confirm: '' }
}

// ── User Management ──
interface MockUser {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  lastLogin: string
}

const mockUsers = ref<MockUser[]>([
  { id: 'u1', name: 'Admin', email: 'admin@lisindustrial.gh', role: 'super_admin', status: 'active', lastLogin: '2026-05-30 08:00' },
  { id: 'u2', name: 'John Doe', email: 'john@lisindustrial.gh', role: 'product_manager', status: 'active', lastLogin: '2026-05-29 14:30' },
  { id: 'u3', name: 'Jane Smith', email: 'jane@lisindustrial.gh', role: 'customer_service', status: 'inactive', lastLogin: '2026-05-28 09:15' },
])

const showUserModal = ref(false)
const showDeleteConfirm = ref(false)
const editingUser = ref<MockUser | null>(null)
const deletingUser = ref<MockUser | null>(null)

const userForm = ref({
  name: '',
  email: '',
  phone: '',
  role: 'customer_service' as string,
  status: 'active' as 'active' | 'inactive',
})

function openNewUser() {
  editingUser.value = null
  userForm.value = { name: '', email: '', phone: '', role: 'customer_service', status: 'active' }
  showUserModal.value = true
}

function openEditUser(user: MockUser) {
  editingUser.value = user
  userForm.value = {
    name: user.name,
    email: user.email,
    phone: '',
    role: user.role,
    status: user.status,
  }
  showUserModal.value = true
}

function saveUser() {
  if (!userForm.value.name.trim() || !userForm.value.email.trim()) {
    showToast('请填写必填字段', 'error')
    return
  }
  if (editingUser.value) {
    const u = mockUsers.value.find(m => m.id === editingUser.value!.id)
    if (u) {
      u.name = userForm.value.name
      u.email = userForm.value.email
      u.role = userForm.value.role
      u.status = userForm.value.status
    }
    showToast('用户已更新', 'success')
  } else {
    const newUser: MockUser = {
      id: 'u' + Date.now(),
      name: userForm.value.name,
      email: userForm.value.email,
      role: userForm.value.role,
      status: userForm.value.status,
      lastLogin: '-',
    }
    mockUsers.value.push(newUser)
    showToast('用户已创建', 'success')
  }
  showUserModal.value = false
}

function confirmDelete(user: MockUser) {
  deletingUser.value = user
  showDeleteConfirm.value = true
}

function doDelete() {
  if (deletingUser.value) {
    mockUsers.value = mockUsers.value.filter(u => u.id !== deletingUser.value!.id)
    showToast('用户已删除', 'success')
  }
  showDeleteConfirm.value = false
  deletingUser.value = null
}

function getRoleLabel(role: string) {
  const map: Record<string, string> = {
    super_admin: '超级管理员',
    product_manager: '产品经理',
    customer_service: '客服',
    warehouse: '仓库管理员',
    finance: '财务',
  }
  return map[role] || role
}

function getRoleColor(role: string) {
  const map: Record<string, string> = {
    super_admin: 'bg-purple-50 text-purple-600',
    product_manager: 'bg-blue-50 text-blue-600',
    customer_service: 'bg-green-50 text-green-600',
    warehouse: 'bg-orange-50 text-orange-600',
    finance: 'bg-cyan-50 text-cyan-600',
  }
  return map[role] || 'bg-gray-50 text-gray-500'
}

function toggleUserStatus(user: MockUser) {
  user.status = user.status === 'active' ? 'inactive' : 'active'
  showToast(`用户已${user.status === 'active' ? '启用' : '禁用'}`, 'success')
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

    <!-- Header -->
    <header class="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-gray-100">
      <div class="flex items-center gap-2">
        <router-link to="/admin/dashboard">
          <svg class="h-8 w-auto" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="#006B3F"/>
            <text x="20" y="27" text-anchor="middle" fill="white" font-size="16" font-weight="900" font-family="sans-serif">L</text>
          </svg>
        </router-link>
        <h1 class="text-lg font-black text-gray-800">系统设置</h1>
      </div>
      <div class="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-[#006B3F] flex items-center justify-center text-white text-sm font-bold overflow-hidden">
        {{ profile.name.charAt(0).toUpperCase() }}
      </div>
    </header>

    <!-- Tab Switcher -->
    <div class="bg-white px-4 flex border-b border-gray-100">
      <button
        class="flex-1 py-4 text-xs font-bold text-center border-b-2 transition-colors"
        :class="activeTab === 'profile' ? 'text-[#006B3F] border-[#006B3F]' : 'text-gray-400 border-transparent hover:text-gray-600'"
        @click="activeTab = 'profile'"
      >
        个人资料
      </button>
      <button
        v-if="isSuperAdmin"
        class="flex-1 py-4 text-xs font-bold text-center border-b-2 transition-colors"
        :class="activeTab === 'users' ? 'text-[#006B3F] border-[#006B3F]' : 'text-gray-400 border-transparent hover:text-gray-600'"
        @click="activeTab = 'users'"
      >
        用户管理
      </button>
    </div>

    <!-- ─── Tab: Profile ─── -->
    <div v-if="activeTab === 'profile'" class="p-4 space-y-4">
      <!-- Avatar -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 text-center">
        <div class="w-20 h-20 rounded-full bg-[#006B3F] mx-auto flex items-center justify-center text-white text-3xl font-black mb-4 shadow-md">
          {{ profile.name.charAt(0).toUpperCase() }}
        </div>
        <button class="text-xs text-[#006B3F] font-bold hover:underline" @click="showToast('头像上传功能开发中', 'info')">
          更换头像
        </button>
      </div>

      <!-- Profile Form -->
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">基本信息</h3>
        <div class="space-y-4">
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">姓名</label>
            <input
              v-model="profile.name"
              class="w-full h-11 bg-gray-50 rounded-xl px-4 text-xs outline-none border border-transparent focus:border-[#F7B500] transition-colors"
              type="text"
            />
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">邮箱</label>
            <input
              :value="profile.email"
              class="w-full h-11 bg-gray-100 rounded-xl px-4 text-xs text-gray-500 outline-none cursor-not-allowed"
              type="email"
              readonly
            />
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">电话</label>
            <input
              v-model="profile.phone"
              class="w-full h-11 bg-gray-50 rounded-xl px-4 text-xs outline-none border border-transparent focus:border-[#F7B500] transition-colors"
              type="text"
            />
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">部门 / 角色</label>
            <input
              :value="profile.department"
              class="w-full h-11 bg-gray-100 rounded-xl px-4 text-xs text-gray-500 outline-none cursor-not-allowed"
              type="text"
              readonly
            />
          </div>
        </div>
      </div>

      <!-- Password Change -->
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">修改密码</h3>
        <div class="space-y-4">
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">当前密码</label>
            <input
              v-model="passwordForm.current"
              class="w-full h-11 bg-gray-50 rounded-xl px-4 text-xs outline-none border border-transparent focus:border-[#F7B500] transition-colors"
              type="password"
              placeholder="输入当前密码"
            />
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">新密码</label>
            <input
              v-model="passwordForm.newPassword"
              class="w-full h-11 bg-gray-50 rounded-xl px-4 text-xs outline-none border border-transparent focus:border-[#F7B500] transition-colors"
              type="password"
              placeholder="输入新密码"
            />
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 block mb-1">确认新密码</label>
            <input
              v-model="passwordForm.confirm"
              class="w-full h-11 bg-gray-50 rounded-xl px-4 text-xs outline-none border border-transparent focus:border-[#F7B500] transition-colors"
              type="password"
              placeholder="再次输入新密码"
            />
          </div>
        </div>
      </div>

      <!-- Save Profile Button -->
      <button
        class="w-full h-12 bg-[#F7B500] text-white rounded-xl font-bold text-sm shadow-sm hover:bg-[#e0a400] transition-colors"
        @click="saveProfile"
      >
        保存设置
      </button>

      <!-- Save Password Button -->
      <button
        class="w-full h-12 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
        @click="savePassword"
      >
        更新密码
      </button>
    </div>

    <!-- ─── Tab: User Management ─── -->
    <div v-if="activeTab === 'users'" class="p-4 space-y-4">
      <!-- Add User Button -->
      <button
        class="w-full h-12 bg-[#006B3F] text-white rounded-xl font-bold text-sm shadow-sm hover:bg-[#005a35] transition-colors flex items-center justify-center gap-2"
        @click="openNewUser"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        新增用户
      </button>

      <!-- User List -->
      <div
        v-for="user in mockUsers"
        :key="user.id"
        class="bg-white rounded-2xl p-4 shadow-sm border border-gray-50"
      >
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-[#006B3F] flex items-center justify-center text-white text-base font-bold flex-shrink-0 shadow-sm">
            {{ user.name.charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-bold text-gray-800">{{ user.name }}</h4>
            <p class="text-[10px] text-gray-400 truncate">{{ user.email }}</p>
            <div class="flex items-center gap-2 mt-1">
              <span class="px-2 py-0.5 text-[9px] font-bold rounded" :class="getRoleColor(user.role)">{{ getRoleLabel(user.role) }}</span>
              <span
                class="px-2 py-0.5 text-[9px] font-bold rounded"
                :class="user.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'"
              >
                {{ user.status === 'active' ? '正常' : '已禁用' }}
              </span>
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <button
              class="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              @click="openEditUser(user)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button
              class="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
              @click="confirmDelete(user)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
          <span class="text-[9px] text-gray-300">最近登录: {{ user.lastLogin }}</span>
          <button
            class="text-[9px] font-bold"
            :class="user.status === 'active' ? 'text-orange-500' : 'text-green-600'"
            @click="toggleUserStatus(user)"
          >
            {{ user.status === 'active' ? '禁用' : '启用' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── Logout Button ── -->
    <div class="px-4 pb-4">
      <button
        class="w-full h-12 bg-red-50 text-red-500 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
        @click="adminStore.logout(); router.push('/admin/login')"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        退出登录
      </button>
    </div>
    <!-- ─── Bottom Navigation ─── -->
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
      <router-link class="flex flex-col items-center gap-1 text-gray-400" to="/admin/inquiries">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span class="text-[10px] font-medium">询盘</span>
      </router-link>
      <router-link class="flex flex-col items-center gap-1 text-[#006B3F]" to="/admin/settings">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        <span class="text-[10px] font-medium">设置</span>
      </router-link>
    </nav>

    <!-- ─── User Form Modal ─── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showUserModal" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          <div class="absolute inset-0 bg-black/40" @click="showUserModal = false"></div>
          <div class="relative bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-[480px] p-6 shadow-2xl">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-base font-black text-gray-800">{{ editingUser ? '编辑用户' : '新增用户' }}</h3>
              <button class="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors" @click="showUserModal = false">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="space-y-4">
              <div>
                <label class="text-[10px] font-bold text-gray-400 block mb-1">姓名 <span class="text-red-400">*</span></label>
                <input
                  v-model="userForm.name"
                  class="w-full h-11 bg-gray-50 rounded-xl px-4 text-xs outline-none border border-transparent focus:border-[#F7B500] transition-colors"
                  type="text"
                  placeholder="输入姓名"
                />
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 block mb-1">邮箱 <span class="text-red-400">*</span></label>
                <input
                  v-model="userForm.email"
                  class="w-full h-11 bg-gray-50 rounded-xl px-4 text-xs outline-none border border-transparent focus:border-[#F7B500] transition-colors"
                  type="email"
                  placeholder="输入邮箱地址"
                />
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 block mb-1">电话</label>
                <input
                  v-model="userForm.phone"
                  class="w-full h-11 bg-gray-50 rounded-xl px-4 text-xs outline-none border border-transparent focus:border-[#F7B500] transition-colors"
                  type="text"
                  placeholder="输入电话号码"
                />
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 block mb-1">角色</label>
                <select
                  v-model="userForm.role"
                  class="w-full h-11 bg-gray-50 rounded-xl px-4 text-xs outline-none border border-transparent focus:border-[#F7B500] transition-colors"
                >
                  <option value="super_admin">超级管理员</option>
                  <option value="product_manager">产品经理</option>
                  <option value="customer_service">客服</option>
                  <option value="warehouse">仓库管理员</option>
                  <option value="finance">财务</option>
                </select>
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 block mb-1">状态</label>
                <div class="flex items-center gap-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      v-model="userForm.status"
                      value="active"
                      class="w-4 h-4 text-[#006B3F] focus:ring-[#006B3F]"
                    />
                    <span class="text-xs text-gray-600">正常</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      v-model="userForm.status"
                      value="inactive"
                      class="w-4 h-4 text-[#006B3F] focus:ring-[#006B3F]"
                    />
                    <span class="text-xs text-gray-600">禁用</span>
                  </label>
                </div>
              </div>
            </div>
            <div class="flex gap-3 mt-6">
              <button
                class="flex-1 h-11 bg-gray-100 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
                @click="showUserModal = false"
              >
                取消
              </button>
              <button
                class="flex-1 h-11 bg-[#006B3F] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-[#005a35] transition-colors"
                @click="saveUser"
              >
                {{ editingUser ? '保存修改' : '创建用户' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ─── Delete Confirmation Modal ─── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showDeleteConfirm" class="fixed inset-0 z-[100] flex items-center justify-center">
          <div class="absolute inset-0 bg-black/40" @click="showDeleteConfirm = false"></div>
          <div class="relative bg-white rounded-3xl w-[320px] p-6 shadow-2xl text-center">
            <div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="text-red-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h3 class="text-base font-black text-gray-800 mb-2">确认删除</h3>
            <p class="text-xs text-gray-500 mb-6">
              确定要删除用户 <span class="font-bold text-gray-700">{{ deletingUser?.name }}</span> 吗？此操作不可撤销。
            </p>
            <div class="flex gap-3">
              <button
                class="flex-1 h-11 bg-gray-100 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
                @click="showDeleteConfirm = false"
              >
                取消
              </button>
              <button
                class="flex-1 h-11 bg-red-500 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-red-600 transition-colors"
                @click="doDelete"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.toast-fade-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.toast-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.toast-fade-enter-from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
.toast-fade-leave-to { opacity: 0; transform: translateX(-50%) translateY(-10px); }

.modal-fade-enter-active { transition: opacity 0.25s ease; }
.modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from { opacity: 0; }
.modal-fade-leave-to { opacity: 0; }
</style>
