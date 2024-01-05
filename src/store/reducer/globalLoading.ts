import { ActionTypes } from '../action.types'
import { createSlice } from '@reduxjs/toolkit'
const globalLoadingReducer = createSlice({
  name: 'globalLoading',
  initialState: {
    state: false,
  },
  reducers: {
    showLoading(state, action) {
      state.state = true
    },
    hideLoading(state, action) {
      state.state = false
    },
  },
})
export const { showLoading, hideLoading } = globalLoadingReducer.actions
export default globalLoadingReducer.reducer
