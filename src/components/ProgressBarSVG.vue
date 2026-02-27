<template>
  <div class="progress-box">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
      <defs>
        <mask :id="maskId">
          <rect v-if="!isDashboard" x="0" y="0" :width="size" :height="size" fill="white" />
          <path v-else :d="maskPath" fill="white" />
        </mask>
      </defs>

      <g :mask="`url(#${maskId})`">
        <circle
          :cx="center"
          :cy="center"
          :r="radius"
          fill="none"
          :stroke="COLORS[Status.Default]"
          stroke-opacity="0.2"
          :stroke-width="stroke"
          :style="{ transform: `rotate(${angleDeg}deg)`, transformOrigin: 'center' }"
        />

        <circle
          class="progress-ring__circle"
          :cx="center"
          :cy="center"
          :r="radius"
          fill="none"
          :stroke="color"
          :stroke-width="stroke"
          :stroke-dasharray="`${circumference} ${circumference}`"
          :stroke-dashoffset="offset"
          :style="{ transform: `rotate(${angleDeg}deg)` }"
        />
      </g>
    </svg>

    <div class="center-content" :style="{ color: color }">
      <component :is="centerContent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue';
import { Status, type ProgressProps} from '@/types';
import useProgressBar from '@/composables/useProgressBar';

const props = defineProps<ProgressProps>();

const { size, center, isDashboard, dy, dx, COLORS, getInternalStatus, getGradientColor } = useProgressBar(props);

const circumference = computed(() => Math.round(2 * Math.PI * props.radius));

const angleDeg = computed(() => {
  if (!isDashboard.value) return -90;
  return (Math.atan2(dy.value, -dx.value) * 180 / Math.PI);
});

const maskPath = computed(() => {
  const cx = center.value;
  const cy = center.value;
  const r = props.radius;
  const lx = cx - dx.value;
  const ly = cy + dy.value;
  const rx = cx + dx.value;
  const ry = cy + dy.value;
  return `M ${cx},${cy} L ${lx},${ly} A ${r},${r} 0 1 1 ${rx},${ry} Z`;
});

const currentStatus = computed(() => getInternalStatus(props.progress));
const color = computed(() => getGradientColor(props.progress, currentStatus.value));

const offset = computed(() => {
  const p = Math.max(0, Math.min(100, props.progress));
  const c = circumference.value;
  let hiddenLen = 0;
  if (isDashboard.value) {
    // 0.66 для компенсации
    const alpha = Math.asin(0.66);
    hiddenLen = Math.round(2 * alpha * props.radius);
  }
  const maxVisible = c - hiddenLen;
  const drawLen = (p / 100) * maxVisible;
  return Math.round(c - drawLen);
});

const maskId = `svg-mask-${Math.floor(Math.random() * 1000)}`;

// --- Иконки
const IconCheck = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [ h('polyline', { points: '20 6 9 17 4 12' }) ]);
const IconCross = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [ h('line', { x1: '18', y1: '6', x2: '6', y2: '18' }), h('line', { x1: '6', y1: '6', x2: '18', y2: '18' }) ]);
const IconAlert = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [ h('circle', { cx: '12', cy: '12', r: '10' }), h('line', { x1: '12', y1: '8', x2: '12', y2: '12' }), h('line', { x1: '12', y1: '16', x2: '12.01', y2: '16' }) ]);

const centerContent = computed(() => {
  if (currentStatus.value === Status.Success) return IconCheck;
  if (currentStatus.value === Status.Warning) return IconAlert;
  if (currentStatus.value === Status.Error) return IconCross;
  return () => h('span', Math.round(props.progress) + '%');
});
</script>

<style scoped lang="scss">
$box-size: 180px;
$transition-speed: 0.35s;

.progress-box {
  position: relative;
  width: fit-content;
  height: fit-content;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg { width: 100%; height: 100%; display: block; }
  .center-content {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    display: flex; justify-content: center; align-items: center;
    pointer-events: none;
    font-size: 24px; font-weight: bold; color: #333;
    svg { width: 1em; height: 1em; vertical-align: middle; }
  }
  .progress-ring__circle {
    transition: stroke-dashoffset $transition-speed ease, stroke $transition-speed ease;
    transform-origin: 50% 50%;
  }
}
</style>
