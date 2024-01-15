import { useLocation, useNavigate, useRoutes } from 'react-router-dom'
import baseRouter from './baseRouter'
import { useCookies } from 'react-cookie'
import { useEffect } from 'react'
import message from '@/utils/message'
const RouterView = () => {
  const [cookie, setCookie] = useCookies(['userInfo'])
  const Element = useRoutes(baseRouter)
  const navigate = useNavigate()
  const cookieUserInfo = cookie.userInfo
  const location = useLocation()
  useEffect(() => {
    if (!cookieUserInfo && location.pathname !== '/login') {
      message.error('未登录')
      navigate('/login')
    }
  }, [navigate])
  return <>{Element}</>
}
export default RouterView
