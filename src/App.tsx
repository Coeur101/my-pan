import { BrowserRouter } from 'react-router-dom'
import RouterView from './router/index'
import { Spin } from 'antd'
import { useSelector } from 'react-redux'
//@ts-ignore
import { KeepaliveScope } from 'react-keepalive-component'
function App() {
  const res = useSelector((state: any) => state.globalLoading)
  return (
    <BrowserRouter basename="/">
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
