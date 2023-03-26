# api

这里列一下整个系统的流程,这里服务器作为一个中间站,存储转发信息

前提:
服务器一直开着,且websocket对象一直处于等待连接状态 ws.onmessage

<!-- 目前已完成的api -->
## register  http

## login     http
前端发送账户account和password数据
后端根据前端的req信息和数据,生成token存储在redis中,并response token
用户收到token后,就能进入chat

## 用户信息请求 http
   
## chat      websocket连接

1. 首次连接登录,获取数据库表中未读取的消息,将用户添加到在线用户状态缓存中,将用户关系查表缓存
这是websockt的第一件事情
客户端的请求中包含首次登录信息

- 将用户状态设为在线,再user缓存中增加一个user
- 进行一次查message表的操作,
- 一次查relation表的操作,将用户的relation缓存

将查到的message中的receiveId==userId的和当前userId和receiveId是群组关系的消息 
以及用户的relation返回,当然返回用户的relation是选择的,如果用户本地有数据则不用返回relation
然后 ws.send()
然后将这些message数据存放到用户的本地缓存中,relation如果需要则存放

2. 客户端用户选择一个receiveId发送了消息,服务端将消息存储
客户端的websocket对象ws.send()
即ws.onmessage = (msg)=>{}
express将数据放入用户消息队列
存放机制：
查看消息的类型

message存入messages表中(同步进行,不await)
取出其中sendType==0,1的消息做判断
sendType==2的直接next,当然这里暂时不next,因为系统消息权限太高了,而系统又没有安全性
sendType==0,1的,筛选其中未发送的消息,且用户未将reminderlevel标记为3的消息
如果是用户间的消息sendType == 0，则查看user缓存中是否有receiveId
如果是群组消息sendType == 1,则express将message存入队列
系统消息sendType==2,暂时不允许...

3. express检索消息队列
通过messageMap.get(userId),即找到userId==receiveId的message[],然后转发该消息
express的websocket对象ws.send(message[])
将消息标记为服务器发送(队列中)
若发送成功，将消息标记为已发送,更新数据库
将message移出消息队列

### 特殊的
如果用户意外的断开了连接
ws.onerror
这个会在连接出现错误时触发,具体还不清楚...



## logout http
   退出登录
   并断开与服务器的websockt 客户端发起websockt对象 ws.close
   更新用户本地的缓存,即用户的个人关系数据和消息数据

## queryUser,queryGroup http
   查找用户,查找group

## newRelation http
   新建关系

## deleteRelation http
   删除关系
   后面这种情况暂定,感觉可以不用考虑->且要更新用户关系缓存,更新消息队列
   因为删除时,用户一定登录的,如果有当前用户的消息一定会通过websocket传输过来
   (数据库root用户删除情况不考虑)

## configProfile  http
   个人信息配置

## configRelation http
   配置关系信息,这个需要更新关系缓存,因为用户一定是登录的,而对应消息是需要实时的

##  configGroup  http,这个最复杂,再说吧...
   
##  comment  http,和chat一样复杂...再说吧...
   