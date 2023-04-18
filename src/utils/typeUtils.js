import { getDocById, getTypeList } from "@/storage/type";
import { getTime } from "@/utils/timeUtils";

export const TYPE_TODAY_ID = -100
export const TYPE_TODO_ID = -200
export const TYPE_ALL_ID = -300

export class TodoType {
  constructor(id, name, colorIndex, svgIndex = -1) {
    this.id = id
    this.name = name
    this.colorIndex = colorIndex
    this.svgIndex = svgIndex
    this.idList = []
    this.doneIdList = []
  }
}

export const TODO_TYPE_TODAY = new TodoType(TYPE_TODAY_ID, '今天', 5)
export const TODO_TYPE_TODO = new TodoType(TYPE_TODO_ID, '计划', 0)
export const TODO_TYPE_ALL = new TodoType(TYPE_ALL_ID, '全部', 10)

export class TodoDoc {
  constructor(id, typeId, name = '', note = '', date = '', timer = '', isFlag = false,
              showExtra = false, saved = false, done = false) {
    this.id = id
    this.typeId = typeId
    this.name = name
    this.note = note
    this.date = date
    this.timer = timer
    this.isFlag = isFlag
    this.showExtra = showExtra
    this.saved = saved
    this.done = done
    this.createTime = new Date().getTime()
  }

  setSortId(sortId) {
    this.sortId = sortId
  }
}

export function getTypeItemById(typeList, typeId) {
  console.log('---tyli', typeList, typeId)
  if (typeId === TYPE_TODAY_ID) {
    // 今天、计划、全部 todoTest
    return TODO_TYPE_TODAY
  }
  return typeList[typeList.findIndex(item => item.id === typeId)]
}

export function getTodoCount(typeItem) {
  return typeItem.idList ? typeItem.idList.length : 0
}

export function getDocList(typeItem) {
  let list = []
  let ids = [...typeItem.idList, ...typeItem.doneIdList]
  for (const id of ids) {
    let item = getDocById(id)
    if (item) {
      // 加这两个保证万无一失
      item.showExtra = false
      item.saved = true
      list.push(item)
    }
  }
  list.sort((v1, v2) => {
    if (v1.done !== v2.done) {
      if (v1.done) {
        return 1
      }
      return -1
    }
    if (v1.sortId < v2.sortId) {
      return -1
    }
    return 1
  })
  return list
}


export function generateLastId(list) {
  let ids = list.map(item => item.sortId).sort((v1, v2) => {
    if (v1 < v2) {
      return -1
    } else if (v1 > v2) {
      return 1
    }
    return 0
  })
  return ids[ids.length - 1] + 1
}

// 保证插入的id满足pre<id<next
export function generateSortId(list, index) {
  if (list.length === 1) {
    return 1
  }
  // 除了上面的情况、不可能插入在最上面、即index>0
  let preId = list[index - 1].sortId
  // next的值不一定是list[index+1],所以需要排序得到next
  let ids = list.map(item => item.sortId).sort((v1, v2) => {
    if (v1 < v2) {
      return -1
    } else if (v1 > v2) {
      return 1
    }
    return 0
  })
  let preIndex = ids.indexOf(preId)
  let nextId = ids[preIndex + 1]
  if (!nextId) {
    // 没有next时
    return preId + 1
  }
  return (preId + nextId) / 2
}

// function noNeedChangeIndex(list, insertItem, currentIndex) {
//   if (insertItem.done) {
//     // 如果下一个是done就不用移动
//     return currentIndex === list.length - 1 || list[currentIndex + 1].done
//   } else {
//     // 如果上一个是!done就不用移动
//     return currentIndex === 0 || !list[currentIndex - 1].done
//   }
// }

/**
 * 根据当前的item的状态判断实际应该在的位置
 * @param list 原始数据
 * @param preItem
 * @param sortCompareFunc 用于排序的接口
 * @returns {*|number}
 */
export function getInsertIndex(list, preItem, sortCompareFunc) {

  // if (noNeedChangeIndex(list, insertItem, currentIndex)) {
  //   return currentIndex
  // }
  if (insertItem.done) {
    // 如果是插入到doneList里
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      if (!item.done) {
        continue
      }
      if (insertItem.sortId < item.sortId) {
        return i
      }
    }
    return list.length
  } else {
    let i = 0
    for (; i < list.length; i++) {
      const item = list[i]
      if (item.done) {
        break
      }
      if (insertItem.sortId < item.sortId) {
        return i
      }
    }
    return i
  }
}

// export function getAllTodoMap() {
//   let map = new Map()
//   let typeList = getTypeList()
//   for (const type of typeList) {
//     map.set(type, getDocList(type))
//   }
//   return map
// }

export function timeSortCompare(item1, item2) {
  let time1 = getTime(item1.date, item1.timer)
  let time2 = getTime(item2.date, item2.timer)
  if (time1 === time2) {
    return 0
  }
  if (time1 < time2) {
    return -1
  }
  return 1
}

export function idSortCompare(item1, item2) {
  if (item1.done !== item2.done) {
    if (item1.done) {
      return 1
    }
    return -1
  }
  if (item1.sortId < item2.sortId) {
    return -1
  }
  return 1
}
