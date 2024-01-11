import { message as antdMessage } from 'antd'
import { NoticeType } from 'antd/es/message/interface'
const showMessage = (msg: string, type: NoticeType, callback?: () => void) => {
  antdMessage.open({
    type: type,
    content: msg,
    onClose: () => {
      if (callback) {
        callback()
      }
    },
  })
}
const message = {
  error: (msg: string, callback?: () => void) => {
    showMessage(msg, 'error', callback)
  },
  success: (msg: string, callback?: () => void) => {
    showMessage(msg, 'success', callback)
  },
  warning: (msg: string, callback?: () => void) => {
    showMessage(msg, 'warning', callback)
  },
}
export default message
