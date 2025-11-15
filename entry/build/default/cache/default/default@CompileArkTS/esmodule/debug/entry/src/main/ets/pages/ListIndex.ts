if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ProductListPage_Params {
    scroller?: Scroller;
    productDataSource?: ProductListDataSource;
    scrollY?: number;
    contentHeight?: number;
    scrollHeight?: number;
}
import { ProductItem } from "@bundle:com.example.list_harmony/entry/ets/view/GoodsListComponent";
import { ProductListDataSource } from "@bundle:com.example.list_harmony/entry/ets/viewmodel/ListDataSource";
import type { Product } from "@bundle:com.example.list_harmony/entry/ets/viewmodel/ListDataSource";
class ProductListPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.scroller = new Scroller();
        this.productDataSource = new ProductListDataSource();
        this.__scrollY = new ObservedPropertySimplePU(0, this, "scrollY");
        this.__contentHeight = new ObservedPropertySimplePU(0, this, "contentHeight");
        this.__scrollHeight = new ObservedPropertySimplePU(0, this, "scrollHeight");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ProductListPage_Params) {
        if (params.scroller !== undefined) {
            this.scroller = params.scroller;
        }
        if (params.productDataSource !== undefined) {
            this.productDataSource = params.productDataSource;
        }
        if (params.scrollY !== undefined) {
            this.scrollY = params.scrollY;
        }
        if (params.contentHeight !== undefined) {
            this.contentHeight = params.contentHeight;
        }
        if (params.scrollHeight !== undefined) {
            this.scrollHeight = params.scrollHeight;
        }
    }
    updateStateVars(params: ProductListPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__scrollY.purgeDependencyOnElmtId(rmElmtId);
        this.__contentHeight.purgeDependencyOnElmtId(rmElmtId);
        this.__scrollHeight.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__scrollY.aboutToBeDeleted();
        this.__contentHeight.aboutToBeDeleted();
        this.__scrollHeight.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // We no longer need @State products here, the DataSource manages it.
    private scroller: Scroller;
    private productDataSource: ProductListDataSource; // <<< Initialize with new DataSource
    // 添加变量来跟踪滚动位置
    private __scrollY: ObservedPropertySimplePU<number>;
    get scrollY() {
        return this.__scrollY.get();
    }
    set scrollY(newValue: number) {
        this.__scrollY.set(newValue);
    }
    private __contentHeight: ObservedPropertySimplePU<number>;
    get contentHeight() {
        return this.__contentHeight.get();
    }
    set contentHeight(newValue: number) {
        this.__contentHeight.set(newValue);
    }
    private __scrollHeight: ObservedPropertySimplePU<number>;
    get scrollHeight() {
        return this.__scrollHeight.get();
    }
    set scrollHeight(newValue: number) {
        this.__scrollHeight.set(newValue);
    }
    onPageShow() {
        // Initial data load is handled by ProductListDataSource's constructor
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.height('100%');
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('商城');
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ bottom: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create(this.scroller);
            Scroll.scrollable(ScrollDirection.Vertical);
            Scroll.edgeEffect(EdgeEffect.Spring);
            Scroll.onScroll((xOffset: number, yOffset: number) => {
                if (yOffset <= 0) {
                    console.log('Reached top edge, consider refreshing');
                    this.productDataSource.refresh();
                }
                if (this.contentHeight > 0 && yOffset >= this.contentHeight - this.scrollHeight) {
                    console.log('Reached bottom edge, consider loading more');
                    this.productDataSource.loadMore();
                }
            });
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('正在刷新...');
            Text.visibility(Visibility.None);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            List.create();
            List.onScrollIndex((first: number, last: number) => {
                if (last >= this.productDataSource.totalCount() - 6 && this.productDataSource.totalCount() > 0) {
                    console.log('Loading more products...');
                    this.productDataSource.loadMore();
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
                                    let componentCall = new ProductItem(this, { product: item }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/ListIndex.ets", line: 38, col: 17 });
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
            LazyForEach.create("1", this, this.productDataSource, __lazyForEachItemGenFunction, __lazyForEachItemIdFunc);
            LazyForEach.pop();
        }
        List.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "ProductListPage";
    }
}
registerNamedRoute(() => new ProductListPage(undefined, {}), "", { bundleName: "com.example.list_harmony", moduleName: "entry", pagePath: "pages/ListIndex", pageFullPath: "entry/src/main/ets/pages/ListIndex", integratedHsp: "false", moduleType: "followWithHap" });
