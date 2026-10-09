# ES4A 在线知识库

> 公开知识库入口｜核对日期：2026-10-08｜依据：当前源码、版本化清单与真实样例｜适用范围：当前 ES4A SDK 与 VS Code 扩展。

ES4A（Easy & Simple for Android）提供中文 Simple 语言与 Android 应用开发工具。本知识库面向第三方用户和 AI，使用说明与参考内容在本站完整提供。

## Simple 项目开发

如果你要编写 Android 应用，从[项目开发入口](simple/README.md)开始：

[环境准备](tutorial/environment.md) → [快速入门](tutorial/started.md) → [项目操作](tutorial/project.md) → [窗口设计](tutorial/designer.md) → [编译与运行](tutorial/build.md)。

查阅：[Simple 语法](simple/Simple语言定义.md) · [核心 API 使用](api/README.md) · [扩展类库使用](libraries/README.md) · [常见问题](tutorial/faq.md)。

## Simple 类库开发

如果你要用 Java 提供新的 Simple 能力，从[类库开发入口](library-development/README.md)开始：

[Java 实现](simple/Simple类库开发.md) · [清单定义](reference/manifests.md) · [构建与交付](library-development/build.md) · [SDK 配置](reference/sdk.md)。

## 阅读和搜索

侧栏按上述两类目的组织。本站维护语法、项目操作、API 通用使用方式和类库开发规则；具体类型、成员与类库样例按所用 SDK 版本查阅，避免在网站重复维护名单与签名。本站搜索用于定位指南和规则，SDK 成员通过 ES4A 类库视图与代码提示查阅。

对 AI：先选择对应目的，再阅读用途、前置条件、完整调用上下文和限制。名称区分组件、普通对象、函数集与语言关键字；不要把 IDE 元数据当作设备运行证据，也不要套用其他 BASIC 方言。

## 当前能力与记录

当前 VS Code 扩展提供项目管理、语言提示和窗口设计器；编译与安装启动由 SDK 工具链执行。设计器使用低保真投影，“调试应用”当前是编译、安装与启动流程。

[更新日志](CHANGELOG.md)记录历史变更，[开发计划](ROADMAP.md)记录待实现方向，两者分别阅读。试验页面保留在独立试验区，不属于正式使用说明，也不进入正式文档搜索。
