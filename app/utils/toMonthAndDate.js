const dateFormatter = new Intl.DateTimeFormat('zh', {
  month: 'numeric',
  day: 'numeric',
})

export function toMonthAndDate(dateString) {
  const date = new Date(dateString)

  return dateFormatter.format(date)
}
