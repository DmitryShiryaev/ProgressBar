import { computed } from 'vue';
import { type ProgressProps, Type, Status } from '@/types';
import { COLORS } from '@/defaults/progressBar';

// Экспортируем хелпер, чтобы использовать в Canvas
export const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  // Если regex не сработал, возвращаем черный
  if (!result) return [0, 0, 0];

  return [
    parseInt(result[1] || '0', 16), // Добавляем '0' как fallback для undefined
    parseInt(result[2] || '0', 16),
    parseInt(result[3] || '0', 16)
  ];
};

export default function useProgressBar(props: ProgressProps) {
  // --- 1. Геометрия ---
  const size = computed(() => (props.radius * 2) + props.stroke);
  const center = computed(() => size.value / 2);

  const VISUAL_CUT_RATIO = 0.75;

  const dy = computed(() => props.radius * VISUAL_CUT_RATIO);
  const dx = computed(() => Math.sqrt(props.radius * props.radius - dy.value * dy.value));

  const isDashboard = computed(() => props.type === Type.Dashboard);

  // --- 2. Вспомогательные функции ---
  const lerp = (start: number, end: number, t: number): number => Math.round(start + (end - start) * t);

  const GRADIENT_STEPS = [
    { limit: 25, from: Status.Default, to: Status.InProgress },
    { limit: 50, from: Status.InProgress, to: Status.Error },
    { limit: 75, from: Status.Error, to: Status.Warning },
    { limit: 100, from: Status.Warning, to: Status.Success },
  ];

  const getInternalStatus = (percent: number): Status => {
    if (percent < 25) return Status.Default;
    if (percent < 50) return Status.InProgress;
    if (percent < 75) return Status.Error;
    if (percent < 100) return Status.Warning;
    return Status.Success;
  };

  const getGradientColor = (percent: number, currentStatus: Status): string => {
    if (currentStatus === Status.Default) {
      return COLORS[Status.Default];
    }

    const step = GRADIENT_STEPS.find(s => percent <= s.limit);
    if (!step) return COLORS[Status.Success];

    const stepIndex = GRADIENT_STEPS.indexOf(step);

    const prevLimit = stepIndex > 0 ? GRADIENT_STEPS[stepIndex - 1]!.limit : 0;

    const localPct = (percent - prevLimit) / (step.limit - prevLimit);

    const startColor = hexToRgb(COLORS[step.from]);
    const endColor = hexToRgb(COLORS[step.to]);

    const r = lerp(startColor[0], endColor[0], localPct);
    const g = lerp(startColor[1], endColor[1], localPct);
    const b = lerp(startColor[2], endColor[2], localPct);

    return `rgb(${r}, ${g}, ${b})`;
  };

  return {
    size,
    center,
    isDashboard,
    dy,
    dx,
    COLORS,
    getInternalStatus,
    getGradientColor,
    hexToRgb // Экспортируем для использования в Canvas
  };
}
