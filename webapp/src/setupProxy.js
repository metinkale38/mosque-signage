const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://opt.mk38.dev',
            changeOrigin: true,
            pathRewrite: { '^/api': '' }
        })
    );


    app.use((req, res, next) => {
        if (req.path.startsWith('/videos') || req.path.startsWith('/images')|| req.path.startsWith('/fullscreen')) {
            createProxyMiddleware({
                target: 'https://signage.igmg-bs.de',
                changeOrigin: true
            })(req, res, next);
        } else {
            next();
        }
    });
};