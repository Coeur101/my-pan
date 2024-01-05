import { Button, Checkbox, Form, Input } from 'antd'
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
import http from '../utils/request'
type FieldType = {
  email?: string
  password?: string
  code?: string
  emailCode?: string
  remmberme?: boolean
  nickName?: string
  compliedPassword?: string
}
const LoginView = (props: any) => {
  const api = {
    checkCode: '/api/checkCode',
  }
  // 操作类型 0:注册 1:登录 2：重置密码
  const [opType, setOpType] = useState<number>(1)
  const [checkCodeUrl, setCheckCodeUrl] = useState<string>(api.checkCode)
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
  const RegisterBox = () => {
    return opType === 0 || opType === 2 ? (
      <div className={style.codeFlex}>
        <Form.Item<FieldType>
          name="emailCode"
          rules={[
            {
              required: true,
              message: '邮箱验证码必须输入',
            },
          ]}
          extra={
            <Button type="primary" className="bg-btn-primary">
              获取邮箱验证码
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
          <Form.Item<FieldType>
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

        <Form.Item<FieldType>
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
        <Form.Item<FieldType>
          name="compliedPassword"
          rules={[
            {
              required: true,
              message: '密码必须输入',
            },
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
          name="basic"
          labelCol={{ span: 1 }}
          wrapperCol={{ span: 30 }}
          style={{ maxWidth: 400 }}
          initialValues={{ remmberme: true }}
          autoComplete="off"
          labelAlign="left"
        >
          <Form.Item<FieldType>
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
            <Form.Item<FieldType>
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
          <div className={style.codeFlex}>
            <Form.Item<FieldType>
              name="code"
              rules={[{ required: true, message: '验证码不能为空!' }]}
              extra={
                <img
                  src={checkCodeUrl}
                  alt=""
                  onClick={() => {
                    loadCheckCode(0)
                  }}
                />
              }
            >
              <Input prefix={<CodepenOutlined />} placeholder="请输入验证码" />
            </Form.Item>
          </div>
          {opType === 1 ? (
            <Form.Item<FieldType> name="remmberme" valuePropName="checked">
              <Checkbox>记住我</Checkbox>
            </Form.Item>
          ) : null}

          <div className={style.user}>
            {opType === 1 ? (
              <Button type="link" onClick={() => setOpType(2)}>
                忘记密码？
              </Button>
            ) : (
              <Button type="link" onClick={() => setOpType(1)}>
                已有账号?
              </Button>
            )}
            {opType === 1 || opType === 2 ? (
              <>
                <Button type="link" onClick={() => setOpType(0)}>
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
            登录
          </Button>
        </Form>
      </div>
    </div>
  )
}
export default LoginView
