<template>
  <section class="list-kategori">
    <q-list v-if="items.length" separator class="list-kategori__items">
      <q-item v-for="item in items" :key="item.id" class="list-kategori__item">
        <q-item-section avatar top>
          <q-avatar color="blue-grey-9" text-color="amber-6" icon="category" />
        </q-item-section>

        <q-item-section>
          <q-item-label class="list-kategori__name">{{ item.nama }}</q-item-label>
          <q-item-label caption class="list-kategori__description">
            {{ item.deskripsi || 'Belum ada deskripsi kategori.' }}
          </q-item-label>

          <div class="list-kategori__meta">
            <q-badge :color="item.aktif ? 'positive' : 'blue-grey-6'" rounded>
              {{ item.aktif ? 'Aktif' : 'Nonaktif' }}
            </q-badge>
          </div>
        </q-item-section>

        <q-item-section side top class="list-kategori__actions">
          <div class="row no-wrap">
            <q-btn
              flat
              round
              dense
              color="amber-6"
              icon="edit"
              aria-label="Ubah kategori"
              @click="emit('edit', item)"
            />
            <q-btn
              flat
              round
              dense
              color="red-4"
              icon="delete_outline"
              aria-label="Hapus kategori"
              :loading="deletingId === item.id"
              @click="emit('delete', item)"
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <div v-else-if="loading" class="list-kategori__skeleton q-pa-md">
      <q-skeleton v-for="index in 3" :key="index" type="QItem" dark />
    </div>

    <div v-else class="list-kategori__empty">Belum ada kategori yang sesuai.</div>

    <div v-if="hasMore" class="list-kategori__more">
      <q-btn
        flat
        no-caps
        color="amber-6"
        label="Muat lebih banyak"
        :loading="loadingMore"
        @click="emit('load-more')"
      />
    </div>

    <q-inner-loading :showing="loading && items.length > 0" color="amber-6" />
  </section>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
  loading: Boolean,
  loadingMore: Boolean,
  hasMore: Boolean,
  deletingId: Number,
})

const emit = defineEmits(['edit', 'delete', 'load-more'])
</script>

<style scoped>
.list-kategori {
  position: relative;
  overflow: hidden;
  border: 1px solid #364145;
  border-radius: 14px;
  background: #191d1f;
}

.list-kategori__item {
  min-height: 94px;
  padding: 16px 18px;
}

.list-kategori__name {
  color: #f3f5f5;
  font-size: 16px;
  font-weight: 700;
}

.list-kategori__description {
  margin-top: 4px;
  color: #aeb6b8;
}

.list-kategori__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.list-kategori__more {
  display: flex;
  justify-content: center;
  padding: 10px;
  border-top: 1px solid #364145;
}

.list-kategori__empty {
  padding: 42px 24px;
  color: #9da6a8;
  text-align: center;
}

.list-kategori__skeleton :deep(.q-skeleton) {
  margin-bottom: 12px;
}

@media (max-width: 480px) {
  .list-kategori__item {
    align-items: flex-start;
    padding: 14px 12px;
  }

  .list-kategori__actions {
    margin-left: 8px;
  }
}
</style>
