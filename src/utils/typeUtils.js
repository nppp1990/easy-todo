export function getTypeItemById(typeList, typeId) {
  if (typeId < 0) {
    // 今天、计划、全部 todoTest
    return { colorIndex: 1, svgIndex: 0, name: 'name1', count: 0, id: typeId }
  }
  return typeList[typeList.findIndex(item => item.id === typeId)]
}