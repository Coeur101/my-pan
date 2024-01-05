import { configureStore } from '@reduxjs/toolkit'
import reduxPromise from 'redux-promise'
import reduxLogger from 'redux-logger'
import globalLoading from './reducer/globalLoading'

let middleWare = [reduxPromise]
let env = process.env.NODE_ENV
if (env === 'development') {
  middleWare.push(reduxLogger)
}
const store = configureStore({
  reducer: {
    globalLoading: globalLoading,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleWare),
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
