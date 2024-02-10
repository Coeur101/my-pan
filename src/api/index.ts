import request, { CreateAxiosInstance } from '../utils/request'

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
/**
 * 获取文件列表
 * @param category 文件分类
 * @param pageNo 页码
 * @param pageSize 分页大小
 * @param fileNameFuzzy 文件名称
 * @param filePid 文件父ID
 * @returns
 */
export const getFileList = (
  category: string = 'all',
  pageNo: number = 1,
  pageSize: number = 15,
  fileNameFuzzy?: string,
  filePid: string = '0'
) => {
  try {
    return request({
      url: '/file/loadDataList',
      params: {
        category,
        pageNo,
        pageSize,
        fileNameFuzzy,
        filePid,
      },
      showLoading: false,
    })
  } catch (error) {}
}
/**
 * 新建目录
 * @param filePid 文件父ID
 * @param fileName 文件名
 * @returns
 */
export const newFoloder = (filePid: string, fileName: string) => {
  try {
    return request({
      url: '/file/newFoloder',
      params: {
        filePid,
        fileName,
      },
    })
  } catch (error) {}
}
/**
 * 文件/目录重命名
 * @param fileId 文件ID
 * @param fileName 文件名称
 * @returns
 */
export const reFileName = (fileId: string, fileName: string) => {
  try {
    return request({
      url: '/file/rename',
      params: {
        fileId,
        fileName,
      },
    })
  } catch (error) {}
}
/**
 * 分片上传文件
 * @param fileId 文件id
 * @param file 文件 文件流
 * @param filePid 文件父id
 * @param fileName 文件名
 * @param chunkIndex 当前分片的索引
 * @param chunks 总分片数
 * @param fileMd5 文件的md5
 * @param errorCallback 错误回调
 * @param uploadProgressCallback 上传文件的进度，是从axios中获取
 * @returns
 */
export const uploadChunkFile = (
  fileId: string,
  file: File,
  filePid: string,
  fileName: string,
  chunkIndex: number,
  chunks: number,
  fileMd5: string,
  errorCallback?: (info: string) => void,
  uploadProgressCallback?: (event: any) => void
) => {
  try {
    return request({
      url: '/file/uploadFile',
      params: {
        fileId,
        file,
        filePid,
        fileName,
        chunkIndex,
        chunks,
        fileMd5,
      },
      dataType: 'file',
      showLoading: false,
      errorCallback,
      uploadProgressCallback,
    })
  } catch (error) {}
}
/**
 * 删除文件
 * @param fileIds 文件id
 * @returns
 */

export const delFiles = (fileIds: string[] | string) => {
  try {
    return request({
      url: '/file/delFile',
      params: {
        fileIds,
      },
    })
  } catch (error) {}
}

export const getAllFolder = (
  filePid: string | string[] = '0',
  currentFileIds?: string
) => {
  try {
    return request({
      url: '/file/loadAllFolder',
      params: {
        filePid,
        currentFileIds,
      },
    })
  } catch (error) {}
}
/**
 * 移动文件
 * @param fileIds 文件id 多选和单选都是个数组
 * @param filePid 文件需要移动到哪个文件夹下
 * @returns
 */
export const changeFileFolder = (fileIds: string[], filePid: string) => {
  try {
    return request({
      url: '/file/changeFileFolder',
      params: {
        fileIds,
        filePid,
      },
    })
  } catch (error) {}
}
/**
 * 获取当前目录信息
 * @param path 完整路径
 * @returns
 */
export const getFolderInfo = (path: string) => {
  try {
    return request({
      url: '/file/getFolderInfo',
      params: {
        path,
      },
      showLoading: false,
    })
  } catch (error) {}
}
/**
 * 获取分享出去的文件目录信息
 * @param shareId 分享的id
 * @param path 完整路径
 * @returns
 */
export const getShareFolderInfo = (shareId: string, path: string) => {
  try {
    return request({
      url: '/showShare/getFolderInfo',
      params: {
        shareId,
        path,
      },
    })
  } catch (error) {}
}
/**
 * 管理员获取文件目录信息
 * @param path 完整路径
 * @returns
 */
export const getAdminFolderInfo = (path: string) => {
  try {
    return request({
      url: '/admin/getFolderInfo',
      params: {
        path,
      },
    })
  } catch (error) {}
}
/**
 * 获取用户使用空间
 * @returns
 */
export const getUserSpaceInfo = () => {
  try {
    return CreateAxiosInstance().get('/getUseSpace', {
      // @ts-ignore
      showLoading: false,
    })
  } catch (error) {}
}
/**
 * 获取文件信息
 * @returns
 */
export const getFile = (fileId: string) => {
  return `/api/file/getFile/${fileId}`
}
/**
 * 获取视频信息
 * @returns
 */
export const getVideoInfo = (fileId: string) => {
  return `/file/ts/getVideoInfo/${fileId}`
}
/**
 * 创建下载链接
 * @returns
 */
export const createDownLoadUrl = (fileId: string) => {
  try {
    return CreateAxiosInstance().get(`/file/createDownLoadUrl${fileId}`, {
      //@ts-ignore
      showLoading: true,
    })
  } catch (error) {}
}
/**
 * 下载文件
 * @returns
 */
export const downLoadFile = (fileId: string) => {
  try {
    return CreateAxiosInstance().get(`/file/download${fileId}`, {
      //@ts-ignore
      showLoading: true,
    })
  } catch (error) {}
}
/**
 * 管理员获取文件信息
 * @returns
 */
export const adminGetFile = (fileId: string) => {
  return `/admin/getFile${fileId}`
}
/**
 * 管理员获取视频信息
 * @returns
 */
export const adminGetVideoInfo = (fileId: string) => {
  return `/admin/ts/getVideoInfo${fileId}`
}
/**
 * 管理员创建下载链接
 * @returns
 */
export const adminCreateDownLoadUrl = (fileId: string) => {
  try {
    return CreateAxiosInstance().get(`/admin/createDownLoadUrl${fileId}`, {
      //@ts-ignore
      showLoading: true,
    })
  } catch (error) {}
}
/**
 * 管理员下载文件
 * @returns
 */
export const adminDownLoadFile = (fileId: string) => {
  try {
    return CreateAxiosInstance().get(`/admin/download${fileId}`, {
      //@ts-ignore
      showLoading: true,
    })
  } catch (error) {}
}
/**
 * 外部分享获取文件信息
 * @returns
 */
export const shareGetFile = (fileId: string) => {
  return `/showShare/getFile${fileId}`
}
/**
 * 外部分享获取视频信息
 * @returns
 */
export const shareGetVideoInfo = (fileId: string) => {
  return `/showShare/ts/getVideoInfo${fileId}`
}
/**
 * 外部分享创建下载链接
 * @returns
 */
export const shareCreateDownLoadUrl = (fileId: string) => {
  try {
    return CreateAxiosInstance().get(`/showShare/createDownLoadUrl${fileId}`, {
      //@ts-ignore
      showLoading: true,
    })
  } catch (error) {}
}
/**
 * 外部分享下载文件
 * @returns
 */
export const shareDownLoadFile = (fileId: string) => {
  try {
    return CreateAxiosInstance().get(`/showShare/download${fileId}`, {
      //@ts-ignore
      showLoading: true,
    })
  } catch (error) {}
}
/**
 * 获取文件信息
 * @param fileId 文件ID
 * @returns
 */
export const getFileInfo = (fileId: string, responseType?: any) => {
  try {
    return request({
      url: `/file/getFile/${fileId}`,
      params: {},
      responseType: responseType,
      showLoading: false,
    })
  } catch (error) {}
}
