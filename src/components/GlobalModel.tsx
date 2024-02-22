import { Button, Modal } from 'antd'
import style from './style/model.module.scss'
import { ReactNode } from 'react'
import { ButtonType } from 'antd/es/button'
export type ModelProps = {
  title?: string
  padding?: number | string
  children?: ReactNode
  buttons?: {
    type?: ButtonType
    click?: () => void
    text?: string
  }[]
  show?: boolean
  cancelBtn?: boolean
  close?: () => void
  width?: string | number
  top?: number
  destroy?: boolean
}
const GlobalModel = <T extends ModelProps>(props: T) => {
  const {
    title,
    close,
    padding,
    children,
    buttons,
    show,
    cancelBtn,
    width,
    top,
    destroy,
  } = props
  const maxHeight = window.innerHeight - (top as number) - 50
  return (
    <Modal
      title={title}
      open={show}
      width={width || 520}
      destroyOnClose={true}
      style={{ top: top || 30 }}
      cancelButtonProps={{ type: 'link' }}
      onCancel={() => {
        if (destroy) {
          Modal.destroyAll()
        }
        close!()
      }}
      cancelText="取消"
      footer={(_, { OkBtn, CancelBtn }) => (
        <>
          <div className={style.modelFooter}>
            {(buttons && buttons!.length > 0) || cancelBtn ? (
              <>
                {cancelBtn ? <CancelBtn></CancelBtn> : null}
                {buttons?.map((btn, index) => (
                  <Button
                    type={btn.type}
                    className="bg-btn-primary"
                    key={index}
                    onClick={btn.click}
                  >
                    {btn.text}
                  </Button>
                ))}
              </>
            ) : (
              <OkBtn />
            )}
          </div>
        </>
      )}
    >
      <div
        className={style.moduleBox}
        style={{ maxHeight: maxHeight, padding: padding }}
      >
        {children}
      </div>
    </Modal>
  )
}
GlobalModel.defaultProps = {
  top: 30,
}
export default GlobalModel
