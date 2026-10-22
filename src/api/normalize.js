// если товар не найден, API отдаёт массив с одной пустой структурой
const EMPTY_ID = /^[0-]+$/
export const isEmptyGood = (g) => !g || !g.brand || EMPTY_ID.test(g.goodsID ?? '')

const API_ERRORS = {
  'Empty key!': 'Не указан ключ покупателя',
  'Invalid key client!': 'Неверный ключ покупателя',
  'Invalid access key': 'Неверный ключ покупателя',
  'Empty number goods!': 'Не указан номер детали',
  'Request quota exceeded!': 'Превышен лимит запросов',
}

export const extractApiError = (data) => {
  if (!data || typeof data !== 'object' || data.error == null) return null
  const errors = Array.isArray(data.error) ? data.error : [data.error]
  return errors.map((e) => API_ERRORS[e] ?? String(e)).join('; ')
}

const goodsOf = (data) => (Array.isArray(data?.goods) ? data.goods : []).filter((g) => !isEmptyGood(g))

export const toBrands = (data) => {
  const seen = new Set()
  return goodsOf(data)
    .filter((g) => !seen.has(g.goodsID) && seen.add(g.goodsID))
    .map((g) => ({
      id: g.goodsID,
      brand: g.brand,
      number: g.number,
      name: g.name,
      count: g.count ?? 0,
    }))
}

// цена берётся со склада, верхний price устаревший (см. доку)
export const toOffers = (data) => {
  const items = goodsOf(data).flatMap((g) => [
    { ...g, isOriginal: true },
    ...(g.analogues ?? []).filter((a) => !isEmptyGood(a)).map((a) => ({ ...a, isOriginal: false })),
  ])

  const rows = items.flatMap((item) => {
    const base = {
      goodsID: item.goodsID,
      brand: item.brand,
      number: item.number,
      name: item.name,
      rate: item.rate,
      isOriginal: item.isOriginal,
    }
    const warehouses = item.warehouses ?? []

    if (warehouses.length === 0) {
      return [{ ...base, key: item.goodsID, warehouse: null, price: null, stock: 0, shipmentDate: null, notRefund: !!item.notRefund }]
    }

    return warehouses.map((w) => ({
      ...base,
      key: `${item.goodsID}:${w.id}`,
      warehouse: w.code || null,
      price: w.price,
      stock: w.stock ?? 0,
      shipmentDate: w.shipmentDate ?? null,
      notRefund: !!(item.notRefund || w.notRefund),
    }))
  })

  return rows.sort(
    (a, b) =>
      Number(b.isOriginal) - Number(a.isOriginal) ||
      Number(b.stock > 0) - Number(a.stock > 0) ||
      (a.price ?? Infinity) - (b.price ?? Infinity),
  )
}
