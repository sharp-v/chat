const express = require('express');
const expressWs = require('express-ws');

const app = express();
const { PORT, ALLOW_CORS } = require('./config');
const {
    // token_middleware,
    catch_error_middleware,
    handle_unknow_middleware,
} = require('./api/middleware/commen_middleware');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

expressWs(app);

/**
 * 设置允许cors跨域请求
 * 注：
 *    该api不需要token_middleware验证
 */
ALLOW_CORS && app.all('*', require('./api/middleware/cors'));

app.use(express.static('./static', { extensions: ['html', 'htm'] }));

/**
 * 测试api，无所谓
 */
app.use('/api/test', require('./api/test').test);

/**
 * 文件上传
 */
app.use('/api/upload', require('./api/upload/index'));
/**
 *  登录和注册请求
 * 注：
 *    该api不需要token_middleware验证
 *  */
app.use('/api', require('./api/system'));
/**
 * 有关用户的relation的api
 */
app.use('/api/relation', require('./api/relation'));

/**
 *  关于系统的所有的查询
 *  因为查询一类多于其他的内容,而且进行查询操作时,也比较统一,
 *  故将查询与其他业务分开
 * */
app.use('/api/query', require('./api/query'));

/**
 * 特殊的websocket api
 * chat,接受消息
 * 注：
 *    该api不需要token_middleware验证
 */
app.use('/api', require('./api/chat'));

/**
 * 该api是用户对自己账户进行关联的api
 *
 */
app.use('/api/account', require('./api/account'));

/**
 * 处理未设置的api
 */
app.use('*', handle_unknow_middleware);

/**
 * 捕获api异常
 */
app.use(catch_error_middleware);

app.listen(PORT, () => {
    console.log('server start up');
});
