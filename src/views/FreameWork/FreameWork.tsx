import { Button, Dropdown, Popover } from 'antd'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import '@/views/style/Feame.scss'
import { startTransition, useEffect, useState } from 'react'
import { MenuProps } from 'antd/lib'
import { useCookies } from 'react-cookie'
import RouterContent from '@/utils/RouterContent'
import Avatar from '@/components/Avatar'
import UpdateAvatar from '../UpdateAvatar'
import { ModelProps } from '@/components/GlobalModel'
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
  const parentProps = {
    prop1: 'Value 1',
    prop2: 'Value 2',
  }
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
  const [modelConfig, setModelConfig] = useState<ModelProps>({
    show: true,
    title: '上传头像',
    buttons: [
      {
        type: 'primary',
        text: '确定',
        click: () => {},
      },
    ],
    cancelBtn: false,
  })
  const location = useLocation()
  const navigate = useNavigate()
  let [popoverVisible, setPopoverVisible] = useState(false)
  let [cookie] = useCookies(['userInfo'])
  let [subList, setSublist] = useState<MenuItems[]>(
    menuItems[0].children as MenuItems[]
  )
  const popoverShow = () => {
    setPopoverVisible(!popoverVisible)
  }

  const activeClass = 'text-[#06a7ff]'
  const subListActiveClass = 'bg-[#eef9fe] text-[#05a1f5]'
  const content = <div>上传区域</div>
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer">
          修改头像
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer">
          修改密码
        </a>
      ),
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer">
          退出
        </a>
      ),
    },
  ]
  useEffect(() => {
    navigate('/main/all', { replace: true })
  }, [])
  const routerActive = (path: string, children?: MenuItems[]) => {
    if (children) {
      setSublist(children as MenuItems[])
    }
    startTransition(() => {
      navigate(path)
    })
  }
  return (
    <div>
      <header className="shadow-[0_3px_10px_rgba(0,0,0,0.1)] h-[56px] w-[100%] pl-6 pr-6 relative z-[200] flex items-center justify-between">
        <div className="flex items-center">
          <span className="iconfont icon-pan text-[40px] text-[#1296db]"></span>
          <div className="font-bold ml-[5px] text-[25px] text-[#05a1f5]">
            Pan
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Popover
            placement="bottom"
            content={content}
            trigger="click"
            open={true}
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
            open={true}
            overlayStyle={{ top: 60 }}
            trigger={['click']}
          >
            <div className="mr-[10px] flex items-center cursor-pointer">
              <div className="m-[0_5px_0_15px]">
                <Avatar
                  userId={cookie.userInfo.userId}
                  avatar={cookie.userInfo.avatar}
                  timeStamp={new Date().getTime()}
                  width={46}
                ></Avatar>
              </div>
              <span className="text-[#05a1f5]">{cookie.userInfo.nickName}</span>
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
              <div className="pr-3"></div>
              <div className="mt-[5px] text-[#7e7e7e] flex justify-around">
                <div className="flex-1">0B / 5MB</div>
                <div className="iconfont icon-refresh text-[#05a1f5] cursor-pointer"></div>
              </div>
            </div>
          </div>
        </div>
        <RouterContent.Provider value={parentProps}>
          <Outlet />
        </RouterContent.Provider>
      </section>
      <UpdateAvatar
        modelConfig={modelConfig}
        userInfo={cookie.userInfo}
      ></UpdateAvatar>
    </div>
  )
}
export default FreameWork
