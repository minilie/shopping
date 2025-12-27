// entry/src/main/ets/pages/Detail.ets
import router from '@ohos.router';
import { ProductListDataSource, ProductCategory } from '../viewmodel/ListDataSource';

interface DetailParams {
  id?: number;
  category?: ProductCategory;
  name?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
  ratingPercentage?: number;
  ratingCount?: number;
}

@Entry
@Component
struct ProductDetailPage {
  @State private productId: number = -1;
  @State private productName: string = '';
  @State private productPrice: number = 0;
  @State private productDesc: string = '';
  @State private productImageUrl: string = '';
  @State private productImageRes: Resource | undefined = undefined;
  @State private productRatingPct: number | undefined = undefined;
  @State private productRatingCount: number | undefined = undefined;

  // 可按需注入或调用接口获取详情，这里仅演示路由参数读取

  aboutToAppear() {
    const params = router.getParams() as DetailParams;
    if (params && typeof params.id === 'number') {
      this.productId = params.id;
    }
    // 优先使用分类+ID重建数据源并查找商品，确保图片 Resource 正确
    if (params && params.category !== undefined && typeof this.productId === 'number') {
      const ds = new ProductListDataSource(params.category as ProductCategory);
      const found = ds.findById(this.productId);
      if (found) {
        this.productName = found.name;
        this.productPrice = found.price;
        this.productDesc = found.description;
        this.productImageRes = found.imageUrl; // Resource 类型
        this.productRatingPct = found.ratingPercentage;
        this.productRatingCount = found.ratingCount;
      }
    }
    if (params && typeof params.name === 'string') {
      this.productName = params.name;
    }
    if (params && typeof params.price === 'number') {
      this.productPrice = params.price;
    }
    if (params && typeof params.description === 'string') {
      this.productDesc = params.description;
    }
    // 若未查到或未传分类，退化为使用路由传递的基本字段（不含 Resource 图片）
    if (params && typeof params.ratingPercentage === 'number') {
      this.productRatingPct = params.ratingPercentage;
    }
    if (params && typeof params.ratingCount === 'number') {
      this.productRatingCount = params.ratingCount;
    }
  }

  build() {
    Navigation() {
      Column() {
        // 预览图：优先展示数据源查到的 Resource
        if (this.productImageRes !== undefined) {
          Image(this.productImageRes as Resource)
            .width('100%')
            .height(220)
            .objectFit(ImageFit.Cover)
            .borderRadius(12)
            .margin({ bottom: 12 })
        } else {
          Image($r('app.media.product_image_placeholder'))
            .width('100%')
            .height(220)
            .objectFit(ImageFit.Cover)
            .borderRadius(12)
            .margin({ bottom: 12 })
        }

        // 调试文本可选：当前商品 ID 与分类
        if (this.productId !== -1) {
          Text(`商品ID：${this.productId}`)
            .fontSize(12)
            .fontColor('#777777')
            .margin({ bottom: 8 })
        }

        Text(this.productName.length > 0 ? this.productName : `商品 #${this.productId}`)
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .margin({ bottom: 12 })

        Text(this.productDesc.length > 0 ? this.productDesc : '暂无描述')
          .fontSize(14)
          .fontColor('#666666')
          .margin({ bottom: 12 })

        Text(`价格：¥${this.productPrice.toFixed(2)}`)
          .fontSize(16)
          .fontColor('#C62828')
          .margin({ bottom: 8 })

        if (this.productRatingPct !== undefined || this.productRatingCount !== undefined) {
          Row() {
            if (this.productRatingPct !== undefined) {
              Text(`好评率：${this.productRatingPct}%`)
                .fontSize(12)
                .fontColor('#333333')
            }
            if (this.productRatingCount !== undefined) {
              Text(`${this.productRatingCount}人评价`)
                .fontSize(12)
                .fontColor('#666666')
                .margin({ left: 12 })
            }
          }
          .margin({ bottom: 12 })
        }

        Button('返回')
          .margin({ top: 24 })
          .onClick(() => router.back())
      }
      .padding(16)
    }
    .title('商品详情')
    .titleMode(NavigationTitleMode.Mini)
  }
}
