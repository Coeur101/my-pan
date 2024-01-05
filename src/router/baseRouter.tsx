import React, { LazyExoticComponent, lazy } from 'react'
// 定义懒加载路由组件的porps类型
const LoginLazy: LazyExoticComponent<any> = lazy(
  () => import('../views/LoginView')
)
const AdminLazy: LazyExoticComponent<any> = lazy(
  () => import('../views/admin/AdminView')
)
const baseRouter = [
  { path: '/', element: <LoginLazy /> },
  { path: '/admin/*', element: <AdminLazy /> },
]
export default baseRouter
