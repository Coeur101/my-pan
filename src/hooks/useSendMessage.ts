import { sendTongyiMessage } from '@/api'
import { CreateAxiosInstance } from '@/utils/request'
import { Readable } from 'stream'
import readline from 'readline'
export const callQwen = async ({
  text,
  history,
  apiKey,
  onMessage,
}: {
  text: string
  history: any
  onMessage: (msg: string) => void
  apiKey: string
}) => {
  const response = await fetch(
    `${process.env.REACT_APP_BASE_URL}/v1/services/aigc/text-generation/generation`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-DashScope-SSE': 'enable',
      },
      body: getParams(text, history),
    }
  )
  console.log(response)
  const reader = (response as any).body?.getReader()

  if (!reader) return
  while (true) {
    const { value, done } = await reader.read()
    const utf8Decoder = new TextDecoder('utf-8')
    const resultText = value ? utf8Decoder.decode(value, { stream: true }) : ''
    try {
      const data = getResult(resultText)
      if (data.output.text) {
        onMessage(data.output.text)
      }
    } catch (e) {}
    if (done) {
      break
    }
  }
}
function getParams(message: string, history: any) {
  return JSON.stringify({
    model: 'qwen-max',
    input: {
      prompt: message,
      history: getHistory(history),
    },
    parameters: {
      incremental_output: true,
    },
  })
}
function getHistory(history: any) {
  const array = []
  // 排除最后一条 history，因为是本次刚发的消息
  for (let i = 0; i < history.length - 2; i += 2) {
    const assistantMsg = history[i]
    const chat = history[i + 1]
    array.push({
      user: chat.content,
      bot: assistantMsg && assistantMsg.content,
    })
  }
  return array
}

function getResult(resultText: string) {
  const lines = resultText.split('\n')
  for (const line of lines) {
    if (line.startsWith('data:')) {
      const data = JSON.parse(line.slice(5))
      return data
    }
  }
}
