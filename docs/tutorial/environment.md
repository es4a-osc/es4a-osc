# 环境准备与 SDK 使用

> 使用指南｜核对日期：2026-10-08｜依据：当前扩展源码、SDK 清单与真实 Simple 样例｜适用范围：当前 ES4A SDK 与 VS Code 扩展。

## 准备什么

开发环境为 Windows、Visual Studio Code、ES4A 扩展及完整 SDK。先从[下载入口](https://dwz.wsd.cx/es4a-xz)取得发布的扩展与 SDK；扩展通过 VS Code 扩展视图的“从 VSIX 安装”安装，已有安装可直接使用。

本文说明当前工具链所需目录，不保证下载入口当前提供哪些压缩包、版本或完整内容；下载内容尚未核实。安装后应检查实际文件。

| 工具 | 用途 | 解压后的目录和关键文件 |
| --- | --- | --- |
| JDK 1.8.0_503 | 编译器运行，以及 Java 类库编译和 JAR 打包 | `sdk/tools/jdk1.8.0_503/bin/java.exe`、`javac.exe`、`jar.exe` |
| Apache Ant 1.9.15 | 开发完整工具包中的源码构建工具；普通应用编译脚本不直接调用 Ant | `sdk/tools/apache-ant-1.9.15/bin/ant.bat` |
| Android 工具链（当前 API 26） | Android 资源处理、DEX、APK 打包及 ADB 安装启动 | `sdk/tools/android/platforms/android-26/android.jar`、`sdk/tools/android/tools/adb.exe` 等 |
| Simple 编译器和 Android 运行库 | 编译中文 Simple 并提供应用运行能力 | `sdk/simple/SimpleCompiler.jar`、`SimpleAndroidRuntime.jar` |

JDK 与 Ant 未随仓库提供，使用同一[下载入口](https://dwz.wsd.cx/es4a-xz)准备，解压时避免形成多一层同名目录。保留 SDK 所提供的 Android 工具和 Simple JAR，不能仅安装任意版本 Android SDK 后假定脚本可用。

## 选择 SDK

1. 打开 VS Code，确认 ES4A 扩展已启用。
2. 按 `Ctrl+Shift+P`，执行 **ES4A: 选择 SDK**。
3. 选择 SDK 根目录的 `sdk.json`，不是单个类库的 `library.json`。
4. 打开 ES4A 侧边栏，检查“类库”视图是否显示运行库及扩展类库。
5. 更新或更换 SDK 文件后执行 **ES4A: 刷新类库**；移动 SDK 根目录后重新选择入口。

所选路径保存在 `es4a.sdk.path`。扩展没有默认 SDK，未选择或路径失效时不会自动寻找 SDK。

## 准备运行设备

编译 APK 不需要连接手机。要使用“调试应用”安装启动，请连接 Android 设备，启用开发者选项和 USB 调试，接受设备上的电脑授权，并检查 ADB 能识别设备。

当前编译器生成的清单使用最低 API 14、目标 API 26；这只是编译器当前配置，不能保证所有核心 API、扩展类库或所有新系统的运行兼容性。每个功能的设备条件见对应 API 和类库说明。

接下来完成[快速入门](tutorial/started.md)；环境或工具缺失时查看[编译与运行](tutorial/build.md)和[常见问题](tutorial/faq.md)。
