# 编写 Simple 类库：Java 实现

> 实现指南｜核对日期：2026-10-08｜依据：当前编译器 RuntimeLoader、运行库注解与 com.example.demo 源码｜适用范围：当前 ES4A SDK 与 VS Code 扩展。

本文回答如何用 Java 实现 Simple 对象、函数和 Android 组件。完整流程从[类库开发入口](library-development/README.md)开始；工程结构、依赖、权限与发布见[构建与交付](library-development/build.md)，IDE 元数据见[清单定义参考](reference/manifests.md)，入口注册见[SDK 配置参考](reference/sdk.md)。

## 注解映射

编译器扫描 `classes.jar` 中的类，只有带 `@SimpleObject` 的类型才会作为 Simple 对象加载。对象的函数、属性、事件和数据成员分别由对应注解公开。

| Java 声明 | Simple 中的含义 |
| --- | --- |
| `@SimpleObject` 类或接口 | 对象类型或接口 |
| `@SimpleComponent` | 与 `@SimpleObject` 同时使用时，声明可由组件系统创建的组件 |
| `@SimpleFunction` 方法 | 函数或过程 |
| `@SimpleProperty` 方法 | 属性获取器或设置器 |
| `@SimpleEvent` 方法 | 事件 |
| `@SimpleDataElement` 字段 | 常量或变量 |

## 数据类型对应

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

## 普通对象

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

在已有主窗口单元中，Simple 代码可以使用完全限定名，也可以先声明别名：

```simple
别名 演示对象 = com.example.demo.演示对象

事件 主窗口.初始化()
	变量 工具 为 演示对象
	工具 = 创建 演示对象

	变量 结果 为 文本型
	结果 = 工具.加前缀("你好")

	变量 长度 为 整数型
	长度 = 演示对象.取长度("你好")
结束 事件
```

!> 扩展类库中的静态函数不会自动成为全局函数。即使 `library.json` 将成员标为 `global: true`，那也只影响 ES4A 的候选提示，不会改变编译器的名称解析规则。

演示对象的 `取长度` 在 Java 中声明为 `static`，在清单对应函数中声明 `static: true`，使 ES4A 按类型成员提供补全。实例函数 `加前缀` 不设置此标记。

### 函数和过程

- 带返回值的 `@SimpleFunction` 方法在 Simple 中是函数。
- 返回 `void` 的 `@SimpleFunction` 方法在 Simple 中是过程。
- `static` 方法属于类型；非静态方法属于对象实例。
- 同名方法可以按参数个数形成重载；不要只依靠参数类型区分相同参数个数的重载。
- 参数和返回类型必须能转换为 Simple 类型。

### 常量和变量

公开字段需要使用 `@SimpleDataElement`：

```java
@SimpleDataElement
public static final int 模式_普通 = 0;

@SimpleDataElement
public static int 当前模式 = 模式_普通;
```

`public static final` 且值可在编译期读取的字段会成为常量；其他公开字段会成为变量。常量值支持逻辑、数值和文本等编译器可识别的基本类型。

### 属性

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

### 事件

事件声明使用 `@SimpleEvent`。对象或组件触发事件时，通过 `EventDispatcher.dispatchEvent` 分派：

```java
@SimpleEvent
public void 完成(String 结果) {
	EventDispatcher.dispatchEvent(this, "完成", 结果);
}
```

事件名、参数顺序和参数类型必须与 `library.json` 中的说明一致。

## Android 组件

组件通常由“公开接口”和“Android 实现类”组成。

### 组件接口

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

### Android 实现类

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

## 下一步

为已经实现的公开类型编写[清单定义](reference/manifests.md)，再按[构建与交付](library-development/build.md)生成类库、接入 SDK 并验证。Java 注解决定编译器可调用的成员；清单描述这些成员在 IDE 中的显示，两者必须一致。
