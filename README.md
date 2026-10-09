# ES4A 在线文档

本仓库使用现有 Docsify，为 Simple 项目开发用户与类库开发用户提供可独立阅读的公开知识库。正式正文位于 `docs/`，入口为 `docs/README.md`。

- [在线知识库](https://es4a.paike.it/)
- [Simple 项目开发](https://es4a.paike.it/#/simple/README)
- [Simple 类库开发](https://es4a.paike.it/#/library-development/README)

## 本地查看与维护

从本目录启动静态 HTTP 服务后打开 `index.html`。例如已有 Python 时：

```bat
python -m http.server 8001 --bind 127.0.0.1
```

无需新增 Node 依赖。正文、导航、主题与 Simple 高亮读取本仓库文件；Docsify 核心和现有通用插件仍使用原 CDN，离线时这些外部依赖可能不可用。

新增正式文档时同步维护 `docs/_sidebar.md` 及 `index.html` 的正式搜索路径，检查实际渲染、章节定位与搜索结果。试验页面在 `test.html` 和 `docs/test/`，保持与正式导航和搜索分开。

API 与类库使用页维护通用方法，不复制当前运行库或扩展类库的类型、成员目录，也不逐库增加演示页。具体签名和样例随 SDK 版本查阅。
