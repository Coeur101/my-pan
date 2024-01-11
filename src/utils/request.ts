import { RequestType } from './types'
import message from './message'
import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { hideLoading, showLoading } from '../store/reducer/globalLoading'
import store from '@/store'
import {
  LoaderFunction,
  Location,
  NavigateFunction,
  useLocation,
  useNavigate,
} from 'react-router-dom'
const contentTypeForm = 'application/x-www-form-urlencoded;charset=UTF-8'
const contentTypeJson = 'application/json'
const responseTypeJson = 'json'
const navigate: NavigateFunction | unknown = null
const location: Location | null = null
export const getRouterOp = (navigate: NavigateFunction, location: Location) => {
  navigate = navigate
  location = location
}
const CreateAxiosInstance = (): AxiosInstance => {
  const http = axios.create({
    baseURL: '/api',
    timeout: 10 * 1000,
  })

  http.interceptors.request.use(
    (config: any) => {
      if (config.showLoading) {
        store.dispatch(showLoading(null))
      }
      return config
    },
    (error) => {
      message.error('请求失败')
      store.dispatch(hideLoading(null))
      return Promise.reject('请求发送失败')
    }
  )
  http.interceptors.response.use(
    (
      response: any
    ): Promise<
      AxiosResponse<{
        code: number
        data: any
        status: string
        info: string
      }>
    > => {
      const {
        showLoading,
        errorCallback,
        showError = true,
        responseType,
      } = response.config

      if (showLoading) {
        store.dispatch(hideLoading(null))
      }
      const data = response.data
      if (responseType === 'arraybuffer' || responseType === 'blob') {
        return data
      }
      if (data.code === 200) {
        return data
      } else if (data.code === 901) {
        ;(navigate as NavigateFunction)(
          '/login?redirectUrl=' + encodeURI(location!.pathname)
        )
        return Promise.reject({ showError: false, msg: '登录超时' })
      } else {
        if (errorCallback) {
          errorCallback(data.info)
        }
        return Promise.reject({ showError: showError, msg: data.info })
      }
    },
    (error) => {
      if (error.config.showLoading) {
        store.dispatch(hideLoading(null))
      }

      return Promise.reject({ showError: true, msg: '网络异常，请稍后重试' })
    }
  )
  return http
}
const request = (
  config: RequestType
):
  | Promise<{
      code: number
      data: any
      status: string
      info: string
    }>
  | undefined => {
  const {
    url,
    params,
    dataType,
    showLoading = true,
    responseType = responseTypeJson,
  } = config
  let contentType = contentTypeForm
  let formData = new FormData()
  for (let key in params) {
    formData.append(key, params[key] === undefined ? '' : params[key])
  }
  if (dataType !== null && dataType === 'json') {
    contentType = contentTypeJson
  }
  let headers = {
    'Content-Type': contentType,
    'X-Requestted-With': 'XMLHttpRequest',
  }
  const http = CreateAxiosInstance()
  try {
    return http.post(url, formData, {
      onUploadProgress: (event_1: any) => {
        if (config.uploadProgressCallback) {
          config.uploadProgressCallback(event_1)
        }
      },
      responseType: responseType,
      headers: headers,
      // @ts-ignore
      showLoading: showLoading,
      errorCallback: config.errorCallback,
      showError: config.showError,
    })
  } catch (error: any) {
    if (error.showError) {
      message.error(error.msg)
    }
  }
}
export default request
