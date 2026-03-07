<template>
  <el-dialog
    class="chart-form"
    :show-close="false"
    :model-value="visible"
    :title="editingItem ? 'Редактирование сектора' : 'Добавление сектора'"
    width="390px"
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
        <el-input :model-value="color" />
        <div class="color-circle" :style="{background: color}"/>
      </el-form-item>
      <el-color-picker-panel v-model="color" style="width: calc(100% - 26px)"/>
    </el-form>

    <template #footer>
      <el-button type="primary" @click="onSubmit" class="save-btn">
        {{ editingItem ? 'Сохранить' : 'Добавить сектор' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { ChartItem } from '@/stores/chartStore'
import { useChartStore } from '@/stores/chartStore'

const store = useChartStore();
const props = defineProps<{
  visible: boolean
  editingItem: string | null
}>()

const emit = defineEmits<{
  close: null
  save: [data: Partial<ChartItem>]
}>()

const name = ref('')
const percentInput = ref('')
const color = ref('')

function onChanges() {
  const item = store.items[props.editingItem];
  if (item) {
    name.value = item.name
    percentInput.value = String(item.percent)
    color.value = item.color
  } else {
    reset()
  }
}

function reset() {
  name.value = ''
  percentInput.value = ''
  color.value = ''
}

function onPercentInput(val: string) {
  const cleaned = val.replace(/[^0-9]/g, '')
  percentInput.value = cleaned.slice(0, 3)
}

function isColor(str: string): boolean {
  const s = new Option().style
  s.color = str
  return s.color !== ''
}


function onSubmit() {
  if (!name.value.trim()) {
    ElMessage.error('Введите наименование')
    return
  }

  const percent = Number(percentInput.value)
  if (isNaN(percent) || percent < 1 || percent > 100) {
    ElMessage.error('Значение должно быть от 1 до 100')
    return
  }

  if (!isColor(color.value)) {
    ElMessage.error('Задан некорректный цвет');
    return
  }

  emit('save', {
    id: props.editingItem,
    name: name.value,
    percent,
    color: color.value
  })
}

onMounted(onChanges);

watch(
  () => props.editingItem,
  () => onChanges()
)
</script>

<style lang="scss">
  @use "@/styles/variables" as *;

  .chart-form {
    padding: 20px;

    .el-dialog__header {
      display: flex;
      align-items: end;
      width: 100%;
      height: 24px;
      padding: 20px 0;
      .el-dialog__title {
        font-weight: 500;
        font-size: 20px;
        line-height: 24px;
        color: $text-color;
      }
    }
    .el-form-item {
      width: 100%;
      height: 60px;
      padding: 10px 20px;
      border: 1px solid $border-color;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;

      .color-circle {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        position: absolute;
        right: 10px;
        top: 0;
      }

      &__label {
        width: 100%;
        justify-content: flex-start;
        height: 16px;
        line-height: 16px;
        font-weight: 400;
        font-size: 12px;
        color: $text-color-secondary
      }
      .el-input {
        &__wrapper {
          box-shadow: none;
          border: none;
          line-height: 24px;
          height: 24px;
          font-size: 16px;
          color: $text-color;
          padding: 0;
        }
      }
    }
    .save-btn {
      height: 60px;
      width: 100%;
      padding: 18px 36px;
      gap:10px;
      background: $btn-bg;
      border-radius: 10px;
      font-size: 16px;
      line-height: 24px;
      font-weight: 400;
    }
  }
</style>
