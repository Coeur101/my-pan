import { Button, Checkbox, Form, Input, message } from 'antd'
import React, { useEffect, useState } from 'react'
import {
  UserOutlined,
  LockOutlined,
  CodepenOutlined,
  AntDesignOutlined,
  MessageFilled,
  MessageOutlined,
} from '@ant-design/icons'
import style from './style/login.module.scss'
import http from '@/utils/request'
import GlobalModel, { ModelProps } from '@/components/GlobalModel'
import { FormInstance } from 'antd/lib/form'
type userFormType = {
  email?: string
  password?: string
  code?: string
  emailCode?: string
  remmberme?: boolean
  nickName?: string
  compliedPassword?: string
}
type emailFormType = {
  email: string
  code: string
}
const LoginView = (props: any) => {
  const api = {
    checkCode: '/api/checkCode',
  }
  let timer: any = null,
    num = 30
  const [modelConfig, setModelConfig] = useState<ModelProps>({
    show: false,
    title: '获取邮箱验证码',
    width: 500,
    buttons: [
      {
        type: 'primary',
        text: '发送邮箱验证码',
        click: async () => {
          try {
            await (emailForm as any).validateFields(['code'])
            timer = setInterval(() => {
              if (num === 0) {
                clearTimeout(timer as number)
                setSendEmailText('发送邮箱验证码')
                setDisabled(false)
                return
              }
              setDisabled(true)
              setSendEmailText(`${num}秒后重试`)
              num--
            }, 1000)
            setModelConfig({
              ...modelConfig,
              show: false,
            })
            setChdeckCodeUrl2(
              `${api.checkCode}?type=1&time=${new Date().getTime()}`
            )
            ;(emailForm as any).resetFields()
          } catch (error) {}
        },
      },
    ],
    cancelBtn: false,
  })
  // 操作类型 0:注册 1:登录 2：重置密码
  const [opType, setOpType] = useState<number>(1)
  const [checkCodeUrl, setCheckCodeUrl] = useState<string>(api.checkCode)
  const [checkCodeUrl2, setChdeckCodeUrl2] = useState<string>(
    api.checkCode + '?type=' + 1 + '&time=' + new Date().getTime()
  )
  const [userForm] = Form.useForm<FormInstance>()
  const [emailForm] = Form.useForm<FormInstance>()
  const [sendEmailText, setSendEmailText] = useState('获取邮箱验证码')
  const [disabled, setDisabled] = useState(false)
  useEffect(() => {
    ;(async function () {
      try {
      } catch (error) {}
    })()
  }, [])
  const loadCheckCode = (type: string | number) => {
    setCheckCodeUrl(
      api.checkCode + '?type=' + type + '&time=' + new Date().getTime()
    )
  }

  const handleEmailCode = async () => {
    try {
      await (userForm as any).validateFields(['email'])
      setModelConfig({
        ...modelConfig,
        show: true,
      })
    } catch (error) {
      message.error('邮箱不能为空')
    }
  }
  // 自定义校验规则
  const customValidate = (_: any, value: string) => {
    const password = (userForm as any).getFieldValue(['password'])
    if (password && value !== password) {
      return Promise.reject('密码不一致')
    }
    return Promise.resolve()
  }
  const RegisterBox = () => {
    return opType === 0 || opType === 2 ? (
      <div className={style.codeFlex}>
        <Form.Item<userFormType>
          name="emailCode"
          rules={[
            {
              required: true,
              message: '邮箱验证码必须输入',
            },
          ]}
          extra={
            <Button
              type="primary"
              onClick={() => handleEmailCode()}
              className="bg-btn-primary"
              disabled={disabled}
            >
              {sendEmailText}
            </Button>
          }
        >
          <Input
            placeholder="输入邮箱验证码"
            prefix={<CodepenOutlined />}
          ></Input>
        </Form.Item>
        <Button type="link">未收到邮箱验证码？</Button>
        {opType === 0 ? (
          <Form.Item<userFormType>
            name="nickName"
            rules={[
              {
                required: true,
                message: '昵称必须输入',
              },
            ]}
          >
            <Input
              prefix={<AntDesignOutlined />}
              placeholder="请输入昵称"
            ></Input>
          </Form.Item>
        ) : null}

        <Form.Item<userFormType>
          name="password"
          rules={[
            {
              required: true,
              message: '密码必须输入',
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入密码"
          ></Input.Password>
        </Form.Item>
        <Form.Item<userFormType>
          name="compliedPassword"
          rules={[
            {
              required: true,
              message: '密码必须输入',
            },
            { validator: customValidate },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请确认密码"
          ></Input.Password>
        </Form.Item>
      </div>
    ) : null
  }
  return (
    <div className={style.loginWraper}>
      <div className={style.loginBox}>
        <div className={style.title}>
          <h2>
            <span>Hello</span>pan!
          </h2>
        </div>
        <Form
          name="user"
          form={userForm}
          labelCol={{ span: 1 }}
          wrapperCol={{ span: 30 }}
          style={{ maxWidth: 400 }}
          initialValues={{ remmberme: true }}
          autoComplete="off"
          labelAlign="left"
        >
          <Form.Item<userFormType>
            name="email"
            rules={[{ required: true, message: '邮箱不能为空!' }]}
          >
            <Input
              maxLength={150}
              prefix={<MessageOutlined />}
              placeholder="请输入邮箱"
            />
          </Form.Item>
          {opType === 1 ? (
            <Form.Item<userFormType>
              name="password"
              rules={[{ required: true, message: '密码不能为空!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
              />
            </Form.Item>
          ) : null}

          {<RegisterBox />}
          {/* <div className={style.codeFlex}> */}
          <Form.Item style={{ marginBottom: 0 }}>
            <Form.Item<userFormType>
              name="code"
              style={{
                display: 'inline-block',
                width: 'calc(60% - 8px)',
                margin: '2px 0',
              }}
              rules={[{ required: true, message: '验证码不能为空!' }]}
              // extra={

              // }
            >
              <Input prefix={<CodepenOutlined />} placeholder="请输入验证码" />
            </Form.Item>
            {/* </div> */}
            <Form.Item
              style={{
                display: 'inline-block',
                width: 'calc(40% - 8px)',
                margin: '0 8px',
              }}
            >
              <img
                src={checkCodeUrl}
                alt=""
                onClick={() => {
                  loadCheckCode(0)
                }}
              />
            </Form.Item>
          </Form.Item>
          {opType === 1 ? (
            <Form.Item<userFormType>
              name="remmberme"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>记住我</Checkbox>
            </Form.Item>
          ) : null}

          <div className={style.user}>
            {opType === 1 ? (
              <Button
                type="link"
                onClick={() => {
                  ;(userForm as any).resetFields()
                  loadCheckCode(0)
                  setOpType(2)
                }}
              >
                忘记密码？
              </Button>
            ) : (
              <Button
                type="link"
                onClick={() => {
                  ;(userForm as any).resetFields()
                  loadCheckCode(0)
                  setOpType(1)
                }}
              >
                已有账号?
              </Button>
            )}
            {opType === 1 || opType === 2 ? (
              <>
                <Button
                  type="link"
                  onClick={() => {
                    ;(userForm as any).resetFields()
                    loadCheckCode(0)
                    setOpType(0)
                  }}
                >
                  没有账号？
                </Button>
              </>
            ) : null}
          </div>
          <Button
            type="primary"
            className="bg-btn-primary w-[100%]"
            htmlType="submit"
          >
            {opType === 0 ? '注册' : opType === 1 ? '登录' : '重置密码'}
          </Button>
        </Form>
      </div>
      <GlobalModel
        width={modelConfig.width}
        title={modelConfig.title}
        show={modelConfig.show}
        cancelBtn={modelConfig.cancelBtn}
        buttons={modelConfig.buttons}
        close={() => {
          ;(emailForm as any).resetFields()
          setModelConfig({
            ...modelConfig,
            show: false,
          })
          setChdeckCodeUrl2(
            `${api.checkCode}?type=1&time=${new Date().getTime()}`
          )
        }}
      >
        <Form
          name="email"
          form={emailForm}
          labelCol={{ span: 1 }}
          wrapperCol={{ span: 40 }}
          style={{ maxWidth: 400 }}
          initialValues={{ email: (userForm as any).getFieldValue(['email']) }}
          autoComplete="off"
          labelAlign="left"
        >
          <Form.Item<emailFormType> name="email">
            <Input disabled prefix={<MessageOutlined />}></Input>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Form.Item<emailFormType>
              name="code"
              rules={[{ required: true, message: '验证码不能为空!' }]}
              style={{
                display: 'inline-block',
                width: 'calc(71% - 8px)',
                marginBottom: 0,
              }}
            >
              <Input prefix={<CodepenOutlined />} placeholder="请输入验证码" />
            </Form.Item>
            <Form.Item
              style={{
                display: 'inline-block',
                width: 'calc(29% - 8px)',
                margin: '0 8px',
              }}
            >
              <img
                src={checkCodeUrl2}
                alt=""
                onClick={() => {
                  setChdeckCodeUrl2(
                    `${api.checkCode}?type=1&time=${new Date().getTime()}`
                  )
                }}
              />
            </Form.Item>
          </Form.Item>
        </Form>
      </GlobalModel>
    </div>
  )
}
export default LoginView
