// entry/src/main/ets/view/RefreshLayout.ets
import { ProductListDataSource } from '../viewmodel/ListDataSource';

@Component
export struct RefreshLayout {
  @ObjectLink dataSource: ProductListDataSource;
  private scroller: Scroller = new Scroller();

  @State private isRefreshing: boolean = false;
  @State private hasRefreshError: boolean = false;
  @State private pullDistance: number = 0;
  @State private lastY: number = 0;
  @State private scrollY: number = 0;
  @State private contentHeight: number = 0;
  @State private scrollHeight: number = 0;

  private readonly REFRESH_THRESHOLD: number = 80;
  private refreshTimeoutId?: number;
  private readonly LOAD_MORE_TRIGGER_OFFSET: number = 50;

  @BuilderParam content: () => void;

  aboutToAppear() {
    // 初始化高度值
    this.contentHeight = 1000; // 设置一个初始值
    this.scrollHeight = 500;   // 设置一个初始值
  }

  build() {
    Column() {
      // 顶部刷新提示：下拉刷新 / 松手刷新 / 正在刷新
      if (!this.isRefreshing && this.pullDistance > 0) {
        Row() {
          Text(this.pullDistance >= this.REFRESH_THRESHOLD ? '松手即可刷新' : '下拉刷新')
            .fontColor(Color.Gray)
        }
        .width('100%')
        .justifyContent(FlexAlign.Center)
        .padding(10)
      } else if (this.isRefreshing) {
        Row() {
          LoadingProgress()
            .width(24)
            .height(24)
          Text('正在刷新...')
            .margin({ left: 10 })
            .fontColor(Color.Gray)
        }
        .width('100%')
        .justifyContent(FlexAlign.Center)
        .padding(10)
      }

      if (this.hasRefreshError) {
        Row() {
          Text('刷新失败')
            .fontColor(Color.Red)
          Text('重试')
            .fontColor('#2D6A4F')
            .margin({ left: 16 })
            .onClick(() => {
              this.hasRefreshError = false;
              this.triggerRefresh();
            })
        }
        .width('100%')
        .justifyContent(FlexAlign.Center)
        .padding({ top: 4, bottom: 8 })
      }

      Scroll(this.scroller) {
        if (this.isRefreshing && this.dataSource.totalCount() === 0) {
          Column() {
            ForEach(this.getSkeletonItems(), (idx: number) => {
              this.skeletonCard()
            }, (idx: number) => idx.toString())
          }
        } else {
          Column() {
            this.content()
            // 控制末端回弹：在到底且无更多数据时增加一个有限高度的底部间距
            if (!this.dataSource.hasMore && this.dataSource.totalCount() > 0) {
              Blank()
                .height(24)
                .width('100%')
            }
          }
          .onAreaChange((oldValue: Area, newValue: Area) => {
            // 安全地将 Length 转换为 number
            const newHeight = this.convertLengthToNumber(newValue.height);
            if (newHeight > 0) {
              this.contentHeight = newHeight;
            }
          })
        }
      }
      .scrollable(ScrollDirection.Vertical)
      .edgeEffect(EdgeEffect.Spring)
      .onScroll((xOffset: number, yOffset: number) => {
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
      })
      .onAreaChange((oldValue: Area, newValue: Area) => {
        // 安全地将 Length 转换为 number
        const newHeight = this.convertLengthToNumber(newValue.height);
        if (newHeight > 0) {
          this.scrollHeight = newHeight;
        }
      })
      .onTouch((event: TouchEvent) => {
        if (this.dataSource.isAtTop) {
          if (event.type === TouchType.Down) {
            this.lastY = event.touches[0].y;
            this.pullDistance = 0;
          } else if (event.type === TouchType.Move) {
            const currentY = event.touches[0].y;
            const deltaY = currentY - this.lastY;
            this.lastY = currentY;

            if (deltaY > 0) {
              this.pullDistance += deltaY;
            }
          } else if (event.type === TouchType.Up) {
            if (this.pullDistance >= this.REFRESH_THRESHOLD && !this.isRefreshing) {
              this.triggerRefresh();
            }
            this.pullDistance = 0;
          }
        } else if (event.type === TouchType.Down) {
          this.pullDistance = 0;
          this.lastY = event.touches[0].y;
        }
      })
      .height('100%')
      .width('100%')
    }
    .height('100%')
    .width('100%')
  }

  @Builder
  private skeletonCard() {
    Column() {
      // 图片占位
      Column()
        .width('100%')
        .height(180)
        .backgroundColor('#E6E6E6')
        .borderRadius(12)

      // 文本占位1
      Column()
        .width('60%')
        .height(16)
        .backgroundColor('#E6E6E6')
        .borderRadius(8)
        .margin({ top: 12 })

      // 文本占位2
      Column()
        .width('40%')
        .height(12)
        .backgroundColor('#E6E6E6')
        .borderRadius(6)
        .margin({ top: 8 })
    }
    .width('100%')
    .backgroundColor('#FFFFFF')
    .borderRadius(16)
    .margin({ bottom: 12, left: 12, right: 12 })
    .padding({ left: 12, right: 12, top: 10, bottom: 12 })
    .shadow({ radius: 6, color: '#14000000', offsetX: 0, offsetY: 2 })
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
    } else if (typeof length === 'string') {
      // 处理百分比字符串如 '100%'
      const numericValue = parseFloat(length);
      return isNaN(numericValue) ? 0 : numericValue;
    }
    return 0;
  }
}
