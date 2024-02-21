import { adminGetFileInfo, getFile, getFileInfo } from '@/api'
import * as docx from 'docx-preview'
import React, { useEffect, useRef } from 'react'
const PreviewDoc: React.FC<{
  fileId: string
  previewType: 'user' | 'admin' | 'share'
  userId?: string
}> = (props) => {
  const { fileId, previewType, userId } = props
  useEffect(() => {
    initDoc()
  }, [])
  const initDoc = async () => {
    try {
      let res
      if (previewType === 'admin') {
        res = await adminGetFileInfo(fileId, userId as string, 'blob')
      } else if (previewType === 'user') {
        res = await getFileInfo(fileId, userId)
      }

      if (!res) {
        return
      }
      console.log(res)
      docx.renderAsync(res, document.querySelector('#docBox') as HTMLElement)
    } catch (error) {}
  }

  return <div id="docBox" className="m-[0_auto]"></div>
}
export default PreviewDoc
