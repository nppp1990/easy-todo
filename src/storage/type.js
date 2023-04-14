import { getDataObject, removeData, saveData } from "@/storage/index";

const KEY_TYPE_LIST = 'todo_local_storage_type_list'
const KEY_DOC_KEY = 'todo_local_todo_'

export function getTypeList() {
  return getDataObject(KEY_TYPE_LIST, [])
}

export function updateTypeList(typeList) {
  if (typeList) {
    saveData(KEY_TYPE_LIST, JSON.stringify(typeList))
  }
}

export function getDocById(docId) {
  return getDataObject(KEY_DOC_KEY + docId)
}

export function saveDoc(doc) {
  if (doc && doc.id) {
    saveData(KEY_DOC_KEY + doc.id, JSON.stringify(doc))
  }
}

export function delDoc(doc) {
  if (doc && doc.id) {
    removeData(KEY_DOC_KEY + doc.id)
  }
}
