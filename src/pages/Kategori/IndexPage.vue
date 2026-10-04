<template>
  <q-page class="kategori-page">
    <section class="kategori-shell">
      <header class="kategori-header">
        <div>
          <q-btn
            flat
            dense
            no-caps
            icon="arrow_back"
            label="Kembali ke menu"
            class="kategori-header__back"
            @click="router.push('/')"
          />
          <h1>Kategori Produk</h1>
          <p>Kelola pengelompokan koleksi furniture yang tampil di katalog.</p>
        </div>

        <q-btn
          unelevated
          no-caps
          icon="add"
          label="Tambah Kategori"
          color="amber-7"
          text-color="dark"
          @click="openCreateDialog"
        />
      </header>

      <div class="kategori-toolbar">
        <q-input
          v-model="search"
          outlined
          dark
          dense
          debounce="300"
          placeholder="Cari kategori..."
          class="kategori-toolbar__search"
          @update:model-value="handleSearch"
        >
          <template #prepend><q-icon name="search" /></template>
        </q-input>
      </div>

      <ListKategori
        :items="items"
        :loading="loading"
        :loading-more="loadingMore"
        :has-more="hasMore"
        :deleting-id="deletingId"
        @edit="openEditDialog"
        @delete="confirmDelete"
        @load-more="loadMore"
      />
    </section>

    <q-dialog v-model="dialogOpen" persistent>
      <q-card class="kategori-dialog">
        <q-card-section class="kategori-dialog__header">
          <q-avatar class="kategori-dialog__icon" icon="category" />
          <div>
            <div class="kategori-dialog__title">
              {{ editingCategory ? 'Ubah Kategori' : 'Tambah Kategori' }}
            </div>
            <p>
              {{
                editingCategory
                  ? 'Perbarui informasi kategori produk.'
                  : 'Tambahkan pengelompokan baru untuk koleksi Anda.'
              }}
            </p>
          </div>
          <q-space />
          <q-btn
            flat
            round
            dense
            icon="close"
            class="kategori-dialog__close"
            aria-label="Tutup"
            @click="dialogOpen = false"
          />
        </q-card-section>

        <q-separator dark class="kategori-dialog__separator" />

        <q-card-section class="kategori-dialog__body">
          <FormKategori
            v-model="form"
            :saving="saving"
            :is-editing="Boolean(editingCategory)"
            @submit="submitForm"
            @cancel="dialogOpen = false"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="deleteDialogOpen" persistent>
      <q-card class="kategori-dialog">
        <q-card-section>
          <div class="text-h6">Hapus kategori</div>
          <p class="q-mb-none q-mt-sm text-grey-4">
            Hapus kategori “{{ categoryToDelete?.nama }}”?
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            no-caps
            label="Batal"
            color="blue-grey-3"
            :disable="Boolean(deletingId)"
            @click="deleteDialogOpen = false"
          />
          <q-btn
            unelevated
            no-caps
            color="red-6"
            label="Hapus"
            :loading="deletingId === categoryToDelete?.id"
            @click="deleteSelectedCategory"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import FormKategori from './comp/FormKategori.vue'
import ListKategori from './comp/ListKategori.vue'
import { useKategoriStore } from '@/stores/kategori'

const $q = useQuasar()
const router = useRouter()
const kategoriStore = useKategoriStore()
const { items, loading, loadingMore, saving, deletingId, currentPage, hasMore } =
  storeToRefs(kategoriStore)
const search = ref('')
const dialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const editingCategory = ref(null)
const categoryToDelete = ref(null)
const form = ref(createEmptyForm())

function createEmptyForm() {
  return {
    nama: '',
    deskripsi: '',
    aktif: true,
  }
}

function getErrorMessage(error, fallback) {
  return error.response?.data?.message || fallback
}

async function getCategories() {
  try {
    await kategoriStore.getCategories()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: getErrorMessage(error, 'Kategori gagal dimuat.'),
    })
  }
}

async function handleSearch(value) {
  kategoriStore.setSearch(value)
  await getCategories()
}

function openCreateDialog() {
  editingCategory.value = null
  form.value = createEmptyForm()
  dialogOpen.value = true
}

function openEditDialog(category) {
  editingCategory.value = category
  form.value = {
    nama: category.nama,
    deskripsi: category.deskripsi || '',
    aktif: category.aktif,
  }
  dialogOpen.value = true
}

async function submitForm() {
  try {
    const message = await kategoriStore.saveCategory(form.value, editingCategory.value?.id)

    dialogOpen.value = false
    $q.notify({ type: 'positive', message })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: getErrorMessage(error, 'Kategori gagal disimpan.'),
    })
  }
}

function confirmDelete(category) {
  categoryToDelete.value = category
  deleteDialogOpen.value = true
}

async function deleteSelectedCategory() {
  if (!categoryToDelete.value) {
    return
  }

  try {
    const message = await kategoriStore.deleteCategory(categoryToDelete.value.id)

    deleteDialogOpen.value = false
    categoryToDelete.value = null
    $q.notify({ type: 'positive', message })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: getErrorMessage(error, 'Kategori gagal dihapus.'),
    })
  }
}

async function loadMore() {
  if (!hasMore.value) {
    return
  }

  try {
    await kategoriStore.getCategories({
      page: currentPage.value + 1,
      append: true,
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: getErrorMessage(error, 'Kategori berikutnya gagal dimuat.'),
    })
  }
}

onMounted(getCategories)
</script>

<style scoped>
.kategori-page {
  min-height: 100vh;
  padding: 32px 18px;
  color: #f4f5f5;
  background: #111313;
}

.kategori-shell {
  width: min(1060px, 100%);
  margin: 0 auto;
}

.kategori-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.kategori-header__back {
  margin-bottom: 8px;
  padding: 0;
  color: #d7aa4d;
}

.kategori-header h1 {
  margin: 0;
  font-size: clamp(27px, 4vw, 35px);
  line-height: 1.2;
}

.kategori-header p {
  margin: 8px 0 0;
  color: #adb4b5;
}

.kategori-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.kategori-toolbar__search {
  width: min(320px, 100%);
}

.kategori-dialog {
  width: min(540px, calc(100vw - 32px));
  overflow: hidden;
  color: #f4f5f5;
  border: 1px solid rgba(225, 173, 37, 0.28);
  border-radius: 16px;
  background: radial-gradient(circle at 92% 0%, rgba(224, 167, 25, 0.14), transparent 36%), #1b2022;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.42);
}

.kategori-dialog__header {
  display: flex;
  align-items: center;
  gap: 13px;
  min-height: 104px;
  padding: 22px 24px 19px;
}

.kategori-dialog__icon {
  flex: 0 0 auto;
  width: 43px;
  height: 43px;
  color: #ffc32b;
  border: 1px solid rgba(255, 195, 43, 0.33);
  background: rgba(222, 165, 13, 0.12);
}

.kategori-dialog__title {
  color: #f8f8f5;
  font-size: 20px;
  font-weight: 750;
  line-height: 1.25;
}

.kategori-dialog__header p {
  margin: 5px 0 0;
  color: #aeb5b6;
  font-size: 12px;
  line-height: 1.45;
}

.kategori-dialog__close {
  align-self: flex-start;
  color: #c8cece;
}

.kategori-dialog__separator {
  background: rgba(255, 255, 255, 0.09);
}

.kategori-dialog__body {
  padding: 22px 24px 24px;
}

@media (max-width: 600px) {
  .kategori-page {
    padding: 22px 14px;
  }

  .kategori-header {
    align-items: stretch;
    flex-direction: column;
  }

  .kategori-header > .q-btn {
    width: 100%;
  }

  .kategori-toolbar__search {
    width: 100%;
  }

  .kategori-dialog__header {
    min-height: auto;
    padding: 18px 18px 16px;
  }

  .kategori-dialog__body {
    padding: 18px;
  }
}
</style>
