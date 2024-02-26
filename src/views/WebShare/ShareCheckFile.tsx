import { getShareFileInfo, verifyShareId } from '@/api'
import Avatar from '@/components/Avatar'
import { Button, Form, Input, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
interface codeFormType {
  code: string
}
interface shareInfoType {
  shareTime: string
  expireTime: string
  nickName: string
  fileName: string
  currentUser?: any
  fileId: string
  avatar: string
  userId: string
}
const ShareCheckFile = () => {
  const [shareInfo, setShareInfo] = useState<shareInfoType>()
  const params = useParams()
  const navigate = useNavigate()
  const [shareCodeForm] = Form.useForm<codeFormType>()
  useEffect(() => {
    getShareInfo()
  }, [])
  const getShareInfo = async () => {
    try {
      const res = await getShareFileInfo(params.shareId as string)
      if (res?.code !== 200) {
        return
      }
      setShareInfo(res.data)
    } catch {}
  }
  const getFile = async () => {
    try {
      await (shareCodeForm as any).validateFields()
      const res = await verifyShareId(
        params.shareId as string,
        (shareCodeForm as any).getFieldsValue(['code']).code
      )
      if (res?.code !== 200) {
        return
      }
      navigate(`/shareView/${params.shareId}`, {
        replace: true,
      })
    } catch (error: any) {
      if (error.showError) {
        message.error(error.msg)
      }
    }
  }
  const GetFile = React.memo((props: any) => {
    const { getFile } = props
    return (
      <div className="inline-block  ml-[6px]">
        <Button
          type="primary"
          className="bg-btn-primary"
          onClick={() => {
            getFile()
          }}
        >
          提取文件
        </Button>
      </div>
    )
  })
  return (
    <div className="bg-share-warpper bg-[#eef2f6] bg-repeat-x flex justify-center h-[100vh] bg-[0_bottom]">
      <div className="mt-[20vh] w-[500px]">
        <div className="flex items-center justify-center">
          <span className="iconfont icon-pan text-[60px] text-[#1296db]"></span>
          <span className="font-bold ml-[5px] text-[25px] text-[#1296db]">
            Pan
          </span>
        </div>
        <div className="mt-[20px] shadow-[0_0_7px_1px_#5757574f] bg-[#fff] rounded-[5px] overflow-hidden ">
          <div className="p-[10px_20px] bg-[#409eff] text-[#fff] flex items-center">
            <Avatar
              width={50}
              avatar={shareInfo?.avatar as string}
              userId={shareInfo?.userId as string}
              timeStamp={new Date().getTime()}
            ></Avatar>
            <div className="ml-[10px]">
              <div className="flex items-center">
                <span className="text-[15px]">{shareInfo?.nickName}</span>
                <span className="text-[12px] ml-[20px]">
                  分享于：{shareInfo?.expireTime}
                </span>
              </div>
              <div className="mt-[10px] text-[12px]">
                分享文件：{shareInfo?.fileName}
              </div>
            </div>
          </div>
          <div className="p-[30px_20px_40px]">
            <div className="font-bold">请输入提取码：</div>
            <div className="mt-[10px]">
              <Form
                name="code"
                labelCol={{ span: 0 }}
                form={shareCodeForm}
                wrapperCol={{ span: 50 }}
                style={{ maxWidth: 600 }}
                autoComplete="off"
                labelAlign="left"
              >
                <Form.Item className="w-full">
                  <Form.Item<codeFormType>
                    name="code"
                    className="inline-block w-[365px]"
                    rules={[
                      {
                        required: true,
                        message: '请输入提取码',
                      },
                    ]}
                  >
                    <Input placeholder="请输入提取码"></Input>
                  </Form.Item>
                  <GetFile getFile={getFile}></GetFile>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ShareCheckFile
