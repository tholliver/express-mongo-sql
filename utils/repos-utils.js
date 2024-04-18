export const timeLapseConverter = (time, lapse) => {
  const splitedDate = dateLapseParser(time, lapse)
  return splitedDate.toISOString().split('T')[0]
}

function dateLapseParser(time, lapse) {
  const currentNowDate = new Date()
  // CASE LAST N [YEARS] AGO

  if (time === 'y')
    return new Date(
      currentNowDate.getFullYear() - lapse,
      currentNowDate.getMonth(),
      currentNowDate.getDate()
    )
  // CASE LAST N MONTHS AGO

  if (time === 'm') {
    return new Date(
      currentNowDate.getFullYear(),
      currentNowDate.getMonth() - lapse,
      currentNowDate.getDate()
    )
  }
  // CASE LAST N DAYS AGO

  if (time === 'd') {
    return new Date(
      currentNowDate.getFullYear(),
      currentNowDate.getMonth(),
      currentNowDate.getDate() - lapse
    )
  }
}

// console.log(timeLapseConverter('m', 7))
