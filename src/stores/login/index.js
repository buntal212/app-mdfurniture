import { defineStore } from 'pinia'
import { api } from '@/boot/axios'

const authTokenKey = 'mdfurniture_auth_token'

export const useLoginStore = defineStore('login', {
  state: () => ({
    form: {
      username: '',
      password: '',
      rememberMe: false,
    },
    loading: false,
    user: null,
  }),

  actions: {
    async login() {
      this.loading = true

      try {
        const response = await api.post('/login', this.form)

        this.user = response.data.user
        sessionStorage.removeItem(authTokenKey)
        localStorage.removeItem(authTokenKey)

        const storage = this.form.rememberMe ? localStorage : sessionStorage
        storage.setItem(authTokenKey, response.data.token)

        return response.data.message
      } catch (error) {
        const message =
          error.response?.data?.errors?.username?.[0] ||
          error.response?.data?.message ||
          'Login gagal. Silakan coba lagi.'

        throw new Error(message, { cause: error })
      } finally {
        this.loading = false
      }
    },
  },
})
