# 基于List组件实现商品列表

### 简介

基于ArkTS，使用List组件，实现了商品列表的懒加载、下拉刷新、列表触底提示与受控回弹效果；并新增商品详情页导航与刷新兜底重试。

![](screenshots/device/List_usage.gif)

### 相关概念

- Scroll：可滚动的容器组件，当子组件的布局尺寸超过父组件的视口时，内容可以滚动。
- List：列表包含一系列相同宽度的列表项。适合连续、多行呈现同类数据，例如图片和文本。
- Tabs：一种可以通过页签进行内容视图切换的容器组件，每个页签对应一个内容视图。
- LazyForEach：开发框架提供数据懒加载（LazyForEach组件）从提供的数据源中按需迭代数据，并在每次迭代过程中创建相应的组件。

### 相关权限

不涉及

### 使用说明

- 列表：支持懒加载与触底提示，`hasMore=false` 时每次到达末尾都会弹出 Toast：“已经到底了”。
- 下拉刷新：顶部显示“下拉刷新 / 松手即可刷新”，刷新有 8s 超时与失败重试按钮。
- 受控回弹：列表末端在无更多数据时加入 24dp 底部间距，避免过度弹性回弹。
- 商品详情：点击商品卡片或“去看看”进入详情页（`pages/Detail`），展示名称、价格、描述、预览图及评价信息（如传参包含）。
- 子类筛选：在各分类页签下方提供横向子类筛选条（如“旗舰/续航/影像/入门”等），点击后立即过滤数据。
- Tabs 优化：通过 `ForEach` 生成 Tab 内容，统一样式并减少重复代码。

### 约束与限制
### 路由配置

- 已在 [entry/src/main/resources/base/profile/main_pages.json](entry/src/main/resources/base/profile/main_pages.json) 中注册：
	- `pages/ListIndex`
	- `pages/Detail`

### 主要改动

- [entry/src/main/ets/view/GoodsListComponent.ets](entry/src/main/ets/view/GoodsListComponent.ets)：为商品卡片与“去看看”绑定点击，跳转详情。
- [entry/src/main/ets/pages/Detail.ets](entry/src/main/ets/pages/Detail.ets)：新增详情页，展示基本信息，支持返回。
- [entry/src/main/ets/view/RefreshLayout.ets](entry/src/main/ets/view/RefreshLayout.ets)：
	- 使用 `pullDistance` 显示“下拉刷新/松手刷新”状态。
	- 刷新增加超时与失败重试。
	- 无更多数据时增加底部间距以控制回弹距离。
- [entry/src/main/ets/pages/ListIndex.ets](entry/src/main/ets/pages/ListIndex.ets)：列表尾部提示作为 `ListItem`，并在尾部出现及每次到达末尾时提示。
	- 新增子类筛选条，并将 Tabs 由手写改为 `ForEach` 生成。
- [entry/src/main/ets/viewmodel/ListDataSource.ets](entry/src/main/ets/viewmodel/ListDataSource.ets)：
	- 增加 `subCategory` 字段与生成逻辑，并支持子类过滤。
	- 暴露 `setSubcategory()` / `getSubcategory()`、`getCategory()`、`findById()`，用于 UI 与详情页查找。

1. 本示例仅支持标准系统上运行，支持设备：华为手机。
2. HarmonyOS系统：HarmonyOS 5.0.5 Release及以上。
3. DevEco Studio版本：DevEco Studio 6.0.0 Release及以上。
4. HarmonyOS SDK版本：HarmonyOS 6.0.0 Release SDK及以上。