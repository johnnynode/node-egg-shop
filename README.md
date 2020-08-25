node-egg-shop
---

基于eggjs的电商平台项目

## 项目启动

- 开启本地mongodb数据库：
    * eg: 新建终端(或cmd)窗口，执行 $ `mongod -f /usr/local/mongodb/etc/mongod.conf`
    * 默认占用端口：27017
    * 本地终端连接数据库：$ `mongo eggshop -u eggadmin -p 123456`
- 开启本地redis数据库：
    * 如若使用，先在config/plugin.js中开启配置，默认是关闭的
    * eg: 新建终端(或cmd)窗口，执行 $redis-cli$
    * 默认占用端口：6379
- 开启本地elasticsearch相关服务
    * 如若使用，先在config/plugin.js中开启配置，默认是关闭的
    * eg: 在终端(或cmd)窗口，执行 $elasticsearch$ (注意：配置好相关环境变量，不再赘述)
    * 默认占用端口：9200
- 运行本项目
    * $npm run dev$
    * 打开浏览器，访问：http://127.0.0.1:7001 (如果端口有冲突会增加端口号的方式来打开)

## 项目结构

1 ） **服务分层**

- 后台管理系统
- 前端页面展示
- API提供
- 其他服务

2 ) **文件结构**


```tree
egg-shop
├── package.json
├── app.js (可选)
├── agent.js (可选)
├── app
│   ├── router.js
│   ├── controller.js
│   │   └── home.js
│   ├── service.js
│   │   └── my_task.js
│   ├── public(可选)
│   │   └── reset.css
│   └── view(可选)
│   │   └── home.tpl
│   └── extend(可选)
│       ├── helper.js (可选)
│       ├── request.js (可选)
│       ├── response.js (可选)
│       ├── context.js (可选)
│       ├── application.js (可选)
│       └── agent.js
├── config
│   ├── plugin.js
│   ├── config.default.js
│   ├── config.prod.js
│   ├── config.test.js (可选)
│   ├── config.local.js (可选)
│   └── config.unittest.js (可选)
├── test
│   ├── middleware
```

## 测试账户

- 前台登录: 15311121111/123456
- 后台登录：admin/123456

## 开发相关

- 涉及开发细节，注意事项，todolist(相关改进), 持续集成和部署

- 详情见[gitbook]()

### 商城前台

**商品模块实现流程**

- 实现商品类型的增删改查
- 实现商品类型属性的增删改查，并实现类型和类型对应属性的关联
- 实现商品分类的增删改查，并实现商品分类表的自关联
- 实现商品模块的增删改查、并且实现商品和商品分类、商品类型、颜色等其他表的关联

**商品模块相关的数据库表ER图**

<div align="center">
    <img with="800" src="./screenshot/2.jpg">
</div>

### 关于分页的问题

**数据库分页查询数据的原理算法**

规则：规定每页 20 条数据的查询方式
查询第一页（page=1）:
db.表名.find().skip(0).limit(20)
查询第二页（page=2）:
db.表名.find().skip(20).limit(20)
查询第三页（page=3）:
db.表名.find().skip(40).limit(20)

规则：规定每页 8 条数据的查询方式
查询第一页（page=1）:
db.表名.find().skip(0).limit(8)

查询第二页（page=2）:
db.表名.find().skip(8).limit(8)
查询第三页（page=3）:
db.表名.find().skip(16).limit(8)
查询第四页（page=4）:
db.表名.find().skip(24).limit(8)

总结：分页查询的 sql 语句
db.表名.find().skip((page-1)*pageSize).limit(pageSize)

**Mongoose 实现分页的方法**

地址：https://mongoosejs.com/docs/queries.html

```js
Person. find({
occupation: /host/,
'name.last': 'Ghost',
age: { $gt: 17, $lt: 66 },
likes: { $in: ['vaporizing', 'talking'] }
}).
limit(10). sort({ occupation: -1 }). select({ name: 1, occupation: 1 }). exec(callback);

// Using query builder
Person. find({ occupation: /host/ }). where('name.last').equals('Ghost'). where('age').gt(17).lt(66). where('likes').in(['vaporizing', 'talking']).
limit(10). sort('-occupation'). select('name occupation'). exec(callback);
```

**数据结合 jqPaginator 实现分页**

插件文档：http://jqpaginator.keenwon.com/

### 前台用户注册流程

- 填入手机号，图形验证码，进行前置校验程序
- 发送验证码，手机获取的验证码和服务器验证码做比较，成功则进入下一步，否则提示错误信息
- 设置账户密码，服务器端生成一条用户数据

### 开发相关

**数据相关**

**插件相关**


**开发顺序**

- 

**微服务**

- 主要采用Nodejs, Seneca, PM2 实践
- 测试框架采用基于nodejs的Mocha和Chai
- 使用Sinon来mock服务以及Swagger文档化微服务

**项目周期**

- 敏捷流程
- 版本管理
- 文档管理
- 自动化
- 缺陷控制

**DevOps**

- 规划
- 编码
- 构建
- 测试
- 部署
- 发布
- 监控
- 运维

- 持续优化
- CI CD
- Harbor Docker 技术
- 前后端分离

### 技术栈相关系统

- 基于Nodejs框架eggjs开发的电商系统 (maintaining)
- 基于Nodejs框架koa2开发的CMS系统 (doing)
- 基于Nodejs框架nestjs开发的电商系统 (todo)
- 基于Golang+Beego+Grom开发的电商系统 (todo)
- 基于Nodejs的流媒体直播系统 (todo)
- 基于Golang的流媒体直播系统 (todo)