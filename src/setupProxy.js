const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api/v1', {
      target: 'https://dashscope.aliyuncs.com',
      changeOrigin: true,
      secure: false,
    }),
    createProxyMiddleware('/api', {
      target: 'http://localhost:7090',
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api',
      },
    })
  )
  /* app.use(
    
  ) */
}
