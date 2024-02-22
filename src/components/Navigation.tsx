import { getAdminFolderInfo, getFolderInfo, getShareFolderInfo } from '@/api'
import { setIsUploadFileList } from '@/store/reducer/globalLoading'
import { formatName } from '@/utils/format'
import { Folder } from '@/views/Main/FolderSelect'
import { RightOutlined } from '@ant-design/icons'
import { Divider } from 'antd'
import React, { forwardRef, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

interface navigationProps {
  isWatchPath: boolean
  shareId?: string
  adminShow?: boolean
  loadList?: (...args: any) => void
  navChange?: (...args: any) => void
  pCurrentFolder?: Folder | null | string
}
interface navigationFolder {
  fileId: string
  fileName: string
}
type categroy = 'all' | 'video' | 'image' | 'music' | 'others' | 'doc'
// 判断是否存在
const findCommonFile = (folderList: any[], currentFolder: any) => {
  return folderList.find((item) => item.fileId === currentFolder.fileId)
}
const Navigation = forwardRef(
  (
    props: navigationProps,
    ref: React.ForwardedRef<{ openCurrentFolder: (...args: any) => void }>
  ) => {
    const {
      isWatchPath,
      shareId,
      adminShow,
      loadList,
      pCurrentFolder,
      navChange,
    } = props
    let [folderList, setFolderList] = useState<navigationFolder[]>([])

    const [categroy, setCategroy] = useState<categroy>('all')
    const navigate = useNavigate()
    const location = useLocation()
    const url = new URLSearchParams(location.search)
    const dispatch = useDispatch()
    useEffect(() => {
      if (pCurrentFolder && (pCurrentFolder as Folder).fileId !== '0') {
        if (findCommonFile(folderList, pCurrentFolder)) {
        } else {
          console.log(pCurrentFolder)

          folderList.push({
            fileId:
              pCurrentFolder !== '0'
                ? ((pCurrentFolder as Folder)?.fileId as string)
                : '',
            fileName: (pCurrentFolder as Folder)?.fileName as string,
          })
        }
      }
    }, [pCurrentFolder])
    useEffect(() => {
      if (isWatchPath) {
        setCategroy(location.pathname.split('/')[2] as categroy)

        if (!url.get('path')) {
          setFolderList([])
        } else {
          getNavigationFolder(url.get('path'))
        }
      }
    }, [location])
    const openCurrentFolder = (folder: navigationFolder) => {
      if (isWatchPath) {
        if (folderList.find((item) => item.fileId === folder.fileId)) {
          navigate(`${location.pathname}?path=${folder.fileId}`)
          loadList!('', folder.fileId)
          return
        }

        if (!folder.fileId) {
          navigate(`${location.pathname}`)
          loadList!()
          return
        }

        const { fileId, fileName } = folder
        folderList?.push({ fileId, fileName })
        setFolderList(folderList)
        setPath()
      } else {
        if (!folder.fileId) {
          setFolderList([])
          navChange!('all')
          console.log(folderList)

          return
        }

        navChange!(folder)
        folderList = folderList.splice(
          folderList.findIndex((item) => item.fileId === folder.fileId),
          1
        )
        setFolderList(folderList)
      }
    }
    const setPath = () => {
      // 不监听路由则不跳转
      if (!isWatchPath) {
        return
      }
      let pathArray: string[] = []
      folderList.forEach((item) => {
        pathArray.push(item.fileId)
      })
      navigate(
        `${location.pathname}${
          pathArray.length > 0 ? '?path=' + pathArray.join('/') : ''
        }`
      )
    }
    const getNavigationFolder = async (path: string | null) => {
      try {
        let res = null
        if (shareId) {
          res = await getShareFolderInfo(path as string, shareId)
        } else if (adminShow) {
          res = await getAdminFolderInfo(path as string)
        } else {
          res = await getFolderInfo(path as string)
        }
        setFolderList(res?.data)
        if (res?.code !== 200) {
          return
        }
      } catch (error) {
        console.log(error)
      }
    }
    const handleRouteBack = () => {
      if (isWatchPath) {
        let pathArry = url.get('path')?.split('/')
        if (pathArry) {
          pathArry.pop()
          if (pathArry.length === 1) {
            navigate(`${location.pathname}?path=${pathArry[0]}`)
          } else if (pathArry.length === 0) {
            navigate(`${location.pathname}`)
          } else {
            navigate(`${location.pathname}?path=${pathArry.join('/')}`)
          }
          dispatch(setIsUploadFileList(null))
        } else {
          navigate(`${location.pathname}`)
        }
      } else {
        if (folderList.length - 2 <= 0) {
          setFolderList([])
          navChange!('all')
          return
        }
        navChange!(folderList[folderList.length - 2])
        folderList = folderList.splice(folderList.length - 1, 1)
        setFolderList(folderList)
      }
    }

    React.useImperativeHandle(ref, () => {
      return {
        openCurrentFolder,
      }
    })
    return (
      <div className="text-[13px] flex items-center leading-10  ml-[10px]">
        {folderList.length > 0 ? (
          <div>
            <span
              className="text-[#06a7ff] cursor-pointer"
              onClick={() => {
                handleRouteBack()
              }}
            >
              返回上一级
            </span>
            <Divider type="vertical" className="border-[black]"></Divider>
          </div>
        ) : (
          <span className="font-bold">全部文件</span>
        )}
        {folderList.length > 0 ? (
          <span
            className="text-[#06a7ff] cursor-pointer"
            onClick={() => openCurrentFolder({ fileId: '', fileName: '' })}
          >
            全部文件
          </span>
        ) : null}
        {folderList.map((item, index) => {
          return (
            <div key={index}>
              <RightOutlined></RightOutlined>
              {index < folderList.length - 1 ? (
                <span
                  className="text-[#06a7ff] cursor-pointer"
                  onClick={() => openCurrentFolder(item)}
                >
                  {formatName(item.fileName)}
                </span>
              ) : (
                <span>{formatName(item.fileName)}</span>
              )}
            </div>
          )
        })}
      </div>
    )
  }
)
export default Navigation
