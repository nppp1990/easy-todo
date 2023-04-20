import { getDocById } from "@/storage/type";
import { getTime } from "@/utils/timeUtils";

export const TYPE_TODAY_ID = -100
export const TYPE_PLAN_ID = -200
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
export const TODO_TYPE_PLAN = new TodoType(TYPE_PLAN_ID, '计划', 0)
export const TODO_TYPE_ALL = new TodoType(TYPE_ALL_ID, '全部', 10)

export class TodoDoc {
  constructor(id, typeId,
              {
                name = '',
                note = '',
                date = '',
                timer = '',
                isFlag = false,
                showExtra = false,
                saved = false,
                done = false
              } = {}) {
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
  }

  setSortId(sortId) {
    this.sortId = sortId
  }
}

export function getTypeItemById(typeList, typeId) {
  if (typeId === TYPE_TODAY_ID) {
    // 今天、计划、全部 todoTest
    return TODO_TYPE_TODAY
  } else if (typeId === TYPE_PLAN_ID) {
    return TODO_TYPE_PLAN
  } else if (typeId === TYPE_ALL_ID) {
    return TODO_TYPE_ALL
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
  if (list.length === 0) {
    return 1
  }
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
export function generateSortId(list, preId) {
  console.log('----preId', list, preId)
  if (preId === undefined || preId === null) {
    return 1
  }
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

export function allSortCompare(item1, item2) {
  const { typeIndex: typeIndex1, type: type1 } = item1.sortInfo
  const { typeIndex: typeIndex2, type: type2 } = item2.sortInfo
  if (typeIndex1 < typeIndex2) {
    return -1
  } else if (typeIndex1 > typeIndex2) {
    return 1
  } else {
    if (type1 < type2) {
      return -1
    } else if (type1 > type2) {
      return 1
    } else {
      return idSortCompare(item1, item2)
    }
  }
}

export function getAllListKey(item) {
  const { sortInfo } = item
  if (!sortInfo) {
    return item.id
  }
  if (sortInfo.type === 1) {
    return 'header_' + item.id
  } else if (sortInfo.type === 2) {
    return item.id
  } else {
    return 'footer_' + item.sortInfo.typeId
  }
}

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
