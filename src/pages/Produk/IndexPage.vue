<template>
  <q-page class="produk-page"
    ><section class="produk-shell">
      <q-btn
        flat
        dense
        no-caps
        icon="arrow_back"
        label="Kembali ke menu"
        color="amber-6"
        @click="router.push('/')"
      />
      <div class="produk-header">
        <div>
          <h1>Produk</h1>
          <p>Kelola informasi produk dan unggah foto produk.</p>
        </div>
        <q-btn
          unelevated
          no-caps
          icon="add"
          label="Tambah Produk"
          color="amber-7"
          text-color="dark"
          @click="open()"
        />
      </div>
      <q-input
        v-model="search"
        dark
        outlined
        dense
        debounce="300"
        placeholder="Cari produk..."
        class="produk-search"
        @update:model-value="load"
        ><template #prepend><q-icon name="search" /></template></q-input
      ><ListProduk :items="items" :loading="loading" @edit="open" @delete="confirmRemove" />
    </section>
    <q-dialog v-model="dialog"
      ><q-card class="produk-dialog"
        ><q-card-section class="text-h6">{{
          editing ? 'Ubah Produk' : 'Tambah Produk'
        }}</q-card-section
        ><q-card-section
          ><FormProduk
            v-model="form"
            :categories="categories"
            :existing-images="editing?.images || []"
            :deleting-image-id="deletingImageId"
            :saving="saving"
            @submit="submit"
            @cancel="dialog = false"
            @delete-image="confirmImageRemove"
            @rejected-files="notifyRejectedFiles" /></q-card-section></q-card></q-dialog
    ><q-dialog v-model="removeDialog"
      ><q-card class="produk-dialog"
        ><q-card-section>Hapus produk “{{ selected?.nama }}”?</q-card-section
        ><q-card-actions align="right"
          ><q-btn flat no-caps label="Batal" @click="removeDialog = false" /><q-btn
            unelevated
            no-caps
            color="red-6"
            label="Hapus"
            @click="remove" /></q-card-actions></q-card></q-dialog
    ><q-dialog v-model="removeImageDialog"
      ><q-card class="produk-dialog"
        ><q-card-section>Hapus foto produk ini?</q-card-section
        ><q-card-section class="text-caption text-grey-5"
          >Foto akan dihapus permanen dan tidak dapat dikembalikan.</q-card-section
        ><q-card-actions align="right"
          ><q-btn flat no-caps label="Batal" @click="removeImageDialog = false" /><q-btn
            unelevated
            no-caps
            color="red-6"
            label="Hapus Foto"
            :loading="deletingImageId === selectedImage?.id"
            @click="removeImage" /></q-card-actions></q-card></q-dialog
  ></q-page>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import FormProduk from './comp/FormProduk.vue'
import ListProduk from './comp/ListProduk.vue'
import { useProdukStore } from '@/stores/produk'
const $q = useQuasar(),
  router = useRouter(),
  store = useProdukStore()
const { items, loading, saving, deletingImageId, categories } = storeToRefs(store)
const search = ref(''),
  dialog = ref(false),
  removeDialog = ref(false),
  removeImageDialog = ref(false),
  editing = ref(null),
  selected = ref(null),
  selectedImage = ref(null),
  form = ref(empty())
function empty() {
  return {
    category_id: null,
    nama: '',
    deskripsi_singkat: '',
    harga: null,
    stok: 0,
    status_stok: 'ready',
    aktif: true,
    indexable: true,
    images: [],
  }
}
async function load() {
  try {
    await store.getProducts(search.value)
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Produk gagal dimuat.',
    })
  }
}
function open(product = null) {
  editing.value = product
  form.value = product
    ? {
        ...empty(),
        category_id: product.category_id,
        nama: product.nama,
        deskripsi_singkat: product.deskripsi_singkat || '',
        harga: product.harga,
        stok: product.stok,
        status_stok: product.status_stok,
        aktif: product.aktif,
        featured: product.featured,
        indexable: product.indexable,
      }
    : empty()
  dialog.value = true
}

function notifyRejectedFiles() {
  $q.notify({
    type: 'negative',
    message: 'Foto harus berformat JPG, PNG, atau WebP dan berukuran maksimal 5 MB.',
  })
}
async function submit() {
  try {
    const message = await store.save(form.value, editing.value?.id)
    dialog.value = false
    $q.notify({ type: 'positive', message })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Produk gagal disimpan.',
    })
  }
}
function confirmRemove(product) {
  selected.value = product
  removeDialog.value = true
}
function confirmImageRemove(image) {
  selectedImage.value = image
  removeImageDialog.value = true
}
async function removeImage() {
  if (!editing.value || !selectedImage.value) return

  try {
    const response = await store.removeImage(editing.value.id, selectedImage.value.id)
    editing.value = response.data
    selectedImage.value = null
    removeImageDialog.value = false
    $q.notify({ type: 'positive', message: response.message })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Foto produk gagal dihapus.',
    })
  }
}
async function remove() {
  try {
    const message = await store.remove(selected.value.id)
    removeDialog.value = false
    $q.notify({ type: 'positive', message })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Produk gagal dihapus.',
    })
  }
}
onMounted(async () => {
  await Promise.all([load(), store.getCategories()])
})
</script>
<style scoped>
.produk-page {
  min-height: 100vh;
  padding: 32px 18px;
  color: #f4f5f5;
  background: #111313;
}
.produk-shell {
  width: min(1060px, 100%);
  margin: auto;
}
.produk-header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 16px;
  margin: 14px 0;
}
.produk-header h1 {
  margin: 0;
  font-size: 34px;
}
.produk-header p {
  color: #adb4b5;
}
.produk-search {
  width: min(320px, 100%);
  margin: 0 0 16px auto;
}
.produk-dialog {
  width: min(640px, calc(100vw - 32px));
  color: #f4f5f5;
  background: #202527;
}
@media (max-width: 600px) {
  .produk-page {
    padding: 22px 14px;
  }
  .produk-header {
    align-items: stretch;
    flex-direction: column;
  }
  .produk-search {
    width: 100%;
  }
}
</style>
