import { getDataObject, removeData, saveData } from "@/storage/index";

const KEY_TYPE_LIST = 'todo_local_storage_type_list'
const KEY_DOC_KEY = 'todo_local_todo_'

export class TodoDoc {
  constructor(id, name = '', note = '', date = '', timer = '', isFlag = false, showExtra = false) {
    this.id = id
    this.name = name
    this.note = note
    this.date = date
    this.timer = timer
    this.isFlag = isFlag
    this.showExtra = showExtra
  }
}

export function getTypeList() {
  return getDataObject(KEY_TYPE_LIST, [])
}

export function updateTypeList(typeList) {
  if (typeList) {
    saveData(KEY_TYPE_LIST, JSON.stringify(typeList))
  }
}

export function getDocList(typeItem) {
  let list = []
  for (const id of typeItem.idList) {
    let item = getDocById(id)
    if (item) {
      item.showExtra = false
      list.push(item)
    }
  }
  return list
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
