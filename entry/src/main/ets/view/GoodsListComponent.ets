// entry/src/main/ets/view/GoodsListComponent.ets
import { Product, ProductCategory } from '../viewmodel/ListDataSource';
import router from '@ohos.router';

@Component
export struct ProductItem {
  @Prop product: Product;
  @Prop category: ProductCategory;

  build() {
    Column() { // 使用Column作为商品卡片的主容器
      Stack() {
        Image(this.product.imageUrl)
          .width('100%')
          .height(180)
          .objectFit(ImageFit.Cover)
          .borderRadius(12)
          .alt($r('app.media.product_image_placeholder'))

        if (this.product.ratingPercentage !== undefined) {
          Text(`${this.product.ratingPercentage}%好评`)
            .fontSize(10)
            .fontColor(Color.White)
            .backgroundColor('#3A2D6A4F')
            .borderRadius(10)
            .padding({ left: 8, right: 8, top: 4, bottom: 4 })
            .position({ x: 10, y: 10 })
        }
      }
      .width('100%')
      .height(180)

      // 商品信息区域
      Column() {
        // 商品名称
        Text(this.product.name)
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .fontColor('#1B1B1F')
          .maxLines(2) // 最多显示两行
          .textOverflow({ overflow: TextOverflow.Ellipsis }) // 超出部分显示省略号

        // 商品描述
        Text(this.product.description)
          .fontSize(12)
          .fontColor('#6B6B6B')
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .margin({ top: 4 })

        // 评价和价格行
        Row() {
          Column() {
            Row() {
              Text('¥')
                .fontSize(12)
                .fontColor('#C62828')
                .margin({ top: 2 })
              Text(`${this.product.price.toFixed(2)}`)
                .fontSize(18)
                .fontColor('#C62828')
                .fontWeight(FontWeight.Bold)
            }

            if (this.product.ratingCount !== undefined) {
              Text(`${this.product.ratingCount}人评价`)
                .fontSize(11)
                .fontColor('#8A8A8A')
                .margin({ top: 2 })
            }
          }
          .layoutWeight(1)

          Text('去看看')
            .fontSize(12)
            .fontColor(Color.White)
            .backgroundColor('#2D6A4F')
            .borderRadius(12)
            .padding({ left: 10, right: 10, top: 6, bottom: 6 })
            .onClick(() => {
              router.pushUrl({
                url: 'pages/Detail',
                params: {
                  id: this.product.id,
                  category: this.category,
                  name: this.product.name,
                  price: this.product.price,
                  description: this.product.description,
                  // 不直接传递 Resource，改为通过分类+ID在详情页重建数据源后查找
                  ratingPercentage: this.product.ratingPercentage,
                  ratingCount: this.product.ratingCount
                }
              });
            })
              .onClick(() => {
                router.pushUrl({ url: 'pages/Detail', params: { id: this.product.id } });
              })
        }
        .width('100%')
        .margin({ top: 10 })
        .alignItems(VerticalAlign.Center)
      }
      .padding({ left: 12, right: 12, top: 10, bottom: 12 }) // 内边距
    }
    .width('100%')
    .backgroundColor('#FFFFFF')
    .borderRadius(16)
    .margin({ bottom: 12, left: 12, right: 12 })
    .shadow({ radius: 6, color: '#14000000', offsetX: 0, offsetY: 2 })
    .onClick(() => {
      router.pushUrl({
        url: 'pages/Detail',
        params: {
          id: this.product.id,
          category: this.category,
          name: this.product.name,
          price: this.product.price,
          description: this.product.description,
          // 不直接传递 Resource，改为通过分类+ID在详情页重建数据源后查找
          ratingPercentage: this.product.ratingPercentage,
          ratingCount: this.product.ratingCount
        }
      });
    })
  }
}
