const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://prayertimes.dynv6.net/api',
            changeOrigin: true
        })
    );
};