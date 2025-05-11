const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://prayertimes.dynv6.net',
            changeOrigin: true,
            pathRewrite: { '^/api': '/api' }
        })
    );


    app.use((req, res, next) => {
        if (req.path.startsWith('/videos') || req.path.startsWith('/images')) {
            createProxyMiddleware({
                target: 'https://signage.igmg-bs.de',
                changeOrigin: true
            })(req, res, next);
        } else {
            next();
        }
    });
};