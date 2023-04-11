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