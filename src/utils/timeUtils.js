import dayjs from "dayjs";

export function getTodayStr() {
  return dayjs().format('YYYY-MM-DD')
}

const ONE_DAY_SECOND = 24 * 3600
const YESTERDAY = '昨天'
const TODAY = '今天'
const TOMORROW = '明天'
const AFTER_TOMORROW = '后天'
const WEEK_DAY = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export function getDayOfWeek(dateStr) {
  return WEEK_DAY[dayjs(dateStr, 'YYYY-MM-DD').toDate().getDay()]
}

export function getSpecialDateStr(dateStr) {
  const curDate = dayjs(dateStr, 'YYYY-MM-DD')
  const today = dayjs(getTodayStr(), 'YYYY-MM-DD')
  const todayUnix = today.unix()
  const curUnix = curDate.unix()
  if (curUnix >= todayUnix - ONE_DAY_SECOND && curUnix < todayUnix) {
    return YESTERDAY
  }
  if (curUnix >= todayUnix && curUnix < todayUnix + ONE_DAY_SECOND) {
    return TODAY
  }
  if (curUnix >= todayUnix + ONE_DAY_SECOND && curUnix < todayUnix + 2 * ONE_DAY_SECOND) {
    return TOMORROW
  }
  if (curUnix >= todayUnix + 2 * ONE_DAY_SECOND && curUnix < todayUnix + 3 * ONE_DAY_SECOND) {
    return AFTER_TOMORROW
  }
  return null
}

export function isToday(dateStr) {
  if (!dateStr) {
    return false
  }
  const curDate = dayjs(dateStr, 'YYYY-MM-DD')
  const today = dayjs(getTodayStr(), 'YYYY-MM-DD')
  const todayUnix = today.unix()
  const curUnix = curDate.unix()
  return curUnix >= todayUnix && curUnix < todayUnix + ONE_DAY_SECOND;

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
    date = new dayjs(dateStr)
  }
  return date.unix()
}