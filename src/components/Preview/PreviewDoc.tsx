import { getFile, getFileInfo } from '@/api'
import * as docx from 'docx-preview'
import React, { useEffect, useRef } from 'react'
const PreviewDoc: React.FC<{
  fileId: string
}> = (props) => {
  const { fileId } = props
  useEffect(() => {
    initDoc()
  }, [])
  const initDoc = async () => {
    try {
      const res = await getFileInfo(fileId, 'blob')
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
