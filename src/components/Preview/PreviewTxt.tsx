import { getFileInfo } from '@/api'
import { Button, Select, SelectProps } from 'antd'
import React, { useEffect, useState } from 'react'

const PreviewTxt: React.FC<{
  fileId: string
}> = (props) => {
  const { fileId } = props
  const [content, setContent] = useState('')
  const [originContent, setOriginContent] = useState('')
  const options: SelectProps['options'] = [
    {
      label: 'urf8编码',
      value: 'utf-8',
    },
    {
      label: 'GBK编码',
      value: 'gb2312',
    },
  ]
  useEffect(() => {
    initContent()
  }, [])
  const handleChange = (value: string | string[]) => {
    setContent(arrayBufferToString(originContent, value as string))
  }
  const initContent = async () => {
    const res = await getFileInfo(fileId, 'arraybuffer')
    setOriginContent(res as any)
    setContent(arrayBufferToString(res))
  }
  const arrayBufferToString = (buffer: any, encoding = 'utf-8') => {
    const decoder = new TextDecoder(encoding)
    return decoder.decode(buffer)
  }
  return (
    <div className="w-full">
      <div className="flex items-center justify-around">
        <div className="flex-1 flex items-center m-[5px_10px]">
          <Select
            size="middle"
            defaultValue="utf8编码"
            onChange={handleChange}
            style={{ width: 200 }}
            options={options}
          />
          <div className="ml-2 text-[#828282]">乱码了切换编码试试看</div>
        </div>
        <div className="mr-2">
          <Button type="primary">复制</Button>
        </div>
      </div>
      <div className="m-0">
        <div className="overflow-x-auto p-[20px]">{content}</div>
      </div>
    </div>
  )
}
export default PreviewTxt
