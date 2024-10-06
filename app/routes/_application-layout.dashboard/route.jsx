import { Readable } from 'node:stream'
import { finished } from 'node:stream/promises'

import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import csv from 'csv-parser'
import { useState } from 'react'
import {
  Tooltip,
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

import { getBill } from './api/get-bill'

import { getUserSession } from '@/sessions'
import { mergeTransactionInTheSameDate } from '@/utils/mergeTransactionInTheSameDate'
import { toMonthAndDate } from '@/utils/toMonthAndDate'

// if having time, refactoring messy spaghatti code
export async function loader({ request }) {
  const session = await getUserSession(request)
  const document = await getBill(session.get('userId'))

  if (!document) return null

  const result = []

  // potential unknown error
  await finished(
    Readable.from(document.bill.buffer, { objectMode: false })
      .pipe(
        csv({
          skipLines: 16,
          mapValues: ({ header, value }) => {
            // Recharts won't be able to process number with currency symbol, so that removing symbol up-front before sending to client
            if (header === '金额(元)') return Number(value.substring(1))

            return value
          },
        }),
      )
      .on('data', (data) => result.push(data)),
  )

  return json({
    status: 'success',
    data: { start: document.start, end: document.end, result },
  })
}

// could make it more beautiful, but losing interest in beautifying it
export default function Dashboard() {
  const [isExpense, setIsExpense] = useState(true)
  const loaderData = useLoaderData()

  const [incomeList, expenseList] = mergeTransactionInTheSameDate(
    loaderData?.data.result,
  )

  function handleClick() {
    setIsExpense((prevIsExpense) => !prevIsExpense)
  }

  return (
    <>
      <div className='mb-6 flex justify-end'>
        <button className='btn swap' onClick={handleClick}>
          <input type='checkbox' />
          <div className='swap-on'>Expense</div>
          <div className='swap-off'>Income</div>
        </button>
      </div>
      <ResponsiveContainer width='100%' height='50%'>
        <BarChart
          data={isExpense ? expenseList.toReversed() : incomeList.toReversed()}
          margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray='3 3' vertical={false} />
          <XAxis
            interval={5}
            dataKey={(value) => toMonthAndDate(value['交易时间'])}
          />
          <YAxis />
          <Tooltip
            contentStyle={{
              border: '0',
              borderRadius: '4px',
              backgroundColor: 'black',
              opacity: '.8',
            }}
            itemStyle={{ color: isExpense ? '#e67700' : '#2b8a3e' }}
            labelStyle={{ color: 'white' }}
          />
          <Bar
            dataKey='金额(元)'
            fill={isExpense ? '#fff9db' : '#f4fce3'}
            activeBar={<Rectangle fill={isExpense ? '#e67700' : '#2b8a3e'} />}
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  )
}
