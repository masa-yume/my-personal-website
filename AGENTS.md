# 给后续修改者的说明

这个仓库是一个课程作业个人网站。修改时保持它简单、能运行、能部署。

## 必须保留

- 前台展示个人简介、技能、学习经历、项目经历和联系方式。
- 后台可以修改这些内容，保存后刷新仍然存在。
- 未登录不能进入编辑页，也不能调用保存接口。
- 界面使用中文。
- 配色保持奶油白、浅绿色和深灰色，不要改成蓝紫色。
- 页面同时适合电脑和手机宽度。

## 不要添加

不要添加博客、评论、点赞、复杂动画、支付、多用户或图片上传。没有明确要求时，不要更换框架，也不要新增数据库服务。

## 代码位置

- `app/page.js`：前台页面。
- `app/admin/page.js`：后台编辑页。
- `app/admin/login/page.js`：登录页。
- `app/api/profile/route.js`：读取和保存资料。
- `app/api/auth/login/route.js`：登录。
- `lib/store.js`：本地 JSON 与 Vercel Blob 的读写。
- `lib/profile.js`：字段校验。
- `lib/session.js`：登录凭证签名，中间件也会引用它，不要在这个文件里使用 Node.js 文件模块。
- `data/profile.json`：本地资料和线上初始资料。
- `middleware.js`：拦截未登录的后台访问和保存请求。

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。后台地址是 `http://localhost:3000/admin`。没有配置环境变量时，本地密码是 `admin123`。

修改资料后，确认 `data/profile.json` 已变化，再刷新首页。

## 修改原则

先看 `PRD.md` 和 `TECH_DESIGN.md`。改动只覆盖当前要求，并在浏览器里检查前台、登录、保存和刷新。涉及布局时同时看窄屏。线上保存依赖用户自己创建的 Vercel Blob，不要把不存在的密钥写进仓库，也不要声称云服务已经配置完成。
