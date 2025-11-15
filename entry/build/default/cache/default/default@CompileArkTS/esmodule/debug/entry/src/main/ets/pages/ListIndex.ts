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
}
import { ProductItem } from "@bundle:com.example.list_harmony/entry/ets/view/GoodsListComponent";
import { ProductListDataSource, ProductCategory } from "@bundle:com.example.list_harmony/entry/ets/viewmodel/ListDataSource";
import type { Product } from "@bundle:com.example.list_harmony/entry/ets/viewmodel/ListDataSource";
import { RefreshLayout } from "@bundle:com.example.list_harmony/entry/ets/view/RefreshLayout";
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
    }
    updateStateVars(params: ProductListPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__selectedTabIndex.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__selectedTabIndex.aboutToBeDeleted();
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
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Navigation.create(new NavPathStack(), { moduleName: "entry", pagePath: "entry/src/main/ets/pages/ListIndex", isUserCreateStack: false });
            Navigation.title("商城");
            Navigation.titleMode(NavigationTitleMode.Mini);
            Navigation.backgroundColor(Color.White);
        }, Navigation);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Tabs.create({
                index: this.selectedTabIndex,
                controller: this.tabsController
            });
            Tabs.scrollable(true);
            Tabs.barMode(BarMode.Scrollable);
            Tabs.barHeight(56);
            Tabs.backgroundColor(Color.White);
            Tabs.onChange(index => {
                this.selectedTabIndex = index;
                // 当Tab切换时，确保当前DataSource的数据是加载过的
                try {
                    if (this.currentDataSource.totalCount() === 0) {
                        console.log(`Loading data for tab ${index}`);
                        this.currentDataSource.refresh(); // 或者根据需求只加载一次
                    }
                }
                catch (e) {
                    console.error(`Error loading data on tab switch: ${e}`);
                }
            });
        }, Tabs);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                // "精选" Tab的内容
                this.buildProductListContent.bind(this)(this.featuredDataSource);
            });
            TabContent.tabBar("精选");
        }, TabContent);
        TabContent.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                // "手机" Tab的内容
                this.buildProductListContent.bind(this)(this.mobileDataSource);
            });
            TabContent.tabBar("手机");
        }, TabContent);
        TabContent.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                // "服饰" Tab的内容
                this.buildProductListContent.bind(this)(this.fashionDataSource);
            });
            TabContent.tabBar("服饰");
        }, TabContent);
        TabContent.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                // "穿搭" Tab的内容
                this.buildProductListContent.bind(this)(this.wearDataSource);
            });
            TabContent.tabBar("穿搭");
        }, TabContent);
        TabContent.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                // "家居" Tab的内容
                this.buildProductListContent.bind(this)(this.homeDataSource);
            });
            TabContent.tabBar("家居");
        }, TabContent);
        TabContent.pop();
        Tabs.pop();
        Column.pop();
        Navigation.pop();
    }
    // 辅助方法，用于构建商品列表内容，包含下拉刷新和懒加载
    buildProductListContent(dataSource: ProductListDataSource, parent = null) {
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
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                List.create();
                                List.width('100%');
                                List.layoutWeight(1);
                                List.onScrollIndex((first: number, last: number) => {
                                    if (last >= dataSource.totalCount() - 6 && dataSource.totalCount() > 0 && !dataSource.isLoadingMore && dataSource.hasMore) {
                                        console.log('LazyForEach triggered load more via onScrollIndex');
                                        dataSource.loadMore();
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
                                                        let componentCall = new ProductItem(this, { product: item }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/ListIndex.ets", line: 112, col: 15 });
                                                        ViewPU.create(componentCall);
                                                        let paramsLambda = () => {
                                                            return {
                                                                product: item
                                                            };
                                                        };
                                                        componentCall.paramsGenerator_ = paramsLambda;
                                                    }
                                                    else {
                                                        this.updateStateVarsOfChildByElmtId(elmtId, {
                                                            product: item
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
                            List.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                // 到底提示
                                if (dataSource.totalCount() > 0 && !dataSource.hasMore) {
                                    this.ifElseBranchUpdateFunction(0, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create('已经到底了');
                                            Text.fontSize(14);
                                            Text.fontColor(Color.Gray);
                                            Text.textAlign(TextAlign.Center);
                                            Text.width('100%');
                                            Text.padding(10);
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
                            Column.pop();
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/ListIndex.ets", line: 105, col: 5 });
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
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    List.create();
                                    List.width('100%');
                                    List.layoutWeight(1);
                                    List.onScrollIndex((first: number, last: number) => {
                                        if (last >= dataSource.totalCount() - 6 && dataSource.totalCount() > 0 && !dataSource.isLoadingMore && dataSource.hasMore) {
                                            console.log('LazyForEach triggered load more via onScrollIndex');
                                            dataSource.loadMore();
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
                                                            let componentCall = new ProductItem(this, { product: item }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/ListIndex.ets", line: 112, col: 15 });
                                                            ViewPU.create(componentCall);
                                                            let paramsLambda = () => {
                                                                return {
                                                                    product: item
                                                                };
                                                            };
                                                            componentCall.paramsGenerator_ = paramsLambda;
                                                        }
                                                        else {
                                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                                product: item
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
                                List.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    If.create();
                                    // 到底提示
                                    if (dataSource.totalCount() > 0 && !dataSource.hasMore) {
                                        this.ifElseBranchUpdateFunction(0, () => {
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Text.create('已经到底了');
                                                Text.fontSize(14);
                                                Text.fontColor(Color.Gray);
                                                Text.textAlign(TextAlign.Center);
                                                Text.width('100%');
                                                Text.padding(10);
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
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "ProductListPage";
    }
}
registerNamedRoute(() => new ProductListPage(undefined, {}), "", { bundleName: "com.example.list_harmony", moduleName: "entry", pagePath: "pages/ListIndex", pageFullPath: "entry/src/main/ets/pages/ListIndex", integratedHsp: "false", moduleType: "followWithHap" });
