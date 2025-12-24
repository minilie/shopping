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
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius(16);
            Column.margin({ bottom: 12, left: 12, right: 12 });
            Column.shadow({ radius: 6, color: '#14000000', offsetX: 0, offsetY: 2 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width('100%');
            Stack.height(180);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.product.imageUrl);
            Image.width('100%');
            Image.height(180);
            Image.objectFit(ImageFit.Cover);
            Image.borderRadius(12);
            Image.alt({ "id": 16777259, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.product.ratingPercentage !== undefined) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${this.product.ratingPercentage}%好评`);
                        Text.fontSize(10);
                        Text.fontColor(Color.White);
                        Text.backgroundColor('#3A2D6A4F');
                        Text.borderRadius(10);
                        Text.padding({ left: 8, right: 8, top: 4, bottom: 4 });
                        Text.position({ x: 10, y: 10 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品信息区域
            Column.create();
            // 商品信息区域
            Column.padding({ left: 12, right: 12, top: 10, bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品名称
            Text.create(this.product.name);
            // 商品名称
            Text.fontSize(16);
            // 商品名称
            Text.fontWeight(FontWeight.Medium);
            // 商品名称
            Text.fontColor('#1B1B1F');
            // 商品名称
            Text.maxLines(2);
            // 商品名称
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        // 商品名称
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品描述
            Text.create(this.product.description);
            // 商品描述
            Text.fontSize(12);
            // 商品描述
            Text.fontColor('#6B6B6B');
            // 商品描述
            Text.maxLines(1);
            // 商品描述
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            // 商品描述
            Text.margin({ top: 4 });
        }, Text);
        // 商品描述
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 评价和价格行
            Row.create();
            // 评价和价格行
            Row.width('100%');
            // 评价和价格行
            Row.margin({ top: 10 });
            // 评价和价格行
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('¥');
            Text.fontSize(12);
            Text.fontColor('#C62828');
            Text.margin({ top: 2 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.product.price.toFixed(2)}`);
            Text.fontSize(18);
            Text.fontColor('#C62828');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.product.ratingCount !== undefined) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${this.product.ratingCount}人评价`);
                        Text.fontSize(11);
                        Text.fontColor('#8A8A8A');
                        Text.margin({ top: 2 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('去看看');
            Text.fontSize(12);
            Text.fontColor(Color.White);
            Text.backgroundColor('#2D6A4F');
            Text.borderRadius(12);
            Text.padding({ left: 10, right: 10, top: 6, bottom: 6 });
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
