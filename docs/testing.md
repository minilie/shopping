# 系统测试与稳定性记录

## 测试环境
- 目标系统：HarmonyOS 5.0.5 Release 及以上
- 开发工具：DevEco Studio 6.0.0 Release 及以上
- 设备：官方模拟器 emulator 5.1.0.110(SP2DEVC00E110R4P11)，真机测评待补

## 自动化测试（Hypium）
- 测试运行器：`entry/src/ohosTest/ets/testrunner/OpenHarmonyTestRunner.ets`
- 测试集合：`entry/src/ohosTest/ets/test/List.test.ets`
- 目前覆盖：数据源初始化、搜索过滤、价格区间筛选、排序规则、分页加载
- 最新执行：模拟器运行通过（ProductListDataSource，2025-12-24）

## 自动化测试执行记录
- 运行命令：`hdc shell aa test -b com.example.list_harmony -m entry_test -s unittest /ets/testrunner/OpenHarmonyTestRunner -s class ProductListDataSource -s timeout 15000`
- 执行结果：全部测试成功（模拟器环境）

## 测试用例与结果
| 用例 ID | 目的 | 步骤 | 预期结果 | 当前结果 |
| --- | --- | --- | --- | --- |
| TC-01 | 首屏展示 | 启动应用进入“商城” | 展示 Tab 与商品列表 | 待真机/模拟器执行 |
| TC-02 | Tab 切换 | 点击不同 Tab | 切换分类并展示对应列表 | 待真机/模拟器执行 |
| TC-03 | 下拉刷新 | 列表顶部下拉超过阈值 | 显示刷新提示并重载数据 | 待真机/模拟器执行 |
| TC-04 | 懒加载 | 向下滚动接近底部 | 自动加载下一批数据 | 数据源用例通过，UI 验证待补 |
| TC-05 | 触底提示 | 加载至无更多数据 | 显示“已经到底了” | 数据源逻辑可达，UI 验证待补 |
| TC-06 | 空状态 | 数据源为空 | 显示“哎呀，这里还没有商品哦” | 逻辑可达，待验证 |
| TC-07 | 搜索过滤 | 输入关键词（如“手机”） | 列表仅显示匹配名称/描述的商品 | 数据源用例通过，UI 验证待补 |
| TC-08 | 筛选/排序 | 选择价格区间或排序规则 | 列表按规则更新与排序 | 数据源用例通过，UI 验证待补 |

## 量化指标与当前实现依据
- 刷新模拟耗时：约 1.5s（`ProductListDataSource.refresh()`）。
- 加载更多模拟耗时：约 0.8s（`ProductListDataSource.loadMore()`）。
- 首批加载数量：每分类 20 条，增量 20 条。
- 触发阈值：下拉刷新阈值约 80px；滚动到 80% 进度或距尾部 6 条触发加载。
- 帧率目标：≥40fps（待使用性能工具量化）。
- 自动化测试结果：Hypium 用例在模拟器通过（ProductListDataSource）。

## 异常与稳定性考虑（当前实现）
- 刷新失败兜底：刷新 Promise 捕获错误后复位状态，避免卡住。
- 重复加载防护：`isLoadingMore` 与 `hasMore` 阻止重复触发。
- 异常场景待验证：快速上拉下拉、多次切换 Tab、滚动过程中触发刷新。
