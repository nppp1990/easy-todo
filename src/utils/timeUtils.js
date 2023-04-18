import dayjs from "dayjs";

export function getTodayStr() {
  return dayjs().format('YYYY-MM-DD')
}

export function getSpecialDateStr(dateStr) {
  const curDate = dayjs(dateStr, 'YYYY-MM-DD')
  if (curDate.isToday()) {
    return '今天'
  }
  if (curDate.isYesterday()) {
    return '昨天'
  }

  if (curDate.isTomorrow()) {
    return '明天'
  }
  return null
}

export function isBeforeToday(dateStr) {
  if (!dateStr) {
    return false
  }
  const date = new dayjs(dateStr)
  return date.unix() < new dayjs().unix()
}

export function isExpire(dateStr, timeStr) {
  if (!dateStr) {
    return false
  }
  let date
  if (timeStr) {
    date = new dayjs(dateStr + 'T' + timeStr)
  } else {
    date = new dayjs(dateStr).add(1, 'day')
  }
  return date.unix() < new dayjs().unix()
}

export function getTime(dateStr, timeStr) {
  if (!dateStr) {
    return 0
  }
  let date
  if (timeStr) {
    date = new dayjs(dateStr + 'T' + timeStr)
  } else {
    date = new dayjs(dateStr).add(1, 'day')
  }
  return date.unix()
}