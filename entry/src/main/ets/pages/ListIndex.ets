// entry/src/main/ets/pages/ListIndex.ets
import { ProductItem } from '../view/GoodsListComponent';
import {
  Product,
  ProductListDataSource,
  ProductCategory,
  SortOption,
  PriceFilter
} from '../viewmodel/ListDataSource';
import { RefreshLayout } from '../view/RefreshLayout'; // 引入新的 RefreshLayout 组件
import promptAction from '@ohos.promptAction';

interface FilterOption<T> {
  label: string;
  value: T;
}

interface CategoryTab {
  label: string;
  ds: ProductListDataSource;
}

@Entry
@Component
struct ProductListPage {
  @State private selectedTabIndex: number = 0;
  private tabsController: TabsController = new TabsController();
  // 不需要在这里声明scroller，RefreshLayout内部会创建并管理
  // private scroller: Scroller = new Scroller(); // 移除这行

  // Initialize each DataSource with its specific category
  private featuredDataSource: ProductListDataSource = new ProductListDataSource(ProductCategory.FEATURED);
  private mobileDataSource: ProductListDataSource = new ProductListDataSource(ProductCategory.MOBILE);
  private fashionDataSource: ProductListDataSource = new ProductListDataSource(ProductCategory.FASHION);
  private wearDataSource: ProductListDataSource = new ProductListDataSource(ProductCategory.WEAR);
  private homeDataSource: ProductListDataSource = new ProductListDataSource(ProductCategory.HOME);

  // Tab 配置用于 ForEach 统一生成
  private categoryTabs: Array<CategoryTab> = [
    { label: '精选', ds: this.featuredDataSource },
    { label: '手机', ds: this.mobileDataSource },
    { label: '服饰', ds: this.fashionDataSource },
    { label: '穿搭', ds: this.wearDataSource },
    { label: '家居', ds: this.homeDataSource }
  ];

  // State for search bar
  @State private searchText: string = '';
  @State private activeSort: SortOption = SortOption.DEFAULT;
  @State private activePriceFilter: PriceFilter = PriceFilter.ALL;
  @State private showFilterPanel: boolean = false;
  @State private activeSubcategoryCurrent: string = '';

  // 非响应式存储：每个分类的当前子类（用于在不同分类间记忆选择）
  private activeSubByCategory: Map<ProductCategory, string> = new Map<ProductCategory, string>();

  // 每个顶层分类的子类选项
  private subcategoryOptionsMap: Map<ProductCategory, Array<string>> = new Map<ProductCategory, Array<string>>([
    [ProductCategory.FEATURED, ['热门', '新品', '健康轻食', '零食饮品']],
    [ProductCategory.MOBILE, ['旗舰', '续航', '影像', '入门']],
    [ProductCategory.FASHION, ['卫衣', '牛仔', '连衣裙', '风衣']],
    [ProductCategory.WEAR, ['T恤', '跑鞋', '手环', '瑜伽']],
    [ProductCategory.HOME, ['清洁', '家具', '香薰', '寝具']]
  ]);

  private sortOptions: FilterOption<SortOption>[] = [
    { label: '默认', value: SortOption.DEFAULT },
    { label: '价格↑', value: SortOption.PRICE_ASC },
    { label: '价格↓', value: SortOption.PRICE_DESC },
    { label: '好评优先', value: SortOption.RATING_DESC }
  ];

  private priceFilters: FilterOption<PriceFilter>[] = [
    { label: '全部', value: PriceFilter.ALL },
    { label: '0-100', value: PriceFilter.UNDER_100 },
    { label: '100-200', value: PriceFilter.BETWEEN_100_200 },
    { label: '200+', value: PriceFilter.OVER_200 }
  ];

  // State for scroll-to-top button
  @State private showScrollToTop: boolean = false;
  private scroller: Scroller = new Scroller(); // Scroller for "Back to Top"
  @State private wasAtEnd: boolean = false;
  private lastEndToastMs: number = 0;

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

  aboutToAppear() {
    const ds = this.currentDataSource;
    if (!ds) {
      console.error('currentDataSource is undefined in aboutToAppear');
      return;
    }
    this.syncControlsFromDataSource(ds);
    const cat = ds.getCategory();
    if (!this.activeSubByCategory.has(cat)) {
      const opts = this.subcategoryOptionsMap.get(cat) ?? [];
      const first = opts.length > 0 ? opts[0] : '';
      this.activeSubByCategory.set(cat, first);
    }
    this.activeSubcategoryCurrent = this.activeSubByCategory.get(cat) ?? '';
    ds.setSubcategory(this.activeSubcategoryCurrent);
  }

  build() {
    Navigation() {
      Column() {
        Tabs({ index: this.selectedTabIndex, controller: this.tabsController }) {
          ForEach(this.categoryTabs, (tabCfg: CategoryTab) => {
            TabContent() {
              this.buildProductListContent(tabCfg.ds);
            }
            .tabBar(tabCfg.label)
          }, (tabCfg: CategoryTab) => tabCfg.label)
        }
        .scrollable(true) // Tabs本身可滚动
        .barMode(BarMode.Scrollable) // TabBar可滚动
        .barHeight(56)
        .backgroundColor(Color.White)
        .onChange(index => {
          this.selectedTabIndex = index;
          this.wasAtEnd = false;
          this.lastEndToastMs = 0;
          const ds = this.currentDataSource;
          if (!ds) {
            console.error('currentDataSource is undefined in Tabs.onChange');
            return;
          }
          // 当Tab切换时，确保当前DataSource的数据是加载过的
          try {
            if (ds.totalCount() === 0) {
              console.log(`Loading data for tab ${index}`);
              ds.refresh(); // 或者根据需求只加载一次
            }
          } catch (e) {
            console.error(`Error loading data on tab switch: ${e}`);
          }
          this.syncControlsFromDataSource(ds);
          const cat2 = ds.getCategory();
          if (!this.activeSubByCategory.has(cat2)) {
            const opts2 = this.subcategoryOptionsMap.get(cat2) ?? [];
            this.activeSubByCategory.set(cat2, opts2.length > 0 ? opts2[0] : '');
          }
          this.activeSubcategoryCurrent = this.activeSubByCategory.get(cat2) ?? '';
          ds.setSubcategory(this.activeSubcategoryCurrent);
        })
      }
    }
    .title("商城") // Navigation的标题
    .titleMode(NavigationTitleMode.Mini) // 小标题模式

    .backgroundColor(Color.Brown)
  }

  // 辅助方法，用于构建商品列表内容，包含下拉刷新和懒加载
  @Builder
  buildProductListContent(dataSource: ProductListDataSource) {
    // 数据源空保护
    if (!dataSource) {
      Column() {
        Text('数据源未初始化')
          .fontSize(14)
          .fontColor(Color.Gray)
          .padding(12)
      }
      .width('100%')
      .height('100%')
    } else {
      // RefreshLayout现在直接接受dataSource，并在内部管理加载状态
      // scroller也不需要从外部传入，RefreshLayout内部会管理其Scroll组件
      RefreshLayout({
        dataSource: dataSource // 传递DataSource实例
      }) {
      Column() {
        this.buildSearchAndFilter(dataSource);

        // 子类选择条
        if ((this.subcategoryOptionsMap.get(dataSource.getCategory()) ?? []).length > 0) {
          Scroll() {
            Row() {
              ForEach(this.subcategoryOptionsMap.get(dataSource.getCategory()) ?? [], (opt: string) => {
                Text(opt)
                  .fontSize(12)
                  .fontColor((this.activeSubcategoryCurrent ?? '') === opt ? Color.White : Color.Black)
                  .backgroundColor((this.activeSubcategoryCurrent ?? '') === opt ? '#2D6A4F' : '#E6E6E6')
                  .borderRadius(12)
                  .padding({ left: 12, right: 12, top: 6, bottom: 6 })
                  .margin({ right: 8, bottom: 4, left: 12 })
                  .onClick(() => {
                    this.activeSubcategoryCurrent = opt;
                    this.activeSubByCategory.set(dataSource.getCategory(), opt);
                    dataSource.setSubcategory(opt);
                  })
              }, (opt: string) => opt)
            }
          }
          .scrollable(ScrollDirection.Horizontal)
          .scrollBar(BarState.Off)
          .width('100%')
        }

        if (dataSource.totalCount() === 0 && !dataSource.isLoadingMore) {
          Column() {
            Image($r('app.media.empty_box_icon')) // You'd need an 'empty_box_icon' asset
              .width(80).height(80)
              .margin({ bottom: 16 })
            Text(this.searchText.length > 0 || this.activePriceFilter !== PriceFilter.ALL ?
              '没有匹配的商品，请调整搜索或筛选条件' :
              '哎呀，这里还没有商品哦')
              .fontSize(16)
              .fontColor(Color.Gray)
          }
          .width('100%')
          .layoutWeight(1)
          .justifyContent(FlexAlign.Center)
          .alignItems(HorizontalAlign.Center)
        } else {
          Column() { // 使用Column包裹List，以便在底部添加"到底了"提示
            List() {
              LazyForEach(dataSource, (item: Product) => {
                ListItem() {
                  ProductItem({ product: item, category: dataSource.getCategory() })
                }
              }, (item: Product) => item.id.toString())

              // Loading more indicator (as a ListItem so it appears inside the list)
              if (dataSource.isLoadingMore) {
                ListItem() {
                  Column() {
                    LoadingProgress()
                      .width(30).height(30)
                      .margin({ top: 10, bottom: 20 })
                  }
                  .width('100%')
                  .justifyContent(FlexAlign.Center)
                }
              }

              // 到底提示（列表尾部项，确保可见）
              if (dataSource.totalCount() > 0 && !dataSource.hasMore && !dataSource.isLoadingMore) {
                ListItem() {
                  Text('已经到底了')
                    .fontSize(14)
                    .fontColor(Color.Gray)
                    .textAlign(TextAlign.Center)
                    .width('100%')
                    .padding(12)
                    .backgroundColor('#F7F7F7')
                    .borderRadius(8)
                    .onAppear(() => {
                      const now = Date.now();
                      if (now - this.lastEndToastMs > 1200) {
                        console.log('已经到底了');
                        promptAction.showToast({ message: '已经到底了', duration: 1500 });
                        this.lastEndToastMs = now;
                      }
                    })
                }
              }
            }
            .width('100%')
            .layoutWeight(1)
            // LazyForEach 内部的 onScrollIndex 可以用来辅助触发懒加载，但主要逻辑在RefreshLayout的onScroll中
            .onScrollIndex((first: number, last: number) => {
              dataSource.setIsAtTop(first === 0);
              if (last >= dataSource.totalCount() - 6 && dataSource.totalCount() > 0 && !dataSource.isLoadingMore &&
              dataSource.hasMore) {
                console.log('LazyForEach triggered load more via onScrollIndex');
                dataSource.loadMore();
              }

              if (!dataSource.hasMore && dataSource.totalCount() > 0) {
                const atEnd = last >= dataSource.totalCount() - 1;
                if (atEnd) {
                  const now = Date.now();
                  // 每次拉到底都提示；加轻微节流避免连续刷屏
                  if (now - this.lastEndToastMs > 1200 || !this.wasAtEnd) {
                    console.log('已经到底了');
                    promptAction.showToast({ message: '已经到底了', duration: 1500 });
                    this.lastEndToastMs = now;
                  }
                }
                this.wasAtEnd = atEnd;
              } else {
                this.wasAtEnd = false;
              }
            })
          }
          .width('100%')
          .layoutWeight(1) // Column的高度需要设置，以便List可以填充
        }
      }
      .width('100%')
      .height('100%')
      //.height('100%') // RefreshLayout的高度需要设置 (uncommented to fix potential layout crashes)
      }
    }
  }

  @Builder
  private buildSearchAndFilter(dataSource: ProductListDataSource) {
    Column() {
      Row() {
        TextInput({ text: this.searchText, placeholder: '搜索商品名称或描述' })
          .layoutWeight(1)
          .height(36)
          .backgroundColor('#F2F2F2')
          .borderRadius(18)
          .padding({ left: 12, right: 12 })
          .onChange((value: string) => {
            this.searchText = value;
            dataSource.setSearchQuery(value);
          })
        if (this.searchText.length > 0) {
          Text('清除')
            .fontSize(12)
            .fontColor('#666666')
            .margin({ left: 8 })
            .padding({ left: 8, right: 8, top: 6, bottom: 6 })
            .onClick(() => {
              this.searchText = '';
              dataSource.setSearchQuery('');
            })
        }
        Text(this.showFilterPanel ? '收起' : '筛选')
          .fontSize(12)
          .fontColor(this.activeSort !== SortOption.DEFAULT || this.activePriceFilter !== PriceFilter.ALL ?
            Color.White : '#666666')
          .backgroundColor(this.activeSort !== SortOption.DEFAULT || this.activePriceFilter !== PriceFilter.ALL ?
            '#2D6A4F' : '#E6E6E6')
          .borderRadius(14)
          .margin({ left: 8 })
          .padding({ left: 10, right: 10, top: 6, bottom: 6 })
          .onClick(() => {
            this.showFilterPanel = !this.showFilterPanel;
          })
      }
      .padding({ left: 12, right: 12, top: 12, bottom: 8 })

      if (this.showFilterPanel) {
        Column() {
          Text('排序')
            .fontSize(12)
            .fontColor(Color.Gray)
            .margin({ left: 12, bottom: 6 })

          Scroll() {
            Row() {
              ForEach(this.sortOptions, (option: FilterOption<SortOption>) => {
                Text(option.label)
                  .fontSize(12)
                  .fontColor(this.activeSort === option.value ? Color.White : Color.Black)
                  .backgroundColor(this.activeSort === option.value ? '#2D6A4F' : '#E6E6E6')
                  .borderRadius(12)
                  .padding({ left: 12, right: 12, top: 6, bottom: 6 })
                  .margin({ right: 8, bottom: 4 })
                  .onClick(() => {
                    this.activeSort = option.value;
                    dataSource.setSortOption(option.value);
                  })
              }, (option: FilterOption<SortOption>) => option.value)
            }
            .padding({ left: 12, right: 12 })
          }
          .scrollable(ScrollDirection.Horizontal)
          .scrollBar(BarState.Off)
          .width('100%')

          Text('价格')
            .fontSize(12)
            .fontColor(Color.Gray)
            .margin({ left: 12, top: 8, bottom: 6 })

          Scroll() {
            Row() {
              ForEach(this.priceFilters, (option: FilterOption<PriceFilter>) => {
                Text(option.label)
                  .fontSize(12)
                  .fontColor(this.activePriceFilter === option.value ? Color.White : Color.Black)
                  .backgroundColor(this.activePriceFilter === option.value ? '#2D6A4F' : '#E6E6E6')
                  .borderRadius(12)
                  .padding({ left: 12, right: 12, top: 6, bottom: 6 })
                  .margin({ right: 8, bottom: 4 })
                  .onClick(() => {
                    this.activePriceFilter = option.value;
                    dataSource.setPriceFilter(option.value);
                  })
              }, (option: FilterOption<PriceFilter>) => option.value)
            }
            .padding({ left: 12, right: 12, bottom: 8 })
          }
          .scrollable(ScrollDirection.Horizontal)
          .scrollBar(BarState.Off)
          .width('100%')
        }
      }
    }
  }

  private syncControlsFromDataSource(dataSource: ProductListDataSource) {
    if (!dataSource) {
      return;
    }
    this.searchText = dataSource.getSearchQuery();
    this.activeSort = dataSource.getSortOption();
    this.activePriceFilter = dataSource.getPriceFilter();
  }
}
