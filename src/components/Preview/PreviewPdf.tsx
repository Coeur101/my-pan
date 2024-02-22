import { adminGetFileInfo, getFile, getFileInfo } from '@/api'
import { pdfjs, Page, Document } from 'react-pdf'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Input, Spin, Tooltip } from 'antd'
import style from '../style/previewPdf.module.scss'
import Icon, {
  FullscreenExitOutlined,
  FullscreenOutlined,
  LeftCircleOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  RightCircleOutlined,
} from '@ant-design/icons'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
// 设置 PDF.js worker 路径
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
const PreviewPdf: React.FC<{
  fileId: string
  previewType: 'user' | 'admin' | 'share'
  userId?: string
}> = (props) => {
  const { fileId, previewType, userId } = props
  const [pageInfo, setPageInfo] = useState({
    pageNumber: 1,
    pageNumberInput: 1,
    pageNumberFocus: false,
    numPages: 1,
    pageWidth: 600,
    fullscreen: false,
  })
  const [pdfData, setPdfData] = useState('')

  let file = useMemo(() => ({ data: pdfData }), [pdfData])
  const initPdf = async () => {
    try {
      let res
      if (previewType === 'admin') {
        res = await adminGetFileInfo(fileId, userId as string, 'arraybuffer')
      } else if (previewType === 'user') {
        res = await getFileInfo(fileId, userId)
      }
      if (!res) {
        return
      }
      setPdfData(res as any)
    } catch (error) {}
  }
  useEffect(() => {
    initPdf()
  }, [])
  // 初始化pdf分页
  //@ts-ignore
  const onDocumentLoadSuccess = ({ numPages }) => {
    setPageInfo({ ...pageInfo, numPages: numPages })
  }
  // 上一页
  const lastPage = () => {
    if (pageInfo.pageNumber == 1) {
      return
    }
    const page = pageInfo.pageNumber - 1
    setPageInfo({ ...pageInfo, pageNumber: page, pageNumberInput: page })
  }
  // 下一页
  const nextPage = () => {
    if (pageInfo.pageNumber == pageInfo.numPages) {
      return
    }
    const page = pageInfo.pageNumber + 1
    setPageInfo({ ...pageInfo, pageNumber: page, pageNumberInput: page })
  }
  // 输入框聚焦
  const onPageNumberFocus = () => {
    setPageInfo({ ...pageInfo, pageNumberFocus: true })
  }
  // 输入框失焦
  const onPageNumberBlur = () => {
    setPageInfo({
      ...pageInfo,
      pageNumberFocus: false,
      pageNumberInput: pageInfo.pageNumber,
    })
  }
  // 输入框值改变时
  const onPageNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    value = (Number(value) <= 0 ? 1 : value) as string
    value = (
      Number(value) >= pageInfo.numPages ? pageInfo.numPages : value
    ) as string
    setPageInfo({ ...pageInfo, pageNumberInput: Number(value) })
  }
  // 按下回车跳转页数
  const toPage = (e: any) => {
    setPageInfo({ ...pageInfo, pageNumber: Number(e.target.value) })
  }
  // 缩放pdf预览
  const pageZoomOut = () => {
    if (pageInfo.pageWidth <= 600) {
      return
    }
    const pageWidth = pageInfo.pageWidth * 0.8
    setPageInfo({ ...pageInfo, pageWidth: pageWidth })
  }
  // 放大pdf预览
  const pageZoomIn = () => {
    const pageWidth = pageInfo.pageWidth * 1.2
    setPageInfo({ ...pageInfo, pageWidth: pageWidth })
  }
  // 调整pdf预览适应窗口大小
  const pageFullscreen = () => {
    if (pageInfo.fullscreen) {
      setPageInfo({ ...pageInfo, fullscreen: false, pageWidth: 600 })
    } else {
      setPageInfo({
        ...pageInfo,
        fullscreen: true,
        pageWidth: window.screen.width - 40,
      })
    }
  }
  return (
    <div className={style.view}>
      <div className={style.pageContainer}>
        {pdfData && (
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<Spin size="large"></Spin>}
          >
            <Page
              pageNumber={pageInfo.pageNumber}
              width={pageInfo.pageWidth}
              loading={<Spin size="large" />}
            />
          </Document>
        )}
      </div>
      <div className={style.pageTool}>
        <Tooltip title={pageInfo.pageNumber == 1 ? '已是第一页' : '上一页'}>
          <span className="mr-1">
            <LeftCircleOutlined onClick={lastPage} />
          </span>
        </Tooltip>
        <Input
          value={
            pageInfo.pageNumberFocus
              ? pageInfo.pageNumberInput
              : pageInfo.pageNumber
          }
          onFocus={onPageNumberFocus}
          onBlur={onPageNumberBlur}
          onChange={onPageNumberChange}
          onPressEnter={toPage}
          type="number"
        />{' '}
        / {pageInfo.numPages}
        <Tooltip
          title={
            pageInfo.pageNumber == pageInfo.numPages ? '已是最后一页' : '下一页'
          }
        >
          <span className="mr-1">
            <RightCircleOutlined onClick={nextPage} />
          </span>
        </Tooltip>
        <Tooltip title="放大">
          <span className="mr-1">
            <PlusCircleOutlined onClick={pageZoomIn} />
          </span>
        </Tooltip>
        <Tooltip title="缩小">
          <span className="mr-1">
            <MinusCircleOutlined onClick={pageZoomOut} />
          </span>
        </Tooltip>
        <Tooltip title={pageInfo.fullscreen ? '恢复默认' : '适合窗口'}>
          <span className="mr-1">
            {pageInfo.fullscreen ? (
              <FullscreenExitOutlined onClick={pageFullscreen} />
            ) : (
              <FullscreenOutlined onClick={pageFullscreen} />
            )}
          </span>
        </Tooltip>
      </div>
    </div>
  )
}
export default PreviewPdf
