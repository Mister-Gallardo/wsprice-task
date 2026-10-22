import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { extractApiError, toBrands, toOffers } from './normalize'

const API_KEY = import.meta.env.VITE_API_KEY

const rawBaseQuery = fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL, timeout: 15000 })

const transportErrorMessage = (error) => {
  switch (error.status) {
    case 'FETCH_ERROR':
      return 'Не удалось связаться с сервером. Проверьте подключение к сети.'
    case 'TIMEOUT_ERROR':
      return 'Сервер не ответил вовремя. Попробуйте ещё раз.'
    case 'PARSING_ERROR':
      return 'Сервер вернул некорректный ответ.'
    default:
      return `Ошибка сервера (${error.status}).`
  }
}

// ошибка API лежит в поле error, причём и при 200, и при 403
const baseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions)
  if (result.error) {
    const message = extractApiError(result.error.data) ?? transportErrorMessage(result.error)
    return { error: { message } }
  }

  const apiError = extractApiError(result.data)
  if (apiError) return { error: { message: apiError } }

  return result
}

export const partsApi = createApi({
  reducerPath: 'partsApi',
  baseQuery,
  keepUnusedDataFor: 300,
  endpoints: (build) => ({
    getBrands: build.query({
      query: (number) => ({ url: '', params: { key: API_KEY, number } }),
      transformResponse: toBrands,
    }),
    getOffers: build.query({
      query: ({ number, brand }) => ({
        url: '',
        params: { key: API_KEY, number, brand, analogues: 'on', info: 'on' },
      }),
      transformResponse: toOffers,
    }),
  }),
})

export const { useGetBrandsQuery, useGetOffersQuery } = partsApi
