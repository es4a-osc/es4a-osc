# 项目操作

> 使用指南｜核对日期：2026-10-08｜依据：当前扩展源码、SDK 清单与真实 Simple 样例｜适用范围：当前 ES4A SDK 与 VS Code 扩展。

## 打开与管理项目

Simple 项目以 `project.properties` 为入口。在命令面板执行 **ES4A: 添加项目**，选择已有项目的属性文件；“刷新项目”重新读取当前项目。

“移除项目”只移出 ES4A 项目列表；“删除项目”会删除真实目录，按确认提示选择回收站或永久删除。不要把两个操作混用。

## 项目目录

```text
HelloSimple/
├─ project.properties
├─ src/com/example/hello/主窗口.simple
├─ assets/
├─ res/
└─ build/                         # 编译生成
```

| 属性 | 用途 | 常用配置 |
| --- | --- | --- |
| `main` | 主窗口限定名，必需；主窗口所在包名也是应用包名 | 如 `com.example.hello.主窗口` |
| `name` | 应用名称，同时用于 APK 文件名 | `MyApp` |
| `source` | 源代码根目录，可用逗号分隔多个目录 | `./src` |
| `assets` | 原样打包的资产目录 | `./assets` |
| `res` | 由 Android 工具编译的资源目录 | `./res` |
| `build` | 生成目录 | `./build` |

以上目录值采用当前 SDK 模板约定。手工建立项目时明确填写这些字段，尤其不要省略 `source` 和 `assets`；应用名称为空时编译器使用 `MyApp`。

项目相对路径以 `project.properties` 所在目录为基准。不要把生成文件当作维护源码。

## 创建与组织单元

在“单元”根节点或单元文件夹中右键创建窗口、对象、接口、服务或文件夹。新建窗口用于界面；对象用于可创建实例的逻辑；接口约定成员；服务单元用于 Android 服务。当前没有独立“线程单元”，线程用对象与线程 API。

单元限定名由源码根下的相对路径和文件名决定。例如 `src/com/example/hello/工具.simple` 的限定名是 `com.example.hello.工具`，无需手写包声明。多源码根重叠时以最具体的源码根计算。

同一项目内移动单元会同步可证明受影响的代码引用；跨项目拖动不支持。主单元移动可能改变应用包名，先理解提示并确认。文件名、窗口名称与引用不是任意全文替换关系，应通过 ES4A 的单元操作完成。

## 应用属性

右键项目设置应用名称、整数版本号、版本名、图标、屏幕方向与主题；也可使用“打开属性”编辑 `project.properties`：

```properties
main=com.example.hello.主窗口
name=你好 Simple
version.code=1
version.name=1.0
icon=@drawable/icon
orientation=portrait
theme=@android:style/Theme.Material.Light.NoActionBar
source=./src
assets=./assets
res=./res
build=./build
```

版本号用正整数，版本名用显示文本；`orientation` 可用 `unspecified`、`landscape`、`portrait`。`theme` 为空时使用系统默认主题。自定义签名字段见[编译与运行](tutorial/build.md#应用签名)。

具体类库可能要求额外项目参数。按所用版本随附的说明或样例配置，通用流程见[扩展类库使用](libraries/README.md)。

## 资源与资产

在“资源”视图导入资源；Android 资源放入 `res/drawable`、`res/layout` 等有效目录。编译器使用 AAPT2 生成标准 Android 资源与 Simple 资源对象，代码可通过全局 `R` 访问，如 `R.drawable_icon`。资源成员取实际编译结果，不能仅根据文件名猜测。

`assets` 用于原样文件，与 `res` 的资源编号不同。按[核心 API 的成员说明](api/README.md#读取成员说明)选择读取方式。项目树可复制资源索引、文件名或相对路径，按调用 API 所需形式使用。

## 代码、设计器与预览

用户代码标签编辑逻辑；设计器标签编辑组件属性。它们各自维护保存和撤销状态，修改一侧后不代表另一侧已经保存。完整代码预览和 XML 属性预览用于查看当前内容，不应当作另一份可独立维护的单元。

事件的写法见[语法参考](simple/Simple语言定义.md#事件处理声明)，布局和交互见[窗口设计](tutorial/designer.md)。
