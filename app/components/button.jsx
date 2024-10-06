import { toWordCase } from '@/utils/toWordCase'

export function Button({ children, isBusy, ...props }) {
  return (
    <button className='btn' {...props}>
      {isBusy ? (
        <span className='loading loading-spinner loading-md' />
      ) : (
        toWordCase(children)
      )}
    </button>
  )
}
