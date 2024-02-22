import GlobalModel, { ModelProps } from '@/components/GlobalModel'
import { Form, Input } from 'antd'
import React, { useEffect } from 'react'

import { LockOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd/es/form/Form'

export interface PasswordTypes {
  newPass: string
  compliePass: string
}
interface passwordProps {
  modelConfig: ModelProps
  onFormInstance: (form: FormInstance) => void
}
const UpdatePassword: React.FC<passwordProps> = (props) => {
  const { modelConfig, onFormInstance } = props
  const [passwordForm] = Form.useForm<PasswordTypes>()
  useEffect(() => {
    onFormInstance(passwordForm)
  }, [passwordForm, onFormInstance])
  // 自定义校验规则
  const customNewValidate = (_: any, value: string) => {
    const password = (passwordForm as any).getFieldValue(['newPass'])
    if (password && value !== password) {
      return Promise.reject('密码不一致')
    }
    return Promise.resolve()
  }

  return (
    <div>
      <GlobalModel {...modelConfig}>
        <Form
          name="basic"
          form={passwordForm}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 20 }}
          style={{ maxWidth: 400 }}
          autoComplete="off"
        >
          <Form.Item<PasswordTypes>
            label="新密码"
            name="newPass"
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />}></Input.Password>
          </Form.Item>
          <Form.Item<PasswordTypes>
            label="确认新密码"
            name="compliePass"
            rules={[
              {
                required: true,
                message: '必填',
              },
              {
                validator: customNewValidate,
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />}></Input.Password>
          </Form.Item>
        </Form>
      </GlobalModel>
    </div>
  )
}
export default UpdatePassword
