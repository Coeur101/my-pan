import {
  PaginationProps,
  Table,
  TableColumnType,
  TablePaginationConfig,
} from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import React, { useState } from 'react'
export type OptionType = {
  selectType?: TableRowSelection<any>
  bordered: boolean
  loading: boolean
  tableHeght?: number
  pagination: false | PaginationProps
  colums: TableColumnType<any>[]
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
