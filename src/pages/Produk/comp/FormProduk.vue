<template>
  <q-form class="form-produk" @submit.prevent="emit('submit')">
    <q-select
      :model-value="modelValue.category_id"
      dark
      outlined
      label="Kategori"
      :options="categories"
      option-label="nama"
      option-value="id"
      emit-value
      map-options
      @update:model-value="set('category_id', $event)"
    />
    <q-input
      :model-value="modelValue.nama"
      dark
      outlined
      label="Nama produk"
      @update:model-value="set('nama', $event)"
    />
    <q-input
      :model-value="modelValue.deskripsi_singkat"
      dark
      outlined
      type="textarea"
      label="Deskripsi singkat"
      @update:model-value="set('deskripsi_singkat', $event)"
    />
    <div class="row q-col-gutter-md">
      <q-input
        class="col"
        :model-value="modelValue.harga"
        dark
        outlined
        type="number"
        label="Harga"
        @update:model-value="set('harga', $event || null)"
      />
      <q-input
        class="col"
        :model-value="modelValue.stok"
        dark
        outlined
        type="number"
        label="Stok"
        @update:model-value="set('stok', Number($event))"
      />
    </div>
    <q-select
      :model-value="modelValue.status_stok"
      dark
      outlined
      label="Status stok"
      :options="[
        { label: 'Ready', value: 'ready' },
        { label: 'Preorder', value: 'preorder' },
        { label: 'Habis', value: 'out_of_stock' },
      ]"
      emit-value
      map-options
      @update:model-value="set('status_stok', $event)"
    />

    <div>
      <div class="text-subtitle2 q-mb-sm">Foto produk</div>
      <q-file
        :model-value="modelValue.images"
        dark
        outlined
        multiple
        use-chips
        accept="image/jpeg,image/png,image/webp"
        max-file-size="5242880"
        label="Pilih foto produk"
        hint="JPG, PNG, WebP · maksimal 5 MB per foto · pilih sampai 10 foto"
        @update:model-value="set('images', $event || [])"
        @rejected="emit('rejected-files', $event)"
      >
        <template #prepend><q-icon name="add_photo_alternate" /></template>
      </q-file>
      <div v-if="existingImages.length" class="existing-images">
        <div v-for="image in existingImages" :key="image.id" class="existing-images__item">
          <div class="existing-images__preview">
            <q-img :src="image.image_url" fit="cover" class="existing-images__image" />
            <q-btn
              round
              dense
              unelevated
              color="red-7"
              icon="delete"
              size="sm"
              class="existing-images__delete"
              :loading="deletingImageId === image.id"
              :disable="saving || deletingImageId !== null"
              :aria-label="`Hapus foto ${image.alt_text || 'produk'}`"
              @click="emit('delete-image', image)"
            />
          </div>
          <span>{{ image.alt_text || 'Foto produk tersimpan' }}</span>
        </div>
      </div>
    </div>

    <div class="row justify-end q-gutter-sm">
      <q-btn flat no-caps label="Batal" @click="emit('cancel')" />
      <q-btn
        type="submit"
        unelevated
        no-caps
        color="amber-7"
        text-color="dark"
        :loading="saving"
        label="Simpan"
      />
    </div>
  </q-form>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Object, required: true },
  categories: { type: Array, default: () => [] },
  existingImages: { type: Array, default: () => [] },
  deletingImageId: { type: [Number, String], default: null },
  saving: Boolean,
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel', 'rejected-files', 'delete-image'])

function set(key, value) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<style scoped>
.form-produk {
  display: grid;
  gap: 14px;
}

.existing-images {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 14px;
}

.existing-images__item {
  display: grid;
  gap: 5px;
  width: 92px;
  color: #aeb6b8;
  font-size: 11px;
}

.existing-images__preview {
  position: relative;
}

.existing-images__image {
  width: 92px;
  height: 72px;
  border-radius: 8px;
}

.existing-images__delete {
  position: absolute;
  top: 4px;
  right: 4px;
}
</style>
