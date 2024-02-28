import { getAdminSetting, setAdminSetting } from '@/api'
import message from '@/utils/message'
import { Button, Form, Input, InputNumber } from 'antd'
import { useEffect, useState } from 'react'
interface systmSettingType {
  registerEmailTitle: string
  registerEmailContent: string
  userInitUseSpace: number
}
const Settings = () => {
  const [settingConfig, setSettingConfig] = useState<systmSettingType>()
  const [settingForm] = Form.useForm<systmSettingType>()
  useEffect(() => {
    getSettingConfig()
  }, [])
  const getSettingConfig = async () => {
    try {
      const res = await getAdminSetting()
      if (res?.code !== 200) {
        return
      }
      ;(settingForm as any).setFieldsValue({
        registerEmailTitle: res.data.registerEmailTitle,
        registerEmailContent: res.data.registerEmailContent,
        userInitUseSpace: res.data.userInitUseSpace,
      })
    } catch (error) {}
  }
  const saveSettingConfig = async () => {
    try {
      await (settingForm as any).validateFields()
      const res = await setAdminSetting(
        (settingForm as any).getFieldsValue(['registerEmailTitle'])
          .registerEmailTitle,
        (settingForm as any).getFieldsValue(['registerEmailContent'])
          .registerEmailContent,
        (settingForm as any).getFieldsValue(['userInitUseSpace'])
          .userInitUseSpace
      )
      if (res?.code !== 200) {
        return
      }
      message.success('保存成功')
      getSettingConfig()
    } catch (error) {}
  }
  return (
    <div className="w-[40vw] p-[30px_40px]">
      <Form form={settingForm}>
        <Form.Item<systmSettingType>
          name="registerEmailTitle"
          rules={[
            {
              required: true,
              message: '注册邮箱标题不能为空',
            },
          ]}
          label="注册邮箱标题"
        >
          <Input placeholder="输入注册邮箱标题"></Input>
        </Form.Item>
        <Form.Item<systmSettingType>
          name="registerEmailContent"
          rules={[
            {
              required: true,
              message: '注册邮箱内容不能为空',
            },
          ]}
          label="注册邮箱内容"
        >
          <Input.TextArea
            rows={5}
            maxLength={1000}
            showCount
            placeholder="输入注册邮箱内容,%s代表映射的邮箱验证码"
          ></Input.TextArea>
        </Form.Item>
        <Form.Item<systmSettingType>
          name="userInitUseSpace"
          rules={[
            {
              required: true,
              message: '用户默认空间不能为空',
            },
          ]}
          label="用户初始化空间配额"
        >
          <InputNumber
            stringMode
            addonAfter={<div>MB</div>}
            defaultValue={100}
            controls
          />
        </Form.Item>
        <Button
          type="primary"
          onClick={() => {
            saveSettingConfig()
          }}
        >
          保存
        </Button>
      </Form>
    </div>
  )
}
export default Settings
