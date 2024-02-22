import { Image } from 'antd'
import React, { forwardRef } from 'react'
interface privewImageProps {
  imageUrl: string
}
const PreviewImage = forwardRef(
  (
    props: privewImageProps,
    ref: React.ForwardedRef<{
      show: () => void
    }>
  ) => {
    const { imageUrl } = props
    const [visible, setVisible] = React.useState(false)
    const show = () => {
      setVisible(true)
    }
    React.useImperativeHandle(ref, () => {
      return {
        show,
      }
    })
    return (
      <div>
        <Image
          preview={{
            visible: visible,
            scaleStep: 1,
            src: imageUrl,
            onVisibleChange: (value: any) => {
              setVisible(value)
            },
          }}
        ></Image>
      </div>
    )
  }
)
export default PreviewImage
