# 编译与运行

> 使用指南｜核对日期：2026-10-08｜依据：当前 SDK 能力脚本、simple.compiler.Main、Compiler 与 Project 源码｜适用范围：当前 ES4A SDK 与 VS Code 扩展。

## 在 ES4A 中编译

先保存本次代码和设计器修改，在项目树选择项目执行 **编译应用**。终端显示正式编译器和 Android 工具的输出。IDE 补全、悬停或快速分析正常，不代表正式编译一定成功。

当前 SDK 的编译脚本使用 JDK 8、Android API 26、Simple 编译器与运行库。工具准备见[环境准备](tutorial/environment.md)。

默认输出为 `build/deploy/<应用名称>.apk`，其中构建目录取 `project.properties` 的 `build`，名称取 `name`。编译失败时不要把旧 APK 当成本次结果。

## 命令行编译

从含 `sdk/` 和项目目录的上级目录运行：

```bat
sdk\capabilities\compile.bat "HelloSimple\project.properties"
```

有空格的路径始终加引号。脚本设置当前 SDK 工具路径，不需要在系统中永久改写 `JAVA_HOME` 或其他变量。

当前编译器成功返回 0，参数或编译错误返回 1；能力批处理会打印错误，但不能仅凭批处理自身最终返回码代替检查输出和新生成 APK。

## 安装与启动

“调试应用”当前依次编译、提取 APK 包名、ADB 安装并启动主 Activity。命令行等价入口为：

```bat
sdk\capabilities\debug.bat "HelloSimple\project.properties" "HelloSimple\build\deploy\你好 Simple.apk"
```

运行前检查设备已连接并授权：

```bat
sdk\tools\android\tools\adb.exe devices
```

`unauthorized` 表示设备尚未授权，`offline` 表示连接未就绪。当前脚本没有提供设备选择界面；多个设备时先使 ADB 的目标明确，再执行安装。

当前“调试应用”不提供断点、单步和变量查看。安装或启动失败时分别检查终端输出，不把编译成功当作设备运行成功。

## 应用签名

`key.location` 和 `key.alias` 在 `project.properties` 中配置证书位置和别名；未指定证书时使用当前工具链的调试签名。当前编译器入口只接受一个项目文件参数；签名密码从环境变量 `KEY_PASSWORD` 读取，`compile.bat` 没有交互收集密码。

因此只填写自定义证书路径不能证明发布签名已经完成，模板中的 `key.password` 未被当前编译器读取，不能用它传递密码。自定义签名要求同时有证书位置和非空 `KEY_PASSWORD`，缺少时会走调试签名。需要自定义签名时，核对当前编译器入口与所用发布流程，并验证生成 APK 的实际签名。

## 常见失败

工具不存在先检查目录层级；语法或类型错误先定位终端中的文件和行号；资源错误先查 `res` 目录与资源引用；扩展调用错误先查实际 SDK 是否包含对应类库及依赖。

重命名单元后可能残留旧的 `build/classes` 文件，这是现有编译流程的已知问题。确认目录确实只是当前项目的构建输出后，清理构建目录再编译；不要删除源代码或资产目录。

更多排查见[常见问题](tutorial/faq.md)。
