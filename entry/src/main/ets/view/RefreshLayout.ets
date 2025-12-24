// entry/src/main/ets/view/RefreshLayout.ets
import { ProductListDataSource } from '../viewmodel/ListDataSource';

@Component
export struct RefreshLayout {
  @ObjectLink dataSource: ProductListDataSource;
  private scroller: Scroller = new Scroller();

  @State private isRefreshing: boolean = false;
  @State private pullDistance: number = 0;
  @State private lastY: number = 0;
  @State private scrollY: number = 0;
  @State private contentHeight: number = 0;
  @State private scrollHeight: number = 0;

  private readonly REFRESH_THRESHOLD: number = 80;
  private readonly LOAD_MORE_TRIGGER_OFFSET: number = 50;

  @BuilderParam content: () => void;

  aboutToAppear() {
    // 初始化高度值
    this.contentHeight = 1000; // 设置一个初始值
    this.scrollHeight = 500;   // 设置一个初始值
  }

  build() {
    Column() {
      if (this.isRefreshing) {
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

      Scroll(this.scroller) {
        Column() {
          this.content()
        }
        .onAreaChange((oldValue: Area, newValue: Area) => {
          // 安全地将 Length 转换为 number
          const newHeight = this.convertLengthToNumber(newValue.height);
          if (newHeight > 0) {
            this.contentHeight = newHeight;
          }
        })
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
