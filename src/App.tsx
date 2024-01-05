import { BrowserRouter } from 'react-router-dom'
import RouterView from './router/index'
import { Spin } from 'antd'
import { useSelector } from 'react-redux'
function App() {
  const res = useSelector((state: any) => state.globalLoading)
  console.log(res)
  return (
    <BrowserRouter>
      <RouterView />
      <Spin spinning={res.state} fullscreen />
    </BrowserRouter>
  )
}

export default App
