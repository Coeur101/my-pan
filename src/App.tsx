import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom'
import RouterView from './router/index'
import { Spin } from 'antd'
import { useSelector } from 'react-redux'
import { getRouterOp } from './utils/request'
function App() {
  const res = useSelector((state: any) => state.globalLoading)
  getRouterOp(useNavigate(), useLocation())
  return (
    <BrowserRouter>
      <RouterView />
      <Spin spinning={res.state} fullscreen />
    </BrowserRouter>
  )
}

export default App
