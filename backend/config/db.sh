##############
#
#  sequelize-cli使用文件
#
##############

#  创建数据库
npx sequelize db:create
#   删除数据库
# npx sequelize db:drop list
#  创建用户表
npx sequelize-cli model:generate --name User --attributes id:integer,account:string,nickName:string,password:string,local:string,avatar:string,gender:integer,url:string,sign:string,phone:string,email:string
#  创建message表
npx sequelize-cli model:generate --name MessageState --attributes id:integer,sendId:integer,receiveId:integer,sendType:integer,content:string,type:integer,url:string
#  创建其他表 暂时没写入后续写入
#  运行迁移
npx sequelize-cli db:migrate
#  撤销迁移
# npx sequelize-cli db:migrate:undo:all
#  创建种子
npx sequelize-cli db:seed:all
# npx sequelize-cli seed:generate --name demo-user
# 撤销创建
# npx sequelize-cli db:seed:undo:all


# update mysql.user 
# set authentication_string=password('helloWorld') where user='root';