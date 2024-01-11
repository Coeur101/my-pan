import { ResponseType } from 'axios'
export interface RequestType {
  url: string
  params: any
  dataType?: string
  showLoading?: boolean
  responseType?: ResponseType | undefined
  uploadProgressCallback?: (event: any) => void
  errorCallback?: (info: string) => void
  showError?: boolean
}
