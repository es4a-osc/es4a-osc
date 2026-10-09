# 类库工程、构建与交付

<!-- 文档信息：开发与交付指南｜核对日期：2026-10-08｜依据：当前类库 build.bat、RuntimeLoader.java、Compiler.java 与演示类库｜适用范围：当前 ES4A SDK 与 VS Code 扩展。 -->

建立类库工程，构建 `classes.jar`，准备依赖与资源，并完成交付验证。代码、权限和清单节点见[Java 实现](library/java.md)；配置字段见[清单定义](library/manifests.md)和[SDK 配置](library/sdk.md)。

## 准备类库工程

### 目录结构

每个类库占用 `sdk/libraries` 下的一个直接子目录。

```text
sdk/libraries/
├─ build.bat
└─ com.example.demo/
   ├─ library.json
   ├─ classes.jar
   ├─ src/
   ├─ libs/
   ├─ res/
   ├─ assets/
   ├─ jni/
   ├─ icons/
   ├─ sample/
   └─ build/
```

| 路径 | 必需 | 说明 |
| --- | --- | --- |
| `library.json` | 是 | ES4A 类库清单 |
| `classes.jar` | 是 | 编译器加载并打入应用的类库代码 |
| `src/` | 开发时 | Java 源码 |
| `libs/` | 否 | 类库依赖的 JAR |
| `res/` | 否 | Android 资源 |
| `assets/` | 否 | Android 资产文件 |
| `jni/` | 否 | 按 ABI 组织的原生库 |
| `icons/` | 否 | `library.json` 引用的 SVG 图标 |
| `sample/` | 推荐 | 用于验证类库的 Simple 项目 |
| `build/` | 生成目录 | 公共构建脚本的中间输出 |

`com.example.demo` 是示例包名。实际类库使用自己的命名空间和独立目录，不放入 `simple.runtime` 包。

## 构建 classes.jar

以下命令在含 `sdk/` 的上级目录运行；也可把类库文件夹拖到公共 `build.bat` 上。完整工具包准备见[环境准备](project/environment.md)，这个类库脚本直接调用 `javac` 和 `jar`，无需 Ant。

所有 SDK 类库共用 `sdk/libraries/build.bat`：

```bat
sdk\libraries\build.bat "sdk\libraries\com.example.demo"
```

公共脚本会：

1. 使用按[环境准备](project/environment.md)放置的 JDK 8 编译 `src`。
2. 将 Android API 26、`SimpleAndroidRuntime.jar` 和 `libs/*` 加入编译类路径。
3. 清理类库自己的 `build/classes`。
4. 把编译结果打包到类库根目录的 `classes.jar`。

## 接入 SDK

按[SDK 配置参考的类库注册](library/sdk.md#类库注册)登记 `library.json`，在 ES4A 中选择这个 `sdk.json` 并刷新类库。字段说明见[清单定义](library/manifests.md)。

## 编译与打包

SDK 编译入口将 `sdk/libraries` 传入 `LIBRARIES_HOME`。编译器扫描直接子目录，仅加载含 `classes.jar` 的类库；未设置或目录不存在时只加载运行库。IDE 注册不改变编译器扫描范围。

| 目录或文件 | 处理方式 |
| --- | --- |
| `classes.jar` | 加入类加载，项目引用后作为整体进入 DEX；已引用类库在打包时缺失此文件则报错。 |
| `libs/*.jar` | 依赖先进入类加载器，随引用类库加入 DEX。 |
| `res/` | 编译并合并 Android 资源。 |
| `assets/` | 打包资产文件。 |
| `libs/` 的非 class 资源、`jni/` | 参与 APK 组装；原生库按 ABI 组织。 |

仅当前项目实际引用的类库连同其依赖、资源、资产和原生库进入 APK。

当前公共脚本只把运行库、Android 平台与本类库的 `libs/*` 放入 Java 编译类路径。编译期依赖其他扩展类库时，需显式提供兼容依赖 JAR，不能把 SDK 入口注册顺序当作 Java 编译依赖解析。`libs` 使用 JAR，当前流程没有直接消费 AAR 的完整方案。

## 验证与发布

### 验证类库

1. 检查 `library.json` 为 UTF-8 JSON，`kind` 为 `library`，类型、成员和继承关系与 Java 实现一致；图标路径存在。
2. 从干净的构建目录生成 `classes.jar`，确认组件接口与实现类、依赖和资源完整。
3. 在 ES4A 中[选择 SDK 并刷新类库](project/environment.md#选择-sdk)，检查分类、定义、补全、悬停和参数提示。
4. 对组件，按[窗口设计](project/designer.md)验证添加、属性、缺省值、候选项、专用编辑器与事件生成；普通对象或接口在代码中验证，调用示例见[普通对象](library/java.md#普通对象)。
5. 编译并打包真实 Simple 样例，在 Android 设备验证函数、属性、事件、权限、资源与生命周期。
6. 使用 `@ManifestNodes` 时，验证有引用、无引用、缺少必填宏和宏含特殊字符的情况，规则见[Android 清单节点](library/java.md#android-清单节点)。

类库树和代码提示只能证明清单已加载，不能代替编译与设备验证。组件未出现在设计器时，检查 `kind`、`type` 与继承关系，不手写属性区绕过清单问题。

### 交付内容

提供完整类库目录、稳定包名与版本、依赖和许可证说明，以及可复现的 Simple 样例和使用说明。说明最低设备条件、权限及未验证能力。

## 常见问题

### ES4A 能看到类库，但编译失败

先检查类库根目录是否存在最新的 `classes.jar`，再检查 Java 完整类型名是否与 `library.json.type` 一致。类库树可见只说明清单已加载。

### 编译器能识别类型，但 ES4A 中没有显示

先确认 ES4A 已通过 **选择 SDK** 载入正确的 `sdk.json`，再运行 **刷新类库**。侧边栏“类库”中看不到分类时，检查 `hidden: true`；窗口设计器“可用”区看不到组件时，检查定义的 `kind` 是否为 `component` 或其子类型，以及窗口组件是否被误当作普通子组件。

### 报告“缺少组件实现”

确认实现类直接实现组件接口，并且接口和实现类都已进入 `classes.jar`。仅通过父类或中间接口间接实现时，当前加载器无法完成配对。

### 修改 Java 后行为没有变化

重新运行公共构建脚本，并确认类库根目录的 `classes.jar` 修改时间已经更新。只修改 `src` 不会影响编译器实际加载的代码。

### 补全信息与编译结果不一致

`library.json` 与 Java 注解是两个独立输入。清单不会校验或生成 Java 成员；修改接口、参数或返回类型时应同步更新两边。

---

[Java 实现](library/java.md) · [清单定义](library/manifests.md) · [SDK 配置](library/sdk.md)
