import { getDataObject, saveData } from "@/storage/index";

const KEY_HISTORY = 'todo_local_storage_history'

export function getLastTypeId() {
  let { lastTypeId } = getDataObject(KEY_HISTORY, { lastTypeId: -1 })
  return lastTypeId
}

export function saveLastTypeId(id) {
  let lastHistory = getDataObject(KEY_HISTORY, {})
  lastHistory['lastTypeId'] = id
  saveData(KEY_HISTORY, JSON.stringify(lastHistory))
}