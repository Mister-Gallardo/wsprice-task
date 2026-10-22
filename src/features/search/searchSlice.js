import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  number: '',
  selected: null, // { brand, number }
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    numberChanged(state, action) {
      state.number = action.payload
      state.selected = null
    },
    brandSelected(state, action) {
      state.selected = action.payload
    },
  },
})

export const { numberChanged, brandSelected } = searchSlice.actions
export const selectNumber = (state) => state.search.number
export const selectSelected = (state) => state.search.selected
export default searchSlice.reducer
