import { CheckOutlined, CopyOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { FC, useEffect, useState } from 'react'
const ChatCopy: FC<{
  content: string
  className: string
}> = (props) => {
  const { content, className } = props
  const [btnStatus, setBtnStatus] = useState<
    'copy' | 'loading' | 'success' | 'error'
  >('copy')
  const btnTips = {
    copy: '复制全文',
    loading: '',
    success: '已复制到剪贴板！',
    error: '复制失败！',
  }
  const copy = () => {
    setBtnStatus('loading')
    navigator.clipboard
      .writeText(content)
      .then(() => setTimeout(() => setBtnStatus('success'), 150))
      .catch(() => setBtnStatus('error'))
      .finally(() => setTimeout(() => setBtnStatus('copy'), 1500))
  }
  return (
    <div className={className}>
      <Button
        icon={btnStatus === 'success' ? <CheckOutlined /> : <CopyOutlined />}
        className="text-[14px] text-[#999]"
        type="text"
        loading={btnStatus === 'loading'}
        onClick={() => {
          copy()
        }}
        size="middle"
      >
        {btnTips[btnStatus]}
      </Button>
    </div>
  )
}
export default ChatCopy
