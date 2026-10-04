<template>
  <q-form class="form-kategori" @submit.prevent="emit('submit')">
    <q-input
      :model-value="modelValue.nama"
      outlined
      dark
      hide-bottom-space
      label="Nama kategori"
      autocomplete="off"
      class="form-kategori__field"
      @update:model-value="updateField('nama', $event)"
    >
      <template #prepend><q-icon name="sell" /></template>
    </q-input>

    <q-input
      :model-value="modelValue.deskripsi"
      outlined
      dark
      hide-bottom-space
      type="textarea"
      label="Deskripsi"
      autogrow
      class="form-kategori__field"
      @update:model-value="updateField('deskripsi', $event)"
    >
      <template #prepend><q-icon name="notes" /></template>
    </q-input>

    <div class="form-kategori__options">
      <div class="form-kategori__toggle">
        <q-toggle
          :model-value="modelValue.aktif"
          color="amber-7"
          label="Kategori aktif"
          @update:model-value="updateField('aktif', $event)"
        />
        <span>{{
          modelValue.aktif ? 'Tampil di daftar kategori' : 'Disimpan sebagai nonaktif'
        }}</span>
      </div>
    </div>

    <div class="form-kategori__actions">
      <q-btn flat no-caps label="Batal" class="form-kategori__cancel" @click="emit('cancel')" />
      <q-btn
        type="submit"
        unelevated
        no-caps
        icon-right="arrow_forward"
        class="form-kategori__submit"
        :label="isEditing ? 'Simpan Perubahan' : 'Simpan Kategori'"
        :loading="saving"
      />
    </div>
  </q-form>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  saving: Boolean,
  isEditing: Boolean,
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

function updateField(field, value) {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value,
  })
}
</script>

<style scoped>
.form-kategori {
  display: grid;
  gap: 16px;
}

.form-kategori__field :deep(.q-field__control) {
  min-height: 53px;
  border-radius: 10px;
  background: rgba(8, 13, 15, 0.28);
}

.form-kategori__field :deep(.q-field__control:before) {
  border-color: #394246;
}

.form-kategori__field :deep(.q-field__control:hover::before),
.form-kategori__field :deep(.q-field--focused .q-field__control::after) {
  border-color: #e7ae1a;
}

.form-kategori__field :deep(.q-field__label) {
  color: #aeb6b8;
}

.form-kategori__field :deep(.q-field__native) {
  color: #f3f5f5;
}

.form-kategori__field :deep(.q-field__prepend) {
  color: #e9b126;
}

.form-kategori__field :deep(textarea.q-field__native) {
  min-height: 66px;
  resize: vertical;
}

.form-kategori__options {
  display: flex;
  align-items: stretch;
  gap: 16px;
}

.form-kategori__toggle {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 53px;
  padding: 7px 12px;
  border: 1px solid #394246;
  border-radius: 10px;
  background: rgba(8, 13, 15, 0.22);
}

.form-kategori__toggle :deep(.q-toggle__label) {
  color: #eef0ef;
  font-size: 13px;
  font-weight: 650;
}

.form-kategori__toggle span {
  padding-left: 40px;
  color: #899295;
  font-size: 10px;
}

.form-kategori__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 10px;
}

.form-kategori__cancel {
  min-height: 42px;
  padding: 0 17px;
  color: #c2cbcd;
}

.form-kategori__submit {
  min-height: 42px;
  padding: 0 18px;
  color: #181409;
  border-radius: 8px;
  background: linear-gradient(110deg, #eaa90a, #ffc630);
  box-shadow: 0 8px 18px rgba(229, 162, 10, 0.18);
  font-weight: 750;
}

@media (max-width: 480px) {
  .form-kategori__options {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .form-kategori__toggle {
    width: 100%;
  }

  .form-kategori__actions {
    justify-content: stretch;
  }

  .form-kategori__actions :deep(.q-btn) {
    flex: 1;
  }
}
</style>
