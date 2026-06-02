import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAdminStore = defineStore('admin', () => {
  const isAuthenticated = ref(false)
  const adminName = ref('')
  const adminEmail = ref('')

  function login(email: string, password: string): boolean {
    // Mock authentication
    if (email === 'admin@lisindustrial.gh' && password === 'admin123') {
      isAuthenticated.value = true
      adminName.value = 'Administrator'
      adminEmail.value = email
      return true
    }
    return false
  }

  function logout() {
    isAuthenticated.value = false
    adminName.value = ''
    adminEmail.value = ''
  }

  const isLoggedIn = computed(() => isAuthenticated.value)

  return { isAuthenticated, adminName, adminEmail, login, logout, isLoggedIn }
}, {
  persist: true,
})
