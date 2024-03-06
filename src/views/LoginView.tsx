import { Button, Checkbox, Form, Input } from 'antd'
import React, {
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import {
  LockOutlined,
  CodepenOutlined,
  AntDesignOutlined,
  MessageOutlined,
} from '@ant-design/icons'
import style from './style/login.module.scss'
import GlobalModel, { ModelProps } from '@/components/GlobalModel'
import { FormInstance } from 'antd/lib/form'
import {
  login,
  qqLogin,
  register,
  resetPassword,
  sendEmailApi,
} from '@/api/index'
import message from '@/utils/message'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { md5, Message } from 'js-md5'
import { useDispatch } from 'react-redux'
import { setLoginState } from '@/store/reducer/globalLoading'
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
    emailCheckCode:
      '/api/checkCode' + '?type=' + 1 + '&time=' + new Date().getTime(),
  }
  let timer = useRef<number | null>(null),
    num = 30
  const [modelConfig, setModelConfig] = useState<ModelProps>({
    show: false,
    title: '获取邮箱验证码',
    width: 500,
    buttons: [
      {
        type: 'primary',
        text: '发送邮箱验证码',
        click: () => {
          sendEmailCode()
        },
      },
    ],
    cancelBtn: false,
  })

  // 操作类型 0:注册 1:登录 2：重置密码
  const [opType, setOpType] = useState<number>(1)
  const [checkCodeUrl, setCheckCodeUrl] = useState<string>(api.checkCode)
  const [checkCodeUrl2, setChdeckCodeUrl2] = useState<string>(
    api.emailCheckCode
  )
  const navigate = useNavigate()
  const location = useLocation()
  const [userForm] = Form.useForm<userFormType>()
  const [emailForm] = Form.useForm<emailFormType>()
  let sendEmailButtonRef: RefObject<HTMLElement> | null =
    useRef<HTMLElement>(null)
  const dispatch = useDispatch()
  const [disabled, setDisabled] = useState(false)
  const [cookies, setCookie, removeCookie] = useCookies([
    'loginInfo',
    'userInfo',
  ])
  useEffect(() => {
    const cookieLoginInfo = cookies.loginInfo
    if (cookieLoginInfo) {
      setTimeout(() => {
        ;(userForm as any).setFields([
          {
            name: 'email',
            value: cookieLoginInfo.email,
          },
          {
            name: 'password',
            value: cookieLoginInfo.password,
          },
          {
            name: 'remmberme',
            value: cookieLoginInfo.remmberme,
          },
        ])
      }, 0)
    }
  }, [userForm, cookies.loginInfo])
  useEffect(() => {
    ;(userForm as any).resetFields()
    return () => {
      clearInterval(timer.current as number)
    }
  }, [opType])
  const loadCheckCode = (type: string | number) => {
    setCheckCodeUrl(
      api.checkCode + '?type=' + type + '&time=' + new Date().getTime()
    )
  }
  const countDown = () => {
    if (num === 0) {
      clearInterval(timer.current as number)
      setDisabled(false)
      sendEmailButtonRef!.current!.innerText = `发送邮箱验证码`
      clearInterval(timer.current as number)
      return
    }

    sendEmailButtonRef!.current!.innerText = `${num}秒后重试`

    num--
  }
  const sendEmailCode = async () => {
    try {
      await (emailForm as any).validateFields(['code'])

      const type = opType === 0 ? '0' : '1'
      const params = (emailForm as any).getFieldsValue()
      const res = await sendEmailApi(
        type,
        params.email,
        params.code,
        (info) => {
          message.error(info)
          setChdeckCodeUrl2(
            `${api.checkCode}?type=1&time=${new Date().getTime()}`
          )
        }
      )
      if ((res as any)?.code !== 200) {
        return
      }
      message.success('验证码发送成功')
      setModelConfig({
        ...modelConfig,
        show: false,
      })
      setDisabled(true)
      countDown()
      if (!timer.current) timer.current = setInterval(countDown, 1000) as any
      ;(emailForm as any).resetFields()
    } catch (error) {}
  }
  const gainEmailCode = async () => {
    try {
      await (userForm as any).validateFields(['email'])
      setModelConfig({
        ...modelConfig,
        show: true,
      })
    } catch (error) {}
  }
  const SendEmailCodeButton = React.memo((props: any) => {
    const { sendEmailCode } = props
    return (
      <div className="inline-block mt-[2px] ml-[6px]">
        <Button
          type="primary"
          className="bg-btn-primary"
          ref={sendEmailButtonRef}
          onClick={() => {
            sendEmailCode()
          }}
          disabled={disabled}
        >
          获取验证码
        </Button>
      </div>
    )
  })
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
      <div>
        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item<userFormType>
            name="emailCode"
            style={{
              display: 'inline-block',
              width: 'calc(60% - 8px)',
              margin: '2px 0',
            }}
            rules={[{ required: true, message: '邮箱验证码!' }]}
            // extra={

            // }
          >
            <Input prefix={<CodepenOutlined />} placeholder="请输入验证码" />
          </Form.Item>
          {/* </div> */}
          <SendEmailCodeButton sendEmailCode={gainEmailCode} />
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
  const errorCallback = (info: any) => {
    message.error(info)
    loadCheckCode('0')
  }
  // 登录 & 注册 & 重置密码的操作
  const submitClick = async () => {
    try {
      await (userForm as any).validateFields()
      let params: userFormType = {
        emailCode: (userForm as any).getFieldsValue(['emailCode']).emailCode,
        password: (userForm as any).getFieldsValue(['password']).password,
        nickName: (userForm as any).getFieldsValue(['nickName']).nickName,
        email: (userForm as any).getFieldsValue(['email']).email,
        code: (userForm as any).getFieldsValue(['code']).code,
      }

      let res = null
      // 注册
      if (opType === 0) {
        res = await register(
          params.email as string,
          params.nickName as string,
          params.password as string,
          params.code as string,
          params.emailCode as string,
          errorCallback
        )
      } else if (opType === 1) {
        let cookie = cookies.loginInfo
        let cookiePassword = cookie && cookie.password
        if (cookiePassword !== params.password) {
          params.password = md5(params.password as Message)
        }
        // 登录
        res = await login(
          params.email as string,
          params.password as string,
          params.code as string,
          errorCallback
        )
      } else {
        // 找回密码
        res = await resetPassword(
          params.email as string,
          params.password as string,
          params.code as string,
          params.emailCode as string,
          errorCallback
        )
      }

      if (res?.code !== 200) {
        return
      }
      // 注册返回
      if (opType === 0) {
        message.success('注册成功，回到登录页')
        clearInterval(timer.current as number)
        setTimeout(() => {
          setOpType(1)
        }, 500)
      } else if (opType === 1) {
        // 路由跳转 记住密码
        if ((userForm as any).getFieldsValue(['remmberme']).remmberme) {
          const loginInfo = {
            email: params.email,
            password: params.password,
            remmberme: (userForm as any).getFieldsValue(['remmberme'])
              .remmberme,
          }
          const expirationDate = new Date()
          expirationDate.setDate(expirationDate.getDate() + 7) // 设置过期时间为7天后
          setCookie('loginInfo', loginInfo, {
            expires: expirationDate,
          })
        } else {
          removeCookie('loginInfo')
        }
        dispatch(setLoginState(0))
        message.success('登录成功') // 存储登录信息cookie
        setCookie('userInfo', res?.data)
        const redirectUrl =
          new URLSearchParams(location.search).get('redirectUrl') || '/'
        navigate(`${redirectUrl}`)
      } else if (opType === 2) {
        // 重置密码
        message.success('重置密码成功，回到登录页')
        setTimeout(() => {
          setOpType(1)
        }, 500)
      }
    } catch (error: any) {}
  }
  // qq登录
  const handleQQLogin = async () => {
    try {
      const res = await qqLogin(
        new URLSearchParams(location.search).get('redirectUrl') || '/',
        errorCallback
      )
      if (res?.code !== 200) {
        return
      }
      removeCookie('userInfo')
      document.location.href = res.data
    } catch (error) {}
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
            onClick={() => {
              submitClick()
            }}
          >
            {opType === 0 ? '注册' : opType === 1 ? '登录' : '重置密码'}
          </Button>
          {/* {opType === 1 ? (
            <div className=" text-center flex justify-center mx-auto mt-[20px]">
              <Button
                type="link"
                className="flex"
                onClick={() => {
                  handleQQLogin()
                }}
              >
                快捷登录
                <img
                  src={require('@/assets/icon-image/qq.png')}
                  className="w-[20px] ml-[10px]"
                />
              </Button>
            </div>
          ) : null} */}
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
