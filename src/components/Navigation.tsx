interface navigationProps {
  isWatchPath: boolean
}
const Navigation: React.FC<navigationProps> = () => {
  return (
    <div className="text-[13px] flex items-center leading-10">全部文件 </div>
  )
}
export default Navigation
