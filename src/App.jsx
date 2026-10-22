import { useSelector } from 'react-redux'
import { useDebounce } from './hooks/useDebounce'
import { BrandList } from './features/search/BrandList'
import { OffersTable } from './features/search/OffersTable'
import { SearchInput } from './features/search/SearchInput'
import { selectNumber, selectSelected } from './features/search/searchSlice'

const MIN_LENGTH = 3

export default function App() {
  const number = useDebounce(useSelector(selectNumber).trim(), 500)
  const selected = useSelector(selectSelected)
  const canSearch = number.length >= MIN_LENGTH

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">Подбор автозапчастей и аналогов</h1>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column gap-3">
              <SearchInput />
              {canSearch ? (
                <BrandList number={number} />
              ) : (
                <div className="form-text">Введите не менее {MIN_LENGTH} символов артикула.</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-semibold">
              {selected ? `Аналоги и предложения: ${selected.brand} ${selected.number}` : 'Аналоги и предложения'}
            </div>
            <div className="card-body">
              {selected ? (
                <OffersTable selected={selected} />
              ) : (
                <div className="text-secondary">Выберите производителя из списка слева.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
