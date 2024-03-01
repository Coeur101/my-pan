import { FC } from 'react'
import ReactMarkDown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
  vscDarkPlus,
  dracula,
} from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
const MdPreview: FC<{
  content: string
}> = (props) => {
  const { content } = props
  return (
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
  )
}
export default MdPreview
