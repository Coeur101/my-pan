import { Spin } from 'antd'
import { SpinProps } from 'antd'
import { message } from 'antd'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import ReactDOM from 'react-dom/client'
import { hideLoading, showLoading } from '../store/reducer/globalLoading'
import store from '../store'
const http = axios.create({
  baseURL: '/api',
  timeout: 2000,
})
http.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8'
// 当前请求的数量
// let requestCount = 0
// const SpinElemt: React.FC = () => {
//   return <Spin tip="加载中" size="large" />
// }
// function showLoading() {
//   if (requestCount === 0) {
//     const dom = document.createElement('div')
//     dom.setAttribute('id', 'loading')
//     document.body.appendChild(dom)
//     ReactDOM.createRoot(<SpinElemt />, dom)
//   }
//   requestCount++
// }
// function hideLoading() {
//   requestCount--
//   if (requestCount === 0) {
//     document.body.removeChild(document.getElementById('loading')!)
//   }
// }

http.interceptors.request.use(
  (config) => {
    store.dispatch(showLoading(null))
    return config
  },
  (error) => {
    message.open({
      type: 'error',
      content: '请求超时',
    })
    store.dispatch(hideLoading(null))
    return Promise.reject(error)
  }
)
http.interceptors.response.use(
  (response) => {
    const data = response.data
    // if (data.code !== 200) {
    //   message.open({
    //     type: 'error',
    //     content: '请求失败',
    //   })
    // }
    store.dispatch(hideLoading(null))
    return data
  },
  (error) => {
    if (error.message === 'Network Error') {
      message.warning('网络连接异常！')
    }
    if (error.code === 'ECONNABORTED') {
      message.warning('请求超时，请重试')
    }
    store.dispatch(hideLoading(null))
    return Promise.reject(
      (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
    )
  }
)
export default http
