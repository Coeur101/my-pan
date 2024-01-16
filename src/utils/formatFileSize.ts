export const formatFileSize = (limit: number) => {
  let size = ''
  if (limit < 0.1 * 1024) {
    //如果小于0.1KB转化成B
    size = limit.toFixed(2) + 'B'
  } else if (limit < 0.1 * 1024 * 1024) {
    //如果小于0.1MB转化成KB
    size = (limit / 1024).toFixed(2) + 'KB'
  } else if (limit < 0.1 * 1024 * 1024 * 1024) {
    //如果小于0.1GB转化成MB
    size = (limit / (1024 * 1024)).toFixed(2) + 'MB'
  } else {
    //其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
  }
  let sizeStr = size + ''
  let index = sizeStr.indexOf('.')
  let dou = sizeStr.substr(index + 1, 2)
  if (dou == '00') {
    return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
  }
  return size
}
