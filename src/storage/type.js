import { getDataObject, removeData, saveData } from "@/storage/index";
import { TodoDoc, TodoType } from "@/utils/typeUtils";

const KEY_TYPE_LIST = 'todo_local_storage_type_list'
const KEY_DOC_KEY = 'todo_local_todo_'

let todoTypeKeys
export function updateTypeList(typeList) {
  if (!todoTypeKeys) {
    todoTypeKeys = Object.keys(new TodoType(0, '', 0))
  }
  if (typeList) {
    // 只保存TodoType定义的字段：id、name、
    saveData(KEY_TYPE_LIST, JSON.stringify(typeList, todoTypeKeys))
  }
}

export function getDocById(docId) {
  return getDataObject(KEY_DOC_KEY + docId)
}

let todoDocKeys
export function saveDoc(doc) {
  if (!todoDocKeys) {
    todoDocKeys = Object.keys(new TodoDoc(0, 0))
  }
  if (doc && doc.id) {
    saveData(KEY_DOC_KEY + doc.id, JSON.stringify(doc, todoDocKeys))
  }
}

export function delDoc(doc) {
  if (typeof doc === 'number') {
    removeData(KEY_DOC_KEY + doc)
  } else if (doc && doc.id) {
    removeData(KEY_DOC_KEY + doc.id)
  }
}
