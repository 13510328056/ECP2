import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Product, CartItem } from '@/types'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const subtotal = computed(() => items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0))
  const shippingCost = computed(() => subtotal.value >= 200 ? 0 : 25)
  const total = computed(() => subtotal.value + shippingCost.value)
  const selectedItems = computed(() => items.value.filter(item => item.quantity > 0))
  const selectedCount = computed(() => selectedItems.value.length)
  const selectedTotal = computed(() => selectedItems.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0))

  function addItem(product: Product, quantity: number = 1, sku?: string) {
    const existing = items.value.find(i => i.productId === product.id && i.selectedSku === sku)
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({ productId: product.id, product, quantity, selectedSku: sku })
    }
  }

  function updateQuantity(productId: string, quantity: number) {
    const item = items.value.find(i => i.productId === productId)
    if (item) {
      item.quantity = Math.max(1, Math.min(quantity, item.product.stockCount))
    }
  }

  function removeItem(productId: string) {
    items.value = items.value.filter(i => i.productId !== productId)
  }

  function clearCart() {
    items.value = []
  }

  return { items, totalItems, subtotal, shippingCost, total, selectedItems, selectedCount, selectedTotal, addItem, updateQuantity, removeItem, clearCart }
}, {
  persist: {
    pick: ['items'],
  },
})
