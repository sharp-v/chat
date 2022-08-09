# chat-frontend

## introduce

如何使用
我们需要 chat-frontend & chat-backend

chat-frontend 即当前路径下的所有文件 (除./chat-backend)
chat-backend 即./chat-backend下所有文件

项目在线地址 http://119.23.54.17:8080

1. 对于chat-frontend:
```sh
# 1. 安装依赖 主要依赖vue3.0 详情看package.json
npm install

# 2. 运行
npm run serve
# 注意与后端接口对应时,需注意 ./src/common/config.js 中配置网络 其中 网络地址参数 IP = 127.0.0.1, 端口参数 PORT = 9000;
# IP 与 PORT均为默认值,根据自己的后端配置,酌情修改
# 另后面可能配置为服务器上的chat-backend的IP和PORT,待续

# 3. 打包 得到前端文件
npm run build
```
2. 对于chat-backend: (均在./chat-backend/下)
   1. 配置环境
```sh
# 切换到对应目录
cd chat-backend

# 配置数据库ORM sequelize-cli
# 编辑 ./config/config.json 配置数据库用户，密码，数据库种类(方言 dialect) 等等 详细看sequelize官方文档
# 运行 ./config/db.sh 改文件用于创建数据库，表，以及生成种子，创建表暂时没有写完，初次创建的时候没有写到db.sh里面，我后续会补上
# 打开数据库，查看对应的库、表、种子数据是否都完成创建成功
```
   2. 运行
```sh
npm run dev
```
   3. pm2 项目管理
```sh
# pm2 管理项目工具 我还不会部署到服务器，之前是用Xshell传到阿里云服务器上 当前部署地址 119.23.54.17:8080
pm2 list                # 查看 当前服务器运行的项目
pm2 stop ${id}          # 根据pm2 list的项目列表id,终止对应id的项目
pm2 start ./src/app.js  # 启动项目
```


## other

1. 为何做这垃圾项目
   为了自己,学东西,提升自己的代码水平...

2. 后续想法
    想拿React重写前端, 写移动和桌面的两个

3. 重新写或者大改 chat-backend 代码
   我现在觉着,chat-backend写的太烂了,想重新写,或者大改
   目的:便于控制和管理代码