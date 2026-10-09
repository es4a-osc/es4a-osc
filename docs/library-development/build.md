# 类库工程、构建与交付

> 开发与交付指南｜核对日期：2026-10-08｜依据：当前类库 build.bat、RuntimeLoader.java、Compiler.java 与演示类库｜适用范围：当前 ES4A SDK 与 VS Code 扩展。

本文维护类库目录、构建、依赖、资源、权限、验证和交付流程。Java 实现见[编写类库](simple/Simple类库开发.md)，所有 JSON 字段只在[清单定义参考](reference/manifests.md)维护，SDK 入口规则只在[SDK 配置参考](reference/sdk.md)维护。

## 准备类库工程


### 类库组成

一个可用的 Simple 类库包含两部分：

| 文件 | 使用者 | 作用 |
| --- | --- | --- |
| `library.json` | ES4A | 提供分类、名称、说明、成员、图标和设计器元数据 |
| `classes.jar` | Simple 编译器和 Android 应用 | 提供实际 Java 类型与运行代码 |

!> `library.json` 能让类库出现在 ES4A 中，但不会生成 Java 代码；`classes.jar` 能被编译器加载，但不会自动生成类库树说明。发布类库时必须同时保证两者正确。

### 开发流程

1. 为类库建立独立目录。
2. 使用 Java 编写对象或组件，并通过 Simple 注解公开成员。
3. 编写 `library.json`，描述 ES4A 应显示的定义与成员。
4. 构建 `classes.jar`。
5. 在 SDK 根清单中登记 `library.json`。
6. 在 ES4A 中选择该 SDK，检查类库树、代码提示和窗口设计器。
7. 使用真实 Simple 示例项目完成编译、打包和设备运行验证。

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

?> `com.example.demo` 是入门示例包名。实际类库应使用自己的命名空间；本 SDK 的其他类库采用 `simple.library.用户名.功能名称`。目录名应稳定且避免重复，不要把扩展类库放进 `simple.runtime` 包。



## 构建 classes.jar

以下命令在含 `sdk/` 的上级目录运行；也可把类库文件夹拖到公共 `build.bat` 上。完整工具包准备见[环境准备](tutorial/environment.md)，这个类库脚本直接调用 `javac` 和 `jar`，无需 Ant。


所有 SDK 类库共用 `sdk/libraries/build.bat`：

```bat
sdk\libraries\build.bat "sdk\libraries\com.example.demo"
```

公共脚本会：

1. 使用按[环境准备](tutorial/environment.md)放置的 JDK 8 编译 `src`。
2. 将 Android API 26、`SimpleAndroidRuntime.jar` 和 `libs/*` 加入编译类路径。
3. 清理类库自己的 `build/classes`。
4. 把编译结果打包到类库根目录的 `classes.jar`。

?> 构建脚本是开发工具；编译器实际加载的是类库根目录的 `classes.jar`。



## 接入 SDK

按[SDK 配置参考的类库注册](reference/sdk.md#类库注册)登记 `library.json`，在 ES4A 中选择这个 `sdk.json` 并刷新类库。清单字段只在[清单定义参考](reference/manifests.md)维护。

## 编译与打包


SDK 编译入口将 `sdk/libraries` 传入 `LIBRARIES_HOME`。编译器扫描直接子目录，仅加载含 `classes.jar` 的类库；未设置或目录不存在时只加载核心运行库。IDE 注册不改变编译器扫描范围。

| 目录或文件 | 处理方式 |
| --- | --- |
| `classes.jar` | 加入类加载，项目引用后作为整体进入 DEX；已引用类库在打包时缺失此文件则报错。 |
| `libs/*.jar` | 依赖先进入类加载器，随引用类库加入 DEX。 |
| `res/` | 编译并合并 Android 资源。 |
| `assets/` | 打包资产文件。 |
| `libs/` 的非 class 资源、`jni/` | 参与 APK 组装；原生库按 ABI 组织。 |

仅当前项目实际引用的类库连同其依赖、资源、资产和原生库进入 APK。



当前公共脚本只把核心运行库、Android 平台与本类库的 `libs/*` 放入 Java 编译类路径。编译期依赖其他扩展类库时，需显式提供兼容依赖 JAR，不能把 SDK 入口注册顺序当作 Java 编译依赖解析。`libs` 使用 JAR，当前流程没有直接消费 AAR 的完整方案。

## Android 权限


需要 Android 权限的对象使用 `@UsesPermissions`：

```java
@SimpleObject
@UsesPermissions(permissionNames = "android.permission.INTERNET")
public final class HTTP服务 {
}
```

多个权限使用逗号分隔。编译器只为项目实际引用的对象收集权限。该注解只负责生成 Android 清单声明；危险权限仍需在应用运行时请求，并处理用户拒绝授权的情况。

## Android 清单节点

`@ManifestNodes` 可以向 Android 清单的固定位置加入节点：

```java
@SimpleObject
@ManifestNodes(
	rootXml = "<uses-feature android:name=\"android.hardware.camera\" />",
	applicationXml = "<meta-data android:name=\"demo.appId\" android:value=\"${应用标识}\" />"
)
public final class 示例对象 {
}
```

| 字段 | 插入位置 |
| --- | --- |
| `rootXml` | `/manifest` |
| `applicationXml` | `/manifest/application` |
| `activityXml` | 主 Activity |
| `intentFilterXml` | 主 Activity 的 Intent Filter |

节点可以引用项目属性：

- `${宏名}`：必填，未配置时编译失败。
- `${宏名=缺省值}`：可选，未配置时使用缺省值。

项目在 `project.properties` 中按“Java 类简名.宏名”赋值：

```properties
示例对象.应用标识=my-app-id
```

!> 宏是文本替换，不会自动转义 XML。类库必须保证注解文本和替换后的值都是合法 XML。



可选宏的缺省值可以为空文本；仅项目实际引用对象的节点参与注入。宏值中的美元符号和反斜杠按字面替换，仍须保证替换后的 XML 合法。

## 验证与发布


### 在 ES4A 中验证类库

类库开发完成后，应从 ES4A 扩展验证清单、设计器和编译器是否使用了同一份定义。

#### 载入 SDK

1. 确认 SDK 根目录的 `sdk.json` 已登记类库的 `library.json`。
2. 在 VS Code 命令面板运行 **ES4A: 选择 SDK**，选择 SDK 根目录的 `sdk.json`，不是类库自己的 `library.json`。
3. 打开 ES4A 侧边栏的“类库”视图，检查类库、分类、定义和成员是否正确显示。
4. 修改 `library.json` 或重新构建 `classes.jar` 后，运行 **ES4A: 刷新类库**，让扩展重新读取 SDK。

!> 侧边栏“类库”用于浏览 SDK 清单，不是添加组件的工具箱。组件要在窗口设计器内添加。

#### 验证组件

1. 在 ES4A 项目树中选择一个窗口单元，执行 **设计窗口布局**。
2. 在设计器的“可用”区找到组件。可视组件拖到窗口或容器中；非可视组件拖到“启用”区。
3. 选中组件，在“属性”区检查名称、说明、缺省值、候选值和专用编辑器，并修改需要验证的属性。
4. 右键组件，打开“组件事件”菜单。选择事件后，ES4A 会定位已有处理过程；不存在时会在代码中插入处理过程并定位到事件体。
5. 保存窗口单元，再通过 ES4A 的编译或调试命令构建并运行示例项目。

设计器依据 `library.json` 创建和编辑组件定义，开发者不需要手写 `.simple` 文件末尾的属性内容。若组件没有出现在“可用”区，先检查定义的 `kind`、`type` 和继承关系，不要通过手工修改属性内容绕过清单问题。

#### 验证普通对象和 API

`kind` 为 `object`、`interface` 或其他非组件定义的类型不会出现在设计器“可用”区，应在 Simple 代码中验证。输入 `别名` 后，ES4A 会根据当前 SDK 提供完整类型名候选；建立别名后，成员补全、悬停说明和参数提示均来自 `library.json`。

创建实例与调用成员的完整示例见[Java 实现中的普通对象](simple/Simple类库开发.md#普通对象)。在已有窗口单元的事件或过程体中测试调用，不要把执行语句放在单元声明区。

?> ES4A 的提示只能证明 `library.json` 已被正确读取；能否编译和运行仍由 `classes.jar` 中的真实 Java 类型与实现决定。

### 发布前检查

1. `library.json` 是 UTF-8 编码的有效 JSON，且 `kind` 为 `library`。
2. `type`、继承关系和成员与 `classes.jar` 中的 Java 实现一致。
3. 每个组件都有可被当前加载器直接识别的实现类。
4. 图标路径相对于 `library.json` 存在。
5. `classes.jar` 位于类库根目录，依赖和资源位于约定目录。
6. SDK 根清单已经登记该 `library.json`。
7. 公共构建脚本能够从干净的 `build` 目录重新生成 `classes.jar`。
8. ES4A 类库树能够显示清单内容，窗口设计器能够添加组件、编辑属性并生成事件处理过程。
9. 普通对象能够在代码中获得类型和成员提示，示例项目能够完成编译和 APK 打包。
10. 在 Android 设备上验证属性、函数、事件、权限、资源和生命周期。
11. 使用 `@ManifestNodes` 时，分别验证有引用、无引用、缺少必填宏和宏值包含特殊字符的情况。

### 常见问题

#### ES4A 能看到类库，但编译失败

先检查类库根目录是否存在最新的 `classes.jar`，再检查 Java 完整类型名是否与 `library.json.type` 一致。类库树可见只说明清单已加载。

#### 编译器能识别类型，但 ES4A 中没有显示

先确认 ES4A 已通过 **选择 SDK** 载入正确的 `sdk.json`，再运行 **刷新类库**。侧边栏“类库”中看不到分类时，检查 `hidden: true`；窗口设计器“可用”区看不到组件时，检查定义的 `kind` 是否为 `component` 或其子类型，以及窗口组件是否被误当作普通子组件。

#### 报告“缺少组件实现”

确认实现类直接实现组件接口，并且接口和实现类都已进入 `classes.jar`。仅通过父类或中间接口间接实现时，当前加载器无法完成配对。

#### 修改 Java 后行为没有变化

重新运行公共构建脚本，并确认类库根目录的 `classes.jar` 修改时间已经更新。只修改 `src` 不会影响编译器实际加载的代码。

#### 补全信息与编译结果不一致

`library.json` 与 Java 注解是两个独立输入。清单不会校验或生成 Java 成员；修改接口、参数或返回类型时应同步更新两边。

交付给应用开发者时，同时提供稳定包名、类库版本、完整目录、依赖与许可证说明、可复现的 Simple 示例和按类型组织的使用文档。说明最低设备条件、所需权限和尚未验证的能力，不以类库树可见代替设备验收。

---

[Java 实现](simple/Simple类库开发.md) · [清单定义](reference/manifests.md) · [SDK 配置](reference/sdk.md)
