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
    private __product: SynchedPropertySimpleOneWayPU<Product>; // This remains @Prop
    get product() {
        return this.__product.get();
    }
    set product(newValue: Product) {
        this.__product.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding(10);
            Row.backgroundColor(Color.White);
            Row.borderRadius(10);
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Ensure 'product_image_placeholder' exists in 'entry/src/main/resources/base/media/'
            Image.create({ "id": 16777246, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
            // Ensure 'product_image_placeholder' exists in 'entry/src/main/resources/base/media/'
            Image.width(80);
            // Ensure 'product_image_placeholder' exists in 'entry/src/main/resources/base/media/'
            Image.height(80);
            // Ensure 'product_image_placeholder' exists in 'entry/src/main/resources/base/media/'
            Image.borderRadius(8);
            // Ensure 'product_image_placeholder' exists in 'entry/src/main/resources/base/media/'
            Image.margin({ right: 10 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.product.name);
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.product.description);
            Text.fontSize(12);
            Text.fontColor(Color.Gray);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`¥${this.product.price.toFixed(2)}`);
            Text.fontSize(16);
            Text.fontColor(Color.Red);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
