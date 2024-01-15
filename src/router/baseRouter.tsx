import React, { LazyExoticComponent, lazy } from 'react'
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
const VideoViewLazy: LazyExoticComponent<any> = lazy(
  () => import('@/views/Main/Video')
)
const MusicViewLazy: LazyExoticComponent<any> = lazy(
  () => import('@/views/Main/Music')
)
const ImagesViewLazy: LazyExoticComponent<any> = lazy(
  () => import('@/views/Main/Images')
)
const DocumentsViewLazy: LazyExoticComponent<any> = lazy(
  () => import('@/views/Main/Doc')
)
const OthersViewLazy: LazyExoticComponent<any> = lazy(
  () => import('@/views/Main/Others')
)
const baseRouter: RouteObject[] = [
  {
    path: '/',
    element: <FeameWorkLazy />,
    children: [
      {
        path: '/main/all',
        element: <AllViewLazy />,
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
        element: <VideoViewLazy />,
      },
      {
        path: '/main/music',
        element: <MusicViewLazy />,
      },
      {
        path: '/main/image',
        element: <ImagesViewLazy />,
      },
      {
        path: '/main/doc',
        element: <DocumentsViewLazy />,
      },
      {
        path: '/main/others',
        element: <OthersViewLazy />,
      },
    ],
  },
  { path: '/login', element: <LoginLazy /> },
  { path: '/qqlogincallback', element: <QqView /> },
]
export default baseRouter
