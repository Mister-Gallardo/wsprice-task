import { useDispatch, useSelector } from 'react-redux'
import { numberChanged, selectNumber } from './searchSlice'

export function SearchInput() {
  const dispatch = useDispatch()
  const number = useSelector(selectNumber)

  return (
    <div>
      <label htmlFor="part-number" className="form-label fw-semibold">
        Артикул детали
      </label>
      <input
        id="part-number"
        type="search"
        className="form-control form-control-lg"
        placeholder="Например, 0189"
        autoComplete="off"
        autoFocus
        value={number}
        onChange={(e) => dispatch(numberChanged(e.target.value))}
      />
    </div>
  )
}
