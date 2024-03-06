import { Button, Modal, PaginationProps, TableColumnProps } from 'antd'
import style from '../style/all.module.scss'
import { StopOutlined } from '@ant-design/icons'
import GlobalTable, { OptionType } from '@/components/Table'
import { useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import Icon from '@/components/Icon'
import { cancelShareUrl, getShareFileList } from '@/api'
import message from '@/utils/message'
interface DataList {
  shareId: string
  fileId: string
  userId: string
  validType: number
  expireTime: string
  shareTime: string
  code: string
  showCount: number
  fileName: string
  folderType: number
  fileCategory: number
  fileType: number
  fileCover: string
}
const Share = () => {
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
                className="iconfont cursor-pointer hover:text-blue-400 icon-link text-[12px] ml-[10px]"
                onClick={() => {
                  copyUrl(record)
                }}
              >
                <span className="ml-[5px]">复制链接</span>
              </span>

              <span
                className="iconfont cursor-pointer hover:text-blue-400 icon-cancel text-[12px] ml-[10px]"
                onClick={() => {
                  cancelShare(record.shareId)
                }}
              >
                <span className="ml-[5px]"> 取消分享</span>
              </span>
            </div>
          </div>
        )
      },
    },
    {
      key: 2,
      title: '分享时间',
      dataIndex: 'shareTime',
      width: 220,
      align: 'left',
    },
    {
      key: 3,
      title: '失效时间',
      dataIndex: 'expireTime',
      width: 220,
      render: (text: string, recorde: DataList) => {
        return <div>{recorde.expireTime ? recorde.expireTime : '永久'}</div>
      },
      align: 'left',
    },
    {
      key: 4,
      title: '浏览次数',
      dataIndex: 'showCount',
      width: 100,
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
      const res = await getShareFileList(pageNo, pageSize)
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
  const copyUrl = (file: DataList) => {
    const domain = window.location.origin // 获取当前页面的域名部分
    const fullShareUrl = `${domain}/shareView/${file.shareId}`
    const copyText = `链接:${fullShareUrl}\n提取码:${file.code}`
    navigator.clipboard.writeText(copyText).then(() => {
      message.success('复制链接成功')
    })
  }
  const cancelShare = (shareId?: string) => {
    let shareIds: string[] = []
    if (shareId) {
      shareIds.push(shareId)
    } else {
      shareIds = selectedRow.map((item) => item.shareId)
    }
    Modal.confirm({
      title: '提示',
      content: '确定要取消分享吗？',
      style: {
        top: 200,
      },
      onOk: async () => {
        return new Promise(async (resolve, reject) => {
          try {
            const res = await cancelShareUrl(shareIds)
            if (res?.code !== 200) {
              reject(res?.info)
            }
            resolve('')
            setSelectedRow([])
            setSelectedRowKeysA([])
            message.success('取消分享成功')
            loadList()
          } catch (error) {
            message.error(error as any)
          }
        })
      },
    })
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
            icon={<StopOutlined />}
            disabled={selectedRowKeysA.length === 0}
            onClick={() => {
              cancelShare()
            }}
          >
            取消分享
          </Button>
        </div>
      </div>
      <div className={`${style.wrapper}`}>
        <GlobalTable option={option} data={data}></GlobalTable>
      </div>
    </div>
  )
}
export default Share
