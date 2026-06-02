import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const userName = ref('')
  const userEmail = ref('')
  const userPhone = ref('')

  function login(email: string, password: string): boolean {
    // Mock login - accept any email with password length >= 6
    if (email && password.length >= 6) {
      isLoggedIn.value = true
      userEmail.value = email
      userName.value = email.split('@')[0]
      userPhone.value = '+233 24 000 0000'
      return true
    }
    return false
  }

  function register(name: string, email: string, phone: string, password: string): boolean {
    if (name && email && phone && password.length >= 6) {
      isLoggedIn.value = true
      userName.value = name
      userEmail.value = email
      userPhone.value = phone
      return true
    }
    return false
  }

  function logout() {
    isLoggedIn.value = false
    userName.value = ''
    userEmail.value = ''
    userPhone.value = ''
  }

  return { isLoggedIn, userName, userEmail, userPhone, login, register, logout }
}, {
  persist: true,
})
