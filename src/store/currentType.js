import { defineStore } from "pinia";
import { ref } from "vue";

export const useCurrentTypeStore = defineStore('currentType', () => {
  let item = ref({
    colorIndex: 1,
    svgIndex: 0,
    name: 'name1',
    count: 2,
    id: 1
  })
  const updateCurrentType = (typeItem) => {
    item.value = typeItem
  }
  return { item, updateCurrentType }
})