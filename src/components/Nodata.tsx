import { ReactNode } from 'react'
import Icon from './Icon'

interface NodataProps {
  msg: string
  children?: ReactNode
  // 是否使用原生的nodata
  isOrigin: true
}
const NoData: React.FC<NodataProps> = ({ msg, children, isOrigin }) => {
  return (
    <div>
      {isOrigin ? (
        <div className="text-center p-[10px_0px]">
          <Icon iconName="noData" width={120} fit="fill"></Icon>
          <div className="text-[14px] text-[#909399] mt-[10px]">{msg} </div>
        </div>
      ) : (
        children
      )}
    </div>
  )
}
export default NoData
