import { DataList } from '@/views/Main/All'
import { Image } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { forwardRef } from 'react'
import PreviewImage from './PreviewIamge'
import {
  adminCreateDownLoadUrl,
  adminDownLoadFile,
  adminGetFile,
  adminGetVideoInfo,
  createDownLoadUrl,
  downLoadFile,
  getFile,
  getVideoInfo,
  shareCreateDownLoadUrl,
  shareDownLoadFile,
  shareGetFile,
  shareGetVideoInfo,
} from '@/api'
import WindowMask from '../WindowMask'
import PreviewVideo from './PreviewVideo'
import PreviewExcel from './PreviewExcelx'
import PreviewDoc from './PreviewDoc'
export type previewType = 'user' | 'admin' | 'share'
// 整合各种预览组件
const Preview = forwardRef(
  (
    props,
    ref: React.ForwardedRef<{
      showPreview: (file: DataList, type: previewType) => void
    }>
  ) => {
    const file_url_map = {
      user: {
        file: (fileId: string) => {
          return getFile(fileId)
        },
        video: (fileId: string) => {
          return getVideoInfo(fileId)
        },
        createFileUrl: async (fileId: string) => {
          return await createDownLoadUrl(fileId)
        },
        downloadFile: async (fileId: string) => {
          return await downLoadFile(fileId)
        },
      },
      admin: {
        file: (fileId: string) => {
          return adminGetFile(fileId)
        },
        video: (fileId: string) => {
          return adminGetVideoInfo(fileId)
        },
        createFileUrl: async (fileId: string) => {
          return await adminCreateDownLoadUrl(fileId)
        },
        downloadFile: async (fileId: string) => {
          return await adminDownLoadFile(fileId)
        },
      },
      share: {
        file: (fileId: string) => {
          return shareGetFile(fileId)
        },
        video: (fileId: string) => {
          return shareGetVideoInfo(fileId)
        },
        createFileUrl: async (fileId: string) => {
          return await shareCreateDownLoadUrl(fileId)
        },
        downloadFile: async (fileId: string) => {
          return await shareDownLoadFile(fileId)
        },
      },
    }
    const [prviewType, setPriewTtpe] = useState<previewType>('user')
    const [fileInfo, setFileInfo] = useState<DataList | null>()
    const [maskShow, setMaskShow] = useState(false)
    const [maskTitle, setMaskTitle] = useState('')
    const imagePriviewRef = useRef<{ show: () => void }>(null)
    const [imageUrl, setImageUrl] = useState('')

    const showPreview = async (file: DataList, type: previewType) => {
      setPriewTtpe(type)
      setFileInfo(file)
      switch (file.fileCategory) {
        case 3:
          imagePriviewRef.current?.show()
          break
        default:
          setMaskShow(true)
          setMaskTitle(file.fileName as string)
          break
      }
    }

    useEffect(() => {
      setImageUrl(getFile(fileInfo?.fileId as string))
    }, [fileInfo])
    React.useImperativeHandle(ref, () => {
      return {
        showPreview,
      }
    })
    const maskClose = () => {
      setMaskShow(false)
      setFileInfo(null)
    }
    const PreviewContainer = () => {
      if (fileInfo?.fileType === 1) {
        return (
          <>
            <PreviewVideo
              videoUrl={file_url_map[prviewType].video(
                fileInfo.fileId as string
              )}
            />
          </>
        )
      }
      if (fileInfo?.fileType === 5) {
        return (
          <>
            <PreviewDoc fileId={fileInfo.fileId as string}></PreviewDoc>
          </>
        )
      }
      if (fileInfo?.fileType === 6) {
        return (
          <>
            <PreviewExcel fileId={fileInfo.fileId as string}></PreviewExcel>
          </>
        )
      }
    }
    return (
      <div>
        <PreviewImage imageUrl={imageUrl} ref={imagePriviewRef} />
        {fileInfo && fileInfo.fileCategory !== 3 ? (
          <WindowMask
            align={fileInfo?.fileCategory === 1 ? 'center' : 'top'}
            close={maskClose}
            width={fileInfo?.fileCategory === 1 ? 1500 : 900}
            show={maskShow}
            title={maskTitle}
          >
            {PreviewContainer()}
          </WindowMask>
        ) : null}
      </div>
    )
  }
)
export default Preview
