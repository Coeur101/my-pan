import { ActionTypes } from '../action.types'
import { createSlice } from '@reduxjs/toolkit'
const globalLoadingReducer = createSlice({
  name: 'globalLoading',
  initialState: {
    state: false,
    loginState: 0, // 0 代表不需要跳转，1代表需要跳转
    // 放一个随机数在里面进行比如时间戳，通过变化来判断是否需要更新文件列表
    isUploadFileList: 0,
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
    setIsUploadFileList(state, action) {
      state.isUploadFileList = new Date().getTime()
    },
  },
})
export const { showLoading, hideLoading, setLoginState, setIsUploadFileList } =
  globalLoadingReducer.actions
export default globalLoadingReducer.reducer
