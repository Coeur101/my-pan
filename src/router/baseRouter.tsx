import React, { LazyExoticComponent, Suspense, lazy } from 'react'
import { RouteObject } from 'react-router-dom'
// 定义懒加载路由组件的porps类型
const LoginLazy: LazyExoticComponent<any> = lazy(
  () => import('@/views/LoginView')
)
const FeameWorkLazy: LazyExoticComponent<any> = lazy(
  () => import('@/views/FreameWork/FreameWork')
)
const QqView: LazyExoticComponent<any> = lazy(
  () => import('@/views/qqLoginCallbackView/QqLoginCallbackView')
)
const AllViewLazy: LazyExoticComponent<any> = lazy(
  () => import('@/views/Main/All')
)
const ShareViewLazy: LazyExoticComponent<any> = lazy(
  () => import('@/views/Share/Share')
)
const RecycleViewLazy: LazyExoticComponent<any> = lazy(
  () => import('@/views/Recycle/Recycle')
)
const FileSettingViewLazy: LazyExoticComponent<any> = lazy(
  () => import('@/views/Admin/FileList')
)
const UserSettingViewLazy: LazyExoticComponent<any> = lazy(
  () => import('@/views/Admin/UserList')
)
const SysSettingViewLazy: LazyExoticComponent<any> = lazy(
  () => import('@/views/Admin/Settings')
)
const ShareCheckFielLazy: LazyExoticComponent<any> = lazy(
  () => import('@/views/WebShare/ShareCheckFile')
)
const ShareViewFielLazy: LazyExoticComponent<any> = lazy(
  () => import('@/views/WebShare/ShareView')
)
const baseRouter: RouteObject[] = [
  {
    path: '/',
    element: <FeameWorkLazy />,
    children: [
      {
        path: '/main/all',
        element: (
          <Suspense>
            {' '}
            <AllViewLazy />
          </Suspense>
        ),
      },
      {
        path: '/myshare',
        element: <ShareViewLazy />,
      },
      {
        path: '/recycle',
        element: <RecycleViewLazy />,
      },
      {
        path: '/settings/fileList',
        element: <FileSettingViewLazy />,
      },
      {
        path: '/settings/userList',
        element: <UserSettingViewLazy />,
      },
      {
        path: '/settings/sysSetting',
        element: <SysSettingViewLazy />,
      },
      {
        path: '/main/video',
        element: (
          <Suspense>
            {' '}
            <AllViewLazy />
          </Suspense>
        ),
      },
      {
        path: '/main/music',
        element: (
          <Suspense>
            {' '}
            <AllViewLazy />
          </Suspense>
        ),
      },
      {
        path: '/main/image',
        element: (
          <Suspense>
            {' '}
            <AllViewLazy />
          </Suspense>
        ),
      },
      {
        path: '/main/doc',
        element: (
          <Suspense>
            {' '}
            <AllViewLazy />
          </Suspense>
        ),
      },
      {
        path: '/main/others',
        element: (
          <Suspense>
            {' '}
            <AllViewLazy />
          </Suspense>
        ),
      },
    ],
  },
  { path: '/login', element: <LoginLazy /> },
  { path: '/qqlogincallback', element: <QqView /> },
  {
    path: '/share/:shareId',
    element: <ShareCheckFielLazy />,
  },
  {
    path: '/shareView/:shareId',
    element: <ShareViewFielLazy />,
  },
]
export default baseRouter
