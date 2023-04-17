import { defineStore } from "pinia";
import { computed, ref, watchEffect } from "vue";
import { getDocList, getTypeItemById } from "@/utils/typeUtils";
import { getTypeList } from "@/storage/type";
import { isBeforeToday } from "@/utils/timeUtils";
import { getLastTypeId } from "@/storage/history";

export const useCurrentTypeStore = defineStore('currentType', () => {
  const allTodoMap = ref(new Map())
  const allTodoTypeList = ref([])
  // 如果是计算属性会不会影响性能？
  const countInfo = computed(() => {
    let allCount = 0
    let todoCount = 0
    let todayCount = 0
    for (const [type, itemList] of allTodoMap.value.entries()) {
      allCount += type.idList.length
      for (const item of itemList) {
        if (item.done) {
          continue
        }
        if (item.date && item.date.length > 0) {
          // 有日期
          todoCount++
        }
        if (item.date && isBeforeToday(item.date)) {
          todayCount++
        }
      }
    }
    return { allCount, todoCount, todayCount }
  })


  watchEffect(()=>{

  })

  const loadData = () => {
    let typeList = getTypeList()
    allTodoTypeList.value = typeList
    let map = new Map()
    for (const type of typeList) {
      let todoList = getDocList(type)
      map.set(type, todoList)
    }
    allTodoMap.value = map
    updateCurrentType(getTypeItemById(typeList, getLastTypeId()))
  }

  const addType = (type) => {
    allTodoMap.value.set(type, [])
  }

  const deleteType = (type) => {
    allTodoMap.value.delete(type)
  }

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
  const delAllDoneItem = () => {
    item.value.doneIdList = []
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
    allTodoMap, allTodoTypeList,
    loadData,
    deleteType, addType,
    countInfo,
    item, updateCurrentType, addTodoItem,
    addDoneItem,
    delAllDoneItem,
    delTodoItem,
    toggleDoneStatus
  }
})