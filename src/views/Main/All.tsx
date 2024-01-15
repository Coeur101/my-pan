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
} from 'antd'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import style from '../style/all.module.scss'
import GlobalTable, { OptionType } from '@/components/Table'
import { PaginationProps } from 'antd/lib'
import { getFileList } from '@/api'
type DataList = {
  fileName: string
  fileSize: string
  lastUpdateTime: string
  key: number | string
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
  const [pageNo, setPageNo] = useState('1')
  const [pageSize, setPageSize] = useState('15')
  const colums: TableColumnProps<any>[] = [
    {
      key: 1,
      title: '文件名',
      dataIndex: 'fileName',
      align: 'left',
      render: (text: string, record: DataList, index: number) => {
        return (
          <div className="cursor-pointer hover:text-blue-700 font-bold">
            {text}
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
      align: 'left',
    },
  ]
  const [total, setTotal] = useState(0)
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
    }
  }, [pageNo, pageSize, total])

  const [data, setData] = useState<DataList[]>([
    {
      fileName: '123123',
      fileSize: '2333',
      lastUpdateTime: '2024-01-15 20:51:18',
      key: '1',
    },
    {
      fileName: '123123',
      fileSize: '2333',
      lastUpdateTime: '2024-01-15 20:51:18',
      key: '2',
    },
    {
      fileName: '123123',
      fileSize: '2333',
      lastUpdateTime: '2024-01-15 20:51:18',
      key: '3',
    },
    {
      fileName: '123123',
      fileSize: '2333',
      lastUpdateTime: '2024-01-15 20:51:18',
      key: '4',
    },
    {
      fileName: '123123',
      fileSize: '2333',
      lastUpdateTime: '2024-01-15 20:51:18',
      key: '5',
    },
    {
      fileName: '123123',
      fileSize: '2333',
      lastUpdateTime: '2024-01-15 20:51:18',
      key: '6',
    },
    {
      fileName: '123123',
      fileSize: '2333',
      lastUpdateTime: '2024-01-15 20:51:18',
      key: '7',
    },
    {
      fileName: '123123',
      fileSize: '2333',
      lastUpdateTime: '2024-01-15 20:51:18',
      key: '8',
    },
  ])
  const loadList = async () => {
    try {
      const res = await getFileList('all', pageNo, pageSize, '')
      if (res?.code !== 200) {
        return
      }
      setData(res?.data?.list)
      setTotal(res.data.totalCount)
    } catch (error) {}
  }
  useEffect(() => {
    loadList()
  }, [pageNo, pageSize])
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
        <Button
          type="default"
          className={style.successBtn}
          icon={<FolderAddOutlined />}
        >
          上传文件夹
        </Button>
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
          <Input.Search placeholder="输入文件名搜索"></Input.Search>
        </div>
        <div className="iconfont icon-refresh text-[#636d7e] cursor-pointer ml-[10px]"></div>
      </div>
      <div className="">全部文件</div>
      <div className="mt-[10px]">
        <GlobalTable
          option={option}
          data={data}
          handleRowOption={(row: any) => {
            return {
              onClick: () => {
                console.log(row)
              },
            }
          }}
        ></GlobalTable>
      </div>
    </div>
  )
}
export default All
