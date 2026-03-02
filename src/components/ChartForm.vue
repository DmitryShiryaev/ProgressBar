<template>
  <el-dialog
    :model-value="visible"
    :title="editingItem ? 'Редактирование сектора' : 'Добавление сектора'"
    width="400px"
    @close="emit('close')"
  >
    <el-form label-width="120px">
      <el-form-item label="Наименование">
        <el-input v-model="name" placeholder="Введите название" />
      </el-form-item>

      <el-form-item label="Значение">
        <el-input
          v-model="percentInput"
          placeholder="0–100"
          @input="onPercentInput"
        />
      </el-form-item>

      <el-form-item label="Цвет">
        <el-color-picker v-model="color" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="emit('close')">Отмена</el-button>
      <el-button type="primary" @click="onSubmit">
        {{ editingItem ? 'Сохранить' : 'Добавить сектор' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { ChartItem } from '@/stores/chartStore'

const props = defineProps<{
  visible: boolean
  editingItem: ChartItem | null
}>()

const emit = defineEmits<{
  close: null
  save: [data: Partial<ChartItem>]
}>()

const name = ref('')
const percentInput = ref('')
const color = ref('#409EFF')

watch(
  () => props.editingItem,
  (item) => {
    if (item) {
      name.value = item.name
      percentInput.value = String(item.percent)
      color.value = item.color
    } else {
      reset()
    }
  },
  { immediate: true }
)

function reset() {
  name.value = ''
  percentInput.value = ''
  color.value = '#409EFF'
}

function onPercentInput(val: string) {
  const cleaned = val.replace(/[^0-9]/g, '')
  percentInput.value = cleaned.slice(0, 3)
}

function onSubmit() {
  if (!name.value.trim()) {
    ElMessage.error('Введите наименование')
    return
  }

  const percent = Number(percentInput.value)
  if (isNaN(percent) || percent < 0 || percent > 100) {
    ElMessage.error('Значение должно быть от 0 до 100')
    return
  }

  emit('save', {
    id: props.editingItem?.id,
    name: name.value,
    percent,
    color: color.value
  })
}
</script>
