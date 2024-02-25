import Icon from '@/components/Icon'
import NoData from '@/components/Nodata'
import { formatFileSize } from '@/utils/format'
import { Progress } from 'antd'
import sparkMd5 from 'spark-md5'
import React, { forwardRef, useState } from 'react'
import { uploadChunkFile } from '@/api'
import { useDispatch } from 'react-redux'
import { setIsUploadFileList } from '@/store/reducer/globalLoading'
import { flushSync } from 'react-dom'
interface file extends File {
  uid: string
}
type FileListType = {
  file: file
  uid: string
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
  uploadSize: number
  key?: number | string
  fileId: string
}
let uploadQueue: any[] = []
let chunkSourceIndex = 0
let isUploading = false
let workCount = 0
const UploaderList = forwardRef(
  (
    props: any,
    ref: React.ForwardedRef<{ addFileToList: (...args: any) => void }>
  ) => {
    // 5mb 进行分片
    let chunkSize = 5 * 1024 * 1024
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
      pause: {
        value: 'pause',
        desc: '暂停中',
        color: '#e6a23c',
        icon: 'pause',
      },
      wait: {
        value: 'wait',
        desc: '等待中',
        color: '#409eff',
        icon: 'pause',
      },
      uploading: {
        value: 'uploading',
        desc: '上传中',
        color: '#409eff',
        icon: 'upload',
      },
      upload_finish: {
        value: 'upload_finish',
        desc: '上传完成',
        color: '#67C23A',
        icon: 'ok',
      },
      upload_seconds: {
        value: 'upload_seconds',
        desc: '秒传',
        color: '#67c23a',
        icon: 'ok',
      },
    }
    const [fileList, setFileList] = useState<FileListType[]>([])
    const [delFileList, setDelFileList] = useState<string[]>([])

    const dispatch = useDispatch()
    const addFileToList = async (files: any[], filePid: string) => {
      uploadQueue = []
      for (const file of files) {
        const fileItem: FileListType = {
          file,
          uid: file.uid,
          // MD5值
          md5: null,
          // md5进度
          md5Progress: 0,
          //文件名
          fileName: file.name,
          // 上传状态
          status: STATUS.wait.value,
          // 文件总大小
          totalSize: file.size,
          uploadSize: 0,
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
          fileId: '',
        }
        if (fileItem.totalSize === 0) {
          fileItem.status = STATUS.emptyfile.value
          fileItem.key = file.uid
          fileList.unshift(fileItem)
          setFileList([...fileList])
          return
        }
        fileList.unshift(fileItem)
        setFileList([...fileList])
        uploadQueue.push(fileItem)
      }
      loopUpload()
    }
    const loopUpload = async () => {
      if (!isUploading && uploadQueue.length > 0) {
        workCount = 0
        isUploading = true
        // 正在有6个文件上传
        const filesToUploadList = uploadQueue.slice(0, 6)
        const uploadPromises = filesToUploadList.map(processFile)
        await Promise.all(uploadPromises) // 并行处理文件上传
        console.log('完成')

        return
      }
    }
    const processFile = async (file: FileListType) => {
      let md5FileUid = await computeMd5(file)
      if (md5FileUid === '') {
        return
      }
      setFileList((prev) => {
        return prev.map((item) => {
          if (item.uid === file.uid) {
            return {
              ...item,
              status: STATUS.init.value,
            }
          } else {
            return item
          }
        })
      })
      // 上传文件
      await uploadFile(md5FileUid)
    }
    /**
     * 解析文件,加密Md5
     * @param fileItem 文件对象
     */
    const computeMd5 = async (fileItem: FileListType): Promise<string> => {
      let file = fileItem.file
      // 开始分片
      let blobSlice = File.prototype.slice
      let chunks = Math.ceil(file.size / chunkSize)
      // 当前分片
      let currentChunk = 0
      let spark = new sparkMd5.ArrayBuffer()
      let fileReader: any = new FileReader()
      // 分片的将文件切割放入数组缓冲区
      const loadNext = () => {
        let start = currentChunk * chunkSize
        let end = start + chunkSize >= file.size ? file.size : start + chunkSize
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
      }
      // 开始分片前调用一次
      loadNext()
      try {
        return await new Promise((resolve, reject) => {
          let resultFile = getFileByUid(file.uid)
          // 每次加入进数组缓冲区成功后都会调用onload,然后开始递归调用loadNext方法进行分片
          fileReader.onload = (e: any) => {
            // 判断每次分片是否完成，然后假如到spark里进行md5加密
            spark.append(e.target.result)
            currentChunk++
            if (currentChunk < chunks) {
              // console.log(`${file.name}第${currentChunk}分片完成`)
              // 跟踪进度
              const progress = Math.floor((currentChunk / chunks) * 100)
              resultFile!.md5Progress = progress
              setFileList((prev) =>
                prev.map((item) => {
                  return item.uid === resultFile?.uid ? resultFile : item
                })
              )
              // 递归调用进行分片
              loadNext()
            } else {
              const end_1 = spark.end()
              // 释放内存
              spark.destroy()
              resultFile!.md5Progress = 100
              resultFile!.status = STATUS.uploading.value
              resultFile!.md5 = end_1
              setFileList((prev) =>
                prev.map((item) => {
                  return item.uid === resultFile?.uid ? resultFile : item
                })
              )
              resolve(fileItem.uid)
            }
          }
          fileReader.onerror = (e_1: any) => {
            resultFile!.md5Progress = -1
            resultFile!.status = STATUS.fail.value
            resolve('')
          }
        })
      } catch (error) {
        return ''
      }
    }
    // chunkIndex当前上传的分片是第几片，来实现暂停后续传
    const uploadFile = async (fileUid: string, chunkIndex?: number) => {
      chunkIndex = chunkIndex ? chunkIndex : 0
      const sourceFile = getFileByUid(fileUid)
      // 拿到转换完成的uid 查找文件
      const file = sourceFile?.file
      const fileSize = sourceFile?.totalSize
      // 分片上传
      const chunks = Math.ceil(fileSize! / chunkSize)
      for (let i = chunkIndex; i <= chunks; i++) {
        // 循环上传
        // 判断当前文件是否被删除,如果被删除则在列表中删除
        const delIndex = delFileList.indexOf(fileUid)
        if (delIndex !== -1) {
          delFileList.slice(delIndex, 1)
          setDelFileList(delFileList)
          // 且不进行上传
          break
        }
        const pauseIndex = fileList.findIndex(
          (item) => item.pause && item.uid === fileUid
        )
        console.log(pauseIndex)

        // 如果暂停则跳出循环上传
        if (pauseIndex !== -1) {
          break
        }
        // 进行分片
        let start = i * chunkSize
        let end = start + chunkSize >= fileSize! ? fileSize! : start + chunkSize
        // 分片文件
        const chunkFile = file?.slice(start, end)
        // 开始上传
        try {
          const res = await uploadChunkFile(
            sourceFile?.fileId || '',
            chunkFile as File,
            sourceFile?.filePid as string,
            sourceFile?.fileName as string,
            i,
            chunks,
            sourceFile?.md5 as string,
            // 错误回调
            (info: string) => {
              sourceFile!.status = STATUS.fail.value
              sourceFile!.errorMsg = info
              setFileList((prev) => {
                return prev.map((item) => {
                  return item.uid === sourceFile?.uid ? sourceFile : item
                })
              })
            },
            // 获取上传进度
            (event) => {
              let loaded = event.loaded
              if (event.loaded > fileSize!) {
                loaded = fileSize
              }
              sourceFile!.uploadSize = i * chunkSize + loaded
              sourceFile!.uploadProgress = Math.floor(
                (sourceFile!.uploadSize / fileSize!) * 100
              )
              setFileList((prev) => {
                return prev.map((item) => {
                  return item.uid === sourceFile?.uid ? sourceFile : item
                })
              })
            }
          )
          if (res?.code !== 200) {
            break
          }
          sourceFile!.status = (STATUS as any)[res.data.status].value
          sourceFile!.fileId = res.data.fileId
          sourceFile!.chunkIndex = i
          // 记录当前分片索引

          // 如果等于这两个状态，代表已经上传完毕
          if (
            sourceFile?.status === STATUS.upload_finish.value ||
            sourceFile?.status === STATUS.upload_seconds.value
          ) {
            sourceFile!.uploadProgress = 100
            setFileList((prev) => {
              return prev.map((item) => {
                return item.uid === sourceFile?.uid ? sourceFile : item
              })
            })
            chunkSourceIndex = 0
            // 上传成功后 通过redux来尝试更新文件列表
            dispatch(setIsUploadFileList(null))
            break
          }
          setFileList((prev) => {
            return prev.map((item) => {
              return item.uid === sourceFile?.uid ? sourceFile : item
            })
          })
        } catch (error) {
          break
        }
      }

      const index = uploadQueue.findIndex((item) => item.uid === fileUid)
      if (index !== -1) {
        uploadQueue.splice(index, 1)
      }
      workCount++
      if (workCount === 6 || uploadQueue.length === 0) {
        isUploading = false
        console.log(123)
      }
      // 如果上传队列中仍有文件，则继续上传
      loopUpload()
    }

    // 继续上传
    const startUpload = (file: FileListType) => {
      fileList.forEach((item) => {
        if (item.uid === file.uid) {
          item.pause = false
        }
      })
      setFileList(fileList)
      uploadFile(file.uid, file.chunkIndex)
    }
    // 暂停上传
    const endUpload = (fileUid: string) => {
      fileList.forEach((item) => {
        if (item.uid === fileUid) {
          item.pause = true
        }
      })
      setFileList(fileList)
    }
    // 获取文件
    const getFileByUid = (uid: string) => {
      const file = fileList.find((item) => item.uid === uid)
      if (file!.totalSize < chunkSize) {
        chunkSize = 1 * 1024 * 1024
      }
      return file
    }
    const delUpload = (file: FileListType) => {
      if (file.status !== STATUS.uploading.value) {
        setFileList((fileList) => {
          return fileList.filter((item) => item.uid !== file.uid)
        })
      } else {
        delFileList.unshift(file.uid)
        setDelFileList(delFileList)
        setFileList((fileList) => {
          return fileList.filter((item) => item.uid !== file.uid)
        })
      }
    }

    const FileItem = () => {
      return (
        <div>
          {fileList.map((item, index) => (
            <div
              key={index}
              className="relative flex justify-center items-center p-[3px_10px] bg-white border-b border-[#ddd]"
            >
              <div className="flex-1">
                <div className="text-[#403e3e]">{item.fileName}</div>
                <div>
                  {item.status === STATUS.uploading.value ||
                  item.status === STATUS.upload_seconds.value ||
                  item.status === STATUS.upload_finish.value ? (
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
                      item.pause
                        ? STATUS.pause.icon
                        : (STATUS as any)[item.status].icon
                    } mr-[3px]`}
                    style={{
                      color: item.pause
                        ? STATUS.pause.color
                        : (STATUS as any)[item.status].color,
                    }}
                  ></span>
                  <span
                    className="text-[13px] text-[red]"
                    style={{
                      color: item.pause
                        ? STATUS.pause.color
                        : (STATUS as any)[item.status].color,
                    }}
                  >
                    {item.status === 'fail'
                      ? item.errorMsg
                      : item.pause
                      ? STATUS.pause.desc
                      : (STATUS as any)[item.status].desc}
                  </span>
                  {item.status === STATUS.uploading.value ? (
                    <span className="ml-[5px]">
                      {formatFileSize(item.uploadSize)}/
                      {formatFileSize(item.totalSize)}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="w-[100px] flex items-center justify-end">
                {/* 加密MD5的进度 */}
                {item.status === STATUS.init.value ? (
                  <Progress
                    type="circle"
                    size="small"
                    style={{ marginBottom: 0 }}
                    percent={item.md5Progress}
                    strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                  ></Progress>
                ) : null}
                {item.status === STATUS.uploading.value ? (
                  <span className="w-[28px] h-[28px] ml-[5px] cursor-pointer text-center inline-block rounded overflow-hidden">
                    {item.pause ? (
                      <div
                        onClick={() => {
                          startUpload(item)
                        }}
                      >
                        <Icon width={28} iconName="upload"></Icon>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          endUpload(item.uid)
                        }}
                      >
                        <Icon width={28} iconName="pause"></Icon>
                      </div>
                    )}
                  </span>
                ) : null}
                <span
                  className="w-[28px] h-[28px] ml-[5px] cursor-pointer text-center inline-block rounded overflow-hidden"
                  title="删除"
                >
                  {item.status !== STATUS.init.value &&
                  item.status !== STATUS.upload_finish.value &&
                  item.status !== STATUS.upload_seconds.value ? (
                    <div onClick={() => delUpload(item)}>
                      <Icon width={28} iconName="del"></Icon>
                    </div>
                  ) : null}
                </span>

                {item.status === STATUS.upload_finish.value ||
                item.status === STATUS.upload_seconds.value ? (
                  <span
                    className="w-[28px] h-[28px] ml-[5px] cursor-pointer text-center inline-block rounded overflow-hidden"
                    title="清除"
                  >
                    <div onClick={() => delUpload(item)}>
                      <Icon width={28} iconName="clean"></Icon>
                    </div>
                  </span>
                ) : null}
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
          <span className="text-[13px] text-[#a9a9a9]">(仅展示本次)</span>
        </div>
        <div className="overflow-auto p-[10px_0] min-h-[30vh] max-h-[calc(100vh-120px)]">
          {fileList.length === 0 ? (
            <NoData msg="暂无上传任务" isOrigin={true}></NoData>
          ) : (
            <FileItem></FileItem>
          )}
        </div>
      </div>
    )
  }
)
export default UploaderList
