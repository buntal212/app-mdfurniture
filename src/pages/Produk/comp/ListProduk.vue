<template>
  <q-list separator class="list-produk">
    <q-item v-for="item in items" :key="item.id">
      <q-item-section avatar>
        <img
          v-if="item.images?.length"
          :src="item.images[0].thumbnail_url || item.images[0].image_url"
          :alt="item.images[0].alt_text || item.nama"
          loading="lazy"
          decoding="async"
          width="48"
          height="48"
          class="list-produk__image"
        />
        <q-avatar v-else color="blue-grey-9" text-color="amber-6" icon="inventory_2" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ item.nama }}</q-item-label>
        <q-item-label caption>{{ item.category?.nama || 'Tanpa kategori' }}</q-item-label>
        <q-item-label caption>{{ item.stok }} stok · {{ item.status_stok }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <div>
          <q-btn flat round dense icon="edit" color="amber-6" @click="emit('edit', item)" />
          <q-btn
            flat
            round
            dense
            icon="delete_outline"
            color="red-4"
            @click="emit('delete', item)"
          />
        </div>
      </q-item-section>
    </q-item>
    <div v-if="!loading && !items.length" class="q-pa-lg text-center text-grey-5">
      Belum ada produk.
    </div>
    <q-inner-loading :showing="loading" color="amber-6" />
  </q-list>
</template>

<script setup>
defineProps({ items: { type: Array, default: () => [] }, loading: Boolean })
const emit = defineEmits(['edit', 'delete'])
</script>

<style scoped>
.list-produk {
  position: relative;
  border: 1px solid #364145;
  border-radius: 14px;
  background: #191d1f;
}

.list-produk :deep(.q-item__label) {
  color: #f3f5f5;
}

.list-produk :deep(.q-item__label--caption) {
  color: #aeb6b8;
}

.list-produk__image {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
}
</style>
