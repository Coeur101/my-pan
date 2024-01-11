import { qqloginCallback } from '@/api'
import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useLocation, useNavigate } from 'react-router-dom'

const QqLoginCallbackView = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [cookie, setCookie] = useCookies(['userInfo'])
  const query = new URLSearchParams(location.search)
  const login = async () => {
    try {
      let res = await qqloginCallback(
        query.get('code') as string,
        query.get('state') as string,
        () => {
          navigate('/')
        }
      )
      if (res?.code !== 200) {
        return
      }
      let redirectUrl = res.data.callbackUrl || '/'
      if (redirectUrl === '/login') {
        redirectUrl = '/'
      }
      setCookie('userInfo', res.data.userInfo)
      navigate(`${redirectUrl}`)
    } catch (error) {}
  }
  useEffect(() => {
    login()
  }, [])
  return <div>登陆中,请勿刷新</div>
}
export default QqLoginCallbackView
