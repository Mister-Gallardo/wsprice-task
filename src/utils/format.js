const priceFormatter = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' })

export const formatPrice = (value) => (typeof value === 'number' && value > 0 ? priceFormatter.format(value) : '—')

// 2019-05-31T15:30:00+03:00 -> дата отгрузки и время, до которого нужно заказать
export const formatShipment = (value) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value ?? '')
  if (!m) return null
  const [, y, mo, d, h, mi] = m
  return { date: `${d}.${mo}.${y}`, orderBefore: `${h}:${mi}` }
}
