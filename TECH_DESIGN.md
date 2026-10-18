# 技术方案

## 选择

网站使用 Next.js（App Router）和 React。页面样式写在一个 CSS 文件里，没有额外的界面库。选择它是因为一个项目同时包含页面和接口，部署到 Vercel 时不需要单独准备服务器。

代码使用 JavaScript，方便直接阅读和修改。

## 页面与接口

| 路径 | 作用 |
| --- | --- |
| `/` | 前台介绍页，每次请求都重新读取资料 |
| `/admin/login` | 登录页 |
| `/admin` | 编辑页，未登录会被转到登录页 |
| `GET /api/profile` | 读取资料 |
| `PUT /api/profile` | 保存资料，必须携带登录凭证 |
| `POST /api/auth/login` | 校验密码并写入登录 Cookie |
| `POST /api/auth/logout` | 清除登录 Cookie |

登录凭证是一个 HttpOnly Cookie，内容由 `ADMIN_SECRET` 签名，7 天后过期。服务端会再次校验签名和有效期，因此只隐藏编辑页还不够，直接调用保存接口也会被拒绝。

## 资料格式

资料是一个 JSON 对象，字段为 `name`、`title`、`bio`、`skills`、`education`、`projects`、`email`、`phone`、`other`。学习和项目经历是数组。保存前会去掉首尾空格、限制长度，并检查必填项。

## 保存方式

本地运行时，保存会写入 `data/profile.json`。刷新页面会重新读取这个文件，所以修改可以留下来。

Vercel 的运行环境不能把修改永久写回项目文件。线上保存使用 Vercel Blob，文件名为 `profile.json`，访问级别为私有。读取时关闭缓存，避免刚保存的内容被旧数据挡住。

当前代码没有替你创建 Blob，也没有填写线上密码。没有连接 Blob 时，线上点击保存会返回明确的失败说明，不会假装已经保存。

判断是否使用 Blob 的条件是环境变量里存在 `BLOB_STORE_ID` 或 `BLOB_READ_WRITE_TOKEN`。Vercel 把 Blob 存储连接到项目后，会自动提供 `BLOB_STORE_ID`。

## 环境变量

| 变量 | 本地 | Vercel |
| --- | --- | --- |
| `ADMIN_PASSWORD` | 可不填，默认 `admin123` | 必须填写，否则不能登录 |
| `ADMIN_SECRET` | 可不填，仅适合本地练习 | 必须换成自己的随机字符串 |
| Blob 相关变量 | 不需要 | 连接 Blob 存储后由 Vercel 写入 |

## 部署时需要的账号

1. 一个 Vercel 账号，用来导入项目并部署。
2. 在该 Vercel 项目里创建一个 Blob 存储，并连接到这个项目。Blob 在 Vercel 的免费额度内可用，但是需要你自己授权和创建。不需要再注册单独的数据库服务。

没有完成这两步时，本地保存仍然可用；线上网站可以展示随代码一起部署的初始资料，但不能把后台修改永久保存下来。

## 部署注意

`data/profile.json` 会随代码部署，作为初始资料。线上第一次成功保存后，以后读取的是 Blob 里的资料。本地文件和线上 Blob 互不影响。
