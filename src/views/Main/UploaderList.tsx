import React, { forwardRef } from 'react'

const UploaderList = forwardRef(
  (
    props: any,
    ref: React.ForwardedRef<{ addFileToList: (...args: any) => void }>
  ) => {
    const addFileToList = (file: Blob, filePid: string) => {
      console.log(123)
    }
    React.useImperativeHandle(ref, () => {
      return {
        addFileToList,
      }
    })
    return (
      <div className="w-[798px]">
        <div className="border-b border-[#dddd] leading-10 text-[15px]">
          <span>上传任务</span>
          <span className="text-[13px] text-[#a9a9a9]">仅展示本次</span>
        </div>
        <div className="overflow-auto p-[10px_0] min-h-[50vh] max-h-[calc(100vh-120px)]"></div>
      </div>
    )
  }
)
export default UploaderList
