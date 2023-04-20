import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import { getDocList, getTypeItemById, TODO_TYPE_TODAY, TodoDoc, TYPE_ALL_ID, TYPE_TODAY_ID } from "@/utils/typeUtils";
import { isBeforeToday } from "@/utils/timeUtils";
import { delDoc } from "@/storage/type";

export const ALL_TYPE_HEADER = 1
export const ALL_TYPE_LIST = 2
export const ALL_TYPE_FOOTER = 3

export const useCurrentTypeStore = defineStore('currentType', () => {
    const allTodoMap = ref(new Map())
    const allTodoTypeList = ref([])
    const idTodoMap = computed(() => {
      let map = new Map()
      for (const [type, itemList] of allTodoMap.value.entries()) {
        map.set(type.id, itemList)
      }
      return map
    })
    const typeMap = computed(() => {
      let map = new Map()
      for (const type of allTodoMap.value.keys()) {
        map.set(type.id, type)
      }
      return map
    })

    // 如果是计算属性会不会影响性能？
    const countInfo = computed(() => {
      let allCount = 0
      let planCount = 0
      let todayCount = 0
      for (const [type, itemList] of allTodoMap.value.entries()) {
        allCount += type.idList.length
        for (const item of itemList) {
          if (item.done || !item.saved) {
            continue
          }
          if (item.date && item.date.length > 0) {
            // 有日期
            planCount++
          }
          if (item.date && isBeforeToday(item.date)) {
            todayCount++
          }
        }
      }
      return { allCount, planCount, todayCount }
    })

    const currentTypeId = ref(TYPE_TODAY_ID)
    // todo 这里改成idList:[{id:1, done: true}, {id:2, done: false}] 更合理点
    // todo 但是我代码已经写成这样了、懒得改过去了
    const item = ref(TODO_TYPE_TODAY)

    const loadData = () => {
      let map = new Map()
      for (const type of allTodoTypeList.value) {
        let todoList = getDocList(type)
        map.set(type, todoList)
      }
      allTodoMap.value = map
      updateCurrentType(getTypeItemById(allTodoTypeList.value, currentTypeId.value))
    }

    const getTodayList = () => {
      let list = reactive([])
      for (const itemList of allTodoMap.value.values()) {
        for (const item of itemList) {
          if (item.done) {
            continue
          }
          if (item.date && isBeforeToday(item.date)) {
            item.showExtra = false
            list.push(item)
          }
        }
      }
      return list
    }

    const getAllList = () => {
      let list = []
      let typeIndex = 0
      for (const typeItem of allTodoTypeList.value) {
        typeItem['sortInfo'] = {
          typeIndex,
          type: ALL_TYPE_HEADER,
        }
        list.push(typeItem)
        const todoList = allTodoMap.value.get(typeItem)
        for (const todoItem of todoList) {
          todoItem['sortInfo'] = {
            typeIndex,
            type: ALL_TYPE_LIST
          }
          todoItem.showExtra = false
          list.push(todoItem)
        }
        const footItem = new TodoDoc(-1, typeItem.id)
        footItem['sortInfo'] = {
          typeIndex,
          type: ALL_TYPE_FOOTER,
          typeId: typeItem.id,
        }
        list.push(footItem)
        typeIndex++
      }
      return list
    }

    const addType = (type) => {
      allTodoMap.value.set(type, [])
    }

    const deleteType = (type) => {
      allTodoMap.value.delete(type)
      for (const id of type.idList) {
        delDoc(id)
      }
      for (const id of type.doneIdList) {
        delDoc(id)
      }
    }

    const updateCurrentType = (typeItem) => {
      if (typeItem) {
        currentTypeId.value = typeItem.id
        item.value = typeItem
      } else {
        // item.value = TODO_TYPE_ALL
        item.value = TODO_TYPE_TODAY
        currentTypeId.value = item.value.id
      }
    }
    const addNewItem = (todoItem) => {
      let type = typeMap.value.get(todoItem.typeId)
      if (item.value.id === TYPE_TODAY_ID || item.value.id === TYPE_ALL_ID) {
        allTodoMap.value.get(type).push(todoItem)
      } else {
        type = item.value
      }
      if (todoItem.done) {
        type.doneIdList.push(todoItem.id)
      } else {
        type.idList.push(todoItem.id)
      }
    }
    const delAllDoneItem = () => {
      item.value.doneIdList = []
    }
    const delTodoItem = (todoItem) => {
      let typeItem = typeMap.value.get(todoItem.typeId)
      if (!typeItem) {
        console.log('----error find type')
        return
      }
      typeItem.idList.splice(item.value.idList.indexOf(todoItem.id), 1)
    }

    const toggleDoneStatus = (todoItem) => {
      let { idList, doneIdList } = typeMap.value.get(todoItem.typeId)
      let fromList, toList
      if (todoItem.done) {
        // 变为true：idList移到doneIdList
        fromList = idList
        toList = doneIdList
      } else {
        fromList = doneIdList
        toList = idList
      }
      let index = fromList.indexOf(todoItem.id)
      if (index > -1) {
        fromList.splice(index, 1)
        // idList不需要排序，所以不用算位置
        toList.push(todoItem.id)
      }
    }

    return {
      allTodoMap, allTodoTypeList, idTodoMap, typeMap,
      loadData,
      deleteType, addType,
      getTodayList, getAllList,
      countInfo,
      item, currentTypeId,
      addNewItem,
      updateCurrentType,
      delAllDoneItem,
      delTodoItem,
      toggleDoneStatus
    }
  },
  {
    persist: {
      paths: ['currentTypeId', 'allTodoTypeList'],
    }
  }
)