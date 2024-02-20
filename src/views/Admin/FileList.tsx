import RouterContent from '@/utils/RouterContent'
import {
  DeleteOutlined,
  DragOutlined,
  FolderAddOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import {
  Button,
  ConfigProvider,
  Input,
  Modal,
  TableColumnProps,
  Upload,
  UploadProps,
  message,
} from 'antd'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import style from '../style/all.module.scss'
import GlobalTable, { OptionType } from '@/components/Table'
import { PaginationProps } from 'antd/lib'
import {
  adminCreateDownLoadUrl,
  adminDownLoadFile,
  changeFileFolder,
  createDownLoadUrl,
  delFiles,
  downLoadFile,
  getAllFileList,
  getFileList,
  newFoloder,
  reFileName,
} from '@/api'
import { InputRef, SearchProps } from 'antd/es/input'
import Icon from '@/components/Icon'
import { formatFileSize } from '@/utils/format'
import { useLocation, useNavigate } from 'react-router-dom'
import { ModelProps } from '@/components/GlobalModel'
import Navigation from '@/components/Navigation'
import { flushSync } from 'react-dom'
import NoData from '@/components/Nodata'
import { useSelector } from 'react-redux'
import Preview, { previewType } from '@/components/Preview/Preview'
export interface DataList {
  fileId?: string
  filePid?: string | number
  fileSize?: number | string
  fileName?: string
  fileCover?: string
  createTime?: string
  lastUpdateTime?: string
  folderType?: number | string
  fileCategory?: number
  fileType?: number
  status?: number
  key: React.Key
  editStatus?: boolean
  fileNameComple?: string
}
const FileList: React.FC<any> = (props) => {
  const acceptType = {
    video: 'video/*',
    doc: 'application/msword, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain, text/markdown, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    music: 'audio/*',
    image: 'image/*',
    all: '',
    others: '',
  }
  const [accept, setAccept] = useState('')
  const parentProps = useContext<{
    upLoadFile?: (...args: any) => void
  }>(RouterContent)
  const upProps: UploadProps = {
    hasControlInside: true,
    capture: 'environment',
    multiple: true,
    customRequest: (info) => {
      // console.log(currentFolder)
      parentProps.upLoadFile!(info.file as Blob, currentFolder)
    },
    showUploadList: false,
    withCredentials: true,
    accept: accept,
  }
  const location = useLocation()
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const [catagory, setCatagory] = useState<string>('all')
  const editInputRef = useRef<InputRef>(null)
  const [data, setData] = useState<DataList[]>([])
  const [currentFile, setCurrentFile] = useState<DataList>()
  const url = new URLSearchParams(location.search)
  const [selectedRowKeysA, setSelectedRowKeysA] = useState<React.Key[]>([])
  const [currentFolder, setCurrentFolder] = useState(
    url.get('path')?.split('/')[url.get('path')!.split('/')!.length - 1] || '0'
  )
  const navigationRef = useRef<{ openCurrentFolder: (...args: any) => void }>(
    null
  )
  const previewRef = useRef<{
    showPreview: (file: DataList, type: previewType) => void
  }>(null)
  const isUploadFileList = useSelector((state: any) => {
    return state.globalLoading.isUploadFileList
  })
  const DisplayIcon = (
    status: number,
    iconName: string,
    type: number,
    row: DataList
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
  /**
   * 表格列的配置
   */
  const colums: TableColumnProps<DataList>[] = [
    {
      key: 1,
      title: '文件名',
      dataIndex: 'fileName',
      align: 'left',
      render: (text: string, record: DataList, index: number) => {
        return (
          <div className=" hover:text-blue-700  h-[44px] flex items-center  group">
            {DisplayIcon(
              record.status as number,
              record.fileCover as string,
              record.fileType as number,
              record
            )}
            {record.editStatus ? (
              <div className="flex  items-center w-[230px]">
                <Input
                  ref={editInputRef}
                  defaultValue={
                    record.fileNameComple ? record.fileNameComple : text
                  }
                  maxLength={190}
                ></Input>
              </div>
            ) : (
              <span
                className="flex-1 flex overflow-hidden items-center gap-2 cursor-pointer whitespace-nowrap ml-[8px]"
                onClick={() => openCurrentFolder(record)}
              >
                <span className="cursor-pointer">{text}</span>
              </span>
            )}

            {record.fileId && record.status === 2 ? (
              <div className="w-[280px]  hidden  group-hover:flex items-center ">
                {record.folderType !== 1 ? (
                  <span
                    className="iconfont cursor-pointer hover:text-blue-400 icon-download text-[12px] ml-[10px]"
                    onClick={() => download(record.fileId as string)}
                  >
                    <span className="ml-[5px]"> 下载</span>
                  </span>
                ) : null}

                <span
                  className="iconfont cursor-pointer hover:text-blue-400 icon-del text-[12px] ml-[10px]"
                  onClick={() => delFile(record.fileId)}
                >
                  <span className="ml-[5px]"> 删除</span>
                </span>
              </div>
            ) : null}
          </div>
        )
      },
    },
    {
      key: 2,
      title: '发布人',
      dataIndex: 'nickName',
      width: 100,
      align: 'left',
    },
    {
      key: 3,
      title: '修改时间',
      dataIndex: 'lastUpdateTime',
      width: 200,
      align: 'left',
    },
    {
      key: 4,
      title: '大小',
      dataIndex: 'fileSize',
      width: 100,
      render: (text: string, recorde: DataList, index: number) => {
        return <div>{formatFileSize((recorde.fileSize as number) || 0)}</div>
      },
      align: 'left',
    },
  ]
  const [total, setTotal] = useState(0)
  const [tableLoading, setTbaleLoading] = useState(false)

  const loadList = async (fileFuzzName: string, filePid?: string) => {
    try {
      setTbaleLoading(true)
      const res = await getAllFileList(pageNo, pageSize, fileFuzzName, filePid)
      if (res?.code !== 200) {
        return
      }
      setData(
        res?.data?.list.map((item: DataList, index: number) => {
          return {
            ...item,
            key: index,
            selected: false,
          }
        })
      )
      setTotal(res.data.totalCount)
    } catch (error) {
    } finally {
      setTbaleLoading(false)
    }
  }
  const saveSelectedKeys = (keys: React.Key[]) => {
    setSelectedRowKeysA(keys)
  }
  const [selectedRow, setSelectedRow] = useState<DataList[]>([])
  const option = useMemo<OptionType>(() => {
    return {
      data: data,
      bordered: true,
      loading: tableLoading,
      selectType: {
        selectedRowKeys: selectedRowKeysA,
        onChange(selectedRowKeysA: React.Key[], slectedRows: DataList[]) {
          setSelectedRow(slectedRows)
          setSelectedRowKeysA(selectedRowKeysA)
        },
      },
      pagination: {
        pageSize: pageSize,
        pageSizeOptions: [15, 20, 30, 100],
        defaultPageSize: 15,
        total: total,
        showTotal: (total: number) => {
          return `共${total}条`
        },
        onChange(current: number, size: number) {
          flushSync(() => {
            setPageNo(current)
            setPageSize(size)
          })
        },
        showSizeChanger: true,
        // hideOnSinglePage: false,
      } as PaginationProps,
      tableHeght: 400,
      colums,
    }
  }, [pageNo, pageSize, total, data, tableLoading, selectedRowKeysA])
  useEffect(() => {
    loadList('')
    saveSelectedKeys(selectedRowKeysA)
  }, [pageNo, pageSize, isUploadFileList])

  // 搜索
  const onSearch: SearchProps['onSearch'] = (value) => {
    loadList(value)
  }
  // 批量删除和单个删除
  const delFile = (fileId?: string) => {
    Modal.confirm({
      title: '确定要删除这些文件吗？',
      content: '删除的文件可在10天内通过回收站还原',
      style: {
        top: 200,
      },
      onOk: async () => {
        return new Promise(async (resolve, reject) => {
          const res = await delFiles(
            fileId
              ? fileId
              : (selectedRow.map((item) => item.fileId) as string[])
          )
          if (res?.code !== 200) {
            reject(res?.info)
          }
          setSelectedRow([])
          setSelectedRowKeysA([])
          resolve('')
          loadList('')
        }).catch((error) => {
          message.error(error)
        })
      },
      onCancel: () => {},
    })
  }

  // 点击文件夹进行下钻,点击文件就进行预览
  const openCurrentFolder = (folder: DataList) => {
    if (!folder.fileType) {
      setCurrentFolder(folder.fileId as string)
      loadList('', folder.fileId)
      navigationRef.current?.openCurrentFolder(folder)
      return
    }
    if (folder.status !== 2) {
      message.warning('文件转码中无法预览,请尝试刷新')
      return
    }
    previewRef.current?.showPreview(folder, 'user')
  }
  // 下载文件
  const download = async (fileId: string) => {
    // 创建下载链接
    try {
      const downloadUrl = await adminCreateDownLoadUrl(fileId)
      if ((downloadUrl as any)?.code !== 200) {
        return
      }
      const domain = window.location.origin // 获取当前页面的域名部分
      const fullDownloadUrl = `${domain}/api/${adminDownLoadFile(
        downloadUrl!.data
      )}`
      window.open(fullDownloadUrl)
    } catch (error) {}
  }

  return (
    <div className={`${style.wrapper} mt-[20px]`}>
      <div className="flex items-center ml-[10px]">
        <Button
          danger
          icon={<DeleteOutlined />}
          className="mr-[10px]"
          type="primary"
          disabled={selectedRowKeysA.length !== 0 ? false : true}
          onClick={() => delFile()}
        >
          批量删除
        </Button>
        <div className="ml-[10px] w-[300px]">
          <Input.Search
            placeholder="输入文件名搜索"
            onSearch={onSearch}
          ></Input.Search>
        </div>
        <div
          className="iconfont icon-refresh text-[#636d7e] cursor-pointer ml-[10px]"
          onClick={() => {
            loadList('')
          }}
        ></div>
      </div>
      <Navigation
        adminShow={true}
        isWatchPath={true}
        ref={navigationRef}
        loadList={loadList}
      ></Navigation>

      <div className={`${style.wrapper}`}>
        <GlobalTable option={option} data={data}></GlobalTable>
      </div>

      <Preview ref={previewRef}></Preview>
    </div>
  )
}
export default FileList
