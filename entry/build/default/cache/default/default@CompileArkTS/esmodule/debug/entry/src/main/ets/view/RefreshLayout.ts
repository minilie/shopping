if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface RefreshLayout_Params {
    dataSource?: ProductListDataSource;
    scroller?: Scroller;
    isRefreshing?: boolean;
    pullDistance?: number;
    lastY?: number;
    scrollY?: number;
    contentHeight?: number;
    scrollHeight?: number;
    REFRESH_THRESHOLD?: number;
    LOAD_MORE_TRIGGER_OFFSET?: number;
    content?: () => void;
}
import type { ProductListDataSource } from '../viewmodel/ListDataSource';
export class RefreshLayout extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__dataSource = new SynchedPropertyNesedObjectPU(params.dataSource, this, "dataSource");
        this.scroller = new Scroller();
        this.__isRefreshing = new ObservedPropertySimplePU(false, this, "isRefreshing");
        this.__pullDistance = new ObservedPropertySimplePU(0, this, "pullDistance");
        this.__lastY = new ObservedPropertySimplePU(0, this, "lastY");
        this.__scrollY = new ObservedPropertySimplePU(0, this, "scrollY");
        this.__contentHeight = new ObservedPropertySimplePU(0, this, "contentHeight");
        this.__scrollHeight = new ObservedPropertySimplePU(0, this, "scrollHeight");
        this.REFRESH_THRESHOLD = 80;
        this.LOAD_MORE_TRIGGER_OFFSET = 50;
        this.content = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: RefreshLayout_Params) {
        this.__dataSource.set(params.dataSource);
        if (params.scroller !== undefined) {
            this.scroller = params.scroller;
        }
        if (params.isRefreshing !== undefined) {
            this.isRefreshing = params.isRefreshing;
        }
        if (params.pullDistance !== undefined) {
            this.pullDistance = params.pullDistance;
        }
        if (params.lastY !== undefined) {
            this.lastY = params.lastY;
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
        if (params.REFRESH_THRESHOLD !== undefined) {
            this.REFRESH_THRESHOLD = params.REFRESH_THRESHOLD;
        }
        if (params.LOAD_MORE_TRIGGER_OFFSET !== undefined) {
            this.LOAD_MORE_TRIGGER_OFFSET = params.LOAD_MORE_TRIGGER_OFFSET;
        }
        if (params.content !== undefined) {
            this.content = params.content;
        }
    }
    updateStateVars(params: RefreshLayout_Params) {
        this.__dataSource.set(params.dataSource);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__dataSource.purgeDependencyOnElmtId(rmElmtId);
        this.__isRefreshing.purgeDependencyOnElmtId(rmElmtId);
        this.__pullDistance.purgeDependencyOnElmtId(rmElmtId);
        this.__lastY.purgeDependencyOnElmtId(rmElmtId);
        this.__scrollY.purgeDependencyOnElmtId(rmElmtId);
        this.__contentHeight.purgeDependencyOnElmtId(rmElmtId);
        this.__scrollHeight.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__dataSource.aboutToBeDeleted();
        this.__isRefreshing.aboutToBeDeleted();
        this.__pullDistance.aboutToBeDeleted();
        this.__lastY.aboutToBeDeleted();
        this.__scrollY.aboutToBeDeleted();
        this.__contentHeight.aboutToBeDeleted();
        this.__scrollHeight.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __dataSource: SynchedPropertyNesedObjectPU<ProductListDataSource>;
    get dataSource() {
        return this.__dataSource.get();
    }
    private scroller: Scroller;
    private __isRefreshing: ObservedPropertySimplePU<boolean>;
    get isRefreshing() {
        return this.__isRefreshing.get();
    }
    set isRefreshing(newValue: boolean) {
        this.__isRefreshing.set(newValue);
    }
    private __pullDistance: ObservedPropertySimplePU<number>;
    get pullDistance() {
        return this.__pullDistance.get();
    }
    set pullDistance(newValue: number) {
        this.__pullDistance.set(newValue);
    }
    private __lastY: ObservedPropertySimplePU<number>;
    get lastY() {
        return this.__lastY.get();
    }
    set lastY(newValue: number) {
        this.__lastY.set(newValue);
    }
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
    private readonly REFRESH_THRESHOLD: number;
    private readonly LOAD_MORE_TRIGGER_OFFSET: number;
    private __content;
    aboutToAppear() {
        // 初始化高度值
        this.contentHeight = 1000; // 设置一个初始值
        this.scrollHeight = 500; // 设置一个初始值
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.height('100%');
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isRefreshing) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.justifyContent(FlexAlign.Center);
                        Row.padding(10);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.width(24);
                        LoadingProgress.height(24);
                    }, LoadingProgress);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('正在刷新...');
                        Text.margin({ left: 10 });
                        Text.fontColor(Color.Gray);
                    }, Text);
                    Text.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create(this.scroller);
            Scroll.scrollable(ScrollDirection.Vertical);
            Scroll.edgeEffect(EdgeEffect.Spring);
            Scroll.onScroll((xOffset: number, yOffset: number) => {
                this.scrollY = yOffset;
                // 到达顶部刷新
                if (yOffset <= 0) {
                    console.log('Reached top edge, consider refreshing');
                }
                // 到达底部加载更多 - 使用更简单的方法
                if (yOffset > 100 && this.contentHeight > 0 && this.scrollHeight > 0) {
                    const scrollProgress = yOffset / (this.contentHeight - this.scrollHeight);
                    if (scrollProgress > 0.8 && !this.dataSource.isLoadingMore && this.dataSource.hasMore) {
                        console.log('Near bottom edge, loading more...');
                        this.dataSource.loadMore();
                    }
                }
            });
            Scroll.onAreaChange((oldValue: Area, newValue: Area) => {
                // 安全地将 Length 转换为 number
                const newHeight = this.convertLengthToNumber(newValue.height);
                if (newHeight > 0) {
                    this.scrollHeight = newHeight;
                }
            });
            Scroll.onTouch((event: TouchEvent) => {
                if (this.scrollY <= 0) {
                    if (event.type === TouchType.Down) {
                        this.lastY = event.touches[0].y;
                        this.pullDistance = 0;
                    }
                    else if (event.type === TouchType.Move) {
                        const currentY = event.touches[0].y;
                        const deltaY = currentY - this.lastY;
                        this.lastY = currentY;
                        if (deltaY > 0) {
                            this.pullDistance += deltaY;
                        }
                    }
                    else if (event.type === TouchType.Up) {
                        if (this.pullDistance >= this.REFRESH_THRESHOLD && !this.isRefreshing) {
                            console.log('Triggering refresh via onTouch');
                            this.isRefreshing = true;
                            this.dataSource.refresh().then(() => {
                                this.isRefreshing = false;
                                this.pullDistance = 0;
                            }).catch((error: Error) => {
                                console.error('Refresh failed:', error);
                                this.isRefreshing = false;
                                this.pullDistance = 0;
                            });
                        }
                        this.pullDistance = 0;
                    }
                }
            });
            Scroll.height('100%');
            Scroll.width('100%');
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.onAreaChange((oldValue: Area, newValue: Area) => {
                // 安全地将 Length 转换为 number
                const newHeight = this.convertLengthToNumber(newValue.height);
                if (newHeight > 0) {
                    this.contentHeight = newHeight;
                }
            });
        }, Column);
        this.content.bind(this)();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    // 辅助方法：安全地将 Length 转换为 number
    private convertLengthToNumber(length: Length): number {
        if (typeof length === 'number') {
            return length;
        }
        else if (typeof length === 'string') {
            // 处理百分比字符串如 '100%'
            const numericValue = parseFloat(length);
            return isNaN(numericValue) ? 0 : numericValue;
        }
        return 0;
    }
    rerender() {
        this.updateDirtyElements();
    }
}
