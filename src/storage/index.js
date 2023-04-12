export function saveData(key, value) {
  localStorage.setItem(key, value)
}

export function getData(key) {
  return localStorage.getItem(key)
}

export function removeData(key) {
  localStorage.removeItem(key)
}

export function getDataObject(key, defaultValue = null) {
  let res = getData(key)
  if (res) {
    try {
      return JSON.parse(res)
    } catch (e) {
      console.log('getData:' + key, e)
    }
  }
  return defaultValue
}