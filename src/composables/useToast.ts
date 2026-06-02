import { reactive } from 'vue'

export function useToast() {
  const toast = reactive({ show: false, message: '', type: 'success' as 'success' | 'error' | 'info' })
  let timeout: number | null = null

  function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
    toast.message = message
    toast.type = type
    toast.show = true
    if (timeout) clearTimeout(timeout)
    timeout = window.setTimeout(() => {
      toast.show = false
    }, 2500)
  }

  return { toast, showToast }
}
