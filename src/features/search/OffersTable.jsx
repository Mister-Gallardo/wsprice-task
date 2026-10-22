import { useGetOffersQuery } from '../../api/partsApi'
import { Loader } from '../../components/Loader'
import { EmptyState, ErrorAlert } from '../../components/StatusMessage'
import { formatPrice, formatShipment } from '../../utils/format'

export function OffersTable({ selected }) {
  const { currentData: rows, isFetching, error, refetch } = useGetOffersQuery(selected)

  if (isFetching) return <Loader text="Загружаем аналоги и предложения…" />
  if (error) return <ErrorAlert error={error} onRetry={refetch} />
  if (!rows?.length) return <EmptyState>Предложений не найдено.</EmptyState>

  return (
    <div className="table-responsive">
      <table className="table table-sm table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th>Производитель / Наименование</th>
            <th>Артикул</th>
            <th>Склад</th>
            <th>Отгрузка</th>
            <th className="text-end">Цена</th>
            <th className="text-end">Остаток</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const shipment = formatShipment(r.shipmentDate)
            const inStock = r.stock > 0
            return (
              <tr key={r.key} className={inStock ? '' : 'text-secondary'}>
                <td>
                  <div className="fw-semibold">
                    {r.brand}
                    {r.isOriginal && <span className="badge text-bg-primary ms-2">Искомая</span>}
                    {r.notRefund && <span className="badge text-bg-warning ms-2">Невозвратная</span>}
                  </div>
                  <div className="small text-secondary">{r.name}</div>
                </td>
                <td className="text-nowrap">{r.number}</td>
                <td>{r.warehouse ?? '—'}</td>
                <td className="text-nowrap small">
                  {shipment ? (
                    <>
                      {shipment.date}
                      <div className="text-secondary">заказ до {shipment.orderBefore}</div>
                    </>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="text-end text-nowrap fw-semibold">{formatPrice(r.price)}</td>
                <td className="text-end text-nowrap">
                  {inStock ? `${r.stock} шт.` : 'нет'}
                  {r.rate > 1 && <div className="small text-secondary">кратность {r.rate}</div>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
