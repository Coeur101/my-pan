import React, { ReactNode, useEffect, useMemo, useState } from 'react'
// 通用背景蒙层，用于预览
const WindowMask: React.FC<{
  children: ReactNode
  title?: string
  align: string
  show: boolean
  width: number
  close: () => void
}> = (props) => {
  const { children, title, align, show, width, close } = props
  useEffect(() => {
    window.addEventListener('resize', resizeWindow)
    return () => {
      window.removeEventListener('resize', resizeWindow)
    }
  }, [])
  const [maskWidth, setMaskWidth] = useState(window.innerWidth)
  const maskContentWidth = useMemo(() => {
    return width > maskWidth ? maskWidth : width
  }, [maskWidth, width])
  const maskContentLeft = useMemo(() => {
    return maskWidth - maskContentWidth < 0
      ? 0
      : (maskWidth - maskContentWidth) / 2
  }, [maskWidth, width])
  // 监听屏幕大小
  const resizeWindow = () => {
    setMaskWidth(window.innerWidth)
  }
  return (
    <div>
      {show ? (
        <div className="top-0 left-0 w-full h-[100vh] z-[200] opacity-50 bg-black fixed "></div>
      ) : null}
      {show ? (
        <div
          className="z-[202] cursor-pointer fixed font-bold text-white top-[32px] right-[32px] w-[44px] h-[44px] rounded-[22px] bg-[rgba(0,0,0,0.1)] flex justify-center items-center"
          onClick={() => close()}
        >
          <span className="iconfont icon-close2"></span>
        </div>
      ) : null}

      <div
        className="z-[201] absolute bg-white"
        style={{ top: 0, left: maskContentLeft, width: maskContentWidth }}
      >
        {show ? (
          <div className="text-center leading-10 border-b border-b-[#ddd] font-bold">
            {title}
          </div>
        ) : null}
        <div
          className="h-[calc(100vh-61px)] pb-10   overflow-auto"
          style={{ alignItems: align }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
export default WindowMask
