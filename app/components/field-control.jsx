import { toSentenceCase } from '@/utils/toSentenceCase'

export function FieldControl({ type, name, error, data }) {
  return (
    <div className='flex flex-col gap-y-2'>
      <label htmlFor={name} className='input flex items-center gap-x-2'>
        <span>{toSentenceCase(name)}</span>
        <input type={type} name={name} className='grow' defaultValue={data} />
      </label>
      {error?.at(0) && <p className='text-red-600'>{error.at(0)}</p>}
    </div>
  )
}
