import { configureStore } from '@reduxjs/toolkit'
import { partsApi } from '../api/partsApi'
import searchReducer from '../features/search/searchSlice'

export const store = configureStore({
  reducer: {
    search: searchReducer,
    [partsApi.reducerPath]: partsApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(partsApi.middleware),
})
