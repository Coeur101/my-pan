import { Outlet } from 'react-router-dom'
const AdminView = () => {
  return (
    <div>
      <h1>admin</h1>
      <Outlet></Outlet>
    </div>
  )
}
export default AdminView
