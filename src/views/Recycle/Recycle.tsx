import { Button, PaginationProps, TableColumnProps } from 'antd'
import style from '../style/all.module.scss'
import { DeleteFilled, ReloadOutlined } from '@ant-design/icons'
import GlobalTable, { OptionType } from '@/components/Table'
import { useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import Icon from '@/components/Icon'
import { completelyDelFile, getRecycleFileList, handleRecoverFile } from '@/api'
import message from '@/utils/message'
import { formatFileSize } from '@/utils/format'
interface DataList {
  fileId: string
  filePid: string
  fileSize: number
  fileName: string
  fileCover: string
  lastUpdateTime: string
  folderType: number
  fileCategory: number
  fileType: number
  status: number
}
const Recycle = () => {
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const [total, setTotal] = useState(0)
  const [tableLoading, setTbaleLoading] = useState(false)
  const [selectedRowKeysA, setSelectedRowKeysA] = useState<React.Key[]>([])
  const [selectedRow, setSelectedRow] = useState<DataList[]>([])
  const [data, setData] = useState<DataList[]>([])
  const colums: TableColumnProps<DataList>[] = [
    {
      key: 1,
      title: '文件名',
      dataIndex: 'fileName',
      align: 'left',
      render: (text: string, record: DataList, index: number) => {
        return (
          <div className=" hover:text-blue-700  h-[44px] flex items-center  group">
            {DisplayIcon(record.fileType as number, record)}
            <span className="flex-1 flex overflow-hidden items-center gap-2 cursor-pointer whitespace-nowrap ml-[8px]">
              <span className="cursor-pointer">{text}</span>
            </span>
            <div className="w-[280px]  hidden  group-hover:flex items-center ">
              <span
                className="iconfont cursor-pointer hover:text-blue-400 icon-revert text-[12px] ml-[10px]"
                onClick={() => {
                  recoverFile(record.fileId)
                }}
              >
                <span className="ml-[5px]">还原</span>
              </span>

              <span
                className="iconfont cursor-pointer hover:text-blue-400 icon-del text-[12px] ml-[10px]"
                onClick={() => {
                  deleteFile(record.fileId)
                }}
              >
                <span className="ml-[5px]">删除</span>
              </span>
            </div>
          </div>
        )
      },
    },
    {
      key: 2,
      title: '删除时间',
      dataIndex: 'recoveryTime',
      width: 220,
      align: 'left',
    },
    {
      key: 3,
      title: '大小',
      dataIndex: 'fileSize',
      render: (text: string, recorde: DataList, index: number) => {
        return <div>{formatFileSize((recorde.fileSize as number) || 0)}</div>
      },
      width: 220,
      align: 'left',
    },
  ]
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
  // 文件图标
  const DisplayIcon = (type: number, row: DataList) => {
    if (type === 3 || type === 1) {
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
  const loadList = async () => {
    try {
      setTbaleLoading(true)
      const res = await getRecycleFileList(pageNo, pageSize)
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
  const recoverFile = async (fileId?: string) => {
    let fileIds: string[] = []
    if (fileId) {
      fileIds.push(fileId as string)
    } else {
      fileIds = selectedRow.map((item) => item.fileId)
    }
    try {
      const res = await handleRecoverFile(fileIds)
      if (res?.code !== 200) {
        return
      }
      setSelectedRowKeysA([])
      setSelectedRow([])
      message.success('恢复文件成功')
      loadList()
    } catch (error) {}
  }
  const deleteFile = async (fileId?: string) => {
    let fileIds: string[] = []
    if (fileId) {
      fileIds.push(fileId as string)
    } else {
      fileIds = selectedRow.map((item) => item.fileId)
    }
    try {
      const res = await completelyDelFile(fileIds)
      if (res?.code !== 200) {
        return
      }
      setSelectedRowKeysA([])
      setSelectedRow([])
      message.success('删除成功')
      loadList()
    } catch (error) {
      message.error(error as any)
    }
  }
  const saveSelectedKeys = (keys: React.Key[]) => {
    setSelectedRowKeysA(keys)
  }
  useEffect(() => {
    loadList()
    saveSelectedKeys(selectedRowKeysA)
  }, [pageSize, pageNo])
  return (
    <div className={`${style.wrapper} mt-[20px]`}>
      <div className="flex items-center ml-[10px]">
        <div className="mr-[10px]">
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            disabled={selectedRowKeysA.length === 0}
            onClick={() => {
              recoverFile()
            }}
            className={style.successBtn}
          >
            还原
          </Button>
        </div>
        <div className="mr-[10px]">
          <Button
            type="primary"
            icon={<DeleteFilled />}
            disabled={selectedRowKeysA.length === 0}
            onClick={() => {
              deleteFile()
            }}
            danger
          >
            彻底删除
          </Button>
        </div>
      </div>
      <div className={`${style.wrapper}`}>
        <GlobalTable option={option} data={data}></GlobalTable>
      </div>
    </div>
  )
}
export default Recycle
