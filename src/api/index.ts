import { AxiosResponse } from 'axios'
import request from '../utils/request'
import { NavigateFunction } from 'react-router-dom'
/**
 * 发送邮箱验证码
 * @param type 0 注册 1 重置密码
 * @param email 邮箱
 * @param checkCode 验证码
 * @returns
 */
export const sendEmailApi = async (
  type: string,
  email: string,
  checkCode: string,
  errorcallback?: (info: any) => void
) => {
  try {
    return await request({
      url: '/sendEmailCode',
      params: {
        type: type,
        email,
        checkCode,
      },
      showLoading: true,
      errorCallback: errorcallback,
    })
  } catch (error) {}
}
/**
 * 注册
 * @param email 邮箱
 * @param nickName 昵称
 * @param password 密码
 * @param checkCode 验证码
 * @param emailCode 邮箱验证码
 * @param errorcallback 错误后的回调函数
 * @returns
 */
export const register = (
  email: string,
  nickName: string,
  password: string,
  checkCode: string,
  emailCode: string,
  errorcallback?: (info: any) => void
) => {
  try {
    return request({
      url: '/register',
      params: {
        email,
        nickName,
        password,
        checkCode,
        emailCode,
      },
      showLoading: true,
      errorCallback: errorcallback,
    })
  } catch (error) {}
}
/**
 * 登录
 * @param email 邮箱
 * @param password 密码
 * @param checkCode 验证码
 * @param errorcallback 错误后的回调函数
 * @returns
 */
export const login = (
  email: string,
  password: string,
  checkCode: string,
  errorcallback?: (info: any) => void
) => {
  try {
    return request({
      url: '/login',
      params: {
        email,
        password,
        checkCode,
      },
      showLoading: true,
      errorCallback: errorcallback,
    })
  } catch (error) {}
}
/**
 * 重置密码
 * @param email 邮箱
 * @param password 密码
 * @param checkCode 验证码
 * @param emailCode 邮箱验证码
 * @param errorcallback 错误请求的回调参数
 * @returns
 */
export const resetPassword = (
  email: string,
  password: string,
  checkCode: string,
  emailCode: string,
  errorcallback?: (info: any) => void
) => {
  try {
    return request({
      url: '/resetPwd',
      params: {
        email,
        emailCode,
        password,
        checkCode,
      },
      showLoading: true,
      errorCallback: errorcallback,
    })
  } catch (error) {}
}
/**
 * qq登录
 * @param callbackUrl qq登录成功后要返回的页面地址
 * @param errorCallback 错误回调
 * @returns
 */
export const qqLogin = (
  callbackUrl: string,
  errorCallback?: (info: any) => void
) => {
  try {
    return request({
      url: '/qqlogin',
      params: {
        callbackUrl,
      },
      errorCallback,
    })
  } catch (error) {}
}
export const qqloginCallback = (
  code: string,
  state: string,
  errorCallback?: (info: any) => void
) => {
  try {
    return request({
      url: '/qqlogin/callback',
      params: {
        code,
        state,
      },
      errorCallback,
    })
  } catch (error) {}
}
/**
 * 上传头像
 * @param avatar 头像文件
 * @param errorCallback 请求错误回调函数
 * @returns
 */
export const avatarUpload = (avatar: Blob) => {
  try {
    return request({
      url: '/updateUserAvatar',
      params: {
        avatar,
      },
    })
  } catch (error) {}
}

export const passwordUpload = (password: string) => {
  try {
    return request({
      url: '/updatePassword',
      params: {
        password,
      },
    })
  } catch (error) {}
}
