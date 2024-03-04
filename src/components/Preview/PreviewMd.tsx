import { adminGetFileInfo, getFileInfo, shareGetFileInfo } from '@/api'
import React, { useEffect, useState } from 'react'
import MdPreview from '../MdPreview'

const PreviewMd: React.FC<{
  fileId: string
  previewType: 'user' | 'admin' | 'share'
  userId?: string
  shareId?: string
}> = (props) => {
  const { fileId, previewType, userId, shareId } = props
  const [content, setContent] = useState('')
  useEffect(() => {
    initContent()
  }, [])
  const initContent = async () => {
    let res
    if (previewType === 'admin') {
      res = await adminGetFileInfo(fileId, userId as string, 'arraybuffer')
    } else if (previewType === 'user') {
      res = await getFileInfo(fileId, 'arraybuffer')
    } else if (previewType === 'share') {
      res = await shareGetFileInfo(fileId, shareId as string, 'arraybuffer')
    }
    setContent(arrayBufferToString(res))
  }
  const arrayBufferToString = (buffer: any, encoding = 'utf-8') => {
    const decoder = new TextDecoder(encoding)
    return decoder.decode(buffer)
  }
  return (
    <div className="bg-[#fafafa]">
      <MdPreview content={content}></MdPreview>
    </div>
  )
}
export default PreviewMd
