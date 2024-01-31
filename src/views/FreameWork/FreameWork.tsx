import {
  Button,
  Dropdown,
  FormInstance,
  Popover,
  Progress,
  message,
} from 'antd'
import {
  Navigate,
  NavigateFunction,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import '@/views/style/Feame.scss'
import { createRef, startTransition, useEffect, useRef, useState } from 'react'
import { MenuProps } from 'antd/lib'
import { useCookies } from 'react-cookie'
import RouterContent from '@/utils/RouterContent'
import Avatar from '@/components/Avatar'
import UpdateAvatar from '../UpdateAvatar'
import { ModelProps } from '@/components/GlobalModel'
import UpdatePassword from '../UpdatePassword'
import { useSelector } from 'react-redux'
import { getUserSpaceInfo, passwordUpload } from '@/api'
import UploaderList from '../Main/UploaderList'
import { formatFileSize } from '@/utils/format'

type MenuItems = {
  icon?: string
  name?: string
  menuCode?: string
  path?: string
  allShow?: boolean
  category?: string
  tips?: string
  children?: MenuItems[]
}

const FreameWork = () => {
  const menuItems: MenuItems[] = [
    {
      icon: 'cloude',
      name: '首页',
      menuCode: 'main',
      path: '/main/all',
      allShow: true,
      children: [
        {
          icon: 'all',
          name: '全部',
          category: 'all',
          path: '/main/all',
        },
        {
          icon: 'video',
          name: '视频',
          category: 'video',
          path: '/main/video',
        },
        {
          icon: 'music',
          name: '音频',
          category: 'music',
          path: '/main/music',
        },
        {
          icon: 'image',
          name: '图片',
          category: 'image',
          path: '/main/image',
        },
        {
          icon: 'doc',
          name: '文档',
          category: 'doc',
          path: '/main/doc',
        },
        {
          icon: 'more',
          name: '其他',
          category: 'others',
          path: '/main/others',
        },
      ],
    },
    {
      icon: 'share',
      name: '分享',
      menuCode: 'share',
      path: '/myshare',
      allShow: true,
      children: [
        {
          name: '分享记录',
          path: '/myshare',
        },
      ],
    },
    {
      path: '/recycle',
      icon: 'del',
      name: '回收站',
      menuCode: 'recycle',

      allShow: true,
      children: [
        {
          name: '删除的文件',
          path: '/recycle',
          tips: '回收站为你保存10天内删除的文件',
        },
      ],
    },
    {
      icon: 'settings',
      path: '/settings/fileList',
      name: '设置',
      menuCode: 'settings',
      allShow: true,
      children: [
        {
          name: '用户文件',
          path: '/settings/fileList',
        },
        {
          name: '用户管理',
          path: '/settings/userList',
        },
        {
          name: '系统设置',
          path: '/settings/sysSetting',
        },
      ],
    },
  ]
  const [avatarModelConfig, setAvatarModelConfig] = useState<ModelProps>({
    show: false,
    title: '上传头像',
    buttons: [
      {
        type: 'primary',
        text: '确定',
        click: () => {
          setAvatarModelConfig({
            ...avatarModelConfig,
            show: false,
          })
        },
      },
    ],
    close() {
      setAvatarModelConfig({
        ...avatarModelConfig,
        show: false,
      })
    },
    cancelBtn: false,
  })
  const UploaderListRef = useRef<{ addFileToList: (...args: any) => void }>(
    null
  )
  const location = useLocation()
  const navigate = useNavigate()
  let [popoverVisible, setPopoverVisible] = useState(false)
  let [cookie, setCookie, removeCookie] = useCookies(['userInfo', 'loginInfo'])
  let [subList, setSublist] = useState<MenuItems[]>(
    menuItems[0].children as MenuItems[]
  )
  const url = new URLSearchParams(location.search)
  let passwordModelRef = useRef<FormInstance | null>()
  const [passwordModelConfig, setPasswordModelConfig] = useState<ModelProps>({
    show: false,
    title: '修改密码',
    buttons: [
      {
        type: 'primary',
        text: '确定',
        click: async () => {
          try {
            if (passwordModelRef.current) {
              await (passwordModelRef as any).current.validateFields()
              const password = (passwordModelRef as any).current.getFieldsValue(
                ['newPass']
              ).newPass
              const res = await passwordUpload(password)
              if (res?.code !== 200) {
                return
              }
              message.success('修改密码成功，需要重新登录')
              ;(navigate as NavigateFunction)(
                '/login?redirectUrl=' + encodeURI(location!.pathname)
              )
              removeCookie('loginInfo')
            }
            return
          } catch (error) {}
        },
      },
    ],
    close() {
      setPasswordModelConfig({
        ...passwordModelConfig,
        show: false,
      })
    },
    cancelBtn: false,
  })
  const [userSpaceInfo, setUserSpaceInfo] = useState({
    useSpace: 0,
    totalSpace: 0,
  })
  const popoverShow = () => {
    setPopoverVisible(!popoverVisible)
  }
  const activeClass = 'text-[#06a7ff]'
  const subListActiveClass = 'bg-[#eef9fe] text-[#05a1f5]'
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a
          target="_blank"
          onClick={() => uploadAvatar()}
          rel="noopener noreferrer"
        >
          修改头像
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => updatePassword()}
        >
          修改密码
        </a>
      ),
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" onClick={() => logOut()}>
          退出
        </a>
      ),
    },
  ]
  const loginState = useSelector((state: any) => {
    return state.globalLoading.loginState
  })
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/main/all', { replace: true })
    }
    const item = menuItems.filter((item) => {
      return item.path === location.pathname
    })
    if (item.length > 0) {
      setSublist(item[0].children as MenuItems[])
    }
  }, [location])
  useEffect(() => {
    if (loginState === 1) {
      ;(navigate as NavigateFunction)(
        '/login?redirectUrl=' + encodeURI(location!.pathname)
      )
    } else {
      getUserSpace()
    }
  }, [loginState])
  // 获取用户空间
  const getUserSpace = async () => {
    try {
      const res = await getUserSpaceInfo()
      //@ts-ignore
      if (res?.code !== 200) {
        return
      }
      setUserSpaceInfo(res.data)
    } catch (error) {}
  }
  const routerActive = (path: string, children?: MenuItems[]) => {
    if (children) {
      setSublist(children as MenuItems[])
    }
    startTransition(() => {
      navigate(`${path}${url.get('path') ? '?path=' + url.get('path') : ''}`)
      // navigate(`${path}`)
    })
  }
  const uploadAvatar = () => {
    setAvatarModelConfig({
      ...avatarModelConfig,
      show: true,
    })
  }
  // 登出
  const logOut = () => {
    removeCookie('userInfo')
    startTransition(() => {
      navigate('/login')
    })
  }
  const updatePassword = () => {
    if (passwordModelRef.current) {
      ;(passwordModelRef as any).current.resetFields()
    }
    setPasswordModelConfig({
      ...passwordModelConfig,
      show: true,
    })
  }
  const handleFormInstance = (form: FormInstance) => {
    // 获取到子组件的Form实例，在父组件调用修改密码的接口
    passwordModelRef.current = form
  }
  const upLoadFile = async (file: Blob, filePid: string) => {
    // 更新页面是异步的，更新完页面之后，再将需要展示的文件传入到子组件中进行显示
    await setPopoverVisible(true)
    // 调用子组件的方法
    UploaderListRef.current?.addFileToList(file, filePid)
  }

  const parentProps: {
    upLoadFile?: (...args: any) => void
    getFileListFunc?: any
  } = {
    upLoadFile: upLoadFile,
  }

  return (
    <div>
      <header className="shadow-[0_3px_10px_rgba(0,0,0,0.1)] h-[56px] w-[100%] p-[0_10px] box-border  relative z-[200] flex items-center justify-between">
        <div className="flex items-center">
          <span className="iconfont icon-pan text-[40px] text-[#1296db]"></span>
          <div className="font-bold ml-[5px] text-[25px] text-[#05a1f5]">
            Pan
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Popover
            placement="bottom"
            content={<UploaderList ref={UploaderListRef} />}
            trigger="click"
            open={popoverVisible}
            overlayStyle={{ top: 60 }}
          >
            <span
              onClick={() => popoverShow()}
              className="iconfont icon-transfer cursor-pointer"
            ></span>
          </Popover>
          <Dropdown
            menu={{ items }}
            placement="bottom"
            overlayStyle={{ top: 60 }}
            trigger={['click']}
          >
            <div className="mr-[10px] flex items-center cursor-pointer">
              <div className="m-[0_5px_0_15px]">
                <Avatar
                  userId={cookie.userInfo?.userId || ''}
                  avatar={cookie.userInfo?.avatar || ''}
                  timeStamp={new Date().getTime()}
                  width={30}
                ></Avatar>
              </div>
              <span className="text-[#05a1f5]">
                {cookie.userInfo?.nickName || ''}
              </span>
            </div>
          </Dropdown>
        </div>
      </header>
      <section className="flex">
        <div className="border-r-[1px] boder-r-[#f1f2f4] flex">
          <div className="h-[calc(100vh-56px)] w-[80px] shadow-[0_3px_10px_0_rgba(0,0,0,0.1)] border-r-[1px_solid_#f1f2f4]">
            {menuItems.map((item, index) => {
              return item.allShow ? (
                <div
                  className={`text-center text-[14px] font-bold p-[20px_0px] cursor-pointer hover:bg-[#f3f3f3]  ${
                    item.children?.some(
                      (el) => el.path === location.pathname
                    ) || item.path == location.pathname
                      ? activeClass
                      : 'text-[#636d7e]'
                  }`}
                  onClick={() =>
                    routerActive(item.path as string, item.children)
                  }
                  key={index}
                >
                  <span
                    className={`iconfont icon-${item.icon} font-normal text-[28px]`}
                  ></span>
                  <div>{item.name}</div>
                </div>
              ) : null
            })}
          </div>
          <div className="w-[200px] p-[20px_10px_0] relative">
            {subList?.map((item, index) => {
              return (
                <div key={index + new Date().getTime()}>
                  <div
                    className={`text-center leading-10 rounded-md cursor-pointer ${
                      location.pathname === item.path
                        ? subListActiveClass
                        : 'hover:bg-[#f3f3f3]'
                    } `}
                    onClick={() => {
                      routerActive(item.path as string)
                    }}
                  >
                    <span
                      className={`iconfont icon-${item.icon} text-sm mr-5  ${
                        location.pathname === item.path
                          ? subListActiveClass
                          : 'text-[#636d7e]'
                      }`}
                    ></span>
                    <span className="text-[13px]">{item.name}</span>
                  </div>
                  {item.tips ? (
                    <div className="mt-[10px] text-[#888] text-[13px]">
                      {item.tips}
                    </div>
                  ) : null}
                </div>
              )
            })}
            <div className="absolute bottom-[10px] w-[90%] p-[0_5px]">
              <div className="">空间使用</div>
              <div className="pr-3">
                <Progress
                  percent={
                    Number(
                      (
                        userSpaceInfo.useSpace / userSpaceInfo.totalSpace
                      ).toFixed(2)
                    ) * 100
                  }
                  strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                />
              </div>
              <div className="mt-[5px] text-[#7e7e7e] flex justify-around">
                <div className="flex-1">
                  {formatFileSize(userSpaceInfo.useSpace)} /{' '}
                  {formatFileSize(userSpaceInfo.totalSpace)}
                </div>
                <div
                  onClick={() => getUserSpace()}
                  className="iconfont icon-refresh text-[#05a1f5] cursor-pointer"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <RouterContent.Provider value={parentProps}>
            <Outlet />
          </RouterContent.Provider>
        </div>
      </section>
      <UpdateAvatar
        modelConfig={avatarModelConfig}
        userInfo={cookie.userInfo}
      ></UpdateAvatar>
      <UpdatePassword
        onFormInstance={handleFormInstance}
        modelConfig={passwordModelConfig}
      ></UpdatePassword>
    </div>
  )
}
export default FreameWork
