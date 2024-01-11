import ReactDOM from 'react-dom/client'
import App from './App'
import '@/css/input.css'
import 'normalize.css'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { Provider } from 'react-redux'
import store from '@/store'
import { CookiesProvider } from 'react-cookie'
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <App />
      </CookiesProvider>
    </Provider>
  </ConfigProvider>
)
