import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Order } from '@/types/order'

export const useOrderStore = defineStore('orders', () => {
  const orders = ref<Order[]>([])

  function load() {
    try {
      const saved = localStorage.getItem('ecp2_orders')
      if (saved) {
        orders.value = JSON.parse(saved)
      }
    } catch {
      orders.value = []
    }
  }

  function save() {
    localStorage.setItem('ecp2_orders', JSON.stringify(orders.value))
  }

  function addOrder(order: Order) {
    orders.value.unshift(order)
    save()
  }

  function getOrderById(id: string): Order | undefined {
    return orders.value.find(o => o.id === id)
  }

  function updateOrderStatus(id: string, status: Order['status']) {
    const order = orders.value.find(o => o.id === id)
    if (order) {
      order.status = status
      order.updatedAt = new Date().toISOString()
      save()
    }
  }

  // Load on init
  load()

  return {
    orders,
    addOrder,
    getOrderById,
    updateOrderStatus,
    load,
  }
})
