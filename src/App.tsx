import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom'
import RouterView from './router/index'
import { Spin } from 'antd'
import { useSelector } from 'react-redux'
function App() {
  const res = useSelector((state: any) => state.globalLoading)
  return (
    <BrowserRouter>
      <RouterView />
      <Spin
        spinning={res.state}
        fullscreen
        wrapperClassName="custom-spin-wrapper"
      />
    </BrowserRouter>
  )
}

export default App
