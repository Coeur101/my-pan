import request from '../utils/request'
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
