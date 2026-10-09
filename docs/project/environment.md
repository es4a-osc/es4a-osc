# 环境准备与 SDK 使用

<!-- 文档信息：使用指南｜核对日期：2026-10-09｜依据：当前扩展源码、SDK 清单与真实 Simple 样例｜适用范围：当前 ES4A SDK 与 VS Code 扩展。 -->

## 准备什么

开发环境为 Windows、Visual Studio Code、ES4A 扩展及完整 SDK。先从[下载入口](https://dwz.wsd.cx/es4a-xz)取得发布的扩展与 SDK；扩展通过 VS Code 扩展视图的“从 VSIX 安装”安装，已有安装可直接使用。

下载内容尚未核实；解压后按下表检查所需文件。

| 工具 | 用途 | 解压后的目录和关键文件 |
| --- | --- | --- |
| JDK 1.8.0_503 | 运行 Simple 编译器 | `sdk/tools/jdk1.8.0_503/bin/java.exe`、`javac.exe`、`jar.exe` |
| Android 工具链（当前 API 26） | Android 资源处理、DEX、APK 打包及 ADB 安装启动 | `sdk/tools/android/platforms/android-26/android.jar`、`sdk/tools/android/tools/adb.exe` 等 |
| Simple 编译器和 Android 运行库 | 编译中文 Simple 并提供应用运行能力 | `sdk/simple/SimpleCompiler.jar`、`SimpleAndroidRuntime.jar` |

JDK 未随仓库提供，通过[下载入口](https://dwz.wsd.cx/es4a-xz)准备，并解压到表中的目录。使用 SDK 随附的 Android 工具和 Simple JAR。

## 选择 SDK

1. 打开 VS Code，确认 ES4A 扩展已启用。
2. 打开 ES4A 侧边栏，在“类库”标题栏点击 **选择 SDK**。
3. 选择 SDK 根目录的 `sdk.json`，不是单个类库的 `library.json`。
4. 检查“类库”视图中的编译器、运行库和扩展库。
5. 更新 SDK 后点击“类库”标题栏的 **刷新类库**；移动或更换 SDK 后重新选择入口。

## 准备运行设备

编译 APK 不需要连接手机。要使用“调试应用”安装启动，请连接 Android 设备，启用开发者选项和 USB 调试，接受设备上的电脑授权，然后在项目上执行“调试应用”。

所用工具链的最低 API 为 14、目标 API 为 26；具体功能的设备条件按对应 SDK 和类库版本确认。

接下来完成[快速入门](project/quickstart.md)；环境或工具缺失时查看[编译与运行](project/build.md)和[常见问题](project/faq.md)。
