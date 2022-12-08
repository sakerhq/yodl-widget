export const formatSecondsToMinutes = (seconds) => {
  return parseInt(seconds / 60) + ' min'
}

export const getLuxonTimeFormatByTimeFormat = (timeFormat) => {
  switch (timeFormat) {
    case '12h':
      return 'h:mm a'

    case '24h':
      return 'HH:mm'

    default:
      return 'HH:mm'
  }
}