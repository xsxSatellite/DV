import { toMonthAndDate } from './toMonthAndDate'

// merge expense and income respectively into their own array
export function mergeTransactionInTheSameDate(data) {
  const incomeList = sumAmountInTheSameDate(
    data.filter((transaction) => transaction['收/支'] === '收入'),
  )
  const expenseList = sumAmountInTheSameDate(
    data.filter((transaction) => transaction['收/支'] === '支出'),
  )

  return [incomeList, expenseList]
}

// delegate mergence to function below to avoid repetition
function sumAmountInTheSameDate(data) {
  const initialAccumulator = {}
  const transaction = data.reduce((accumulator, currentValue) => {
    const monthAndDate = toMonthAndDate(currentValue['交易时间'])

    if (!accumulator[monthAndDate]) {
      return {
        ...accumulator,
        [monthAndDate]: currentValue,
      }
    }

    return {
      ...accumulator,
      [monthAndDate]: {
        ...accumulator[monthAndDate],
        '金额(元)':
          accumulator[monthAndDate]['金额(元)'] + currentValue['金额(元)'],
      },
    }
  }, initialAccumulator)

  return Object.values(transaction)
}
