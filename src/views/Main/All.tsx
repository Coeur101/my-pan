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
  TableColumnProps,
  Upload,
  UploadProps,
  message,
} from 'antd'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import style from '../style/all.module.scss'
import GlobalTable, { OptionType } from '@/components/Table'
import { PaginationProps } from 'antd/lib'
import { getFileList } from '@/api'
import { InputRef, SearchProps } from 'antd/es/input'
import Icon from '@/components/Icon'
import { formatFileSize } from '@/utils/formatFileSize'
import { useLocation, useNavigate } from 'react-router-dom'
interface DataList {
  fileId?: string
  filePid?: string | number
  fileSize?: number | string
  fileName?: string
  fileCover?: string
  createTime?: string
  lastUpdateTime?: string
  folderType?: number
  fileCategory?: number
  fileType?: number
  status?: number
  key: number | string
  editStatus?: boolean
  fileNameComple?: string
}
const All: React.FC<any> = (props) => {
  // const aa = useContext(RouterContent)
  const upProps: UploadProps = {
    hasControlInside: true,
    capture: 'environment',
    multiple: true,
    customRequest: () => {},
    showUploadList: false,
    withCredentials: true,
    accept: '',
  }
  const navigate = useNavigate()
  const location = useLocation()
  const [pageNo, setPageNo] = useState('1')
  const [pageSize, setPageSize] = useState('15')
  const [catagory, setCatagory] = useState<
    'all' | 'video' | 'music' | 'image' | 'doc' | 'others'
  >('all')

  const editInputRef = useRef<InputRef>(null)
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

  const colums: TableColumnProps<any>[] = [
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
                  value={record.fileNameComple || record.fileName}
                  maxLength={190}
                ></Input>
                <span className="iconfont icon-right1 ml-[10px] block  bg-btn-primary text-white p-[3px_3px] rounded-md cursor-pointer"></span>
                <span className="iconfont icon-error ml-[10px] block bg-btn-primary text-white p-[3px_3px] rounded-md cursor-pointer"></span>
              </div>
            ) : (
              <span className="flex-1 flex overflow-hidden items-center gap-2 cursor-pointer whitespace-nowrap ml-[8px]">
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
                <span className="iconfont cursor-pointer hover:text-blue-400 icon-del text-[12px] ml-[10px]">
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
                <span className="iconfont cursor-pointer hover:text-blue-400 icon-move text-[12px] ml-[10px]">
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
        return <div>{formatFileSize(recorde.fileSize as number) || 0}</div>
      },
      align: 'left',
    },
  ]
  const [total, setTotal] = useState(0)
  const loadList = async (fileFuzzName: string) => {
    try {
      const res = await getFileList(catagory, pageNo, pageSize, fileFuzzName)
      if (res?.code !== 200) {
        return
      }
      setData(res?.data?.list)
      setTotal(res.data.totalCount)
    } catch (error) {}
  }
  const [selectedRow, setSelectedRow] = useState<DataList[]>([])
  const option = useMemo<OptionType>(() => {
    return {
      bordered: true,
      loading: false,
      selectType: {
        onChange(selectedRowKeysA: React.Key[], slectedRows: DataList[]) {
          setSelectedRow(slectedRows)
        },
      },
      pagination: {
        pageSize: 15,
        pageSizeOptions: [15, 30, 50, 100],
        total: total,
        showTotal: (total: number) => {
          return `共${total}条`
        },
        hideOnSinglePage: false,
      } as PaginationProps,
      tableHeght: 400,
      colums,
      loadListFunc: loadList,
    }
  }, [pageNo, pageSize, total])

  const [data, setData] = useState<DataList[]>([
    // {
    //   fileName: '123123',
    //   fileSize: '2333',
    //   lastUpdateTime: '2024-01-15 20:51:18',
    //   status: 2,
    //   fileType: 1,
    //   key: '1',
    //   fileId: '123',
    // },
    // {
    //   fileName: '123123',
    //   fileSize: '2333',
    //   lastUpdateTime: '2024-01-15 20:51:18',
    //   key: '2',
    // },
    // {
    //   fileName: '123123',
    //   fileSize: '2333',
    //   lastUpdateTime: '2024-01-15 20:51:18',
    //   key: '3',
    // },
    // {
    //   fileName: '123123',
    //   fileSize: '2333',
    //   lastUpdateTime: '2024-01-15 20:51:18',
    //   key: '4',
    // },
    // {
    //   fileName: '123123',
    //   fileSize: '2333',
    //   lastUpdateTime: '2024-01-15 20:51:18',
    //   key: '5',
    // },
    // {
    //   fileName: '123123',
    //   fileSize: '2333',
    //   lastUpdateTime: '2024-01-15 20:51:18',
    //   key: '6',
    // },
    // {
    //   fileName: '123123',
    //   fileSize: '2333',
    //   lastUpdateTime: '2024-01-15 20:51:18',
    //   key: '7',
    // },
    // {
    //   fileName: '123123',
    //   fileSize: '2333',
    //   lastUpdateTime: '2024-01-15 20:51:18',
    //   key: '8',
    // },
  ])
  useEffect(() => {
    editInputRef.current?.focus({
      cursor: 'all',
    })
  }, [data])
  useEffect(() => {
    setCatagory(location.pathname.split('/')[2] as any)
  }, [location])
  const onSearch: SearchProps['onSearch'] = (value) => {
    loadList(value)
  }
  const handleEdit = (row: DataList) => {
    setData((prevData) => {
      return prevData.map((item) => {
        return item.key === row.key
          ? { ...item, editStatus: !item.editStatus }
          : { ...item, editStatus: false }
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
          editStatus: true,
        },
        ...prevData,
      ]
    })
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
        >
          批量删除
        </Button>
        <Button
          type="default"
          className={style.moveBtn}
          icon={<DragOutlined />}
        >
          批量移动
        </Button>
        <div className="ml-[10px] w-[300px]">
          <Input.Search
            placeholder="输入文件名搜索"
            onSearch={onSearch}
          ></Input.Search>
        </div>
        <div className="iconfont icon-refresh text-[#636d7e] cursor-pointer ml-[10px]"></div>
      </div>
      <div className="">全部文件</div>
      <div className={`${style.wrapper} mt-[10px]`}>
        <GlobalTable option={option} data={data}></GlobalTable>
      </div>
    </div>
  )
}
export default All
