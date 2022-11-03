/**
 * Custom class to deal with the shitty ass js dates
 */


const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]


const FORMAT_EUROPEAN = 'european'
const FORMAT_AMERICAN = 'american'

/**
 * Converts Date object to specified format
 * @param format
 * @param date
 */
function convertDate(format: string, date: Date): string {
  const pad = (s) => (s < 10 ? '0' + s : s)
  switch (format) {
    default:
    case FORMAT_EUROPEAN:
      return [
        pad(date.getDate()),
        pad(date.getMonth() + 1),
        date.getFullYear(),
      ].join('-')
    case FORMAT_AMERICAN:
      return [
        date.getFullYear(),
        pad(date.getMonth() + 1),
        pad(date.getDate()),
      ].join('-')
  }
}

function convertTime(time: Date): string {
  const pad = (s) => (s < 10 ? '0' + s : s)
  return [
    pad(time.getHours()),
    pad(time.getMinutes()),
  ].join(':')
}

function convertDateTime(time: Date): string {
  const pad = (s) => (s < 10 ? '0' + s : s)
  return [
    pad(time.getDate()),
    pad(time.getMonth() + 1),
    time.getFullYear(),
  ].join('-') + ' ' + [
    pad(time.getHours()),
    pad(time.getMinutes()),
  ].join(':')
}

function convertDayMonth(date: Date): string {
  const pad = (s) => (s < 10 ? '0' + s : s)
  // return pad(date.getDate()) + ' ' + monthNames[date.getMonth()]
  return pad(date.getDate()) + ' ' + months[date.getMonth()]
}

function convertTimeDayShortMonth(time: Date): string {
  const pad = (s) => (s < 10 ? '0' + s : s)
  // return pad(date.getDate()) + ' ' + monthNames[date.getMonth()]
  return pad(time.getHours()) + ':' + pad(time.getMinutes()) + ', ' + pad(time.getDate()) + ' ' + months[time.getMonth()].slice(0, 3)
}

const DateUtils = {
  toEuropean: (date: Date): string => convertDate(FORMAT_EUROPEAN, date),
  toAmerican: (date: Date): string => convertDate(FORMAT_AMERICAN, date),
  toTime: (time: Date): string => convertTime(time),
  toDateTime: (time: Date): string => convertDateTime(time),
  toDayMonth: (date: Date): string => convertDayMonth(date),
  toTimeDayShortMonth: (time: Date): string => convertTimeDayShortMonth(time),
}

export default DateUtils
