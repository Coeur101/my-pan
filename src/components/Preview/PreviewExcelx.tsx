import { adminGetFileInfo, getFile, getFileInfo } from '@/api'
import * as XLSX from 'xlsx'
import React, { useEffect, useRef, useState } from 'react'
import style from '../style/previewExcel.module.scss'
const PreviewExcel: React.FC<{
  fileId: string
  previewType: 'user' | 'admin' | 'share'
  userId?: string
}> = (props) => {
  const { fileId, previewType, userId } = props
  const [excelContent, setExcelContent] = useState('')
  useEffect(() => {
    initDoc()
  }, [])

  const initDoc = async () => {
    try {
      let res
      if (previewType === 'admin') {
        res = await adminGetFileInfo(fileId, userId as string, 'arraybuffer')
      } else if (previewType === 'user') {
        res = await getFileInfo(fileId, 'arraybuffer')
      }
      if (!res) {
        return
      }
      const workBook = XLSX.read(new Uint8Array(res as any), { type: 'array' })
      console.log(123)

      const workSheet = workBook.Sheets[workBook.SheetNames[0]]
      setExcelContent(XLSX.utils.sheet_to_html(workSheet))
    } catch (error) {}
  }

  return (
    <div
      id="excelBox"
      dangerouslySetInnerHTML={{ __html: excelContent }}
      className={`${style['excelBox']} w-full p-[10px]`}
    ></div>
  )
}
export default PreviewExcel
