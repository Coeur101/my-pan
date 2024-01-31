// 整合各种预览组件
interface PreviewPropType {
  type: '0' | '1' | '2' | '3' | '4' // 文件预览类型
  show: boolean // 是否打开弹窗
}
const Preview: React.FC<PreviewPropType> = () => {
  return <div>123</div>
}
export default Preview
