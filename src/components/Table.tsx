import {
  PaginationProps,
  Table,
  TableColumnType,
  TablePaginationConfig,
} from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import React, { useEffect, useState } from 'react'
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
  useEffect(() => {
    option.loadListFunc()
  }, [
    (option.pagination as any).pageSize,
    (option.pagination as any).current,
    (option.pagination as any).total,
  ])
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
