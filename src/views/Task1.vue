<template>
  <div class="demo-view">
    <h1>Задание 1 - Progress Bar</h1>

    <div class="container">
      <aside class="controls-card">
        <h3>Настройки</h3>

        <div class="control-group">
          <label>Значение: {{ Math.round(progress) }}%</label>
          <input v-model.number="progress" type="range" min="0" max="100" step="1" />
        </div>

        <div class="control-group">
          <label>Радиус: {{ radius }}px</label>
          <input v-model.number="radius" type="range" min="50" max="100" step="1" />
        </div>

        <div class="control-group">
          <label>Толщина: {{ stroke }}px</label>
          <input v-model.number="stroke" type="range" min="3" max="12" step="1" />
        </div>

        <div class="control-group">
          <label>Тип отображения</label>
          <select v-model="type">
            <option value="circle">Полный круг</option>
            <option value="dashboard">Dashboard</option>
          </select>
        </div>
      </aside>

      <!-- Область отображения -->
      <main class="display-area">
        <!-- SVG Вариант -->
        <div class="preview-card">
          <h3>SVG Component</h3>
          <div class="canvas-wrapper">
            <progress-svg
              :radius="radius"
              :stroke="stroke"
              :progress="progress"
              :type="type"
            />
          </div>
        </div>

        <!-- Canvas Вариант -->
        <div class="preview-card">
          <h3>Canvas Component</h3>
          <div class="canvas-wrapper">
            <progress-canvas
              :radius="radius"
              :stroke="stroke"
              :progress="progress"
              :type="type"
            />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import ProgressSvg from '@/components/ProgressBarSVG.vue';
import ProgressCanvas from '@/components/ProgressBarCanvas.vue';
import { Type } from '@/types';

const progress: Ref<number> = ref(65);
const radius: Ref<number> = ref(70);
const stroke: Ref<number> = ref(8);
const type: Ref<Type> = ref<Type>(Type.Dashboard);
</script>

<style scoped>
.demo-view {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f4f4f9;
  min-height: 100vh;
  color: #333;
}

h1 {
  margin-bottom: 30px;
  color: #2c3e50;
}

.container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
  max-width: 1200px;
  width: 100%;
}

/* Панель управления */
.controls-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  flex: 1;
  min-width: 300px;
  max-width: 350px;
  height: fit-content;
}

.control-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #555;
}

input[type="range"],
select {
  width: 100%;
  cursor: pointer;
}

button {
  padding: 10px 15px;
  cursor: pointer;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s;
  text-align: left;
  &:hover {
    background: #e9ecef;
  }
}

.display-area {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  flex: 2;
  justify-content: center;
}

.preview-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-card h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.1rem;
  color: #555;
}

.canvas-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 220px;
}
</style>
