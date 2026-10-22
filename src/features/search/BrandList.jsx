import { useDispatch, useSelector } from 'react-redux'
import { useGetBrandsQuery } from '../../api/partsApi'
import { Loader } from '../../components/Loader'
import { EmptyState, ErrorAlert } from '../../components/StatusMessage'
import { brandSelected, selectSelected } from './searchSlice'

export function BrandList({ number }) {
  const dispatch = useDispatch()
  const selected = useSelector(selectSelected)
  const { currentData: brands, isFetching, error, refetch } = useGetBrandsQuery(number)

  if (isFetching) return <Loader text="Ищем производителей…" />
  if (error) return <ErrorAlert error={error} onRetry={refetch} />
  if (!brands?.length) return <EmptyState>По артикулу «{number}» ничего не найдено.</EmptyState>

  return (
    <div className="list-group">
      {brands.map((b) => {
        const isActive = selected?.brand === b.brand && selected?.number === b.number
        return (
          <button
            key={b.id}
            type="button"
            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center gap-2 ${isActive ? 'active' : ''}`}
            aria-current={isActive}
            onClick={() => dispatch(brandSelected({ brand: b.brand, number: b.number }))}
          >
            <span className="text-truncate">
              <span className="fw-semibold">{b.brand}</span>
              <span className="d-block small opacity-75 text-truncate">
                {b.number} · {b.name}
              </span>
            </span>
            <span className={`badge rounded-pill ${b.count > 0 ? 'text-bg-success' : 'text-bg-secondary'}`}>
              {b.count > 0 ? `${b.count} шт.` : 'нет'}
            </span>
          </button>
        )
      })}
    </div>
  )
}
