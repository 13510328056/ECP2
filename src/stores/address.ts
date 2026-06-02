import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ShippingInfo } from '@/types/order'

export const useAddressStore = defineStore('address', () => {
  const addresses = ref<ShippingInfo[]>([])
  const defaultIndex = ref(0)

  // Load from localStorage
  function load() {
    try {
      const saved = localStorage.getItem('ecp2_addresses')
      if (saved) {
        const parsed = JSON.parse(saved)
        addresses.value = parsed.list || []
        defaultIndex.value = parsed.defaultIndex || 0
      }
    } catch {
      addresses.value = []
      defaultIndex.value = 0
    }
  }

  function save() {
    localStorage.setItem('ecp2_addresses', JSON.stringify({
      list: addresses.value,
      defaultIndex: defaultIndex.value,
    }))
  }

  const defaultAddress = computed(() => {
    if (addresses.value.length === 0) return null
    return addresses.value[defaultIndex.value] || addresses.value[0]
  })

  function addAddress(addr: ShippingInfo) {
    addresses.value.push(addr)
    if (addresses.value.length === 1) {
      defaultIndex.value = 0
    }
    save()
  }

  function updateAddress(index: number, addr: ShippingInfo) {
    if (index >= 0 && index < addresses.value.length) {
      addresses.value[index] = addr
      save()
    }
  }

  function deleteAddress(index: number) {
    if (index >= 0 && index < addresses.value.length) {
      addresses.value.splice(index, 1)
      if (defaultIndex.value >= addresses.value.length) {
        defaultIndex.value = Math.max(0, addresses.value.length - 1)
      }
      save()
    }
  }

  function setDefault(index: number) {
    if (index >= 0 && index < addresses.value.length) {
      defaultIndex.value = index
      save()
    }
  }

  // Load on initialization
  load()

  return {
    addresses,
    defaultIndex,
    defaultAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefault,
    load,
  }
})
