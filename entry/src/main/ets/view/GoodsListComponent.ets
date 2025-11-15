// entry/src/main/ets/view/GoodsListComponent.ets
import { Product } from '../viewmodel/ListDataSource';

@Component
export struct ProductItem {
  @Prop product: Product;

  build() {
    Column() { // 使用Column作为商品卡片的主容器
      // 商品图片
      Image(this.product.imageUrl)
        .width('100%') // 图片宽度占满
        .height(180) // 固定高度
        .borderRadius(8)
        .alt($r('app.media.product_image_placeholder')) // 替代文本，防止图片加载失败

      // 商品信息区域
      Column() {
        // 商品名称
        Text(this.product.name)
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .maxLines(2) // 最多显示两行
          .textOverflow({ overflow: TextOverflow.Ellipsis }) // 超出部分显示省略号
          .margin({ bottom: 4 })

        // 商品描述
        Text(this.product.description)
          .fontSize(12)
          .fontColor(Color.Gray)
          .margin({ bottom: 8 })

        // 评价和价格行
        Row() {
          Text(`${this.product.ratingCount || 0}人评价 ${this.product.ratingPercentage || 0}%好评`)
            .fontSize(12)
            .fontColor(Color.Gray)
            .layoutWeight(1) // 占据左侧空间

          Text(`¥${this.product.price.toFixed(2)}`)
            .fontSize(16)
            .fontColor(Color.Red)
            .fontWeight(FontWeight.Bold)
        }
        .width('100%')
      }
      .padding({ left: 8, right: 8, bottom: 8 }) // 内边距
    }
    .width('100%') // 卡片宽度占满
    .backgroundColor(Color.White)
    .borderRadius(10)
    .margin({ bottom: 8, left: 12, right: 12 }) // 卡片间距和左右外边距
    .shadow({ radius: 2, color: '#1A000000', offsetX: 0, offsetY: 1 }) // 添加阴影效果
  }
}