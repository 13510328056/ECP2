import { defineStore } from 'pinia'
import { ref } from 'vue'
import { categories as defaultCategories } from '@/data/categories'
import type { Category } from '@/data/categories'

const STORAGE_KEY = 'ecp2_categories'

function loadFromStorage(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return JSON.parse(JSON.stringify(defaultCategories))
}

function saveToStorage(data: Category[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const useCategoryStore = defineStore('categories', () => {
  const tree = ref<Category[]>(loadFromStorage())

  function persist() {
    saveToStorage(tree.value)
  }

  function findNode(id: string, nodes: Category[] = tree.value): Category | null {
    for (const node of nodes) {
      if (node.id === id) return node
      if (node.children) {
        const found = findNode(id, node.children)
        if (found) return found
      }
    }
    return null
  }

  function removeNodeById(id: string, nodes: Category[] = tree.value): boolean {
    const idx = nodes.findIndex((n) => n.id === id)
    if (idx >= 0) { nodes.splice(idx, 1); return true }
    for (const node of nodes) {
      if (node.children && removeNodeById(id, node.children)) return true
    }
    return false
  }

  function addCategory(category: Category, parentId?: string) {
    if (parentId) {
      const parent = findNode(parentId)
      if (parent) {
        parent.children.push(category)
      } else {
        tree.value.push(category)
      }
    } else {
      tree.value.push(category)
    }
    persist()
  }

  function updateCategory(id: string, data: Partial<Category>) {
    const node = findNode(id)
    if (node) {
      Object.assign(node, data)
      persist()
    }
  }

  function deleteCategory(id: string) {
    removeNodeById(id, tree.value)
    persist()
  }

  function resetToDefault() {
    tree.value = JSON.parse(JSON.stringify(defaultCategories))
    persist()
  }

  return { tree, findNode, addCategory, updateCategory, deleteCategory, resetToDefault, persist }
})
