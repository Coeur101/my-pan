import GlobalModel, { ModelProps } from '@/components/GlobalModel'
import message from '@/utils/message'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, Input, Upload, UploadProps } from 'antd'
import { useState } from 'react'
import ImgCrop from 'antd-img-crop'
import { avatarUpload } from '@/api'
import { useLocation, useNavigate } from 'react-router-dom'
type AvatarTypes = {
  nickName: string
  avatarUrl: string
}
const UpdateAvatar: React.FC<{
  userInfo: {
    nickName: string
    userId: string
    avatar?: any
    admin: boolean
  }
  modelConfig: ModelProps
}> = (props) => {
  const { userInfo, modelConfig } = props
  const [loadFile, setLoadFile] = useState<string>()
  const navigate = useNavigate()
  const location = useLocation()
  const upProps: UploadProps = {
    hasControlInside: true,
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const res = await avatarUpload(
          file as Blob,
          (info) => {
            message.error(info)
          },
          navigate,
          location as any
        )
        if (res?.code !== 200) {
          onError!(new Error(res?.info), file)
        }
        onSuccess!(res?.data)
        let img = new FileReader()
        img.readAsDataURL(file as Blob)
        img.onload = ({ target }) => {
          setLoadFile(target?.result as string)
        }
      } catch (error) {
        console.log(error)
      }
    },
    beforeUpload: (file: any) => {
      const isImage = file.type.startsWith('image/')
      const isSizeValid = file.size / 1024 / 1024 <= 5 // 文件大小限制为5MB

      if (!isImage) {
        message.error('只能上传图片文件！')
      }

      if (!isSizeValid) {
        message.error('文件大小不能超过5MB！')
      }

      return isImage && isSizeValid
    },
    capture: 'environment',
    maxCount: 1,
    showUploadList: false,
    listType: 'picture',
    accept: '.png,.PNG,.jpg,.JPG, .jpeg,.JPEG,.GIF,.gif,.BMP',
  }
  return (
    <div>
      <GlobalModel {...modelConfig}>
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 15 }}
          style={{ maxWidth: 400 }}
          autoComplete="off"
        >
          <Form.Item<AvatarTypes> label="昵称">
            {userInfo?.nickName || ''}
          </Form.Item>

          <Form.Item<AvatarTypes> label="头像">
            <div className="flex justify-center items-end">
              <div className="bg-[rgb(245,245,245)] w-[150px] h-[150px] flex items-center overflow-hidden justify-center relative">
                {loadFile ? (
                  <img src={loadFile} alt="" className="w-full" />
                ) : userInfo?.avatar ? (
                  <img src={userInfo?.avatar || ''} alt="" className="w-full" />
                ) : (
                  <img src={`/api/getAvatar/${userInfo?.userId || ''}`} />
                )}
              </div>
              <div className="ml-[10px] align-bottom">
                <ImgCrop>
                  <Upload {...upProps}>
                    <Button
                      icon={<UploadOutlined />}
                      type="primary"
                      className="bg-btn-primary"
                    >
                      选择
                    </Button>
                  </Upload>
                </ImgCrop>
              </div>
            </div>
          </Form.Item>
        </Form>
      </GlobalModel>
    </div>
  )
}
export default UpdateAvatar
