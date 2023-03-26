const { code } = require('../api-code');
/**
 * 验证headers中是否有token
 * 所有用户处了登录和注册之外都需要该中间件做验证(chat,tochat例外)
 */
function token_middleware(req, res, next) {
    console.log('token check middleware');
    const token = req.headers['token'];
    console.log(req.originalUrl);
    console.log(token);
    if (token) {
        next();
    } else {
        res.state(401).send({
            code: code.system.confirm.token.noPermission.value,
        });
    }
}

function catch_error_middleware(err, req, res, next) {
    if (err) {
        res.status(500).send({
            code: code.system.catchErr.error,
            data: { detail: err.message },
        });
    }
}

function handle_unknow_middleware(req, res) {
    res.status(404).send({
        status: '404',
        message: '404',
    });
}

module.exports = {
    token_middleware,
    catch_error_middleware,
    handle_unknow_middleware,
};
