if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ProductListPage_Params {
    selectedTabIndex?: number;
    tabsController?: TabsController;
    featuredDataSource?: ProductListDataSource;
    mobileDataSource?: ProductListDataSource;
    fashionDataSource?: ProductListDataSource;
    wearDataSource?: ProductListDataSource;
    homeDataSource?: ProductListDataSource;
    categoryTabs?: Array<CategoryTab>;
    searchText?: string;
    activeSort?: SortOption;
    activePriceFilter?: PriceFilter;
    showFilterPanel?: boolean;
    activeSubcategoryCurrent?: string;
    activeSubByCategory?: Map<ProductCategory, string>;
    subcategoryOptionsMap?: Map<ProductCategory, Array<string>>;
    sortOptions?: FilterOption<SortOption>[];
    priceFilters?: FilterOption<PriceFilter>[];
    showScrollToTop?: boolean;
    scroller?: Scroller;
    wasAtEnd?: boolean;
    lastEndToastMs?: number;
}
import { ProductItem } from "@bundle:com.example.list_harmony/entry/ets/view/GoodsListComponent";
import { ProductListDataSource, ProductCategory, SortOption, PriceFilter } from "@bundle:com.example.list_harmony/entry/ets/viewmodel/ListDataSource";
import type { Product } from "@bundle:com.example.list_harmony/entry/ets/viewmodel/ListDataSource";
import { RefreshLayout } from "@bundle:com.example.list_harmony/entry/ets/view/RefreshLayout";
import promptAction from "@ohos:promptAction";
interface FilterOption<T> {
    label: string;
    value: T;
}
interface CategoryTab {
    label: string;
    ds: ProductListDataSource;
}
class ProductListPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__selectedTabIndex = new ObservedPropertySimplePU(0, this, "selectedTabIndex");
        this.tabsController = new TabsController();
        this.featuredDataSource = new ProductListDataSource(ProductCategory.FEATURED);
        this.mobileDataSource = new ProductListDataSource(ProductCategory.MOBILE);
        this.fashionDataSource = new ProductListDataSource(ProductCategory.FASHION);
        this.wearDataSource = new ProductListDataSource(ProductCategory.WEAR);
        this.homeDataSource = new ProductListDataSource(ProductCategory.HOME);
        this.categoryTabs = [
            { label: '精选', ds: this.featuredDataSource },
            { label: '手机', ds: this.mobileDataSource },
            { label: '服饰', ds: this.fashionDataSource },
            { label: '穿搭', ds: this.wearDataSource },
            { label: '家居', ds: this.homeDataSource }
        ];
        this.__searchText = new ObservedPropertySimplePU('', this, "searchText");
        this.__activeSort = new ObservedPropertySimplePU(SortOption.DEFAULT, this, "activeSort");
        this.__activePriceFilter = new ObservedPropertySimplePU(PriceFilter.ALL, this, "activePriceFilter");
        this.__showFilterPanel = new ObservedPropertySimplePU(false, this, "showFilterPanel");
        this.__activeSubcategoryCurrent = new ObservedPropertySimplePU('', this, "activeSubcategoryCurrent");
        this.activeSubByCategory = new Map<ProductCategory, string>();
        this.subcategoryOptionsMap = new Map<ProductCategory, Array<string>>([
            [ProductCategory.FEATURED, ['热门', '新品', '健康轻食', '零食饮品']],
            [ProductCategory.MOBILE, ['旗舰', '续航', '影像', '入门']],
            [ProductCategory.FASHION, ['卫衣', '牛仔', '连衣裙', '风衣']],
            [ProductCategory.WEAR, ['T恤', '跑鞋', '手环', '瑜伽']],
            [ProductCategory.HOME, ['清洁', '家具', '香薰', '寝具']]
        ]);
        this.sortOptions = [
            { label: '默认', value: SortOption.DEFAULT },
            { label: '价格↑', value: SortOption.PRICE_ASC },
            { label: '价格↓', value: SortOption.PRICE_DESC },
            { label: '好评优先', value: SortOption.RATING_DESC }
        ];
        this.priceFilters = [
            { label: '全部', value: PriceFilter.ALL },
            { label: '0-100', value: PriceFilter.UNDER_100 },
            { label: '100-200', value: PriceFilter.BETWEEN_100_200 },
            { label: '200+', value: PriceFilter.OVER_200 }
        ];
        this.__showScrollToTop = new ObservedPropertySimplePU(false, this, "showScrollToTop");
        this.scroller = new Scroller();
        this.__wasAtEnd = new ObservedPropertySimplePU(false, this, "wasAtEnd");
        this.lastEndToastMs = 0;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ProductListPage_Params) {
        if (params.selectedTabIndex !== undefined) {
            this.selectedTabIndex = params.selectedTabIndex;
        }
        if (params.tabsController !== undefined) {
            this.tabsController = params.tabsController;
        }
        if (params.featuredDataSource !== undefined) {
            this.featuredDataSource = params.featuredDataSource;
        }
        if (params.mobileDataSource !== undefined) {
            this.mobileDataSource = params.mobileDataSource;
        }
        if (params.fashionDataSource !== undefined) {
            this.fashionDataSource = params.fashionDataSource;
        }
        if (params.wearDataSource !== undefined) {
            this.wearDataSource = params.wearDataSource;
        }
        if (params.homeDataSource !== undefined) {
            this.homeDataSource = params.homeDataSource;
        }
        if (params.categoryTabs !== undefined) {
            this.categoryTabs = params.categoryTabs;
        }
        if (params.searchText !== undefined) {
            this.searchText = params.searchText;
        }
        if (params.activeSort !== undefined) {
            this.activeSort = params.activeSort;
        }
        if (params.activePriceFilter !== undefined) {
            this.activePriceFilter = params.activePriceFilter;
        }
        if (params.showFilterPanel !== undefined) {
            this.showFilterPanel = params.showFilterPanel;
        }
        if (params.activeSubcategoryCurrent !== undefined) {
            this.activeSubcategoryCurrent = params.activeSubcategoryCurrent;
        }
        if (params.activeSubByCategory !== undefined) {
            this.activeSubByCategory = params.activeSubByCategory;
        }
        if (params.subcategoryOptionsMap !== undefined) {
            this.subcategoryOptionsMap = params.subcategoryOptionsMap;
        }
        if (params.sortOptions !== undefined) {
            this.sortOptions = params.sortOptions;
        }
        if (params.priceFilters !== undefined) {
            this.priceFilters = params.priceFilters;
        }
        if (params.showScrollToTop !== undefined) {
            this.showScrollToTop = params.showScrollToTop;
        }
        if (params.scroller !== undefined) {
            this.scroller = params.scroller;
        }
        if (params.wasAtEnd !== undefined) {
            this.wasAtEnd = params.wasAtEnd;
        }
        if (params.lastEndToastMs !== undefined) {
            this.lastEndToastMs = params.lastEndToastMs;
        }
    }
    updateStateVars(params: ProductListPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__selectedTabIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__searchText.purgeDependencyOnElmtId(rmElmtId);
        this.__activeSort.purgeDependencyOnElmtId(rmElmtId);
        this.__activePriceFilter.purgeDependencyOnElmtId(rmElmtId);
        this.__showFilterPanel.purgeDependencyOnElmtId(rmElmtId);
        this.__activeSubcategoryCurrent.purgeDependencyOnElmtId(rmElmtId);
        this.__showScrollToTop.purgeDependencyOnElmtId(rmElmtId);
        this.__wasAtEnd.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__selectedTabIndex.aboutToBeDeleted();
        this.__searchText.aboutToBeDeleted();
        this.__activeSort.aboutToBeDeleted();
        this.__activePriceFilter.aboutToBeDeleted();
        this.__showFilterPanel.aboutToBeDeleted();
        this.__activeSubcategoryCurrent.aboutToBeDeleted();
        this.__showScrollToTop.aboutToBeDeleted();
        this.__wasAtEnd.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __selectedTabIndex: ObservedPropertySimplePU<number>;
    get selectedTabIndex() {
        return this.__selectedTabIndex.get();
    }
    set selectedTabIndex(newValue: number) {
        this.__selectedTabIndex.set(newValue);
    }
    private tabsController: TabsController;
    // 不需要在这里声明scroller，RefreshLayout内部会创建并管理
    // private scroller: Scroller = new Scroller(); // 移除这行
    // Initialize each DataSource with its specific category
    private featuredDataSource: ProductListDataSource;
    private mobileDataSource: ProductListDataSource;
    private fashionDataSource: ProductListDataSource;
    private wearDataSource: ProductListDataSource;
    private homeDataSource: ProductListDataSource;
    // Tab 配置用于 ForEach 统一生成
    private categoryTabs: Array<CategoryTab>;
    // State for search bar
    private __searchText: ObservedPropertySimplePU<string>;
    get searchText() {
        return this.__searchText.get();
    }
    set searchText(newValue: string) {
        this.__searchText.set(newValue);
    }
    private __activeSort: ObservedPropertySimplePU<SortOption>;
    get activeSort() {
        return this.__activeSort.get();
    }
    set activeSort(newValue: SortOption) {
        this.__activeSort.set(newValue);
    }
    private __activePriceFilter: ObservedPropertySimplePU<PriceFilter>;
    get activePriceFilter() {
        return this.__activePriceFilter.get();
    }
    set activePriceFilter(newValue: PriceFilter) {
        this.__activePriceFilter.set(newValue);
    }
    private __showFilterPanel: ObservedPropertySimplePU<boolean>;
    get showFilterPanel() {
        return this.__showFilterPanel.get();
    }
    set showFilterPanel(newValue: boolean) {
        this.__showFilterPanel.set(newValue);
    }
    private __activeSubcategoryCurrent: ObservedPropertySimplePU<string>;
    get activeSubcategoryCurrent() {
        return this.__activeSubcategoryCurrent.get();
    }
    set activeSubcategoryCurrent(newValue: string) {
        this.__activeSubcategoryCurrent.set(newValue);
    }
    // 非响应式存储：每个分类的当前子类（用于在不同分类间记忆选择）
    private activeSubByCategory: Map<ProductCategory, string>;
    // 每个顶层分类的子类选项
    private subcategoryOptionsMap: Map<ProductCategory, Array<string>>;
    private sortOptions: FilterOption<SortOption>[];
    private priceFilters: FilterOption<PriceFilter>[];
    // State for scroll-to-top button
    private __showScrollToTop: ObservedPropertySimplePU<boolean>;
    get showScrollToTop() {
        return this.__showScrollToTop.get();
    }
    set showScrollToTop(newValue: boolean) {
        this.__showScrollToTop.set(newValue);
    }
    private scroller: Scroller; // Scroller for "Back to Top"
    private __wasAtEnd: ObservedPropertySimplePU<boolean>;
    get wasAtEnd() {
        return this.__wasAtEnd.get();
    }
    set wasAtEnd(newValue: boolean) {
        this.__wasAtEnd.set(newValue);
    }
    private lastEndToastMs: number;
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
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Navigation.create(new NavPathStack(), { moduleName: "entry", pagePath: "entry/src/main/ets/pages/ListIndex", isUserCreateStack: false });
            Navigation.title("商城");
            Navigation.titleMode(NavigationTitleMode.Mini);
            Navigation.backgroundColor(Color.Brown);
        }, Navigation);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Tabs.create({ index: this.selectedTabIndex, controller: this.tabsController });
            Tabs.scrollable(true);
            Tabs.barMode(BarMode.Scrollable);
            Tabs.barHeight(56);
            Tabs.backgroundColor(Color.White);
            Tabs.onChange(index => {
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
                }
                catch (e) {
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
            });
        }, Tabs);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const tabCfg = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    TabContent.create(() => {
                        this.buildProductListContent.bind(this)(tabCfg.ds);
                    });
                    TabContent.tabBar(tabCfg.label);
                }, TabContent);
                TabContent.pop();
            };
            this.forEachUpdateFunction(elmtId, this.categoryTabs, forEachItemGenFunction, (tabCfg: CategoryTab) => tabCfg.label, false, false);
        }, ForEach);
        ForEach.pop();
        Tabs.pop();
        Column.pop();
        Navigation.pop();
    }
    // 辅助方法，用于构建商品列表内容，包含下拉刷新和懒加载
    buildProductListContent(dataSource: ProductListDataSource, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 数据源空保护
            if (!dataSource) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('数据源未初始化');
                        Text.fontSize(14);
                        Text.fontColor(Color.Gray);
                        Text.padding(12);
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new 
                                // RefreshLayout现在直接接受dataSource，并在内部管理加载状态
                                // scroller也不需要从外部传入，RefreshLayout内部会管理其Scroll组件
                                RefreshLayout(this, {
                                    dataSource: dataSource // 传递DataSource实例
                                    ,
                                    content: () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Column.create();
                                            Column.width('100%');
                                            Column.height('100%');
                                        }, Column);
                                        this.buildSearchAndFilter.bind(this)(dataSource);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            If.create();
                                            // 子类选择条
                                            if ((this.subcategoryOptionsMap.get(dataSource.getCategory()) ?? []).length > 0) {
                                                this.ifElseBranchUpdateFunction(0, () => {
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Scroll.create();
                                                        Scroll.scrollable(ScrollDirection.Horizontal);
                                                        Scroll.scrollBar(BarState.Off);
                                                        Scroll.width('100%');
                                                    }, Scroll);
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Row.create();
                                                    }, Row);
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        ForEach.create();
                                                        const forEachItemGenFunction = _item => {
                                                            const opt = _item;
                                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                Text.create(opt);
                                                                Text.fontSize(12);
                                                                Text.fontColor((this.activeSubcategoryCurrent ?? '') === opt ? Color.White : Color.Black);
                                                                Text.backgroundColor((this.activeSubcategoryCurrent ?? '') === opt ? '#2D6A4F' : '#E6E6E6');
                                                                Text.borderRadius(12);
                                                                Text.padding({ left: 12, right: 12, top: 6, bottom: 6 });
                                                                Text.margin({ right: 8, bottom: 4, left: 12 });
                                                                Text.onClick(() => {
                                                                    this.activeSubcategoryCurrent = opt;
                                                                    this.activeSubByCategory.set(dataSource.getCategory(), opt);
                                                                    dataSource.setSubcategory(opt);
                                                                });
                                                            }, Text);
                                                            Text.pop();
                                                        };
                                                        this.forEachUpdateFunction(elmtId, this.subcategoryOptionsMap.get(dataSource.getCategory()) ?? [], forEachItemGenFunction, (opt: string) => opt, false, false);
                                                    }, ForEach);
                                                    ForEach.pop();
                                                    Row.pop();
                                                    Scroll.pop();
                                                });
                                            }
                                            else {
                                                this.ifElseBranchUpdateFunction(1, () => {
                                                });
                                            }
                                        }, If);
                                        If.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            If.create();
                                            if (dataSource.totalCount() === 0 && !dataSource.isLoadingMore) {
                                                this.ifElseBranchUpdateFunction(0, () => {
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Column.create();
                                                        Column.width('100%');
                                                        Column.layoutWeight(1);
                                                        Column.justifyContent(FlexAlign.Center);
                                                        Column.alignItems(HorizontalAlign.Center);
                                                    }, Column);
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Image.create({ "id": 16777247, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
                                                        Image.width(80);
                                                        Image.height(80);
                                                        Image.margin({ bottom: 16 });
                                                    }, Image);
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Text.create(this.searchText.length > 0 || this.activePriceFilter !== PriceFilter.ALL ?
                                                            '没有匹配的商品，请调整搜索或筛选条件' :
                                                            '哎呀，这里还没有商品哦');
                                                        Text.fontSize(16);
                                                        Text.fontColor(Color.Gray);
                                                    }, Text);
                                                    Text.pop();
                                                    Column.pop();
                                                });
                                            }
                                            else {
                                                this.ifElseBranchUpdateFunction(1, () => {
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Column.create();
                                                        Column.width('100%');
                                                        Column.layoutWeight(1);
                                                    }, Column);
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        List.create();
                                                        List.width('100%');
                                                        List.layoutWeight(1);
                                                        List.onScrollIndex((first: number, last: number) => {
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
                                                            }
                                                            else {
                                                                this.wasAtEnd = false;
                                                            }
                                                        });
                                                    }, List);
                                                    {
                                                        const __lazyForEachItemGenFunction = _item => {
                                                            const item = _item;
                                                            {
                                                                const itemCreation2 = (elmtId, isInitialRender) => {
                                                                    ListItem.create(() => { }, false);
                                                                };
                                                                const observedDeepRender = () => {
                                                                    this.observeComponentCreation2(itemCreation2, ListItem);
                                                                    {
                                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                            if (isInitialRender) {
                                                                                let componentCall = new ProductItem(this, { product: item, category: dataSource.getCategory() }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/ListIndex.ets", line: 238, col: 19 });
                                                                                ViewPU.create(componentCall);
                                                                                let paramsLambda = () => {
                                                                                    return {
                                                                                        product: item,
                                                                                        category: dataSource.getCategory()
                                                                                    };
                                                                                };
                                                                                componentCall.paramsGenerator_ = paramsLambda;
                                                                            }
                                                                            else {
                                                                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                                                                    product: item, category: dataSource.getCategory()
                                                                                });
                                                                            }
                                                                        }, { name: "ProductItem" });
                                                                    }
                                                                    ListItem.pop();
                                                                };
                                                                observedDeepRender();
                                                            }
                                                        };
                                                        const __lazyForEachItemIdFunc = (item: Product) => item.id.toString();
                                                        LazyForEach.create("1", this, dataSource, __lazyForEachItemGenFunction, __lazyForEachItemIdFunc);
                                                        LazyForEach.pop();
                                                    }
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        If.create();
                                                        // Loading more indicator (as a ListItem so it appears inside the list)
                                                        if (dataSource.isLoadingMore) {
                                                            this.ifElseBranchUpdateFunction(0, () => {
                                                                {
                                                                    const itemCreation = (elmtId, isInitialRender) => {
                                                                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                                                        ListItem.create(deepRenderFunction, true);
                                                                        if (!isInitialRender) {
                                                                            ListItem.pop();
                                                                        }
                                                                        ViewStackProcessor.StopGetAccessRecording();
                                                                    };
                                                                    const itemCreation2 = (elmtId, isInitialRender) => {
                                                                        ListItem.create(deepRenderFunction, true);
                                                                    };
                                                                    const deepRenderFunction = (elmtId, isInitialRender) => {
                                                                        itemCreation(elmtId, isInitialRender);
                                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                            Column.create();
                                                                            Column.width('100%');
                                                                            Column.justifyContent(FlexAlign.Center);
                                                                        }, Column);
                                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                            LoadingProgress.create();
                                                                            LoadingProgress.width(30);
                                                                            LoadingProgress.height(30);
                                                                            LoadingProgress.margin({ top: 10, bottom: 20 });
                                                                        }, LoadingProgress);
                                                                        Column.pop();
                                                                        ListItem.pop();
                                                                    };
                                                                    this.observeComponentCreation2(itemCreation2, ListItem);
                                                                    ListItem.pop();
                                                                }
                                                            });
                                                        }
                                                        // 到底提示（列表尾部项，确保可见）
                                                        else {
                                                            this.ifElseBranchUpdateFunction(1, () => {
                                                            });
                                                        }
                                                    }, If);
                                                    If.pop();
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        If.create();
                                                        // 到底提示（列表尾部项，确保可见）
                                                        if (dataSource.totalCount() > 0 && !dataSource.hasMore && !dataSource.isLoadingMore) {
                                                            this.ifElseBranchUpdateFunction(0, () => {
                                                                {
                                                                    const itemCreation = (elmtId, isInitialRender) => {
                                                                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                                                        ListItem.create(deepRenderFunction, true);
                                                                        if (!isInitialRender) {
                                                                            ListItem.pop();
                                                                        }
                                                                        ViewStackProcessor.StopGetAccessRecording();
                                                                    };
                                                                    const itemCreation2 = (elmtId, isInitialRender) => {
                                                                        ListItem.create(deepRenderFunction, true);
                                                                    };
                                                                    const deepRenderFunction = (elmtId, isInitialRender) => {
                                                                        itemCreation(elmtId, isInitialRender);
                                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                            Text.create('已经到底了');
                                                                            Text.fontSize(14);
                                                                            Text.fontColor(Color.Gray);
                                                                            Text.textAlign(TextAlign.Center);
                                                                            Text.width('100%');
                                                                            Text.padding(12);
                                                                            Text.backgroundColor('#F7F7F7');
                                                                            Text.borderRadius(8);
                                                                            Text.onAppear(() => {
                                                                                const now = Date.now();
                                                                                if (now - this.lastEndToastMs > 1200) {
                                                                                    console.log('已经到底了');
                                                                                    promptAction.showToast({ message: '已经到底了', duration: 1500 });
                                                                                    this.lastEndToastMs = now;
                                                                                }
                                                                            });
                                                                        }, Text);
                                                                        Text.pop();
                                                                        ListItem.pop();
                                                                    };
                                                                    this.observeComponentCreation2(itemCreation2, ListItem);
                                                                    ListItem.pop();
                                                                }
                                                            });
                                                        }
                                                        else {
                                                            this.ifElseBranchUpdateFunction(1, () => {
                                                            });
                                                        }
                                                    }, If);
                                                    If.pop();
                                                    List.pop();
                                                    Column.pop();
                                                });
                                            }
                                        }, If);
                                        If.pop();
                                        Column.pop();
                                    }
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/ListIndex.ets", line: 187, col: 7 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        dataSource: dataSource // 传递DataSource实例
                                        ,
                                        content: () => {
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Column.create();
                                                Column.width('100%');
                                                Column.height('100%');
                                            }, Column);
                                            this.buildSearchAndFilter.bind(this)(dataSource);
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                If.create();
                                                // 子类选择条
                                                if ((this.subcategoryOptionsMap.get(dataSource.getCategory()) ?? []).length > 0) {
                                                    this.ifElseBranchUpdateFunction(0, () => {
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Scroll.create();
                                                            Scroll.scrollable(ScrollDirection.Horizontal);
                                                            Scroll.scrollBar(BarState.Off);
                                                            Scroll.width('100%');
                                                        }, Scroll);
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Row.create();
                                                        }, Row);
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            ForEach.create();
                                                            const forEachItemGenFunction = _item => {
                                                                const opt = _item;
                                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                    Text.create(opt);
                                                                    Text.fontSize(12);
                                                                    Text.fontColor((this.activeSubcategoryCurrent ?? '') === opt ? Color.White : Color.Black);
                                                                    Text.backgroundColor((this.activeSubcategoryCurrent ?? '') === opt ? '#2D6A4F' : '#E6E6E6');
                                                                    Text.borderRadius(12);
                                                                    Text.padding({ left: 12, right: 12, top: 6, bottom: 6 });
                                                                    Text.margin({ right: 8, bottom: 4, left: 12 });
                                                                    Text.onClick(() => {
                                                                        this.activeSubcategoryCurrent = opt;
                                                                        this.activeSubByCategory.set(dataSource.getCategory(), opt);
                                                                        dataSource.setSubcategory(opt);
                                                                    });
                                                                }, Text);
                                                                Text.pop();
                                                            };
                                                            this.forEachUpdateFunction(elmtId, this.subcategoryOptionsMap.get(dataSource.getCategory()) ?? [], forEachItemGenFunction, (opt: string) => opt, false, false);
                                                        }, ForEach);
                                                        ForEach.pop();
                                                        Row.pop();
                                                        Scroll.pop();
                                                    });
                                                }
                                                else {
                                                    this.ifElseBranchUpdateFunction(1, () => {
                                                    });
                                                }
                                            }, If);
                                            If.pop();
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                If.create();
                                                if (dataSource.totalCount() === 0 && !dataSource.isLoadingMore) {
                                                    this.ifElseBranchUpdateFunction(0, () => {
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Column.create();
                                                            Column.width('100%');
                                                            Column.layoutWeight(1);
                                                            Column.justifyContent(FlexAlign.Center);
                                                            Column.alignItems(HorizontalAlign.Center);
                                                        }, Column);
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Image.create({ "id": 16777247, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
                                                            Image.width(80);
                                                            Image.height(80);
                                                            Image.margin({ bottom: 16 });
                                                        }, Image);
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Text.create(this.searchText.length > 0 || this.activePriceFilter !== PriceFilter.ALL ?
                                                                '没有匹配的商品，请调整搜索或筛选条件' :
                                                                '哎呀，这里还没有商品哦');
                                                            Text.fontSize(16);
                                                            Text.fontColor(Color.Gray);
                                                        }, Text);
                                                        Text.pop();
                                                        Column.pop();
                                                    });
                                                }
                                                else {
                                                    this.ifElseBranchUpdateFunction(1, () => {
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            Column.create();
                                                            Column.width('100%');
                                                            Column.layoutWeight(1);
                                                        }, Column);
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            List.create();
                                                            List.width('100%');
                                                            List.layoutWeight(1);
                                                            List.onScrollIndex((first: number, last: number) => {
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
                                                                }
                                                                else {
                                                                    this.wasAtEnd = false;
                                                                }
                                                            });
                                                        }, List);
                                                        {
                                                            const __lazyForEachItemGenFunction = _item => {
                                                                const item = _item;
                                                                {
                                                                    const itemCreation2 = (elmtId, isInitialRender) => {
                                                                        ListItem.create(() => { }, false);
                                                                    };
                                                                    const observedDeepRender = () => {
                                                                        this.observeComponentCreation2(itemCreation2, ListItem);
                                                                        {
                                                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                                if (isInitialRender) {
                                                                                    let componentCall = new ProductItem(this, { product: item, category: dataSource.getCategory() }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/ListIndex.ets", line: 238, col: 19 });
                                                                                    ViewPU.create(componentCall);
                                                                                    let paramsLambda = () => {
                                                                                        return {
                                                                                            product: item,
                                                                                            category: dataSource.getCategory()
                                                                                        };
                                                                                    };
                                                                                    componentCall.paramsGenerator_ = paramsLambda;
                                                                                }
                                                                                else {
                                                                                    this.updateStateVarsOfChildByElmtId(elmtId, {
                                                                                        product: item, category: dataSource.getCategory()
                                                                                    });
                                                                                }
                                                                            }, { name: "ProductItem" });
                                                                        }
                                                                        ListItem.pop();
                                                                    };
                                                                    observedDeepRender();
                                                                }
                                                            };
                                                            const __lazyForEachItemIdFunc = (item: Product) => item.id.toString();
                                                            LazyForEach.create("1", this, dataSource, __lazyForEachItemGenFunction, __lazyForEachItemIdFunc);
                                                            LazyForEach.pop();
                                                        }
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            If.create();
                                                            // Loading more indicator (as a ListItem so it appears inside the list)
                                                            if (dataSource.isLoadingMore) {
                                                                this.ifElseBranchUpdateFunction(0, () => {
                                                                    {
                                                                        const itemCreation = (elmtId, isInitialRender) => {
                                                                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                                                            ListItem.create(deepRenderFunction, true);
                                                                            if (!isInitialRender) {
                                                                                ListItem.pop();
                                                                            }
                                                                            ViewStackProcessor.StopGetAccessRecording();
                                                                        };
                                                                        const itemCreation2 = (elmtId, isInitialRender) => {
                                                                            ListItem.create(deepRenderFunction, true);
                                                                        };
                                                                        const deepRenderFunction = (elmtId, isInitialRender) => {
                                                                            itemCreation(elmtId, isInitialRender);
                                                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                                Column.create();
                                                                                Column.width('100%');
                                                                                Column.justifyContent(FlexAlign.Center);
                                                                            }, Column);
                                                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                                LoadingProgress.create();
                                                                                LoadingProgress.width(30);
                                                                                LoadingProgress.height(30);
                                                                                LoadingProgress.margin({ top: 10, bottom: 20 });
                                                                            }, LoadingProgress);
                                                                            Column.pop();
                                                                            ListItem.pop();
                                                                        };
                                                                        this.observeComponentCreation2(itemCreation2, ListItem);
                                                                        ListItem.pop();
                                                                    }
                                                                });
                                                            }
                                                            // 到底提示（列表尾部项，确保可见）
                                                            else {
                                                                this.ifElseBranchUpdateFunction(1, () => {
                                                                });
                                                            }
                                                        }, If);
                                                        If.pop();
                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                            If.create();
                                                            // 到底提示（列表尾部项，确保可见）
                                                            if (dataSource.totalCount() > 0 && !dataSource.hasMore && !dataSource.isLoadingMore) {
                                                                this.ifElseBranchUpdateFunction(0, () => {
                                                                    {
                                                                        const itemCreation = (elmtId, isInitialRender) => {
                                                                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                                                            ListItem.create(deepRenderFunction, true);
                                                                            if (!isInitialRender) {
                                                                                ListItem.pop();
                                                                            }
                                                                            ViewStackProcessor.StopGetAccessRecording();
                                                                        };
                                                                        const itemCreation2 = (elmtId, isInitialRender) => {
                                                                            ListItem.create(deepRenderFunction, true);
                                                                        };
                                                                        const deepRenderFunction = (elmtId, isInitialRender) => {
                                                                            itemCreation(elmtId, isInitialRender);
                                                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                                Text.create('已经到底了');
                                                                                Text.fontSize(14);
                                                                                Text.fontColor(Color.Gray);
                                                                                Text.textAlign(TextAlign.Center);
                                                                                Text.width('100%');
                                                                                Text.padding(12);
                                                                                Text.backgroundColor('#F7F7F7');
                                                                                Text.borderRadius(8);
                                                                                Text.onAppear(() => {
                                                                                    const now = Date.now();
                                                                                    if (now - this.lastEndToastMs > 1200) {
                                                                                        console.log('已经到底了');
                                                                                        promptAction.showToast({ message: '已经到底了', duration: 1500 });
                                                                                        this.lastEndToastMs = now;
                                                                                    }
                                                                                });
                                                                            }, Text);
                                                                            Text.pop();
                                                                            ListItem.pop();
                                                                        };
                                                                        this.observeComponentCreation2(itemCreation2, ListItem);
                                                                        ListItem.pop();
                                                                    }
                                                                });
                                                            }
                                                            else {
                                                                this.ifElseBranchUpdateFunction(1, () => {
                                                                });
                                                            }
                                                        }, If);
                                                        If.pop();
                                                        List.pop();
                                                        Column.pop();
                                                    });
                                                }
                                            }, If);
                                            If.pop();
                                            Column.pop();
                                        }
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    dataSource: dataSource // 传递DataSource实例
                                });
                            }
                        }, { name: "RefreshLayout" });
                    }
                });
            }
        }, If);
        If.pop();
    }
    private buildSearchAndFilter(dataSource: ProductListDataSource, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.padding({ left: 12, right: 12, top: 12, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: this.searchText, placeholder: '搜索商品名称或描述' });
            TextInput.layoutWeight(1);
            TextInput.height(36);
            TextInput.backgroundColor('#F2F2F2');
            TextInput.borderRadius(18);
            TextInput.padding({ left: 12, right: 12 });
            TextInput.onChange((value: string) => {
                this.searchText = value;
                dataSource.setSearchQuery(value);
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.searchText.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('清除');
                        Text.fontSize(12);
                        Text.fontColor('#666666');
                        Text.margin({ left: 8 });
                        Text.padding({ left: 8, right: 8, top: 6, bottom: 6 });
                        Text.onClick(() => {
                            this.searchText = '';
                            dataSource.setSearchQuery('');
                        });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.showFilterPanel ? '收起' : '筛选');
            Text.fontSize(12);
            Text.fontColor(this.activeSort !== SortOption.DEFAULT || this.activePriceFilter !== PriceFilter.ALL ?
                Color.White : '#666666');
            Text.backgroundColor(this.activeSort !== SortOption.DEFAULT || this.activePriceFilter !== PriceFilter.ALL ?
                '#2D6A4F' : '#E6E6E6');
            Text.borderRadius(14);
            Text.margin({ left: 8 });
            Text.padding({ left: 10, right: 10, top: 6, bottom: 6 });
            Text.onClick(() => {
                this.showFilterPanel = !this.showFilterPanel;
            });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showFilterPanel) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('排序');
                        Text.fontSize(12);
                        Text.fontColor(Color.Gray);
                        Text.margin({ left: 12, bottom: 6 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
                        Scroll.scrollable(ScrollDirection.Horizontal);
                        Scroll.scrollBar(BarState.Off);
                        Scroll.width('100%');
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.padding({ left: 12, right: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const option = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(option.label);
                                Text.fontSize(12);
                                Text.fontColor(this.activeSort === option.value ? Color.White : Color.Black);
                                Text.backgroundColor(this.activeSort === option.value ? '#2D6A4F' : '#E6E6E6');
                                Text.borderRadius(12);
                                Text.padding({ left: 12, right: 12, top: 6, bottom: 6 });
                                Text.margin({ right: 8, bottom: 4 });
                                Text.onClick(() => {
                                    this.activeSort = option.value;
                                    dataSource.setSortOption(option.value);
                                });
                            }, Text);
                            Text.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.sortOptions, forEachItemGenFunction, (option: FilterOption<SortOption>) => option.value, false, false);
                    }, ForEach);
                    ForEach.pop();
                    Row.pop();
                    Scroll.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('价格');
                        Text.fontSize(12);
                        Text.fontColor(Color.Gray);
                        Text.margin({ left: 12, top: 8, bottom: 6 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
                        Scroll.scrollable(ScrollDirection.Horizontal);
                        Scroll.scrollBar(BarState.Off);
                        Scroll.width('100%');
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.padding({ left: 12, right: 12, bottom: 8 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const option = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(option.label);
                                Text.fontSize(12);
                                Text.fontColor(this.activePriceFilter === option.value ? Color.White : Color.Black);
                                Text.backgroundColor(this.activePriceFilter === option.value ? '#2D6A4F' : '#E6E6E6');
                                Text.borderRadius(12);
                                Text.padding({ left: 12, right: 12, top: 6, bottom: 6 });
                                Text.margin({ right: 8, bottom: 4 });
                                Text.onClick(() => {
                                    this.activePriceFilter = option.value;
                                    dataSource.setPriceFilter(option.value);
                                });
                            }, Text);
                            Text.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.priceFilters, forEachItemGenFunction, (option: FilterOption<PriceFilter>) => option.value, false, false);
                    }, ForEach);
                    ForEach.pop();
                    Row.pop();
                    Scroll.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    private syncControlsFromDataSource(dataSource: ProductListDataSource) {
        if (!dataSource) {
            return;
        }
        this.searchText = dataSource.getSearchQuery();
        this.activeSort = dataSource.getSortOption();
        this.activePriceFilter = dataSource.getPriceFilter();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "ProductListPage";
    }
}
registerNamedRoute(() => new ProductListPage(undefined, {}), "", { bundleName: "com.example.list_harmony", moduleName: "entry", pagePath: "pages/ListIndex", pageFullPath: "entry/src/main/ets/pages/ListIndex", integratedHsp: "false", moduleType: "followWithHap" });
