if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface RefreshLayout_Params {
    dataSource?: ProductListDataSource;
    scroller?: Scroller;
    isRefreshing?: boolean;
    hasRefreshError?: boolean;
    pullDistance?: number;
    lastY?: number;
    scrollY?: number;
    contentHeight?: number;
    scrollHeight?: number;
    REFRESH_THRESHOLD?: number;
    refreshTimeoutId?: number;
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
        this.__hasRefreshError = new ObservedPropertySimplePU(false, this, "hasRefreshError");
        this.__pullDistance = new ObservedPropertySimplePU(0, this, "pullDistance");
        this.__lastY = new ObservedPropertySimplePU(0, this, "lastY");
        this.__scrollY = new ObservedPropertySimplePU(0, this, "scrollY");
        this.__contentHeight = new ObservedPropertySimplePU(0, this, "contentHeight");
        this.__scrollHeight = new ObservedPropertySimplePU(0, this, "scrollHeight");
        this.REFRESH_THRESHOLD = 80;
        this.refreshTimeoutId = undefined;
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
        if (params.hasRefreshError !== undefined) {
            this.hasRefreshError = params.hasRefreshError;
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
        if (params.refreshTimeoutId !== undefined) {
            this.refreshTimeoutId = params.refreshTimeoutId;
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
        this.__hasRefreshError.purgeDependencyOnElmtId(rmElmtId);
        this.__pullDistance.purgeDependencyOnElmtId(rmElmtId);
        this.__lastY.purgeDependencyOnElmtId(rmElmtId);
        this.__scrollY.purgeDependencyOnElmtId(rmElmtId);
        this.__contentHeight.purgeDependencyOnElmtId(rmElmtId);
        this.__scrollHeight.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__dataSource.aboutToBeDeleted();
        this.__isRefreshing.aboutToBeDeleted();
        this.__hasRefreshError.aboutToBeDeleted();
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
    private __hasRefreshError: ObservedPropertySimplePU<boolean>;
    get hasRefreshError() {
        return this.__hasRefreshError.get();
    }
    set hasRefreshError(newValue: boolean) {
        this.__hasRefreshError.set(newValue);
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
    private refreshTimeoutId?: number;
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
            // 顶部刷新提示：下拉刷新 / 松手刷新 / 正在刷新
            if (!this.isRefreshing && this.pullDistance > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.justifyContent(FlexAlign.Center);
                        Row.padding(10);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.pullDistance >= this.REFRESH_THRESHOLD ? '松手即可刷新' : '下拉刷新');
                        Text.fontColor(Color.Gray);
                    }, Text);
                    Text.pop();
                    Row.pop();
                });
            }
            else if (this.isRefreshing) {
                this.ifElseBranchUpdateFunction(1, () => {
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
                this.ifElseBranchUpdateFunction(2, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.hasRefreshError) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.justifyContent(FlexAlign.Center);
                        Row.padding({ top: 4, bottom: 8 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('刷新失败');
                        Text.fontColor(Color.Red);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('重试');
                        Text.fontColor('#2D6A4F');
                        Text.margin({ left: 16 });
                        Text.onClick(() => {
                            this.hasRefreshError = false;
                            this.triggerRefresh();
                        });
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
                if (this.dataSource.isAtTop) {
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
                            this.triggerRefresh();
                        }
                        this.pullDistance = 0;
                    }
                }
                else if (event.type === TouchType.Down) {
                    this.pullDistance = 0;
                    this.lastY = event.touches[0].y;
                }
            });
            Scroll.height('100%');
            Scroll.width('100%');
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isRefreshing && this.dataSource.totalCount() === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const idx = _item;
                            this.skeletonCard.bind(this)();
                        };
                        this.forEachUpdateFunction(elmtId, this.getSkeletonItems(), forEachItemGenFunction, (idx: number) => idx.toString(), false, false);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
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
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 控制末端回弹：在到底且无更多数据时增加一个有限高度的底部间距
                        if (!this.dataSource.hasMore && this.dataSource.totalCount() > 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Blank.create();
                                    Blank.height(24);
                                    Blank.width('100%');
                                }, Blank);
                                Blank.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        Scroll.pop();
        Column.pop();
    }
    private skeletonCard(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius(16);
            Column.margin({ bottom: 12, left: 12, right: 12 });
            Column.padding({ left: 12, right: 12, top: 10, bottom: 12 });
            Column.shadow({ radius: 6, color: '#14000000', offsetX: 0, offsetY: 2 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 图片占位
            Column.create();
            // 图片占位
            Column.width('100%');
            // 图片占位
            Column.height(180);
            // 图片占位
            Column.backgroundColor('#E6E6E6');
            // 图片占位
            Column.borderRadius(12);
        }, Column);
        // 图片占位
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 文本占位1
            Column.create();
            // 文本占位1
            Column.width('60%');
            // 文本占位1
            Column.height(16);
            // 文本占位1
            Column.backgroundColor('#E6E6E6');
            // 文本占位1
            Column.borderRadius(8);
            // 文本占位1
            Column.margin({ top: 12 });
        }, Column);
        // 文本占位1
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 文本占位2
            Column.create();
            // 文本占位2
            Column.width('40%');
            // 文本占位2
            Column.height(12);
            // 文本占位2
            Column.backgroundColor('#E6E6E6');
            // 文本占位2
            Column.borderRadius(6);
            // 文本占位2
            Column.margin({ top: 8 });
        }, Column);
        // 文本占位2
        Column.pop();
        Column.pop();
    }
    private getSkeletonItems(): Array<number> {
        return [0, 1, 2, 3, 4, 5, 6, 7];
    }
    private triggerRefresh() {
        console.log('Triggering refresh via onTouch');
        this.isRefreshing = true;
        this.hasRefreshError = false;
        // 刷新超时兜底（例如 8 秒）
        if (this.refreshTimeoutId !== undefined) {
            clearTimeout(this.refreshTimeoutId);
        }
        this.refreshTimeoutId = setTimeout(() => {
            if (this.isRefreshing) {
                console.warn('Refresh timed out');
                this.isRefreshing = false;
                this.hasRefreshError = true;
            }
        }, 8000);
        this.dataSource.refresh().then(() => {
            this.isRefreshing = false;
            this.hasRefreshError = false;
            if (this.refreshTimeoutId !== undefined) {
                clearTimeout(this.refreshTimeoutId);
                this.refreshTimeoutId = undefined;
            }
        }).catch((error: Error) => {
            console.error('Refresh failed:', error);
            this.isRefreshing = false;
            this.hasRefreshError = true;
            if (this.refreshTimeoutId !== undefined) {
                clearTimeout(this.refreshTimeoutId);
                this.refreshTimeoutId = undefined;
            }
        });
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
