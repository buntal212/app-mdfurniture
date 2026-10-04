import { ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/boot/axios'

export const useProdukStore = defineStore('produk', () => {
  const items = ref([])
  const loading = ref(false)
  const saving = ref(false)
  const categories = ref([])

  async function getProducts(search = '') {
    loading.value = true
    try {
      items.value = (await api.get('/products', { params: { search, per_page: 12 } })).data.data
    } finally {
      loading.value = false
    }
  }

  async function getCategories() {
    categories.value = (await api.get('/categories', { params: { per_page: 100 } })).data.data
  }

  async function save(product, id) {
    saving.value = true
    try {
      const body = new FormData()
      const fields = [
        'category_id',
        'nama',
        'deskripsi_singkat',
        'harga',
        'stok',
        'status_stok',
        'aktif',
        'featured',
        'indexable',
      ]

      fields.forEach((field) => {
        if (product[field] !== undefined && product[field] !== null) {
          body.append(
            field,
            typeof product[field] === 'boolean' ? Number(product[field]) : product[field],
          )
        }
      })

      const images = product.images || []
      images.forEach((image) => body.append('images[]', image))

      if (id) {
        body.append('_method', 'PATCH')
      }

      const response = id
        ? await api.post(`/products/${id}`, body)
        : await api.post('/products', body)

      await getProducts()
      return response.data.message
    } finally {
      saving.value = false
    }
  }

  async function remove(id) {
    const response = await api.delete(`/products/${id}`)
    await getProducts()
    return response.data.message
  }

  return { items, loading, saving, categories, getProducts, getCategories, save, remove }
})
