import RouterContent from '@/utils/RouterContent'
import { useContext } from 'react'

const All: React.FC<any> = (props) => {
  const aa = useContext(RouterContent)
  console.log(aa)

  return <div>全部</div>
}
export default All
