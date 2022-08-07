# chat-frontend

## introduce

如何使用
我们需要 chat-fontend & chat-backend, 但是现在只有 chat-frontend
1. 对于chat-frontend:

```sh
# 1. 安装依赖 主要依赖vue3.0 详情看[package.json](./package.json)
npm install
# 2. 运行
npm run serve
# 注意与后端接口对应时,需注意 ./src/common/config.js 中配置网络 其中 网络地址参数 IP = 127.0.0.1, 端口参数 PORT = 9000;
# IP 与 PORT均为默认值,根据自己的后端配置,酌情修改
#   另后面可能配置为服务器上的chat-backend的IP和PORT,待续
# 3. 打包 得到前端文件
npm run build
```
2. 对于chat-backend:
    等待后续提交该部分代码

## other

1. 为何做这垃圾项目
   为了自己,学东西,提升自己的代码水平...

2. 后续想法
    想拿React重写前端, 写移动和桌面的两个

3. 重新写或者大改 chat-backend 代码
   我现在觉着,chat-backend写的太烂了,想重新写,或者大改
   目的:便于控制和管理代码