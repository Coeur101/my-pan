import { PaginationProps, Table, TableColumnType } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import React from 'react'
import { useLocation } from 'react-router-dom'
export type OptionType = {
  selectType?: TableRowSelection<any>
  bordered: boolean
  loading: boolean
  tableHeght?: number
  pagination: false | PaginationProps
  colums: TableColumnType<any>[]
  data: any
}
interface TableProps {
  option: OptionType
  handleRowOption?: any
  data: any
}
const GlobalTable: React.FC<TableProps> = ({ option, handleRowOption }) => {
  return (
    <Table
      scroll={{ y: option.tableHeght || 260, scrollToFirstRowOnChange: true }}
      onRow={handleRowOption}
      loading={option.loading}
      pagination={option.pagination}
      rowSelection={option.selectType}
      columns={option.colums}
      dataSource={option.data}
    />
  )
}
export default GlobalTable
