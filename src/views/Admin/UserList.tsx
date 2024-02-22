import {
  Button,
  Divider,
  Input,
  Modal,
  PaginationProps,
  Select,
  SelectProps,
  Space,
  TableColumnProps,
  Tooltip,
} from 'antd'
import style from '../style/all.module.scss'
import GlobalTable, { OptionType } from '@/components/Table'
import { useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { getAllUserList, getRecycleFileList } from '@/api'
import { formatFileSize } from '@/utils/format'
import _ from 'lodash'
import Avatar from '@/components/Avatar'
interface DataList {
  userId: string
  nickName: string
  email: string
  qqAvatar?: any
  joinTime: string
  lastLoginTime: string
  status: number
  useSpace: number
  totalSpace: number
}
const UserList = () => {
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const [total, setTotal] = useState(0)
  const [tableLoading, setTbaleLoading] = useState(false)
  const [data, setData] = useState<DataList[]>([])
  const [userName, SetUserName] = useState('')
  const [userStatus, setUserStatus] = useState('')
  const colums: TableColumnProps<DataList>[] = [
    {
      key: 1,
      title: '头像',
      dataIndex: 'qqAvatar',
      align: 'center',
      width: 80,
      render: (text: string, record: DataList, index: number) => {
        return (
          <div className=" justify-center h-[44px] flex items-center ">
            <Avatar
              userId={record.userId || ''}
              avatar={record.qqAvatar || ''}
              timeStamp={new Date().getTime()}
              width={30}
            ></Avatar>
          </div>
        )
      },
    },
    {
      key: 2,
      title: '昵称',
      dataIndex: 'nickName',
      width: 100,
      render: (text: string, record: DataList, index: number) => {
        return (
          <Tooltip title={text}>
            <div className="w-full whitespace-nowrap overflow-hidden overflow-ellipsis">
              {text}
            </div>
          </Tooltip>
        )
      },
      align: 'left',
    },
    {
      key: 3,
      title: '邮箱',
      dataIndex: 'email',
      width: 150,
      align: 'left',
    },
    {
      key: 4,
      title: '空间使用',
      dataIndex: 'useSpace',
      render: (text: number, record: DataList, index: number) => {
        return (
          <div>
            {formatFileSize(text) + '/' + formatFileSize(record.totalSpace)}
          </div>
        )
      },
      width: 150,
      align: 'left',
    },
    {
      key: 5,
      title: '加入时间',
      dataIndex: 'joinTime',

      width: 150,
      align: 'left',
    },
    {
      key: 6,
      title: '最后登录时间',
      dataIndex: 'lastLoginTime',

      width: 150,
      align: 'left',
    },
    {
      key: 7,
      title: '状态',
      dataIndex: 'status',
      render: (text: string, record: DataList, index: number) => {
        return (
          <div className="text-center">
            {record.status === 1 ? (
              <div className="text-green-500">启用</div>
            ) : (
              <div className="text-red-400">禁用</div>
            )}
          </div>
        )
      },
      width: 70,
      align: 'center',
    },
    {
      key: 8,
      title: '操作',
      dataIndex: 'status',
      render: (text: string, record: DataList, index: number) => {
        return (
          <div>
            <Space size={0}>
              <Button type="link">分配空间</Button>
              <Divider type="vertical" />
              <Button type="link">
                {record.status === 1 ? '禁用' : '启用'}
              </Button>
            </Space>
          </div>
        )
      },

      align: 'center',
    },
  ]
  const option = useMemo<OptionType>(() => {
    return {
      data: data,
      bordered: true,
      loading: tableLoading,
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
  }, [pageNo, pageSize, total, data, tableLoading])
  const selectOption: SelectProps['options'] = [
    {
      label: '启用',
      value: '1',
    },
    {
      label: '禁用',
      value: '0',
    },
  ]
  const loadList = async () => {
    try {
      setTbaleLoading(true)
      const res = await getAllUserList(pageNo, pageSize, userStatus, userName)
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
  const handleUserNameChange = (value: React.ChangeEvent<HTMLInputElement>) => {
    console.log(value.currentTarget.defaultValue)
    SetUserName(value.currentTarget.defaultValue)
  }
  const handleUserStatusChange = (value: string) => {
    setUserStatus(value)
  }

  const handleSearch = () => {
    loadList()
  }
  useEffect(() => {
    loadList()
  }, [pageSize, pageNo])
  return (
    <div className={`${style.wrapper} mt-[20px]`}>
      <div className="flex items-center ml-[10px]">
        <div className="mr-[10px]">
          <Space>
            用户昵称:
            <Input
              placeholder="输入用户名称"
              onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleUserNameChange(e)
              }}
              allowClear
            ></Input>
            状态:
            <Select
              size="middle"
              optionFilterProp="children"
              placeholder="选择状态"
              onChange={handleUserStatusChange}
              style={{ width: 200 }}
              allowClear
              options={selectOption}
            />
            <Button type="primary" onClick={handleSearch}>
              查询
            </Button>
          </Space>
        </div>
      </div>
      <div className={`${style.wrapper}`}>
        <GlobalTable option={option} data={data}></GlobalTable>
      </div>
    </div>
  )
}
export default UserList
