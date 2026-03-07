<template>
  <div class="chart-list-item">
    <div class="info">
      <span class="title">{{title}}</span>
      <el-divider direction="vertical" />
      <span class="percent">{{percent}} %</span>
      <el-divider direction="vertical" />
      <div class="color" :style="{background: color}"/>
    </div>
    <div class="actions">
      <el-link type="info" underline="never" @click="edit">
        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.6347 3.36068L11.5122 1.51465C12.5491 0.495117 14.2303 0.495117 15.2673 1.51465L17.1448 3.36068C18.1817 4.38021 18.1817 6.0332 17.1448 7.05273L15.2673 8.89876M9.6347 3.36068L1.98151 10.8855C1.55337 11.3064 1.28442 11.8586 1.21924 12.4505L0.758209 16.6368C0.660685 17.5224 1.474 18.2417 2.35937 18.053L6.18956 17.2366C6.68766 17.1305 7.14416 16.8856 7.50455 16.5313L15.2673 8.89876M9.6347 3.36068L15.2673 8.89876M12.451 17.9099H18.0836" stroke="#99A1B7" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </el-link>
      <el-link type="info" underline="never" @click="remove">
        <svg width="18" height="21" viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 4.75L12.4558 2.11754C12.1836 1.30086 11.4193 0.75 10.5585 0.75H7.44152C6.58066 0.75 5.81638 1.30086 5.54415 2.11754L5 4.75M3 5.55V6.25C3 6.25 3 8.3052 3 9.33228V15.75C3 17.9591 4.79086 19.75 7 19.75H11C13.2091 19.75 15 17.9591 15 15.75V9.33228C15 8.30521 15 6.25 15 6.25V5.55M0.75 4.75H17.25" stroke="#99A1B7" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </el-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ChartItem } from '@/stores/chartStore'

const props = defineProps<{
  data: ChartItem
}>()

const emit = defineEmits<{
  edit: [id: string]
  remove: [id: string]
}>()

const title = computed(() => props.data.name);
const percent = computed(() => props.data.percent);
const color = computed(() => props.data.color);

function edit() {
  doEmit('edit')
}
function remove(id) {
  doEmit('remove')
}

function doEmit(type: emit) {
  const id = props.data.id;
  if (id) {
    emit(type, id)
  } else {
    ElMessage.error('Нет сектора с таким ID: ', id)
  }
}

</script>

<style lang="scss" scoped>
  @use "@/styles/variables" as *;

  .chart-list-item {
    width: 100%;
    background: $chart-list-item-bg;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: $text-color;
    font-size: 16px;
    line-height: 24px;
    font-family: Inter;
    border-radius: 10px;
    padding: 18px 20px;


    .info {
      height: 24px;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      min-width: 253px;
      max-width: 400px;
      .title {
        width: 100px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .color {
        width: 20px;
        height: 20px;
        border-radius: 10px;
      }
    }
    .actions {
      display: inline-flex;
      justify-content: space-between;
      width: 69px;
      height: 24px;
      .el-link {
        width: 24px;
        color: $icon-color;
      }
    }
  }
</style>
