import { ActionTypes } from '../action.types'
import { createSlice } from '@reduxjs/toolkit'
const globalLoadingReducer = createSlice({
  name: 'globalLoading',
  initialState: {
    state: false,
    loginState: 0, // 0 代表不需要跳转，1代表需要跳转
  },
  reducers: {
    showLoading(state, action) {
      state.state = true
    },
    hideLoading(state, action) {
      state.state = false
    },
    setLoginState(state, action) {
      state.loginState = action.payload
    },
  },
})
export const { showLoading, hideLoading, setLoginState } =
  globalLoadingReducer.actions
export default globalLoadingReducer.reducer
