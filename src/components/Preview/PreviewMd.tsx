import { getFileInfo } from '@/api'
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
}> = (props) => {
  const { fileId } = props
  const [content, setContent] = useState('')
  useEffect(() => {
    initContent()
  }, [])
  const initContent = async () => {
    const res = await getFileInfo(fileId, 'arraybuffer')
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
