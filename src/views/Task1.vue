<template>
  <div class="demo-view">
    <h1>Задание 1 - Progress Bar</h1>

    <div class="container">
      <!-- Панель управления -->
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

        <!-- Кнопка автопрогона -->
        <div class="control-group auto-play-group">
          <button
            @click="toggleAutoPlay"
            :class="{ active: isAutoPlaying }"
            class="auto-play-btn"
          >
            <span v-if="!isAutoPlaying">▶ Авто-прогон (3с)</span>
            <span v-else>⏹ Стоп</span>
          </button>
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
import { ref, onUnmounted, watch, type Ref } from 'vue';
import ProgressSvg from '@/components/ProgressBarSVG.vue';
import ProgressCanvas from '@/components/ProgressBarCanvas.vue';
import { Type } from '@/types';

const progress: Ref<number> = ref(65);
const radius: Ref<number> = ref(70);
const stroke: Ref<number> = ref(8);
const type: Ref<Type> = ref<Type>(Type.Dashboard);

// --- Константы ---
const AUTO_PLAY_DURATION = 3000;
const TRANSITION_DELAY = 350; // 0.35s в миллисекунда

// --- Логика автопрогона ---
const isAutoPlaying = ref(false);
const isWaitingReset = ref(false);
const isWaitingRender = ref(false); // Флаг: ожидание отрисовки компонента
let animationFrameId: number | null = null;
let renderFrameId: number | null = null; // Таймер для одного кадра ожидания
let startTime: number | null = null;

const toggleAutoPlay = () => {
  if (isAutoPlaying.value) {
    stopAutoPlay();
    return;
  }

  // 1. Сброс прогресса
  isWaitingReset.value = true;
  progress.value = 0;
};

// Следим за прогрессом. Когда он станет 0, начинаем этап 2
watch(progress, (newVal) => {
  if (isWaitingReset.value && newVal === 0) {
    isWaitingReset.value = false;
    waitForRender(); // Переход к этапу 2
  }
});

// Этап 2: Ждем одного кадра, чтобы компонент успел обновиться (сбросился)
const waitForRender = () => {
  isWaitingRender.value = true;

  // Запускаем один кадр requestAnimationFrame
  renderFrameId = requestAnimationFrame(() => {
    isWaitingRender.value = false;

    // Кадр отрисован. Теперь ждем CSS transition (0.35s)
    setTimeout(() => {
      startAutoPlayAnimation();
    }, TRANSITION_DELAY);
  });
};

// Этап 3: Запуск таймера
const startAutoPlayAnimation = () => {
  isAutoPlaying.value = true;
  startTime = performance.now();

  const animate = (time: number) => {
    if (!isAutoPlaying.value || !startTime) return;

    const elapsed = time - startTime;

    if (elapsed >= AUTO_PLAY_DURATION) {
      progress.value = 100;
      isAutoPlaying.value = false;
      return;
    }

    progress.value = Math.min((elapsed / AUTO_PLAY_DURATION) * 100, 100);
    animationFrameId = requestAnimationFrame(animate);
  };
  animationFrameId = requestAnimationFrame(animate);
};

const stopAutoPlay = () => {
  isAutoPlaying.value = false;
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  if (renderFrameId) cancelAnimationFrame(renderFrameId);
  startTime = null;
  isWaitingReset.value = false;
  isWaitingRender.value = false;
};

onUnmounted(() => {
  stopAutoPlay();
});
</script>

<style scoped lang="scss">
$primary-color: #42b883;
$primary-hover: #3aa876;
$bg-color: #f4f4f9;
$card-bg: #ffffff;
$text-main: #2c3e50;
$text-secondary: #555555;
$border-radius: 12px;
$box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
$transition-speed: 0.2s;

.demo-view {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: $bg-color;
  color: $text-main;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
}

h1 {
  margin-bottom: 30px;
  color: $text-main;
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
  background: $card-bg;
  padding: 25px;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  flex: 1;
  min-width: 300px;
  max-width: 350px;
  height: fit-content;
}

.control-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  color: $text-secondary;
}

input[type="range"],
select {
  width: 100%;
  cursor: pointer;
}

/* Кнопка автопрогона */
.auto-play-group {
  margin-bottom: 20px;
  width: 100%;

  .auto-play-btn {
    width: 100%;
    padding: 12px 20px;
    cursor: pointer;
    background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
    border: 1px solid #90cdf4;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    color: #0c4a6e;
    transition: all $transition-speed;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 10px;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);
    }

    &.active {
      background: $primary-color;
      color: white;
      border-color: $primary-color;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  }
}

/* Область отображения */
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
  border-radius: $border-radius;
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
  color: $text-secondary;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.canvas-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 220px;
  border: 1px dashed #e5e7eb;
  border-radius: 8px;
  background: #fafafa;
}
</style>
