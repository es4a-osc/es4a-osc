# Simple 类库开发 <!-- {docsify-ignore-all} -->

<!-- 文档信息：开发导航｜核对日期：2026-10-08｜依据：当前扩展源码、SDK 清单与真实 Simple 样例｜适用范围：当前 ES4A SDK 与 VS Code 扩展。 -->

使用 Java 为 Simple 提供对象、函数和 Android 组件。

## 开发流程

1. [工程与交付](library/build.md)：目录、依赖、资源、构建与验证。
2. [Java 实现](library/java.md)：类型、注解、成员、权限与清单节点。
3. [清单定义](library/manifests.md)：分类、类型、成员和设计器元数据。
4. [SDK 配置](library/sdk.md)：注册类库、能力和模板。
5. [验证与发布](library/build.md#验证与发布)：检查 IDE、编译结果和设备行为。

`classes.jar` 提供实际代码，`library.json` 提供 IDE 元数据。交付时保持二者一致，并提供对应版本的说明和 Simple 样例。

应用侧的调用流程见[扩展库](project/extensions.md)。
