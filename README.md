# ES4A 在线文档

使用 Docsify，为 Simple 项目开发和类库开发提供公开文档。正文在 `docs/`，入口为 `docs/README.md`。

- [在线文档](https://es4a.paike.it/)
- [项目开发](https://es4a.paike.it/#/project/README)
- [类库开发](https://es4a.paike.it/#/library/README)

## 本地查看

从本目录启动静态 HTTP 服务，例如：

```bat
python -m http.server 8001 --bind 127.0.0.1
```

打开服务地址即可阅读。正文、主题与 Simple 高亮来自本仓库，Docsify 及通用插件来自现有 CDN；无需新增依赖。

## 维护

- 应用文档在 `docs/project/`，类库开发文档在 `docs/library/`；更新日志与开发计划分别维护。
- 新增或移动页面时，同步 `_sidebar.md`、搜索路径和相关 README 链接，检查网页、章节定位与搜索。不保留旧地址兼容页。
- 运行库与扩展库只维护使用方法，具体成员和样例随 SDK 版本查阅。
- 保留语言与配置规则及有效示例；核对信息写在正文开头的 HTML 注释中。
- 试验内容位于 `test.html` 和 `docs/test/`，不进入正式导航与搜索。
