if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ProductItem_Params {
    product?: Product;
}
import type { Product } from '../viewmodel/ListDataSource';
export class ProductItem extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__product = new SynchedPropertyObjectOneWayPU(params.product, this, "product");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ProductItem_Params) {
    }
    updateStateVars(params: ProductItem_Params) {
        this.__product.reset(params.product);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__product.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__product.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __product: SynchedPropertySimpleOneWayPU<Product>;
    get product() {
        return this.__product.get();
    }
    set product(newValue: Product) {
        this.__product.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.backgroundColor(Color.White);
            Column.borderRadius(10);
            Column.margin({ bottom: 8, left: 12, right: 12 });
            Column.shadow({ radius: 2, color: '#1A000000', offsetX: 0, offsetY: 1 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品图片
            Image.create(this.product.imageUrl);
            // 商品图片
            Image.width('100%');
            // 商品图片
            Image.height(180);
            // 商品图片
            Image.borderRadius(8);
            // 商品图片
            Image.alt({ "id": 16777259, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品信息区域
            Column.create();
            // 商品信息区域
            Column.padding({ left: 8, right: 8, bottom: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品名称
            Text.create(this.product.name);
            // 商品名称
            Text.fontSize(16);
            // 商品名称
            Text.fontWeight(FontWeight.Medium);
            // 商品名称
            Text.maxLines(2);
            // 商品名称
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            // 商品名称
            Text.margin({ bottom: 4 });
        }, Text);
        // 商品名称
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品描述
            Text.create(this.product.description);
            // 商品描述
            Text.fontSize(12);
            // 商品描述
            Text.fontColor(Color.Gray);
            // 商品描述
            Text.margin({ bottom: 8 });
        }, Text);
        // 商品描述
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 评价和价格行
            Row.create();
            // 评价和价格行
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.product.ratingCount || 0}人评价 ${this.product.ratingPercentage || 0}%好评`);
            Text.fontSize(12);
            Text.fontColor(Color.Gray);
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`¥${this.product.price.toFixed(2)}`);
            Text.fontSize(16);
            Text.fontColor(Color.Red);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        // 评价和价格行
        Row.pop();
        // 商品信息区域
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
