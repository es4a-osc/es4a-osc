# Simple 类库开发

> 开发导航｜核对日期：2026-10-08｜依据：当前扩展源码、SDK 清单与真实 Simple 样例｜适用范围：当前 ES4A SDK 与 VS Code 扩展。

从 Java 实现到 IDE 描述，再到构建与 SDK 接入，按以下路线开发和交付 Simple 类库：

| 目的 | 文档 |
| --- | --- |
| 建立类库目录，准备依赖与工具 | [类库工程、构建与交付](library-development/build.md) |
| 编写 Java 对象、组件、属性、函数和事件 | [编写类库：Java 实现](simple/Simple类库开发.md) |
| 描述分类、类型、成员、缺省值和设计器行为 | [清单定义参考](reference/manifests.md) |
| 注册类库、配置项目能力与模板 | [SDK 配置参考](reference/sdk.md) |
| 检查 IDE、正式编译、权限、资源与设备行为 | [验证与发布](library-development/build.md#验证与发布) |
| 核对应用开发者如何使用交付的类库 | [扩展类库使用](libraries/README.md) |

`classes.jar` 与 Java 注解决定实际可调用能力，`library.json` 描述 IDE 中的元数据；发布时保证两者一致。交付时提供与版本一致的说明和样例，使类库使用者能确认调用要求，不需要从 Java 或清单规则反推调用方法。

共用字段与规则只在各自参考页维护。本入口不复制参考正文。
