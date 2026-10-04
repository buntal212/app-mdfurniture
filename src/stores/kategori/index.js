import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/boot/axios'

const perPage = 12

export const useKategoriStore = defineStore('kategori', () => {
  const items = ref([])
  const loading = ref(false)
  const loadingMore = ref(false)
  const saving = ref(false)
  const deletingId = ref(null)
  const currentPage = ref(0)
  const hasMore = ref(false)
  const search = ref('')

  const canLoadMore = computed(() => hasMore.value && !loadingMore.value)

  function setSearch(value) {
    search.value = value?.trim() || ''
  }

  async function getCategories({ page = 1, append = false } = {}) {
    if (append) {
      loadingMore.value = true
    } else {
      loading.value = true
    }

    try {
      const response = await api.get('/categories', {
        params: {
          page,
          per_page: perPage,
          search: search.value || undefined,
        },
      })

      const { current_page: currentPageResponse, data, next_page_url: nextPageUrl } = response.data

      items.value = append ? [...items.value, ...data] : data
      currentPage.value = currentPageResponse
      hasMore.value = Boolean(nextPageUrl)
    } finally {
      loading.value = false
      loadingMore.value = false
    }
  }

  async function saveCategory(category, categoryId = null) {
    saving.value = true

    try {
      const response = categoryId
        ? await api.put(`/categories/${categoryId}`, category)
        : await api.post('/categories', category)

      await getCategories()

      return response.data.message
    } finally {
      saving.value = false
    }
  }

  async function deleteCategory(categoryId) {
    deletingId.value = categoryId

    try {
      const response = await api.delete(`/categories/${categoryId}`)

      await getCategories()

      return response.data.message
    } finally {
      deletingId.value = null
    }
  }

  return {
    items,
    loading,
    loadingMore,
    saving,
    deletingId,
    currentPage,
    hasMore,
    canLoadMore,
    search,
    setSearch,
    getCategories,
    saveCategory,
    deleteCategory,
  }
})
