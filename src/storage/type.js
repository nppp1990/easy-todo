import { getDataObject, saveData } from "@/storage/index";

const KEY_TYPE_LIST = 'todo_local_storage_type_list'

export function getTypeList() {
  return getDataObject(KEY_TYPE_LIST, [])
}

export function addType() {

}

export function deleteType() {

}

export function updateTypeList(typeList) {
  if (typeList) {
    saveData(KEY_TYPE_LIST, JSON.stringify(typeList))
  }
}

export class updateType {
}