export function getTypeItemById(typeList, typeId) {
  if (typeId < 0) {
    // 今天、计划、全部 todoTest
    return { colorIndex: 1, svgIndex: 0, name: 'name1', count: 0, id: typeId, idList: [] }
  }
  return typeList[typeList.findIndex(item => item.id === typeId)]
}

export function getTodoCount(typeItem) {
  return typeItem.idList ? typeItem.idList.length : 0
}