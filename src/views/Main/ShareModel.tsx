import GlobalModel, { ModelProps } from '@/components/GlobalModel'
import { forwardRef, useEffect, useState } from 'react'
import { DataList } from './All'
import { Button, Form, Input, Radio, RadioChangeEvent } from 'antd'
import { shareFile } from '@/api/index'
import React from 'react'
import Clipboard from 'clipboard'
import message from '@/utils/message'
interface ShareModelProps {
  modelConfig: ModelProps
  fileInfo: DataList
  setShareModelButtons: () => void
}
type shareFile = {
  fileName: string
  indate: 0 | 1 | 2 | 3
  exportCodeTab: 0 | 1
  exportCode: ''
}
const ShareModel = forwardRef(
  (
    props: ShareModelProps,
    ref: React.ForwardedRef<{ createShareUrl: () => any }>
  ) => {
    const { modelConfig, fileInfo, setShareModelButtons } = props
    const [shareUrlForm] = Form.useForm<shareFile>()
    const [isShareSuccess, setIsShareSuccess] = useState(false)
    const [shareUrl, setShareUrl] = useState('')
    const [code, setCode] = useState('')
    const [isCustomExportCode, setIsCustomExportCode] = useState(1)
    const transExportCode = (e: RadioChangeEvent) => {
      setIsCustomExportCode(e.target.value)
    }
    useEffect(() => {
      ;(shareUrlForm as any).resetFields()
      if (!modelConfig.show) {
        setIsShareSuccess(false)
      }
    }, [modelConfig])
    useEffect(() => {
      const clipboard = new Clipboard('.copyShareUrlBtn', {
        text: () => `链接:${shareUrl}\n提取码:${code}`,
      })
      clipboard.on('success', () => {
        message.success('复制成功')
      })
      return () => {
        clipboard.destroy()
      }
    }, [shareUrl])

    const createShareUrl = async () => {
      try {
        await (shareUrlForm as any).validateFields()

        const res = await shareFile(
          fileInfo.fileId as string,
          (shareUrlForm as any).getFieldsValue(['exportCodeTab']).exportCodeTab,
          (shareUrlForm as any).getFieldsValue(['indate']).indate,
          (shareUrlForm as any).getFieldsValue(['exportCode']).exportCode
        )
        if (res?.code !== 200) {
          return
        }
        setIsShareSuccess(true)
        // 获取当前域名
        const domain = window.location.origin // 获取当前页面的域名部分
        const fullShareUrl = `${domain}/share/${res.data.shareId}`
        setShareUrl(fullShareUrl)
        // button按钮改变
        setShareModelButtons()
        setCode(res.data.code)
      } catch (error) {
        console.log(error)
      }
    }
    React.useImperativeHandle(ref, () => {
      return {
        createShareUrl,
      }
    })
    return (
      <GlobalModel {...modelConfig}>
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          form={shareUrlForm}
          wrapperCol={{ span: 15 }}
          style={{ maxWidth: 650 }}
          autoComplete="off"
        >
          <Form.Item<shareFile> label="文件">
            <div>{fileInfo && fileInfo.fileName}</div>
          </Form.Item>
          {isShareSuccess ? (
            <>
              <Form.Item label="分享链接">
                <div>{shareUrl}</div>
              </Form.Item>
              <Form.Item label="提取码">
                <div>{code}</div>
              </Form.Item>
              <Form.Item className="ml-[100px] w-[300px]">
                <Button type="primary" className="copyShareUrlBtn">
                  复制链接和提取码
                </Button>
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item<shareFile>
                label="有效期"
                name="indate"
                rules={[{ required: true, message: '请选择有效期' }]}
              >
                <Radio.Group>
                  <Radio value={0}>1天</Radio>
                  <Radio value={1}>7天</Radio>
                  <Radio value={2}>30天</Radio>
                  <Radio value={3}>永久有效</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item<shareFile>
                name="exportCodeTab"
                label="提取码"
                rules={[{ required: true, message: '请选择提取码方式' }]}
              >
                <Radio.Group onChange={transExportCode}>
                  <Radio value={0}>自定义</Radio>
                  <Radio value={1}>系统生成</Radio>
                </Radio.Group>
              </Form.Item>
              {isCustomExportCode === 0 ? (
                <Form.Item<shareFile>
                  name="exportCode"
                  rules={[
                    { required: true, message: '请输入提取码' },
                    { max: 5, min: 5, message: '请输入5位提取码' },
                  ]}
                  className="ml-[100px] w-[300px]"
                >
                  <Input placeholder="请输入5位提取码" maxLength={5}></Input>
                </Form.Item>
              ) : null}
            </>
          )}
        </Form>
      </GlobalModel>
    )
  }
)
export default ShareModel
