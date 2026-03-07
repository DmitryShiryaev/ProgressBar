<template>
  <div class="wrapper">
    <h2>Круговая Диаграмма</h2>
    <el-divider/>

    <chart-form-dialog
      :visible="dialogVisible"
      :editing-item="editingItem"
      @close="closeDialog"
      @save="handleSave"
    />

    <div class="layout">
      <div class="list">
        <el-scrollbar max-height="400px" class="chart-items list-view">
          <chart-list-item v-for="(item, key) in store.items" :key="key" :data="item" @edit="edit" @remove="remove"/>
        </el-scrollbar>
        <el-button type="primary" @click="openAddDialog" class="add-btn add-chart-item">
          Добавить сектор
        </el-button>
      </div>
      <div class="chart">
        <canvas ref="canvasRef"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useChartStore } from '@/stores/chartStore'
import ChartFormDialog from '@/components/ChartForm.vue'
import ChartListItem from '@/components/task2/ChartListItem.vue'
import type { ChartItem } from '@/stores/chartStore'
import Chart from 'chart.js/auto'

const store = useChartStore()

const dialogVisible: boolean = ref(false)
const editingItem: string = ref('')

function openAddDialog() {
  editingItem.value = null
  dialogVisible.value = true
}

function edit(id: string) {
  editingItem.value = id;
  dialogVisible.value = true
}

function closeDialog() {
  dialogVisible.value = false
}

function remove(id: string) {
  store.removeItem(id)
}

function handleSave(data: ChartItem) {
  store.saveItem(data)
  dialogVisible.value = false
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

function renderChart() {
  console.log('renderChart');
  if (!canvasRef.value) return

  const labels = Object.values(store.items).map(i => i.name)
  const data = Object.values(store.items).map(i => i.percent)
  const colors = Object.values(store.items).map(i => i.color)

  if (chart) {
    chart.data.labels = labels
    chart.data.datasets[0].data = data
    chart.data.datasets[0].backgroundColor = colors
    chart.update()
    return
  }

  chart = new Chart(canvasRef.value, {
    type: 'pie',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          hoverOffset: 10
        }
      ]
    },
    options: {
      responsive: true,
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 800
      },
      plugins: {
        legend: {
          position: 'bottom',
          align: 'center',
          labels: {
            boxWidth: 14,
            boxHeight: 14,
            padding: 30,
            textPadding: 18,
            usePointStyle: true,
            pointStyle: 'circle',
            color: "#3C3C3C",
            font: { size: 15, family: 'Inter', weight: '400' },
          }
        }
      }
    }
  })
}

onMounted(renderChart)

watch(() => store.items, () => renderChart());

</script>

<style lang="scss" scoped>
@use "@/styles/variables" as *;

h2 {
  display: flex;
  align-self: flex-start;
}

.layout {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  width: 100%;

  .list {
    width: 541px;
    display: flex;
    flex-wrap: wrap;
    align-self: flex-start;
    .list-view {
      height: auto;
      width: 100%;
      :deep(.el-scrollbar__wrap) {
        height: auto;

        .el-scrollbar__view {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }
      }
    }
    .add-chart-item {
      margin-top: 10px;
      width: 100%;
      padding: 18px 36px;
      height: 60px;
      line-height: 24px;
      font-size: 16px;
      background: $btn-bg;
    }
  }
  .chart {
    width: 500px;
    height: 500px;
  }
}

</style>
