import { defineStore } from "pinia";
import { ref } from "vue";

export const useCurrentTypeStore = defineStore('currentType', () => {
  // todo 这里改成idList:[{id:1, done: true}, {id:2, done: false}] 更合理点
  // todo 但是我代码已经写成这样了、懒得改过去了
  let item = ref({
    colorIndex: 1,
    svgIndex: 0,
    name: 'name1',
    count: 2,
    id: 1,
    idList: [],
    doneIdList: [],
  })
  const updateCurrentType = (typeItem) => {
    item.value = typeItem
  }
  const addTodoItem = (todoId) => {
    item.value.idList.push(todoId)
  }
  const addDoneItem = (itemId) => {
    item.value.doneIdList.push(itemId)
  }
  const delTodoItem = (todoId) => {
    item.value.idList.splice(item.value.idList.indexOf(todoId), 1)
  }

  /**
   * todo 这里设计不合理的是，fromIndex和toIndex从外部传进来
   * @param todoId
   * @param done 新状态是否为done，done为true时，fromList为idList、toList为doneIdList
   */
  const toggleDoneStatus = (todoId, done) => {
    let fromList
    let toList
    if (done) {
      // 变为true：idList移到doneIdList
      fromList = item.value.idList
      toList = item.value.doneIdList
    } else {
      fromList = item.value.doneIdList
      toList = item.value.idList
    }
    // idList不需要排序，所以不用算位置
    fromList.splice(fromList.indexOf(todoId), 1)
    toList.push(todoId)
  }

  return {
    item, updateCurrentType, addTodoItem, addDoneItem,
    delTodoItem, toggleDoneStatus
  }
})