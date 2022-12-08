import { DateTime } from 'luxon'

export const getOrdinalNumber = (number) => {
  const s = ['th', 'st', 'nd', 'rd']
  const v = number % 100
  return number + (s[(v - 20) % 10] || s[v] || s[0])
}

export const convertISODateToUserFormatDate = (ISODate, userFormat) => {
  let formattedDate

  switch (userFormat) {
    case 'european_standard':
      formattedDate = DateTime.fromISO(ISODate).toFormat('dd-MM-yyyy')
      break

    case 'american':
      formattedDate = DateTime.fromISO(ISODate).toFormat('MM-dd-yyyy')
      break

    default:
      break
  }

  return formattedDate
}
