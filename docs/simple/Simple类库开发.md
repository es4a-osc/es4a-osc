# Simple 类库开发

> 使用 Java 为 Simple 提供对象、函数和 Android 组件。内容根据当前编译器类库加载器、运行库注解、SDK 清单、ES4A 扩展源码及入门演示类库核对于 2026-10-08。

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

## 编写 Java 类库

### 注解映射

编译器扫描 `classes.jar` 中的类，只有带 `@SimpleObject` 的类型才会作为 Simple 对象加载。对象的函数、属性、事件和数据成员分别由对应注解公开。

| Java 声明 | Simple 中的含义 |
| --- | --- |
| `@SimpleObject` 类或接口 | 对象类型或接口 |
| `@SimpleComponent` | 与 `@SimpleObject` 同时使用时，声明可由组件系统创建的组件 |
| `@SimpleFunction` 方法 | 函数或过程 |
| `@SimpleProperty` 方法 | 属性获取器或设置器 |
| `@SimpleEvent` 方法 | 事件 |
| `@SimpleDataElement` 字段 | 常量或变量 |

### 数据类型对应

| Java 类型 | Simple 类型 |
| --- | --- |
| `boolean` | `逻辑型` |
| `byte` | `字节型` |
| `short` | `短整数型` |
| `int` | `整数型` |
| `long` | `长整数型` |
| `float` | `单精度小数型` |
| `double` | `双精度小数型` |
| `String` | `文本型` |
| `java.util.Calendar` | `日期时间型` |
| `simple.runtime.variants.Variant` | `变体型` |
| Java 数组 | 对应元素类型和维数的 Simple 数组 |
| 带 `@SimpleObject` 的 Java 类型 | 对应的 Simple 对象类型 |
| `void` 返回值 | 过程 |

传址参数不能直接使用普通 Java 类型，需要使用 `simple.runtime.parameters` 中对应的 `ReferenceParameter` 类型。例如 `IntegerReferenceParameter` 对应传址的 `整数型`，`StringReferenceParameter` 对应传址的 `文本型`。

### 普通对象

`classes.jar` 中的 Java 类型提供 Simple 程序实际调用的对象、函数、属性和事件。

下面的普通对象取自入门演示类库。实例方法在创建对象后调用，静态方法通过类型调用。

```java
package com.example.demo;

import simple.runtime.annotations.SimpleFunction;
import simple.runtime.annotations.SimpleObject;

@SimpleObject
public final class 演示对象 {

	public 演示对象() {
	}

	@SimpleFunction
	public String 加前缀(String 文本) {
		return "[Simple] " + 文本;
	}

	@SimpleFunction
	public static int 取长度(String 文本) {
		return 文本.length();
	}
}
```

Simple 代码可以使用完全限定名，也可以先声明别名：

```simple
别名 演示对象 = com.example.demo.演示对象

变量 工具 为 演示对象
工具 = 创建 演示对象

变量 结果 为 文本型
结果 = 工具.加前缀("你好")

变量 长度 为 整数型
长度 = 演示对象.取长度("你好")
```

!> 扩展类库中的静态函数不会自动成为全局函数。即使 `library.json` 将成员标为 `global: true`，那也只影响 ES4A 的候选提示，不会改变编译器的名称解析规则。

演示对象的 `取长度` 在 Java 中声明为 `static`，在清单对应函数中声明 `static: true`，使 ES4A 按类型成员提供补全。实例函数 `加前缀` 不设置此标记。

#### 函数和过程

- 带返回值的 `@SimpleFunction` 方法在 Simple 中是函数。
- 返回 `void` 的 `@SimpleFunction` 方法在 Simple 中是过程。
- `static` 方法属于类型；非静态方法属于对象实例。
- 同名方法可以按参数个数形成重载；不要只依靠参数类型区分相同参数个数的重载。
- 参数和返回类型必须能转换为 Simple 类型。

#### 常量和变量

公开字段需要使用 `@SimpleDataElement`：

```java
@SimpleDataElement
public static final int 模式_普通 = 0;

@SimpleDataElement
public static int 当前模式 = 模式_普通;
```

`public static final` 且值可在编译期读取的字段会成为常量；其他公开字段会成为变量。常量值支持逻辑、数值和文本等编译器可识别的基本类型。

#### 属性

属性使用同名的获取器和设置器：

```java
@SimpleProperty
public String 标题() {
	return title;
}

@SimpleProperty(
	type = SimpleProperty.PROPERTY_TYPE_STRING,
	initializer = "\"\""
)
public void 标题(String value) {
	title = value;
}
```

- 获取器无参数并返回属性值。
- 设置器返回 `void`，并且只有一个参数。
- 只提供获取器时，属性为只读。
- 获取器与设置器必须使用相同名称和完全相同的类型。

`@SimpleProperty` 的 `type` 和 `initializer` 应写在设置器上。对象创建后，运行库会按 `type` 解析 `initializer`，再调用设置器写入初值；不要在构造方法中重复设置同一个默认值。

!> Java 注解中的 `initializer` 是运行时初值，`library.json` 中的 `initializer` 是 ES4A 显示和分析使用的设计期缺省值。两处应表达同一个默认状态，但作用不同，修改时需要同步核对。当前运行时的逻辑初值使用 `True`、`False`，而 `library.json` 使用 Simple 表达式 `真`、`假`。

#### 事件

事件声明使用 `@SimpleEvent`。对象或组件触发事件时，通过 `EventDispatcher.dispatchEvent` 分派：

```java
@SimpleEvent
public void 完成(String 结果) {
	EventDispatcher.dispatchEvent(this, "完成", 结果);
}
```

事件名、参数顺序和参数类型必须与 `library.json` 中的说明一致。

### Android 组件

组件通常由“公开接口”和“Android 实现类”组成。

#### 组件接口

```java
package com.example.demo;

import simple.runtime.annotations.SimpleComponent;
import simple.runtime.annotations.SimpleEvent;
import simple.runtime.annotations.SimpleObject;
import simple.runtime.annotations.SimpleProperty;
import simple.runtime.components.可视组件;

@SimpleComponent
@SimpleObject
public interface 演示按钮 extends 可视组件 {

	@SimpleEvent
	void 被单击();

	@SimpleProperty
	String 标题();

	@SimpleProperty(
		type = SimpleProperty.PROPERTY_TYPE_STRING,
		initializer = "\"\""
	)
	void 标题(String value);
}
```

常用基础接口：

| 类型 | 用途 |
| --- | --- |
| `组件` | 非可视组件 |
| `可视组件` | 提供 Android `View` 的组件 |
| `组件容器` | 可以包含其他组件的容器 |

容器型可视组件可以同时继承 `可视组件` 和 `组件容器`。

#### Android 实现类

```java
package com.example.demo;

import android.view.View;
import android.widget.Button;
import simple.runtime.android.MainActivity;
import simple.runtime.components.组件容器;
import simple.runtime.components.impl.android.视图组件;
import simple.runtime.events.EventDispatcher;

/**
 * 演示按钮的 Android 实现。直接实现组件接口，供编译器配对。
 * Simple 对外成员由接口声明，实现类不重复添加 Simple 注解。
 *
 * @author 树先生 xhwsd@qq.com
 */
public final class 演示按钮Impl extends 视图组件 implements 演示按钮 {

	/**
	 * 父类负责创建视图并将组件加入容器。
	 *
	 * @param container 容纳按钮的组件容器，不可为 null
	 */
	public 演示按钮Impl(组件容器 container) {
		super(container);
	}

	@Override
	protected View createView() {
		// 此方法由父类构造器调用，不依赖子类尚未初始化的字段。
		Button button = new Button(MainActivity.getContext());
		// 保留标题的大小写，避免主题自动转换英文文本。
		button.setAllCaps(false);
		button.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View view) {
				被单击();
			}
		});
		return button;
	}

	@Override
	public void 被单击() {
		// 事件名必须与接口中声明的 @SimpleEvent 方法一致。
		EventDispatcher.dispatchEvent(this, "被单击");
	}

	@Override
	public String 标题() {
		return ((Button) getView()).getText().toString();
	}

	@Override
	public void 标题(String value) {
		((Button) getView()).setText(value);
	}
}
```

当前编译器按 Java 的直接继承关系寻找组件实现，因此必须遵守以下规则：

- 实现类直接 `implements` 带 `@SimpleComponent` 的组件接口，或者直接继承带该注解的组件类。
- 实现类提供接收 `组件容器` 的公开构造方法。
- 可视组件返回真实 Android `View`。
- 事件由实现类在真实发生时分派，不要在属性设置器中伪造事件。
- 接口与实现类都必须打入同一个可加载的 `classes.jar`。

!> 间接实现组件接口时，当前加载器不能把实现类与组件自动配对，编译时会报告缺少组件实现。

## 编写 `library.json`

`library.json` 描述 ES4A 中的类库树、补全、悬停、属性框和设计器投影。它必须与 `classes.jar` 中的真实 Java 类型保持一致。

### 最小示例

```json
{
	"name": "演示扩展库",
	"description": "演示对象和组件的类库",
	"version": "0.1.0",
	"authors": [
		{
			"name": "示例作者",
			"email": "author@example.com"
		}
	],
	"kind": "library",
	"categories": [
		{
			"name": "扩展可视组件",
			"definitions": [
				{
					"name": "演示按钮",
					"description": "可以响应单击事件的按钮。",
					"icon": "icons/square-rounded-check.svg",
					"kind": "component",
					"type": "com.example.demo.演示按钮",
					"inherits": [
						"simple.runtime.components.可视组件"
					],
					"properties": [
						{
							"name": "标题",
							"type": "文本型",
							"description": "按钮显示的文本",
							"initializer": "\"\"",
							"projection": "text"
						}
					],
					"events": [
						{
							"name": "被单击",
							"description": "按钮被单击时触发"
						}
					]
				}
			]
		}
	]
}
```

### 类库字段

| 字段 | 必需 | 说明 |
| --- | --- | --- |
| `name` | 是 | 类库显示名称 |
| `description` | 否 | 类库用途说明 |
| `version` | 否 | 类库版本 |
| `authors` | 否 | 作者数组；`name` 必需，`email` 可选 |
| `kind` | 是 | 固定为 `library` |
| `categories` | 是 | 按显示顺序排列的分类数组 |

### 分类字段

| 字段 | 必需 | 说明 |
| --- | --- | --- |
| `name` | 是 | 分类名称 |
| `description` | 否 | 分类说明 |
| `definitions` | 是 | 分类中的定义 |
| `hidden` | 否 | 为 `true` 时不在类库树显示该分类 |

`hidden` 只对分类有效。定义即使位于隐藏分类中，仍可参与语言提示和类型解析；其中的组件也仍可出现在窗口设计器的“可用”区。

### 定义字段

| 字段 | 说明 |
| --- | --- |
| `name` | Simple 中显示的名称 |
| `description` | 定义说明 |
| `icon` | 相对于 `library.json` 的 SVG 图标路径 |
| `kind` | `component`、`component.window`、`interface`、`object`、`layout` 或 `type` 等用途类别 |
| `type` | Java 类或接口的完整名称 |
| `inherits` | 直接父类型标识数组 |
| `constants` | 常量 |
| `variables` | 变量 |
| `properties` | 属性 |
| `functions` | 函数和过程 |
| `events` | 事件 |

### 成员和参数

成员常用字段：

| 字段 | 说明 |
| --- | --- |
| `name` | 成员名称 |
| `description` | 成员说明 |
| `type` | 常量、变量或属性的数据类型 |
| `value` | 常量值 |
| `return` | 函数返回类型；过程省略 |
| `params` | 有序参数数组 |
| `initializer` | 属性或变量的缺省表达式 |
| `writable: false` | 只读属性 |
| `global: true` | 在 ES4A 中提供全局候选 |
| `static: true` | 在 ES4A 中将函数或变量识别为类型成员，须与 Java 声明一致 |
| `editor` | 属性编辑器 |
| `select` | 属性候选值 |
| `group` | 属性框中的附加分组 |
| `layouts` | 属性适用的直接父级布局 |
| `projection` | 设计器识别的稳定属性语义 |

参数的 `name` 必需，`type` 和 `description` 可选；`byRef: true` 表示传址参数。

### 配置属性框

以下字段决定 `library.json` 中的定义如何进入属性框，以及用户可以如何查看和编辑属性值。

#### 缺省值

字符串形式的 `initializer` 同时作为显示文本和 Simple 表达式：

```json
"initializer": "真"
```

需要区分显示文本与实际表达式时使用对象：

```json
"initializer": {
	"label": "默认",
	"value": "字体_默认_大小"
}
```

`library.json` 中的 `initializer` 只提供缺省显示和语义，不会自动向 `.simple` 文件的属性区写入属性。组件创建时真正执行的初值来自 Java 设置器上的 `@SimpleProperty.initializer`。

#### 候选值

```json
"select": {
	"input": true,
	"options": [
		"真",
		{
			"label": "适应内容",
			"value": "长度_适应内容"
		}
	]
}
```

- 字符串选项的显示文本与写入表达式相同。
- 对象选项使用 `label` 显示、使用 `value` 写入。
- `input: true` 允许用户输入候选项以外的值。
- 已存在但不在候选中的值会原样保留。

#### 属性编辑器

`library.json.editor` 决定 ES4A 提供哪种输入界面；它不等同于 Java 注解的 `@SimpleProperty.type`，也不会参与运行时属性初始化。

| `editor` | 用途 |
| --- | --- |
| `simple.boolean` | 逻辑值 |
| `simple.integer` | 整数 |
| `simple.single` | 单精度小数或表达式 |
| `simple.string` | 文本或表达式 |
| `simple.color` | 颜色 |
| `simple.pixel` | 尺寸、边距和 `px`、`dp`、`dip`、`sp` 单位 |
| `simple.layout` | 容器布局 |
| `simple.anchor` | 当前组件的直接可视兄弟 |
| `simple.asset` | 资产值 |

### 配置设计器投影

`projection` 把类库自定义的属性名映射为设计器认识的稳定语义。它只影响设计器显示与画布交互，不改变 Simple 编译和 Android 运行行为。

`projection` 的值不是用户看到的属性名，而是设计器识别的语义。类库可以自行命名属性，再用下列值告诉设计器如何解释它。

#### 标识、尺寸和位置

| `projection` | 映射的属性 | 设计器如何使用 |
| --- | --- | --- |
| `id` | 组件标识 | 识别相对布局引用的目标组件；组件改名时也据此更新锚点引用。它不是组件名称。 |
| `width` | 宽度 | 决定组件在画布上的宽度；支持适应内容、匹配父级和固定 DIP，拖动调整宽度时回写该属性。 |
| `height` | 高度 | 决定组件在画布上的高度；支持适应内容、匹配父级和固定 DIP，拖动调整高度时回写该属性。 |
| `x` | 左边位置 | 仅用于绝对布局，表示组件左边相对父容器左边的距离；移动组件时回写该属性。 |
| `y` | 顶边位置 | 仅用于绝对布局，表示组件顶边相对父容器顶边的距离；移动组件时回写该属性。 |

#### 外边距和内边距

| `projection` | 映射的属性 | 设计器如何使用 |
| --- | --- | --- |
| `leftMargin` | 左外边距 | 在组件左侧保留与父容器或相邻组件之间的距离。 |
| `topMargin` | 上外边距 | 在组件上方保留与父容器或相邻组件之间的距离。 |
| `rightMargin` | 右外边距 | 在组件右侧保留与父容器或相邻组件之间的距离。 |
| `bottomMargin` | 下外边距 | 在组件下方保留与父容器或相邻组件之间的距离。 |
| `paddingLeft` | 左内边距 | 在组件左边界与自身内容或子组件之间保留距离。 |
| `paddingTop` | 上内边距 | 在组件上边界与自身内容或子组件之间保留距离。 |
| `paddingRight` | 右内边距 | 在组件右边界与自身内容或子组件之间保留距离。 |
| `paddingBottom` | 下内边距 | 在组件下边界与自身内容或子组件之间保留距离。 |

#### 文本显示

| `projection` | 映射的属性 | 设计器如何使用 |
| --- | --- | --- |
| `text` | 主文本 | 作为按钮、标签、编辑框等文本组件的画布显示内容。 |
| `hint` | 提示文本 | 主文本为空时，作为编辑框等组件的占位提示显示。 |
| `textColor` | 文本颜色 | 设置主文本在画布中的颜色。 |
| `textSize` | 字体大小 | 设置文本在画布中的低保真字号。 |
| `fontFamily` | 字体类型 | 将 Simple 字体常量投影为默认、无衬线、衬线或等宽字体。 |
| `fontBold` | 字体加粗 | 为真时在画布中使用粗体。 |
| `fontItalic` | 字体倾斜 | 为真时在画布中使用斜体。 |

#### 容器和父级布局

| `projection` | 映射的属性 | 设计器如何使用 |
| --- | --- | --- |
| `layout` | 容器布局 | 决定容器如何排列子组件，例如线性、表格、单帧、相对或绝对布局。 |
| `orientation` | 布局方向 | 在线性布局中决定子组件水平排列还是垂直排列。 |
| `gravity` | 内容对齐 | 决定组件内部内容的对齐；用于布局定义时，决定容器内子组件的整体排列位置。 |
| `layoutGravity` | 父级对齐 | 决定组件自身在父容器分配空间中的对齐位置。 |
| `weight` | 组件权重 | 在线性布局中，决定当前组件分配主方向剩余空间的比例。 |
| `weightSum` | 权重总和 | 在线性布局容器上指定计算子组件权重时使用的总值。 |

`gravity` 表示组件内部内容的对齐方式，`layoutGravity` 表示组件自身在父容器中的对齐方式，两者不要混用。

`layouts` 可以限制某个属性只在指定父级布局下显示：

```json
{
	"name": "位于左边",
	"type": "整数型",
	"editor": "simple.anchor",
	"layouts": ["布局_相对"],
	"group": "相对组件"
}
```

不适用于当前布局的既有属性值仍会保留，不会被设计器自动删除。

## 构建与接入 SDK

Java 实现和 `library.json` 完成后，需要生成 `classes.jar`，再把类库登记到 ES4A 当前使用的 SDK。

### 构建 `classes.jar`

所有 SDK 类库共用 `sdk/libraries/build.bat`：

```bat
sdk\libraries\build.bat "E:\路径\到\类库目录"
```

公共脚本会：

1. 使用 SDK 自带的 JDK 8 编译 `src`。
2. 将 Android API 26、`SimpleAndroidRuntime.jar` 和 `libs/*` 加入编译类路径。
3. 清理类库自己的 `build/classes`。
4. 把编译结果打包到类库根目录的 `classes.jar`。

?> 构建脚本是开发工具；编译器实际加载的是类库根目录的 `classes.jar`。

### 登记到 SDK

在 SDK 根目录的 `sdk.json` 中，把类库清单加入 `libraries`：

```json
{
	"libraries": [
		"libraries/com.example.demo/library.json"
	]
}
```

路径相对于 `sdk.json`。`libraries` 只接受明确路径数组，不支持单个字符串或通配表达式。调整数组位置即可调整 ES4A 加载和显示类库的顺序；分类和定义保持各自数组顺序，不需要额外排序字段。

ES4A 只加载这里明确登记的 `library.json`；Simple 编译器则通过 `LIBRARIES_HOME` 扫描每个直接子目录中的 `classes.jar`。SDK 的编译入口会把 `sdk/libraries` 传给编译器。

### 依赖、资源和原生库

编译器识别以下固定位置：

- `libs/*.jar`：先加入类加载器，并在需要时参与 DEX。
- `res/`：参与 Android 资源编译与合并。
- `assets/`：加入 APK 资产。
- `jni/`：加入按 ABI 组织的原生库。

编译器会发现全部类库，但只把当前项目实际引用到的类库及其依赖、资源、资产和原生库放入 APK。

Android 类库还可以按实际引用声明权限，并向应用清单的固定位置加入节点。

### Android 权限

需要 Android 权限的对象使用 `@UsesPermissions`：

```java
@SimpleObject
@UsesPermissions(permissionNames = "android.permission.INTERNET")
public final class HTTP服务 {
}
```

多个权限使用逗号分隔。编译器只为项目实际引用的对象收集权限。该注解只负责生成 Android 清单声明；危险权限仍需在应用运行时请求，并处理用户拒绝授权的情况。

### Android 清单节点

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

```simple
别名 文本工具 = com.example.tools.文本工具

变量 工具 为 文本工具
工具 = 创建 文本工具

变量 结果 为 文本型
结果 = 工具.加前缀("你好")
```

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

---

[← 上一篇：Simple 语言定义](/simple/Simple语言定义.md)
