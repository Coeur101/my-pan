import { createContext } from 'react'
const RouterContent = createContext<{ upLoadFile?: (...args: any) => void }>({})
export default RouterContent
