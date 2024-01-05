import { useRoutes } from 'react-router-dom'
import baseRouter from './baseRouter'

const RouterView = () => {
  const Element = useRoutes(baseRouter)
  return <>{Element}</>
}
export default RouterView
