import { RequestType } from './types'
import message from './message'
import axios, { AxiosInstance, AxiosResponse } from 'axios'
import {
  hideLoading,
  setLoginState,
  showLoading,
} from '../store/reducer/globalLoading'
import store from '@/store'
import { Cookies } from 'react-cookie'
const contentTypeForm = 'application/x-www-form-urlencoded;charset=UTF-8'
const contentTypeJson = 'application/json'
const responseTypeJson = 'json'
export const CreateAxiosInstance = (): AxiosInstance => {
  const http = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    timeout: 30 * 1000,
  })
  // const [cookie, setCookie, removeCookie] = useCookies(['userInfo'])
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
      if (
        responseType === 'arraybuffer' ||
        responseType === 'blob' ||
        responseType === 'stream'
      ) {
        return data
      }
      if (data.code === 200) {
        return data
      } else if (data.code === 901) {
        // removeCookie('userInfo')
        const cookie = new Cookies()
        cookie.remove('userInfo')
        store.dispatch(setLoginState(1))
        message.error('登录超时')
        return Promise.reject({ showError: false, msg: '登录超时' })
      } else {
        if (errorCallback) {
          errorCallback(data.info)
        }
        return Promise.reject({ showError: true, msg: data.info })
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
    headers,
  } = config
  let contentType = contentTypeForm
  let formData = new FormData()
  for (let key in params) {
    formData.append(key, params[key] === undefined ? '' : params[key])
  }
  if (dataType !== null && dataType === 'json') {
    contentType = contentTypeJson
  }
  let headerss: Record<string, any> = {
    'Content-Type': contentType,
    'X-Requestted-With': 'XMLHttpRequest',
  }
  if (headers) {
    for (const key in headers) {
      headerss[key] = headers[key]
    }
  }
  const http = CreateAxiosInstance()
  try {
    return http.post(url, formData, {
      // 上传文件的进度
      onUploadProgress: (event_1: any) => {
        if (config.uploadProgressCallback) {
          config.uploadProgressCallback(event_1)
        }
      },
      responseType: responseType,
      headers: headerss,
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
