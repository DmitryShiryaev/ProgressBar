import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuid } from 'uuid'

export interface ChartItem {
  id: string
  name: string
  percent: number
  color: string
}

export const useChartStore = defineStore('chart', () => {
  const id1 = uuid();
  const id2 = uuid();
  const id3 = uuid();
  const items = ref<Record<string, ChartItem>>({
    [id1]: {
      id: id1,
      name: 'Сектор - 1',
      percent: 30,
      color: '#4BC0C0'
    },
    [id2]: {
      id: id2,
      name: 'Сектор - 2',
      percent: 30,
      color: '#FFCD56'
    },
    [id3]: {
      id: id3,
      name: 'Сектор - 3',
      percent: 25,
      color: '#FF6384'
    }
});

  function saveItem(data: Partial<ChartItem>) {
    if (data.id && items.value[data.id]) {
      items.value = {
        ...items.value,
        [data.id]: { ...items.value[data.id], ...data },
      }
    } else {
      const id = uuid();
      items.value = {
        ...items.value,
        [id]: {
          id,
          name: data.name ?? 'Название по умолчанию',
          percent: data.percent ?? 0,
          color: data.color ?? '#409EFF'
        }
      }
    }
  }

  function removeItem(id: string) {
    const { [id]: removed, ...rest } = items.value
    items.value = rest
  }

  return { items, saveItem, removeItem }
})
