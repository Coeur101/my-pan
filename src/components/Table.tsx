import {
  PaginationProps,
  Table,
  TableColumnType,
  TablePaginationConfig,
} from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
export type OptionType = {
  selectType?: TableRowSelection<any>
  bordered: boolean
  loading: boolean
  tableHeght?: number
  pagination: false | PaginationProps
  colums: TableColumnType<any>[]
  loadListFunc: (...args: any) => void
}
interface TableProps {
  option: OptionType
  handleRowOption?: any
  data: any
}
const GlobalTable: React.FC<TableProps> = ({
  option,
  handleRowOption,
  data,
}) => {
  const location = useLocation()
  useEffect(() => {
    option.loadListFunc('', location.pathname.split('/')[2] as string)
  }, [(option.pagination as any).pageSize, (option.pagination as any).current])
  return (
    <Table
      scroll={{ y: option.tableHeght || 260, scrollToFirstRowOnChange: true }}
      onRow={handleRowOption}
      loading={option.loading}
      pagination={option.pagination}
      rowSelection={option.selectType}
      columns={option.colums}
      dataSource={data}
    />
  )
}
export default GlobalTable
