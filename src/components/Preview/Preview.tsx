import { DataList } from '@/views/Main/All'
import { Image } from 'antd'
import React, { useRef, useState } from 'react'
import { forwardRef } from 'react'
import PreviewImage from './PreviewIamge'
import { getFile } from '@/api'
export type previewType = '0' | '1' | '2' | '3' | '4'
// 整合各种预览组件
const Preview = forwardRef(
  (
    props,
    ref: React.ForwardedRef<{
      showPreview: (file: DataList, type: previewType) => void
    }>
  ) => {
    const [prviewType, setPriewTtpe] = useState<previewType>('0')
    const [fileInfo, setFileInfo] = useState<DataList>()
    const imagePriviewRef = useRef<{ show: () => void }>(null)
    const [imageUrl, setImageUrl] = useState('')
    const showPreview = async (file: DataList, type: previewType) => {
      setPriewTtpe(type)
      setFileInfo(file)

      switch (file.fileCategory) {
        case 3:
          imagePriviewRef.current?.show()
          setImageUrl(getFile(file.fileId as string))
          break
        default:
          break
      }
    }
    React.useImperativeHandle(ref, () => {
      return {
        showPreview,
      }
    })
    return (
      <div>
        <PreviewImage imageUrl={imageUrl} ref={imagePriviewRef} />
      </div>
    )
  }
)
export default Preview
