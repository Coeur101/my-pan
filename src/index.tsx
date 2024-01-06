import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@/css/input.css'
import 'normalize.css'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { Provider } from 'react-redux'
import store from '@/store'
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>
)
