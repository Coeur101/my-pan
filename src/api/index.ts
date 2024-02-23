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
      showLoading: false,
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
    return CreateAxiosInstance().get(`/file/createDownloadUrl/${fileId}`, {
      //@ts-ignore
      showLoading: true,
    })
  } catch (error) {}
}
/**
 * 下载文件
 * @returns
 */
export const downLoadFile = (downloadId: string) => {
  return `/file/download/${downloadId}`
}
/**
 * 管理员获取文件信息
 * @returns
 */
export const adminGetFile = (fileId: string, userId: string) => {
  return `/api/admin/getFile/${userId}/${fileId}`
}
/**
 * 管理员获取视频信息
 * @returns
 */
export const adminGetVideoInfo = (fileId: string, userId: string) => {
  return `/admin/ts/getVideoInfo/${userId}/${fileId}`
}
/**
 * 管理员创建下载链接
 * @returns
 */
export const adminCreateDownLoadUrl = (fileId: string, userId: string) => {
  try {
    return CreateAxiosInstance().get(
      `/admin/createDownloadUrl/${userId}/${fileId}`,
      {
        //@ts-ignore
        showLoading: true,
      }
    )
  } catch (error) {}
}
/**
 * 管理员下载文件
 * @returns
 */
export const adminDownLoadFile = (downloadId: string) => {
  return `/admin/download/${downloadId}`
}
/**
 * 外部分享获取文件信息
 * @returns
 */
export const shareGetFile = (fileId: string) => {
  return `/showShare/getFile/${fileId}`
}
/**
 * 外部分享获取视频信息
 * @returns
 */
export const shareGetVideoInfo = (fileId: string) => {
  return `/showShare/ts/getVideoInfo/${fileId}`
}
/**
 * 外部分享创建下载链接
 * @returns
 */
export const shareCreateDownLoadUrl = (fileId: string) => {
  try {
    return CreateAxiosInstance().get(`/showShare/createDownloadUrl/${fileId}`, {
      //@ts-ignore
      showLoading: true,
    })
  } catch (error) {}
}
/**
 * 外部分享下载文件
 * @returns
 */
export const shareDownLoadFile = (downloadId: string) => {
  return `/showShare/download/${downloadId}`
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
/**
 * 管理员获取文件信息
 * @param fileId 文件id
 * @param userId 用户id
 * @param responseType 返回的数据格式
 * @returns
 */
export const adminGetFileInfo = (
  fileId: string,
  userId: string,
  responseType?: any
) => {
  try {
    return request({
      url: `/admin/getFile/${userId}/${fileId}`,
      params: {},
      responseType: responseType,
      showLoading: false,
    })
  } catch (error) {}
}
/**
 * 创建分享链接
 * @param fileId 文件id
 * @param codeType 是否为自定义提取码
 * @param validType 时间有效期
 * @param code 自定义提取码
 * @returns
 */
export const shareFile = (
  fileId: string,
  codeType: 0 | 1,
  validType: 0 | 1 | 2 | 3,
  code: string
) => {
  try {
    return request({
      url: '/share/shareFile',
      params: {
        fileId,
        codeType,
        validType,
        code,
      },
    })
  } catch (error) {}
}
/**
 * 获取分享文件列表
 * @param pageNo 当前页
 * @param pageSize 当前页总数量
 * @returns
 */
export const getShareFileList = (pageNo: number = 1, pageSize: number = 15) => {
  try {
    return request({
      url: '/share/loadShareList',
      params: {
        pageNo,
        pageSize,
      },
      showLoading: false,
    })
  } catch (error) {}
}
/**
 * 取消分享
 * @param shareIds 分享链接id的数组
 * @returns
 */
export const cancelShareUrl = (shareIds: string[]) => {
  try {
    return request({
      url: '/share/cancelShare',
      params: {
        shareIds,
      },
    })
  } catch (error) {}
}
/**
 * 获取回收站文件列表。
 *
 * @param {number} pageNo - 要获取的页码
 * @param {number} pageSize - 每页的条目数
 * @return {Promise<any>} 一个返回回收站文件列表的承诺
 */
export const getRecycleFileList = (
  pageNo: number = 1,
  pageSize: number = 15
) => {
  try {
    return request({
      url: '/recycle/loadRecycleList',
      params: {
        pageNo,
        pageSize,
      },
      showLoading: false,
    })
  } catch (error) {}
}
/**
 * 处理恢复具有给定文件ID的文件。
 *
 * @param {string[]} fileIds - 要恢复的文件的ID
 * @return {Promise<any>} 一个Promise，它会返回恢复请求的结果
 */
export const handleRecoverFile = (fileIds: string[]) => {
  try {
    return request({
      url: '/recycle/recoverFile',
      params: {
        fileIds,
      },
    })
  } catch (error) {}
}
/**
 * 从回收站永久删除文件。
 *
 * @param {string[]} fileIds - 要删除的文件ID数组。
 * @return {Promise<any>} 一个Promise，返回删除操作的结果。
 */
export const completelyDelFile = (fileIds: string[]) => {
  try {
    return request({
      url: '/recycle/delFile',
      params: {
        fileIds,
      },
    })
  } catch (error) {}
}
/**
 * 根据指定的页码、页面大小、文件名模糊搜索和文件PID检索所有文件列表。
 *
 * @param {number} pageNo - 要检索的页码
 * @param {number} pageSize - 每页的项目数
 * @param {string} [fileNameFuzzy] - 文件名的模糊搜索字符串
 * @param {string} [filePid='0'] - 父文件ID
 * @return {Promise<any>} 解析为文件列表的Promise
 */
export const getAllFileList = (
  pageNo: number = 1,
  pageSize: number = 15,
  fileNameFuzzy?: string,
  filePid: string = '0'
) => {
  try {
    return request({
      url: '/admin/loadFileList',
      params: {
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
 * 作为管理员删除文件。
 *
 * @param {string[]} fileIdAndUserIds - 文件ID和用户ID的数组。
 * @return {Promise<any>} 一个 Promise，返回删除请求的结果。
 */
export const adminDelFile = (fileIdAndUserIds: string[]) => {
  try {
    return request({
      url: '/admin/delFile',
      params: {
        fileIdAndUserIds,
      },
    })
  } catch (error) {}
}
export const getAllUserList = (
  pageNo: number = 1,
  pageSize: number = 15,
  status?: string,
  nickNameFuzzy?: string
) => {
  try {
    return request({
      url: '/admin/loadUserList',
      params: {
        pageNo,
        pageSize,
        nickNameFuzzy,
        status,
      },
      showLoading: false,
    })
  } catch (error) {}
}
/**
 * 设置用户文件大小。
 *
 * @param {string} userId - 用户ID
 * @param {number} changeSpace - 用户空间变化量
 * @return {any} 请求的结果
 */
export const setUserFileSize = (userId: string, changeSpace: number) => {
  try {
    return request({
      url: '/admin/updateUserSpace',
      params: {
        userId,
        changeSpace,
      },
    })
  } catch (error) {
    console.log(error)
  }
}
export const setUserStatusOp = (userId: string, status: string) => {
  try {
    return request({
      url: '/admin/updateUserStatus',
      params: {
        userId,
        status,
      },
    })
  } catch (error) {}
}
