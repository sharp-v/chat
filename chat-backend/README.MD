# 基本功能期望

简单的聊天应用
要求:
1. 实时性
2. 好友消息，群组消息
3. 消息管理
4. 消息撤回
5. 动态

# Introduce
./chat-project-files 为项目文档，说明了项目后端的部分设计思路
./config/config.json sequelize 的配置文件
./config/db.sh 用sequelize-cli配置数据库、表以及生成数据种子
./migrations 和 ./models 相当于DDL 在这里配置DDL 具体看sequelize官方文档吧 我是个半调子
./seeders 数据种子
./src 后端文件
./static 静态资源文件夹，也即前端打包的输出文件夹

后端需要配置好数据库，该步骤较麻烦，我也忘得差不多了。。

```sh
# npm 运行项目
npm run dev
# pm2 运行项目
pm2 start ./src/app.js
```


## other
### 总体设计

后端依赖:nodejs,express,express-ws,mysql2,sequelize,+生成token的一个加密算法
前端依赖:vue3,vant3,axios,(Fetch),websocket,+一些静态的资源库(矢量图库,图片库)

前端功能:
用户登录注册,发送消息到服务器,发送websocket心跳包检测是否有新消息,配置管理

后端功能:
接收客户端websocket心跳消息,检索用户消息列表,转发客户端消息,用户配置管理接口
期间需要存储这些数据到redis中，因为redis是将数据存在内存中的

### 详细设计

后端部分：
redis只存两分钟的在线用户数据，用户也只能在两分钟内撤回数据
设置一个频率更新redis中的数据：
将那些没有在线的用户的关系的数据清除，这是因为一个用户登录后，这里让它的所有有关系的用户的关系数据也让redis存储在内存中
而这些数据如果不清除只会耗费内存



### 核心问题

websocket心跳设置
心跳间隔不宜过长，过长没有实时性
过短，这个害怕服务器吃不消

