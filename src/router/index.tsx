import { useLocation, useNavigate, useRoutes } from 'react-router-dom'
import baseRouter from './baseRouter'
import { useCookies } from 'react-cookie'
import { useEffect } from 'react'
import message from '@/utils/message'
const RouterView = () => {
  const [cookie, setCookie] = useCookies(['userInfo'])
  const location = useLocation()
  const Element = useRoutes(baseRouter, location)
  const navigate = useNavigate()
  const cookieUserInfo = cookie.userInfo
  useEffect(() => {
    if (!cookieUserInfo && location.pathname !== '/login') {
      message.error('未登录')
      navigate('/login')
    }
  }, [navigate, cookieUserInfo, location.pathname])

  return <>{Element}</>
}

export default RouterView
