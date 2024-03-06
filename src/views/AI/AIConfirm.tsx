import MdPreview from '@/components/MdPreview'
import {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import cryptoJS from 'crypto-js'
import message from '@/utils/message'
import { callQwen } from '@/hooks/index'
import { Input } from 'antd'
import ChatLoading from '@/components/ChatLoading'
import ChatCopy from '@/components/ChatCopy'
interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  key?: number
}
const roleAlias = { user: 'ME', assistant: 'PanGPT', system: 'System' }
const AIConfirm = () => {
  const [messageContent, setMessageContent] = useState('')
  const [messageList, setMessageList] = useState<ChatMessage[]>([
    {
      key: Date.now() + Math.random(),
      role: 'system',
      content: '你是 ChatGPT，OpenAI 训练的大型语言模型，尽可能简洁地回答。',
    },
    {
      key: Date.now() + Math.random(),
      role: 'assistant',
      content: `你好，我是AI语言模型，我可以提供一些常用服务和信息，例如：
  
  1. 翻译：我可以把中文翻译成英文，英文翻译成中文，还有其他一些语言翻译，比如法语、日语、西班牙语等。
  
  2. 咨询服务：如果你有任何问题需要咨询，例如健康、法律、投资等方面，我可以尽可能为你提供帮助。
  
  3. 闲聊：如果你感到寂寞或无聊，我们可以聊一些有趣的话题，以减轻你的压力。
  
  请告诉我你需要哪方面的帮助，我会根据你的需求给你提供相应的信息和建议。`,
    },
  ])
  const [apiKey, setApiKey] = useState('')
  const [isTalking, setIsTalking] = useState(false)
  const [isConfig, setIsConfig] = useState(false)
  const clickConfig = () => {
    if (!isConfig) {
      setMessageContent(getAPIKey())
    } else {
      setMessageContent('')
    }
    setIsConfig(!isConfig)
  }
  const sendChatMessage = useCallback(
    async (content: string) => {
      try {
        setIsTalking(true)
        if (messageList.length === 2) {
          messageList.pop()
        }
        setMessageContent('')
        setMessageList((prevMessageList) => [
          ...prevMessageList,
          {
            key: Date.now() + Math.random(),
            role: 'user',
            content: messageContent,
          },
          {
            key: Date.now() + Math.random(),
            role: 'assistant',
            content: '',
          },
        ])
        const apiKey = getAPIKey()
        await callQwen({
          text: content,
          history: messageList,
          apiKey,
          onMessage: (msg: string) => {
            appendLastMessageContent(msg)
          },
        })
      } catch (error: any) {
        appendLastMessageContent(error)
      } finally {
        setIsTalking(false)
      }
    },
    [messageContent]
  )
  const saveAPIKey = (apiKey: string) => {
    if (apiKey.slice(0, 3) !== 'sk-' || apiKey.length !== 35) {
      message.warning('API Key 错误，请检查后重新输入！')
      return false
    }
    const aesAPIKey = cryptoJS.AES.encrypt(apiKey, getSecretKey()).toString()
    localStorage.setItem('apiKey', aesAPIKey)
    return true
  }
  const sendOrSave = () => {
    if (!messageContent.length) return
    if (isConfig) {
      if (saveAPIKey(messageContent.trim())) {
        setIsConfig(!isConfig)
        message.success('API key 设置成功')
      }
      setMessageContent('')
    } else {
      if (!getAPIKey()) {
        message.warning('请将APIkey填写完整,再使用聊天功能')
        return
      }
      sendChatMessage(messageContent)
    }
  }

  const getAPIKey = () => {
    if (apiKey) return apiKey
    const aesAPIKey = localStorage.getItem('apiKey') ?? ''
    setApiKey(
      cryptoJS.AES.decrypt(aesAPIKey, getSecretKey()).toString(
        cryptoJS.enc.Utf8
      )
    )
    return cryptoJS.AES.decrypt(aesAPIKey, getSecretKey()).toString(
      cryptoJS.enc.Utf8
    )
  }
  const appendLastMessageContent = (content: string) => {
    setMessageList((prev) => {
      // 拷贝前一个状态数组
      const updatedList = [...prev]
      // 将消息添加到最后一条消息的内容中
      updatedList[updatedList.length - 1].content += content
      return updatedList
    })
  }
  const handleInputChange = (e: any) => {
    setMessageContent(e.target.value)
  }

  const handleButtonClick = () => {
    sendOrSave()
  }
  const handleInputKeyPress = (e: any) => {
    if (!isTalking) {
      handleButtonClick()
    }
  }

  useEffect(() => {
    // 从本地获取聊天记录，解决切换组件导致记录被删除
    const localMessageList =
      localStorage.getItem('messageHistory') &&
      JSON.parse(localStorage.getItem('messageHistory') as string)
    setMessageList(localMessageList)
  }, [])
  useEffect(() => {
    return () => {
      localStorage.setItem(
        'messageHistory',
        JSON.stringify(
          messageList.length === 0
            ? [
                {
                  key: Date.now() + Math.random(),
                  role: 'system',
                  content:
                    '你是 ChatGPT，OpenAI 训练的大型语言模型，尽可能简洁地回答。',
                },
                {
                  key: Date.now() + Math.random(),
                  role: 'assistant',
                  content: `你好，我是AI语言模型，我可以提供一些常用服务和信息，例如：
      
                      1. 翻译：我可以把中文翻译成英文，英文翻译成中文，还有其他一些语言翻译，比如法语、日语、西班牙语等。
                      
                      2. 咨询服务：如果你有任何问题需要咨询，例如健康、法律、投资等方面，我可以尽可能为你提供帮助。
                      
                      3. 闲聊：如果你感到寂寞或无聊，我们可以聊一些有趣的话题，以减轻你的压力。
                      
                      请告诉我你需要哪方面的帮助，我会根据你的需求给你提供相应的信息和建议。`,
                },
              ]
            : messageList
        )
      )
    }
  }, [messageList])

  const getSecretKey = () => 'lianginx'
  return (
    <div className=" flex-col z-50 relative">
      <div className="flex flex-nowrap sticky top-[56px] w-full items-baseline  px-6 py-4 bg-gray-100">
        <div className="text-2xl font-bold">PanGPT</div>
        <div className="ml-4 text-sm text-gray-500">
          基于 通义千问 的 ChatGPT 自然语言模型人工智能对话
        </div>
        <div
          className="ml-auto px-3 py-2 text-sm cursor-pointer hover:bg-white rounded-md"
          onClick={() => {
            clickConfig()
          }}
        >
          设置
        </div>
        <div
          className=" px-3 py-2 text-sm cursor-pointer hover:bg-white rounded-md"
          onClick={() => {
            setMessageList([])
          }}
        >
          清空聊天记录
        </div>
      </div>
      <Message messageList={messageList}></Message>
      <div className="sticky bottom-0 w-full p-6 pb-8 bg-gray-100">
        {isConfig ? (
          <div className="-mt-2 mb-2 text-sm text-gray-500">
            请输入 API Key：
          </div>
        ) : null}

        <div className="flex">
          <Input
            value={messageContent}
            onChange={handleInputChange}
            onPressEnter={handleInputKeyPress}
            type={isConfig ? 'password' : 'text'}
            placeholder={isConfig ? 'sk-xxxxxxxxxx' : '请输入'}
            className="mr-[10px]"
          />
          <button
            className="px-4 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-700 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 whitespace-nowrap disabled:bg-blue-300"
            onClick={() => {
              handleButtonClick()
            }}
            disabled={isTalking}
          >
            {isConfig ? '保存' : '发送'}
          </button>
        </div>
      </div>
    </div>
  )
}
const Message: FC<{
  messageList: ChatMessage[]
}> = (props) => {
  const { messageList } = props
  const chatListDom = useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
    if (!chatListDom.current) return
    chatListDom.current.scrollTo(0, chatListDom.current.scrollHeight)
  }
  useLayoutEffect(() => {
    scrollToBottom()
  }, [messageList])
  return (
    <div
      className="flex-1 mx-2  h-[500px] overflow-auto scroll-p-0 "
      style={{ scrollbarWidth: 'none' }}
      ref={chatListDom}
    >
      {messageList
        .filter((v) => v.role !== 'system')
        .map((item, index) => {
          return (
            <div
              className="group flex flex-col px-4 py-3 hover:bg-slate-100 rounded-lg"
              key={item.key}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="font-bold">{roleAlias[item.role]}：</div>
                <ChatCopy
                  className="invisible group-hover:visible"
                  content={item.content}
                />
              </div>
              <div>
                {item.content ? (
                  <div className="prose text-sm text-slate-600 leading-relaxed">
                    <MdPreview content={item.content}></MdPreview>
                  </div>
                ) : (
                  <ChatLoading />
                )}
              </div>
            </div>
          )
        })}
    </div>
  )
}
export default AIConfirm
