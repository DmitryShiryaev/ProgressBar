<template>
  <div class="progress-box">
    <canvas ref="canvasRef" :width="size" :height="size"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Status, type ProgressProps } from '@/types';
import useProgressBar, { hexToRgb } from '@/composables/useProgressBar';

const props = defineProps<ProgressProps>();
const canvasRef = ref<HTMLCanvasElement | null>(null);
let rafId: number | null = null;
const currentP = ref(0);

const { size, center, isDashboard, dy, dx, COLORS, getInternalStatus, getGradientColor } = useProgressBar(props);

// --- Отрисовка иконок ---
const drawIcon = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  status: Status
) => {
  ctx.save();

  // Получаем цвет
  const colorRgb = hexToRgb(COLORS[status]);
  const colorString = `rgb(${colorRgb.join(',')})`;

  ctx.lineWidth = radius * 0.07; // Базовая толщина

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = colorString;
  ctx.fillStyle = colorString;

  if (status === Status.Success) {
    const rIcon = radius * 0.5;
    // Галочка
    ctx.beginPath();
    ctx.moveTo(cx - rIcon * 0.12, cy + rIcon * 0.02);
    ctx.lineTo(cx, cy + rIcon * 0.12);
    ctx.lineTo(cx + rIcon * 0.15, cy - rIcon * 0.10);
    ctx.stroke();
  } else if (status === Status.Warning) {
    const rIcon = radius * 0.3;
    ctx.lineWidth = radius * 0.03;
    // Восклицательный знак
    ctx.beginPath();
    ctx.arc(cx, cy, rIcon * 0.5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, cy - (rIcon * 0.23));
    ctx.lineTo(cx, cy);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy + (rIcon * 0.23), rIcon * 0.1, 0, Math.PI * 2);
    ctx.fill();
  } else if (status === Status.Error) {
    const rIcon = radius * 0.4;
    const coef = 0.2;
    ctx.lineWidth = radius * 0.05;
    ctx.beginPath();
    ctx.moveTo(cx - rIcon * coef, cy - rIcon * coef);
    ctx.lineTo(cx + rIcon * coef, cy + rIcon * coef);
    ctx.moveTo(cx + rIcon * coef, cy - rIcon * coef);
    ctx.lineTo(cx - rIcon * coef, cy + rIcon * coef);
    ctx.stroke();
  }
  ctx.restore();
};

const draw = () => {
  const cvs = canvasRef.value;
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  if (!ctx) return;

  const { radius, stroke } = props;
  const s = size.value;
  const cx = center.value;
  const cy = center.value;

  ctx.clearRect(0, 0, s, s);
  currentP.value += (props.progress - currentP.value) * 0.1;
  const p = currentP.value;

  // ИСПРАВЛЕНИЕ 1: Для иконки используем ЦЕЛЕВОЙ прогресс (props.progress)
  // Если ползунок на 100%, иконка сразу станет Success
  const iconStatus = getInternalStatus(props.progress);

  ctx.save();

  if (isDashboard.value) {
    ctx.beginPath();
    const lx = cx - dx.value;
    const ly = cy + dy.value;

    ctx.moveTo(cx, cy);
    ctx.lineTo(lx, ly);
    ctx.arc(cx, cy, radius, Math.PI - Math.asin(0.75), Math.asin(0.75), false);
    ctx.closePath();
    ctx.clip();
  }

  const cap: CanvasLineCap = isDashboard.value ? 'butt' : 'round';

  // 1. Трек
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = COLORS[Status.Default];
  ctx.lineWidth = stroke;
  ctx.lineCap = cap;
  ctx.stroke();
  ctx.restore();

  // 2. Прогресс (используем анимированный p для цвета и длины)
  if (p > 0.5) {
    let start = -Math.PI / 2;
    let max = (3 * Math.PI) / 2;

    if (isDashboard.value) {
      const a = Math.asin(0.75);
      start = Math.PI - a;
      max = (2 * Math.PI) + a;
    }

    const sweep = (p / 100) * (max - start);

    ctx.beginPath();
    ctx.arc(cx, cy, radius, start, start + sweep);
    ctx.strokeStyle = getGradientColor(p, iconStatus); // Цвет тоже зависит от iconStatus
    ctx.lineWidth = stroke;
    ctx.lineCap = cap;
    ctx.stroke();
  }
  ctx.restore();

  // 3. Контент
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = getGradientColor(p, iconStatus);
  ctx.font = `bold ${radius * 0.4}px sans-serif`;

  if (iconStatus === Status.Success || iconStatus === Status.Warning || iconStatus === Status.Error) {
    drawIcon(ctx, cx, cy, radius, iconStatus);
  } else {
    ctx.fillText(Math.round(p) + '%', cx, cy);
  }

  rafId = requestAnimationFrame(draw);
};

onMounted(draw);
onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId);
});
</script>

<style scoped lang="scss">
$box-size: 180px;

.progress-box {
  position: relative;
  width: $box-size;
  height: $box-size;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  canvas { display: block; max-width: 100%; }
}
</style>
