import {
  adminCreateDownLoadUrl,
  adminDownLoadFile,
  getAllFileList,
  getShareLoginInfo,
  getShowShareFileList,
  saveShareFile,
  shareCreateDownLoadUrl,
} from '@/api'
import Avatar from '@/components/Avatar'
import Navigation from '@/components/Navigation'
import Preview, { previewType } from '@/components/Preview/Preview'
import style from '../style/all.module.scss'
import GlobalTable, { OptionType } from '@/components/Table'
import {
  CloseCircleOutlined,
  LogoutOutlined,
  StopOutlined,
} from '@ant-design/icons'
import { Button, PaginationProps, TableColumnProps } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  NavigateFunction,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { DataList } from '../Admin/FileList'
import { useSelector } from 'react-redux'
import Icon from '@/components/Icon'
import { formatFileSize } from '@/utils/format'
import { flushSync } from 'react-dom'
import message from '@/utils/message'
import FolderSelect from '../Main/FolderSelect'
import { ModelProps } from '@/components/GlobalModel'

interface shareInfoType {
  shareTime: string
  expireTime: string
  nickName: string
  fileName: string
  currentUser: boolean
  fileId: string
  avatar: string
  userId: string
}

const ShareView = () => {
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const url = new URLSearchParams(location.search)
  const [data, setData] = useState<DataList[]>([])
  const [currentFile, setCurrentFile] = useState<DataList>()
  const [modelConfig, setModelConfig] = useState<ModelProps>({
    show: false,
    title: '移动到',
    width: 600,
    destroy: true,
    close() {
      setModelConfig({
        ...modelConfig,
        show: false,
      })
    },
    cancelBtn: true,
  })
  const [selectedRowKeysA, setSelectedRowKeysA] = useState<React.Key[]>([])
  const navigationRef = useRef<{ openCurrentFolder: (...args: any) => void }>(
    null
  )
  const previewRef = useRef<{
    showPreview: (file: DataList, type: previewType) => void
  }>(null)
  const isUploadFileList = useSelector((state: any) => {
    return state.globalLoading.isUploadFileList
  })
  const loginState = useSelector((state: any) => {
    return state.globalLoading.loginState
  })
  useEffect(() => {
    if (loginState === 1) {
      ;(navigate as NavigateFunction)(
        '/login?redirectUrl=' + encodeURI(location!.pathname)
      )
    }
  }, [loginState])
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

            <span
              className="flex-1 flex overflow-hidden items-center gap-2 cursor-pointer whitespace-nowrap ml-[8px]"
              onClick={() => openCurrentFolder(record)}
            >
              <span className="cursor-pointer">{text}</span>
              {record.status === 0 ? (
                <span className="text-[13px] ml-[10px] text-[#f75000]">
                  转码中
                </span>
              ) : record.status === 1 ? (
                <span className="text-[red] text-[13px] ml-[10px]">失败</span>
              ) : null}
            </span>

            {record.fileId && record.status === 2 && !shareInfo?.currentUser ? (
              <div className="w-[160px]    flex items-center justify ">
                {record.folderType !== 1 ? (
                  <span
                    className="iconfont cursor-pointer text-blue-400 icon-download text-[12px] ml-[10px]"
                    onClick={() => download(record.fileId as string)}
                  >
                    <span className="ml-[5px]"> 下载</span>
                  </span>
                ) : null}
                <span
                  className="iconfont cursor-pointer text-blue-400 icon-import text-[12px] ml-[10px]"
                  onClick={() => {
                    saveMyPan(record)
                  }}
                >
                  <span className="ml-[5px]">保存到网盘</span>
                </span>
              </div>
            ) : null}
          </div>
        )
      },
    },
    {
      key: 2,
      title: '修改时间',
      dataIndex: 'lastUpdateTime',
      width: 200,
      align: 'left',
    },
    {
      key: 3,
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

  const loadList = async (filePid?: string) => {
    try {
      setTbaleLoading(true)
      const res = await getShowShareFileList(
        params.shareId as string,
        filePid,
        pageNo,
        pageSize
      )
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
    } catch (error: any) {
      if (error.showError) {
        message.error(error.msg)
        navigate(`/share/${params.shareId}`)
      }
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
    if (!url.get('path')) {
      loadList('')
      return
    }
    let pathArray = url.get('path')?.split('/')
    loadList(pathArray ? pathArray![pathArray!.length - 1] : '0')
    saveSelectedKeys(selectedRowKeysA)
  }, [pageNo, pageSize, isUploadFileList, url.get('path')])

  // 点击文件夹进行下钻,点击文件就进行预览
  const openCurrentFolder = (folder: DataList) => {
    if (!folder.fileType) {
      navigationRef.current?.openCurrentFolder(folder)
      return
    }
    if (folder.status !== 2) {
      message.warning('文件转码中无法预览,请尝试刷新')
      return
    }
    previewRef.current?.showPreview(folder, 'share')
  }
  // 下载文件
  const download = async (fileId: string) => {
    // 创建下载链接
    try {
      const downloadUrl = await shareCreateDownLoadUrl(
        fileId,
        params.shareId as string
      )
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
  const [shareInfo, setShareInfo] = useState<shareInfoType>()
  useEffect(() => {
    getShareInfo()
  }, [])
  const getShareInfo = async () => {
    try {
      const res = await getShareLoginInfo(params.shareId as string)

      if (res?.code !== 200) {
        return
      }
      setShareInfo(res.data)
    } catch (error: any) {
      if (error.showError) {
        message.error(error.msg)
        navigate('/')
      }
    }
  }
  const saveMyPan = (file?: DataList) => {
    setCurrentFile(file)
    setModelConfig({
      ...modelConfig,
      show: true,
    })
  }
  const moveFolderDone = async (currentChildFolder: DataList) => {
    let fileIdsList: any[] = []
    if (selectedRow.length > 0) {
      fileIdsList = selectedRow.map((item) => item.fileId)
    } else if (currentFile) {
      fileIdsList = []
      fileIdsList.push(currentFile.fileId)
    }
    try {
      const res = await saveShareFile(
        params.shareId as string,
        fileIdsList,
        currentChildFolder.fileId
      )
      if (res?.code !== 200) {
        return
      }
      setModelConfig({
        ...modelConfig,
        show: false,
      })
      setCurrentFile(undefined)
      setSelectedRow([])
      setSelectedRowKeysA([])
      message.success('保存成功')
    } catch (error: any) {
      if (error.showError) {
        message.error(error.msg)
      }
    }
  }
  return (
    <div>
      <div className="w-full fixed bg-blue-400 h-[50px]">
        <div className="w-[70%] m-auto text-[#fff] leading-[50px]">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            <span className="iconfont icon-pan text-[40px] text-[#fff]"></span>
            <div className="font-bold ml-[5px] text-[25px] text-[#fff]">
              Pan
            </div>
          </div>
        </div>
      </div>
      <div className="w-[70%] m-auto pt-[50px]">
        <div className="mt-[20px] flex justify-around border-b-[1px] border-b-[#ddd] pb-[10px]">
          <div className="flex-1 flex items-center">
            <Avatar
              width={50}
              avatar={shareInfo?.avatar as string}
              userId={shareInfo?.userId as string}
              timeStamp={new Date().getTime()}
            ></Avatar>
            <div className="ml-[10px]">
              <div className="flex items-center">
                <span className="text-[15px]">{shareInfo?.nickName}</span>
                <span className="text-[12px] ml-[20px]">
                  分享于：{shareInfo?.expireTime}
                </span>
              </div>
              <div className="mt-[10px] text-[12px]">
                分享文件：{shareInfo?.fileName}
              </div>
            </div>
          </div>
          <div>
            {shareInfo?.currentUser ? (
              <Button
                type="primary"
                disabled={selectedRow.length === 0}
                icon={<StopOutlined />}
              >
                取消分享
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={() => saveMyPan()}
                icon={<LogoutOutlined />}
                disabled={selectedRow.length === 0}
              >
                保存到网盘中
              </Button>
            )}
          </div>
        </div>
        <Navigation
          adminShow={true}
          isWatchPath={true}
          ref={navigationRef}
          shareId={params.shareId}
          loadList={loadList}
        ></Navigation>

        <div className={`${style.wrapper}`}>
          <GlobalTable option={option} data={data}></GlobalTable>
        </div>
        <FolderSelect
          modelConfig={modelConfig}
          files={selectedRow.length > 0 ? selectedRow : currentFile}
          moveFolderDone={moveFolderDone}
        ></FolderSelect>
        <Preview ref={previewRef as any}></Preview>
      </div>
    </div>
  )
}
export default ShareView
