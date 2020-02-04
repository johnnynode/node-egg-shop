# node-egg-shop

## 项目结构

- 后台管理系统

- 前端页面展示

- API提供

- 其他服务

## 用户RBAC权限管理

- RBAC 实现流程
    * 1、实现角色的增、删、改、查 
    * 2、实现用户的增、删、改、查，增加修改用户的时候需要选择角色 
    * 3、实现权限的增、删、改、查 (页面菜单) 
    * 4、实现角色授权功能 
    * 5、判断当前登录的用户是否有访问菜单的权限 
    * 6、根据当前登录账户的角色信息动态显示左侧菜单

- 用户RBAC权限管理
    * 用户管理
        * 用户列表
        * 添加用户
        * 编辑用户
        * 设置角色
    * 角色管理
        * 角色列表
        * 添加角色
        * 编辑角色
        * 设置权限
    * 权限管理
        * 权限列表
        * 添加权限
        * 编辑权限

### 权限控制相关的数据库表

- admin
    * _id
    * username
    * password
    * mobile
    * email
    * status
    * role_id
    * add_time
    * is_super
- role
    * _id
    * title
    * description
    * status
    * add_time
- role_access
    * _id
    * access_id
    * role_id
- access
    * _id
    * module_name
    * action_name
    * type
    * url
    * status
    * module_id
    * sort
    * description
    * add_time

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org