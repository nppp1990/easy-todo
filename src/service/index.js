// 因为没有后端，咱们这里做数据处理
import { useTypeStore } from "@/store/type";
import { TodoDoc } from "@/utils/typeUtils";

// {
//   "name": "333",
//   "colorIndex": 5,
//   "color": "#157efb",
//   "svgIndex": 0
// }
export const createType = (typeInfo) => {
  // typeInfo  { colorIndex: 1, svgIndex: 0, name: 'name1', count: 2, id: 1 },
  let res = { ...typeInfo, idList: [], doneIdList: [] }
  console.log('creatType', typeInfo, res)
  return Promise.resolve(res)
}

export function createTodoDoc() {
  return new TodoDoc(useTypeStore().incrementDocId())
}