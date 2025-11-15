// entry/src/main/ets/pages/ListIndex.ets
import { ProductItem } from '../view/GoodsListComponent';
// Adjust import path for Product and ProductListDataSource
import { Product, ProductListDataSource } from '../viewmodel/ListDataSource'; // <<< Corrected import


@Entry
@Component
struct ProductListPage {
  // We no longer need @State products here, the DataSource manages it.
  private scroller: Scroller = new Scroller();
  private productDataSource: ProductListDataSource = new ProductListDataSource(); // <<< Initialize with new DataSource

  // 添加变量来跟踪滚动位置
  @State private scrollY: number = 0;
  @State private contentHeight: number = 0;
  @State private scrollHeight: number = 0;

  onPageShow() {
    // Initial data load is handled by ProductListDataSource's constructor
  }

  build() {
    Column() {
      Text('商城')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .margin({ bottom: 10 })

      Scroll(this.scroller) {
        Column() {
          Text('正在刷新...')
            .visibility(Visibility.None) // Control visibility based on refresh state

          List() {
            LazyForEach(this.productDataSource, (item: Product) => {
              ListItem() {
                ProductItem({ product: item })
              }
            }, (item: Product) => item.id.toString())
          }
          .onScrollIndex((first: number, last: number) => {
            if (last >= this.productDataSource.totalCount() - 6 && this.productDataSource.totalCount() > 0) {
              console.log('Loading more products...');
              this.productDataSource.loadMore();
            }
          })
        }
      }
      .scrollable(ScrollDirection.Vertical)
      .edgeEffect(EdgeEffect.Spring)
      .onScroll((xOffset: number, yOffset: number) => {
        if (yOffset <= 0) {
          console.log('Reached top edge, consider refreshing');
          this.productDataSource.refresh();
        }
        if (this.contentHeight > 0 && yOffset >= this.contentHeight - this.scrollHeight) {
          console.log('Reached bottom edge, consider loading more');
          this.productDataSource.loadMore();
        }
      })
    }
    .height('100%')
    .width('100%')
  }
}