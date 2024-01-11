import React, { LazyExoticComponent, lazy } from 'react'
// 定义懒加载路由组件的porps类型
const LoginLazy: LazyExoticComponent<any> = lazy(
  () => import('@/views/LoginView')
)
const LayoutLazy: LazyExoticComponent<any> = lazy(
  () => import('@/views/layout/LayoutView')
)
const QqView: LazyExoticComponent<any> = lazy(
  () => import('@/views/qqLoginCallbackView/QqLoginCallbackView')
)
const baseRouter = [
  { path: '/', element: <LayoutLazy /> },
  { path: '/login', element: <LoginLazy /> },
  { path: '/qqlogincallback', element: <QqView /> },
]
export default baseRouter
