interface IconProps {
  fielType?: number
  iconName?: string
  cover?: string
  width?: number
  fit?: any
}
const Icon: React.FC<IconProps> = (props) => {
  const { width, fit, cover, iconName, fielType } = props
  const fileTypeMap = {
    0: { desc: '目录', icon: 'folder' },
    1: { desc: '视频', icon: 'video' },
    2: { desc: '音频', icon: 'music' },
    3: { desc: '图片', icon: 'image' },
    4: { desc: 'exe', icon: 'pdf' },
    5: { doc: 'doc', icon: 'word' },
    6: { desc: 'excel', icon: 'excel' },
    7: { desc: '纯文本', icon: 'txt' },
    8: { desc: '程序', icon: 'code' },
    9: { desc: '压缩包', icon: 'zip' },
    10: { desc: '其他文件', icon: 'others' },
  }
  const getImage = () => {
    if (cover) {
      return `/api/file/getImage${cover}`
    }
    let icon = 'del'
    if (iconName) {
      icon = iconName
    } else {
      const iconMap = (fileTypeMap as any)[fielType as number]
      if (iconMap) {
        icon = iconMap['icon']
      }
    }
    return new URL(
      require(`@/assets/easypan静态资源/icon-image/${icon}.png`),
      import.meta.url
    ).href
  }
  return (
    <span className="inline-block" style={{ width: width, height: width }}>
      <img src={getImage()} alt="" style={{ objectFit: fit }} />
    </span>
  )
}
Icon.defaultProps = {
  width: 32,
  fit: 'cover',
}
export default Icon
