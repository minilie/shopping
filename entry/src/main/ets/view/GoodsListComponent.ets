// entry/src/main/ets/view/GoodsListComponent.ets
// Adjust import path for Product
import { Product } from '../viewmodel/ListDataSource'; // <<< Corrected import

@Component
export struct ProductItem {
  @Prop product: Product; // This remains @Prop

  build() {
    Row() {
      // Ensure 'product_image_placeholder' exists in 'entry/src/main/resources/base/media/'
      Image($r('app.media.product_image_placeholder')) // <<< Check this resource path and image existence
        .width(80)
        .height(80)
        .borderRadius(8)
        .margin({ right: 10 })
      Column() {
        Text(this.product.name)
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
        Text(this.product.description)
          .fontSize(12)
          .fontColor(Color.Gray)
        Text(`¥${this.product.price.toFixed(2)}`)
          .fontSize(16)
          .fontColor(Color.Red)
          .fontWeight(FontWeight.Bold)
      }
    }
    .width('100%')
    .padding(10)
    .backgroundColor(Color.White)
    .borderRadius(10)
    .margin({ bottom: 8 })
  }
}