// entry/src/main/ets/pages/ListIndex.ets
import { ProductItem } from '../view/GoodsListComponent';
import { Product, ProductListDataSource } from '../viewmodel/ListDataSource';
import { RefreshLayout } from '../view/RefreshLayout'; // 引入新的 RefreshLayout 组件

@Entry
@Component
struct ProductListPage {
  @State private selectedTabIndex: number = 0;
  private tabsController: TabsController = new TabsController();
  // 不需要在这里声明scroller，RefreshLayout内部会创建并管理
  // private scroller: Scroller = new Scroller(); // 移除这行

  // 为每个Tab创建一个独立的DataSource实例，以管理各自的数据状态
  // 这里需要使用 'new' 关键字初始化
  private featuredDataSource: ProductListDataSource = new ProductListDataSource();
  private mobileDataSource: ProductListDataSource = new ProductListDataSource();
  private fashionDataSource: ProductListDataSource = new ProductListDataSource();
  private wearDataSource: ProductListDataSource = new ProductListDataSource();
  private homeDataSource: ProductListDataSource = new ProductListDataSource();


  // 根据当前选中的Tab返回对应的DataSource
  private get currentDataSource(): ProductListDataSource {
    switch (this.selectedTabIndex) {
      case 0:
        return this.featuredDataSource;
      case 1:
        return this.mobileDataSource;
      case 2:
        return this.fashionDataSource;
      case 3:
        return this.wearDataSource;
      case 4:
        return this.homeDataSource;
      default:
        return this.featuredDataSource;
    }
  }

  build() {
    Navigation() {
      Column() {
        Tabs({
          index: this.selectedTabIndex,
          controller: this.tabsController
        }) {
          TabContent() {
            // "精选" Tab的内容
            this.buildProductListContent(this.featuredDataSource);
          }
          .tabBar("精选")

          TabContent() {
            // "手机" Tab的内容
            this.buildProductListContent(this.mobileDataSource);
          }
          .tabBar("手机")

          TabContent() {
            // "服饰" Tab的内容
            this.buildProductListContent(this.fashionDataSource);
          }
          .tabBar("服饰")

          TabContent() {
            // "穿搭" Tab的内容
            this.buildProductListContent(this.wearDataSource);
          }
          .tabBar("穿搭")

          TabContent() {
            // "家居" Tab的内容
            this.buildProductListContent(this.homeDataSource);
          }
          .tabBar("家居")
        }
        .scrollable(true) // Tabs本身可滚动
        .barMode(BarMode.Scrollable) // TabBar可滚动
        .barHeight(56)
        .backgroundColor(Color.White)
        .onChange(index => {
          this.selectedTabIndex = index;
          // 当Tab切换时，确保当前DataSource的数据是加载过的
          try {
            if (this.currentDataSource.totalCount() === 0) {
              console.log(`Loading data for tab ${index}`);
              this.currentDataSource.refresh(); // 或者根据需求只加载一次
            }
          } catch (e) {
            console.error(`Error loading data on tab switch: ${e}`);
          }
        })
      }
    }
    .title("商城") // Navigation的标题
    .titleMode(NavigationTitleMode.Mini) // 小标题模式
    .backgroundColor(Color.White)
  }

  // 辅助方法，用于构建商品列表内容，包含下拉刷新和懒加载
  @Builder
  buildProductListContent(dataSource: ProductListDataSource) {
    // RefreshLayout现在直接接受dataSource，并在内部管理加载状态
    // scroller也不需要从外部传入，RefreshLayout内部会管理其Scroll组件
    RefreshLayout({
      dataSource: dataSource // 传递DataSource实例
    }) {
      Column() { // 使用Column包裹List，以便在底部添加“到底了”提示
        List() {
          LazyForEach(dataSource, (item: Product) => {
            ListItem() {
              ProductItem({ product: item })
            }
          }, (item: Product) => item.id.toString())
        }
        .width('100%')
        .layoutWeight(1)
        // LazyForEach 内部的 onScrollIndex 可以用来辅助触发懒加载，但主要逻辑在RefreshLayout的onScroll中
        .onScrollIndex((first: number, last: number) => {
          if (last >= dataSource.totalCount() - 6 && dataSource.totalCount() > 0 && !dataSource.isLoadingMore && dataSource.hasMore) {
            console.log('LazyForEach triggered load more via onScrollIndex');
            dataSource.loadMore();
          }
        }); // 添加分号以明确终止语句

        // 到底提示
        if (dataSource.totalCount() > 0 && !dataSource.hasMore) {
          Text('已经到底了')
            .fontSize(14)
            .fontColor(Color.Gray)
            .textAlign(TextAlign.Center)
            .width('100%')
            .padding(10)
        }
      }
      .width('100%')
      .height('100%') // Column的高度需要设置，以便List可以填充
    }
    //.height('100%') // RefreshLayout的高度需要设置 (uncommented to fix potential layout crashes)
  }
}