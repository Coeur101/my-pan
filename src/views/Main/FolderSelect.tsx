import { getAllFolder } from '@/api'
import GlobalModel, { ModelProps } from '@/components/GlobalModel'
import Icon from '@/components/Icon'
import React, { useEffect, useState } from 'react'
interface Folder {
  fileId: string
  filePid: string
  fileSize?: any
  fileName: string
  fileCover?: any
  lastUpdateTime: string
  folderType: number
  fileCategory?: any
  fileType?: any
  status: number
}

// 文件目录的选择弹窗
const FolderSelect: React.FC<{
  modelConfig: ModelProps
  files: any
  pCurrentFolder?: string
}> = (props) => {
  const { modelConfig, files, pCurrentFolder } = props
  const [folderList, setFolder] = useState<Folder[] | never[]>([])
  const [currentFolder] = useState<Folder>()
  useEffect(() => {
    if (modelConfig.show) {
      loadAllFolder()
    }
    console.log(files)
  }, [modelConfig])
  const loadAllFolder = async () => {
    try {
      const res = await getAllFolder(
        '0',
        pCurrentFolder === '0'
          ? ''
          : typeof files === 'object'
          ? (files.map((item: any) => item.fileId) as string[])
          : files
      )
      if (res?.code !== 200) {
        return
      }
      setFolder(res.data)
    } catch (error) {}
  }
  const DisplayIcon = (
    status: number,
    iconName: string,
    type: number,
    row: Folder
  ) => {
    if ((type === 3 || type === 1) && status === 2) {
      return (
        <Icon cover={row.fileCover as string} fielType={type} width={32}></Icon>
      )
    } else {
      if (row.folderType === 0 || !row.folderType) {
        return <Icon fielType={type}></Icon>
      }
      if (row.folderType === 1) {
        return <Icon fielType={0}></Icon>
      }
    }
  }
  return (
    <GlobalModel {...modelConfig}>
      <div className="pl-[10px] fixed w-[530px] bg-[#f1f1f1]">
        <div className="text-[13px] flex items-center leading-10">
          <span className="font-bold">全部文件</span>
        </div>
      </div>
      <div className="max-h-[calc(100vh-300px)] min-h-[200px]  mt-[40px]">
        {folderList.length > 0 ? (
          folderList.map((item) => {
            return (
              <div
                className="cursor-pointer flex items-center p-[10px]  hover:bg-[#f8f8f8]"
                key={item.fileId}
              >
                {DisplayIcon(item.status, item.fileName, item.fileType, item)}
                <span className="inline-block ml-[10px]">{item.fileName}</span>
              </div>
            )
          })
        ) : (
          <div className="text-center leading-[200px]">
            移动到 {currentFolder?.fileName} 文件夹下
          </div>
        )}
      </div>
    </GlobalModel>
  )
}

export default FolderSelect
