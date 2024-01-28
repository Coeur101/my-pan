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
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import style from '../style/all.module.scss'
import GlobalTable, { OptionType } from '@/components/Table'
import { PaginationProps } from 'antd/lib'
import {
  changeFileFolder,
  delFiles,
  getFileList,
  newFoloder,
  reFileName,
} from '@/api'
import { InputRef, SearchProps } from 'antd/es/input'
import Icon from '@/components/Icon'
import { formatFileSize } from '@/utils/format'
import { useLocation, useNavigate } from 'react-router-dom'
import { ModelProps } from '@/components/GlobalModel'
import FolderSelect from './FolderSelect'
import Navigation from '@/components/Navigation'
import { FileListType } from './UploaderList'
import { flushSync } from 'react-dom'
import NoData from '@/components/Nodata'
interface DataList {
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
const All: React.FC<any> = (props) => {
  const acceptType = {
    video: 'video/*',
    doc: 'application/msword, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain, text/markdown, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    music: 'audio/*',
    image: 'image/*',
    all: '',
    others: '',
  }
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
  const [accept, setAccept] = useState('')
  const parentProps = useContext<{
    upLoadFile?: (...args: any) => void
  }>(RouterContent)
  const upProps: UploadProps = {
    hasControlInside: true,
    capture: 'environment',
    multiple: true,
    customRequest: (info) => {
      parentProps.upLoadFile!(info.file as Blob, currentFolder)
    },
    showUploadList: false,
    withCredentials: true,
    accept: accept,
  }
  const navigate = useNavigate()
  const location = useLocation()
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const [catagory, setCatagory] = useState<string>('all')
  const editInputRef = useRef<InputRef>(null)
  const [data, setData] = useState<DataList[]>([])
  const [currentFolder, setCurrentFolder] = useState('0')
  const [currentFile, setCurrentFile] = useState<DataList>()
  const url = new URLSearchParams(location.search)
  const navigationRef = useRef<{ openCurrentFolder: (...args: any) => void }>(
    null
  )
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
                <span
                  className="iconfont icon-right1 ml-[10px] block  bg-btn-primary text-white p-[3px_3px] rounded-md cursor-pointer"
                  onClick={() =>
                    handleInputValue(record, record.key, 'fileName')
                  }
                ></span>
                <span
                  className="iconfont icon-error ml-[10px] block bg-btn-primary text-white p-[3px_3px] rounded-md cursor-pointer"
                  onClick={() => {
                    handleCancel(record)
                  }}
                ></span>
              </div>
            ) : (
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
            )}

            {record.fileId && record.status === 2 ? (
              <div className="w-[280px]  hidden  group-hover:flex items-center ">
                <span className="iconfont cursor-pointer hover:text-blue-400 icon-share1 text-[12px] ml-[10px]">
                  <span className="ml-[5px]">分享</span>
                </span>
                {record.fileType === 0 ? (
                  <span className="iconfont cursor-pointer hover:text-blue-400 icon-download text-[12px] ml-[10px]">
                    <span className="ml-[5px]"> 下载</span>
                  </span>
                ) : null}
                <span
                  className="iconfont cursor-pointer hover:text-blue-400 icon-del text-[12px] ml-[10px]"
                  onClick={() => delFile(record.fileId)}
                >
                  <span className="ml-[5px]"> 删除</span>
                </span>
                <span
                  className="iconfont cursor-pointer hover:text-blue-400 icon-edit text-[12px] ml-[10px]"
                  onClick={() => {
                    handleEdit(record)
                  }}
                >
                  <span className="ml-[5px]">编辑</span>
                </span>
                <span
                  className="iconfont cursor-pointer hover:text-blue-400 icon-move text-[12px] ml-[10px]"
                  onClick={() => moveFile(record)}
                >
                  <span className="ml-[5px]">移动</span>
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
      width: 200,
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
      const res = await getFileList(
        catagory,
        pageNo,
        pageSize,
        fileFuzzName,
        filePid
      )
      if (res?.code !== 200) {
        return
      }
      setData(
        res?.data?.list.map((item: DataList, index: number) => {
          return {
            ...item,
            key: index,
          }
        })
      )
      setTotal(res.data.totalCount)
    } catch (error) {
    } finally {
      setTbaleLoading(false)
    }
  }
  const [selectedRow, setSelectedRow] = useState<DataList[]>([])
  const option = useMemo<OptionType>(() => {
    return {
      data: data,
      bordered: true,
      loading: tableLoading,
      selectType: {
        onChange(selectedRowKeysA: React.Key[], slectedRows: DataList[]) {
          setSelectedRow(slectedRows)
        },
      },
      pagination: {
        pageSize: 15,
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
        // hideOnSinglePage: false,
      } as PaginationProps,
      tableHeght: 400,
      colums,
    }
  }, [pageNo, pageSize, total, data, tableLoading])

  useEffect(() => {
    editInputRef.current?.focus({
      cursor: 'all',
    })
  }, [data])
  useEffect(() => {
    setCatagory(location.pathname.split('/')[2] as any)
    // 判断分类来设置上传文件的类型
    setAccept(
      (acceptType as Record<string, string>)[location.pathname.split('/')[2]]
    )
    if (location.pathname !== '/main/all') {
      return
    }
    if (url.get('path') || location.pathname === '/main/all') {
      let pathArray = url.get('path')?.split('/')
      loadList('', pathArray ? pathArray![pathArray!.length - 1] : '0')
    }
  }, [location, pageNo, pageSize])
  useEffect(() => {
    if (!url.get('path')) {
      loadList('')
    }
  }, [catagory, pageNo, pageSize])
  // 搜索
  const onSearch: SearchProps['onSearch'] = (value) => {
    loadList(value)
  }
  // 编辑
  const handleEdit = (row: DataList) => {
    setData((prevData) => {
      return prevData
        .map((item) => {
          return item.key === row.key
            ? { ...item, editStatus: !item.editStatus }
            : { ...item, editStatus: false }
        })
        .filter((item) => {
          return item.fileId !== ''
        })
    })
  }
  const handleNewFolder = () => {
    if (data.some((item) => item.editStatus)) {
      message.warning('请先取消或保存当前编辑行')
      return
    }

    setData((prevData) => {
      return [
        {
          fileName: '',
          fileSize: 0,
          fileType: 0,
          fileId: '',
          filePid: 0,
          status: 2,
          key: new Date().getTime(),
          lastUpdateTime: '',
          folderType: 1,
          fileNameComple: '',
          editStatus: true,
        },
        ...prevData,
      ]
    })
  }
  // 重命名文件
  const handleInputValue = async (
    row: DataList,
    key: React.Key,
    dataIndex: string
  ) => {
    try {
      let fileName = editInputRef.current?.input?.value.trim()
      if (
        editInputRef.current?.input?.value.indexOf('/') !== -1 ||
        editInputRef.current?.input?.value === ''
      ) {
        message.warning('不能有/且不能为空')
        return
      }
      let res: any = ''
      if (row.fileId === '') {
        res = await newFoloder(row.filePid as string, fileName as string)
      } else {
        res = await reFileName(row.fileId as string, fileName as string)
      }
      if (res.code !== 200) {
        return
      }
      fileName = res.data.fileName
      if (row.fileType === 0) {
        fileName =
          (fileName as string) + fileName?.substring(fileName?.lastIndexOf('.'))
      }
      setData((prevData) => {
        return prevData.map((item) => {
          return item.key === row.key
            ? { ...res.data, editStatus: false, key: res.data.fileId }
            : item
        })
      })
      setTotal(total + 1)
    } catch (error: any) {
      message.error(error.msg as string)
    }
  }
  // 取消编辑
  const handleCancel = (row: DataList) => {
    if (row.fileId) {
      setData((prevData) => {
        return prevData.map((item) => {
          return item.key === row.key
            ? {
                ...item,
                editStatus: false,
              }
            : { ...item, editStatus: false }
        })
      })
    } else {
      setData((prevData) => {
        return prevData.filter((item) => {
          return item.key !== row.key
        })
      })
    }
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
          resolve('')
          loadList('')
        }).catch((error) => {
          message.error(error)
        })
      },
      onCancel: () => {},
    })
  }
  // 移动文件
  const moveFile = async (file?: DataList) => {
    setCurrentFile(file)
    setModelConfig({
      ...modelConfig,
      show: true,
    })
  }
  // 找到要移动的文件在目标文件夹下是否存在
  const findCommonFile = (fileList: DataList[], childFileList: any[]) => {
    const commonObjects = []

    // 创建一个 Set 用于存储 arr1 中的所有值
    const set = new Set(fileList.map((obj) => obj.fileId))

    // 遍历 arr2，如果 arr2 中的任何对象的值在 set 中，则将其添加到 commonObjects 中
    for (const obj of childFileList) {
      if (set.has(obj.fileId)) {
        commonObjects.push(obj)
      }
    }

    return commonObjects
  }
  // 子组件弹窗移动文件
  const moveFolderDone = async (currentChildFolder: any) => {
    console.log(currentChildFolder?.fileId, currentFolder)
    if (!currentChildFolder?.fileId) {
      const errorFile =
        selectedRow.length > 0
          ? selectedRow.filter((item: any) => item.filePid === currentFolder)
          : currentFile?.filePid === currentFolder
      console.log(errorFile)

      if (
        (errorFile as DataList[]).length &&
        (errorFile as DataList[]).length > 0
      ) {
        message.warning(
          `有${
            (errorFile as DataList[]).length
          }个文件或文件夹已在当前文件夹下，无法移动`
        )
        return
      } else if (errorFile) {
        message.warning(`已在当前文件夹下，无法移动`)
        return
      }
    }
    let fileIdsList: any[] = []
    if (selectedRow.length > 0) {
      fileIdsList = selectedRow
    } else if (currentFile) {
      fileIdsList = []
      fileIdsList.push(currentFile)
    }
    // if(findCommonFile(data,fileIdsList)){

    // }
    console.log(currentChildFolder, currentFolder)

    if (currentChildFolder?.fileId === currentFolder) {
      message.warning('所选文件已在当前文件夹下，无法移动')
      return
    }

    try {
      const res = await changeFileFolder(
        fileIdsList.map((item) => item.fileId),
        currentChildFolder?.fileId as string
      )
      if (res?.code !== 200) {
        return
      }
      message.success('移动完成')
      setModelConfig({
        ...modelConfig,
        show: false,
      })

      if (url.get('path') || location.pathname === '/main/all') {
        let pathArray = url.get('path')?.split('/')
        loadList('', pathArray ? pathArray![pathArray!.length - 1] : '0')
      }
    } catch (error: any) {
      console.log(error)

      // message.error(error.info)
    }
  }
  // 点击文件夹进行下钻,点击文件就进行预览
  const openCurrentFolder = (folder: DataList) => {
    if (!folder.fileType) {
      setCurrentFolder(folder.fileId as string)
      loadList('', folder.fileId)
      navigationRef.current?.openCurrentFolder(folder)
    }
  }
  return (
    <div className={`${style.wrapper} mt-[20px]`}>
      <div className="flex items-center w-full">
        <div className="mr-[10px]">
          <Upload {...upProps}>
            <Button
              icon={<UploadOutlined />}
              type="primary"
              className="bg-btn-primary"
            >
              上传
            </Button>
          </Upload>
        </div>
        {catagory === 'all' ? (
          <Button
            onClick={() => handleNewFolder()}
            type="default"
            className={style.successBtn}
            icon={<FolderAddOutlined />}
          >
            新建文件夹
          </Button>
        ) : null}

        <Button
          danger
          icon={<DeleteOutlined />}
          className="mr-[10px]"
          type="primary"
          disabled={selectedRow.length !== 0 ? false : true}
          onClick={() => delFile()}
        >
          批量删除
        </Button>
        <Button
          type="default"
          className={style.moveBtn}
          icon={<DragOutlined />}
          disabled={selectedRow.length !== 0 ? false : true}
          onClick={() => moveFile()}
        >
          批量移动
        </Button>
        <div className="ml-[10px] w-[300px]">
          <Input.Search
            placeholder="输入文件名搜索"
            onSearch={onSearch}
          ></Input.Search>
        </div>
        <div
          className="iconfont icon-refresh text-[#636d7e] cursor-pointer ml-[10px]"
          onClick={() => loadList('')}
        ></div>
      </div>
      <Navigation
        isWatchPath={true}
        ref={navigationRef}
        loadList={loadList}
      ></Navigation>
      {data.length > 0 ? (
        <div className={`${style.wrapper}`}>
          <GlobalTable option={option} data={data}></GlobalTable>
        </div>
      ) : (
        <div>
          <NoData
            msg="当前目录为空，上传你的第一个文件吧"
            isOrigin={true}
          ></NoData>
          <div className="mt-[20px] flex justify-center items-center">
            <Upload {...upProps}>
              <div className="cursor-pointer text-center w-[100px] h-[100px] m-[0_10px] p-[5px_0px] bg-[rgba(241,241,241,0.5)]">
                <span className="w-[60px] h-[60px] inline-block rounded overflow-hidden">
                  <img
                    src={require('@/assets/easypan静态资源/icon-image/file.png')}
                    alt=""
                  />
                </span>
                <div>上传文件</div>
              </div>
            </Upload>
            {catagory === 'all' ? (
              <div
                className="cursor-pointer text-center w-[100px] h-[100px] m-[0_10px] p-[5px_0px] bg-[rgba(241,241,241,0.5)]"
                onClick={() => handleNewFolder()}
              >
                <span className="w-[60px] h-[60px] inline-block rounded overflow-hidden">
                  <img
                    src={require('@/assets/easypan静态资源/icon-image/folder.png')}
                    alt=""
                  />
                </span>
                <div>新建目录</div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <FolderSelect
        modelConfig={modelConfig}
        files={selectedRow.length > 0 ? selectedRow : currentFile}
        moveFolderDone={moveFolderDone}
      ></FolderSelect>
    </div>
  )
}
export default All
