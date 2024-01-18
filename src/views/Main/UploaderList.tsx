import { Progress } from 'antd'
import React, { forwardRef, useState } from 'react'
interface file extends File {
  uid: string
}
type FileListType = {
  file: file
  uid: String
  md5: string | null
  md5Progress: number
  fileName: string
  status: string
  totalSize: number
  uploadProgress: number
  pause: boolean
  chunkIndex: number
  filePid: number | string
  errorMsg: string
}
const UploaderList = forwardRef(
  (
    props: any,
    ref: React.ForwardedRef<{ addFileToList: (...args: any) => void }>
  ) => {
    const STATUS = {
      emptyfile: {
        value: 'emptyfile',
        desc: '文件为空',
        color: '#F75000',
        icon: 'close',
      },
      fail: {
        value: 'fail',
        desc: '上传失败',
        color: '#F75000',
        icon: 'close',
      },
      init: {
        value: 'init',
        desc: '解析中',
        color: '#e6a23c',
        icon: 'clock',
      },
      uploading: {
        value: 'uploading',
        desc: '上传中',
        color: '#409eff',
        icon: 'upload',
      },
      uploading_finish: {
        value: 'uploading_finish',
        desc: '上传完成',
        color: '#67C23A',
        icon: 'ok',
      },
      uploading_seconds: {
        value: 'uploading_seconds',
        desc: '秒传',
        color: '#67c23a',
        icon: 'ok',
      },
    }
    const [fileList, setFileList] = useState<FileListType[]>([])
    const addFileToList = (file: file, filePid: string) => {
      const fileItem = {
        file,
        uid: file.uid,
        // MD5值
        md5: null,
        // md5进度
        md5Progress: 0,
        //文件名
        fileName: file.name,
        // 上传状态
        status: STATUS.init.value,
        // 文件总大小
        totalSize: file.size,
        // 上传进度
        uploadProgress: 0,
        // 暂停
        pause: false,
        // 当前分片
        chunkIndex: 0,
        // 文件父Id
        filePid,
        // 错误信息
        errorMsg: '',
      }
      fileList.unshift(fileItem)
      setFileList([...fileList])
    }
    const FileItem = () => {
      return (
        <div>
          {fileList.map((item) => (
            <div className="relative flex justify-center items-center p-[3px_10px] bg-white border-b border-[#ddd]">
              <div className="flex-1">
                <div className="text-[#403e3e]">{item.fileName}</div>
                <div>
                  {item.status === STATUS.uploading.value ||
                  item.status === STATUS.uploading_seconds.value ||
                  item.status === STATUS.uploading_finish.value ? (
                    <Progress
                      style={{ marginBottom: 0 }}
                      percent={item.uploadProgress}
                      strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                    ></Progress>
                  ) : null}
                </div>
                <div className="flex items-center mt-[5px]">
                  <span
                    className={`iconfont icon-${
                      (STATUS as any)[item.status].icon
                    } mr-[3px]`}
                    style={{ color: (STATUS as any)[item.status].color }}
                  ></span>
                  <span
                    className="text-[13px] text-[red]"
                    style={{ color: (STATUS as any)[item.status].color }}
                  >
                    {item.status === 'fail'
                      ? item.errorMsg
                      : (STATUS as any)[item.status].desc}
                  </span>
                </div>
              </div>
              <div className="w-[100px] flex items-center justify-end">
                <span
                  className="w-[28px] h-[28px] ml-[5px] cursor-pointer text-center inline-block rounded overflow-hidden"
                  title="清除"
                >
                  <img
                    src={require('@/assets/easypan静态资源/icon-image/clean.png')}
                    alt=""
                  />
                </span>
              </div>
            </div>
          ))}
        </div>
      )
    }
    React.useImperativeHandle(ref, () => {
      return {
        addFileToList,
      }
    })
    return (
      <div className="w-[798px]">
        <div className="border-b border-[#dddd] leading-10 text-[15px]">
          <span>上传任务</span>
          <span className="text-[13px] text-[#a9a9a9]">仅展示本次</span>
        </div>
        <div className="overflow-auto p-[10px_0] min-h-[50vh] max-h-[calc(100vh-120px)]">
          <FileItem></FileItem>
        </div>
      </div>
    )
  }
)
export default UploaderList
