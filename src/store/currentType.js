import { defineStore } from "pinia";
import { ref } from "vue";

export const useCurrentTypeStore = defineStore('currentType', () => {
  let item = ref({
    colorIndex: 1,
    svgIndex: 0,
    name: 'name1',
    count: 2,
    id: 1,
    idList: [],
  })
  const updateCurrentType = (typeItem) => {
    item.value = typeItem
  }
  const addTodoItem = (todoId) => {
    item.value.idList.push(todoId)
  }

  const delTodoItem = (todoId) => {
    item.value.idList.splice(item.value.idList.indexOf(todoId), 1)
  }

  return { item, updateCurrentType, addTodoItem, delTodoItem }
})