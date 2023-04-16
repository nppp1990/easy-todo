import dayjs from "dayjs";

export function getDateStr(dateStr) {
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

export function isExpire(dataStr, timeStr) {
  if (!dataStr) {
    return false
  }
  let date
  if (timeStr) {
    date = new dayjs(dataStr + 'T' + timeStr)
  } else {
    date = new dayjs(dataStr).add(1, 'day')
  }
  return date.unix() < new dayjs().unix();

}