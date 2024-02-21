import React, { useEffect } from 'react'
import { DataList } from '@/views/Main/All'
import Icon from '../Icon'
import { Button } from 'antd'
import { formatFileSize } from '@/utils/format'
import { AxiosResponse } from 'axios'
import { preivewDataList } from './Preview'
interface PreviewNotFoundProps {
  fileInfo: preivewDataList
  getDownloadUrlFunc: (downloadId: string) => string
  getCreateDownloadUrlFunc: (fileId: string, userId?: string) => any
}
const PreviewNotFound: React.FC<PreviewNotFoundProps> = (props) => {
  const { fileInfo, getCreateDownloadUrlFunc, getDownloadUrlFunc } = props
  const download = async () => {
    try {
      const createDownloadUrl = await getCreateDownloadUrlFunc(
        fileInfo.fileId as string,
        fileInfo.userId
      )
      if (createDownloadUrl.code !== 200) {
        return
      }
      const domain = window.location.origin // 获取当前页面的域名部分
      const fullDownloadUrl = `${domain}/api/${getDownloadUrlFunc(
        createDownloadUrl.data
      )}`
      window.open(fullDownloadUrl)
    } catch (error) {}
  }
  return (
    <div className="flex items-center flex-col justify-center w-full">
      <div>
        <Icon width={80} fielType={fileInfo.fileType}></Icon>
      </div>
      <div className="font-bold text-[rgb(99,109,126)]">
        {fileInfo.fileName}
      </div>
      <div className="text-[#999898] mt-2 text-[13px]">
        {fileInfo.fileName?.split('.')[1] === 'doc'
          ? 'doc文件不支持预览，请转为docx或其他可预览的文件类型或下载后查看'
          : '该类型的文件暂不支持预览，请下载后查看'}
      </div>
      <div className="mt-[20px]">
        <Button type="primary" onClick={() => download()}>
          点击下载 {formatFileSize(fileInfo.fileSize as number)}
        </Button>
      </div>
    </div>
  )
}
export default PreviewNotFound
