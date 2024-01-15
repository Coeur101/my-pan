import GlobalModel, { ModelProps } from '@/components/GlobalModel'
import message from '@/utils/message'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, Input, Upload, UploadProps } from 'antd'
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

  const upProps: UploadProps = {
    name: 'file',
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    headers: {
      authorization: 'authorization-text',
    },
    hasControlInside: false,
    onChange(info) {},
    beforeUpload: (file: any) => {
      const baseSize = 1024 * 1024 * 5
      if (file.size > baseSize) {
        message.error('图片大小不能超过5M')
        return false
      }
      return Upload.LIST_IGNORE
    },
    capture: 'user',
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
          <Form.Item<AvatarTypes> label="昵称">{userInfo.nickName}</Form.Item>

          <Form.Item<AvatarTypes> label="头像">
            <div className="flex justify-center items-end">
              <div className="bg-[rgb(245,245,245)] w-[150px] h-[150px] flex items-center overflow-hidden justify-center relative">
                <img src={userInfo.avatar} alt="" className="w-full" />
              </div>
              <div className="ml-[10px] align-bottom">
                <Upload {...upProps}>
                  <Button
                    icon={<UploadOutlined />}
                    type="primary"
                    className="bg-btn-primary"
                  >
                    选择
                  </Button>
                </Upload>
              </div>
            </div>
          </Form.Item>
        </Form>
      </GlobalModel>
    </div>
  )
}
export default UpdateAvatar
