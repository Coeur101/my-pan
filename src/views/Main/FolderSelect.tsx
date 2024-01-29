import { changeFileFolder, getAllFolder } from '@/api'
import GlobalModel, { ModelProps } from '@/components/GlobalModel'
import Icon from '@/components/Icon'
import Navigation from '@/components/Navigation'
import { message } from 'antd'
import React, { useEffect, useState } from 'react'
export interface Folder {
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
  moveFolderDone: any
}> = (props) => {
  const { modelConfig, files, moveFolderDone } = props
  const [folderList, setFolder] = useState<Folder[] | never[]>([])
  const [currentFolder, setCurrentFolder] = useState<
    | Folder
    | {
        fileName: string
        fileId: string
      }
  >({
    fileName: '',
    fileId: '0',
  })
  const [childData, setChildData] = useState([])
  const buttons: any = [
    {
      text: '移动到此',
      type: 'primary',
      click: () => {
        console.log(currentFolder)

        moveFolderDone(currentFolder)
      },
    },
  ]
  useEffect(() => {
    if (modelConfig.show) {
      loadAllFolder()
    }
    setCurrentFolder({
      fileId: '0',
      fileName: '',
    })
  }, [modelConfig])

  const loadAllFolder = async () => {
    try {
      const res = await getAllFolder(
        (currentFolder && (currentFolder as Folder)?.fileId) || '0',
        files && files.length > 0
          ? (files.map((item: any) => item.fileId) as string[])
          : files.fileId
      )
      if (res?.code !== 200) {
        return
      }

      setFolder(res.data)
    } catch (error) {
      console.log(error)
    }
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
  useEffect(() => {
    if (currentFolder.fileId !== '0') {
      loadAllFolder()
    }
  }, [currentFolder])
  const navChange = async (data: any) => {
    if (data === 'all') {
      setCurrentFolder({
        fileName: '',
        fileId: '0',
      })
    } else {
      setCurrentFolder(data)
    }
  }
  const selectFolder = (item: Folder) => {
    setCurrentFolder(item)
  }
  return (
    <GlobalModel {...modelConfig} buttons={buttons}>
      <div className="pl-[10px] fixed w-[530px] bg-[#f1f1f1]">
        <div className="text-[13px] flex items-center leading-10">
          <Navigation
            isWatchPath={false}
            pCurrentFolder={currentFolder as Folder}
            navChange={navChange}
          ></Navigation>
        </div>
      </div>
      <div className="max-h-[calc(100vh-300px)] min-h-[200px]  mt-[40px]">
        {folderList.length > 0 ? (
          folderList.map((item) => {
            return (
              <div
                className="cursor-pointer flex items-center p-[10px]  hover:bg-[#f8f8f8]"
                onClick={() => selectFolder(item)}
                key={item.fileId}
              >
                {DisplayIcon(item.status, item.fileName, item.fileType, item)}
                <span className="inline-block ml-[10px]">{item.fileName}</span>
              </div>
            )
          })
        ) : (
          <div className="text-center leading-[200px]">
            移动到 {(currentFolder as Folder)?.fileName} 文件夹下
          </div>
        )}
      </div>
    </GlobalModel>
  )
}

export default FolderSelect
