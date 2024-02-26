import { adminGetFileInfo, getFileInfo, shareGetFileInfo } from '@/api'
import React, { useEffect, useState } from 'react'
import ReactMarkDown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
  vscDarkPlus,
  dracula,
} from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
const PreviewMd: React.FC<{
  fileId: string
  previewType: 'user' | 'admin' | 'share'
  userId?: string
  shareId?: string
}> = (props) => {
  const { fileId, previewType, userId, shareId } = props
  const [content, setContent] = useState('')
  useEffect(() => {
    initContent()
  }, [])
  const initContent = async () => {
    let res
    if (previewType === 'admin') {
      res = await adminGetFileInfo(fileId, userId as string, 'arraybuffer')
    } else if (previewType === 'user') {
      res = await getFileInfo(fileId, userId)
    } else if (previewType === 'share') {
      res = await shareGetFileInfo(fileId, shareId as string)
    }
    setContent(arrayBufferToString(res))
  }
  const arrayBufferToString = (buffer: any, encoding = 'utf-8') => {
    const decoder = new TextDecoder(encoding)
    return decoder.decode(buffer)
  }
  return (
    <div className="bg-[#fafafa]">
      <ReactMarkDown
        remarkPlugins={[remarkGfm]}
        components={{
          //@ts-ignore
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
              <SyntaxHighlighter
                showLineNumbers={true}
                //@ts-ignore
                style={dracula}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
        }}
      >
        {content}
      </ReactMarkDown>
    </div>
  )
}
export default PreviewMd
