// entry/src/main/ets/viewmodel/ListDataSource.ets

// Define the Product interface here or in a shared common file
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  // 可以添加更多属性，例如评价数、好评率
  ratingCount?: number;
  ratingPercentage?: number;
}

// Data source that implements IDataSource for LazyForEach
export class ProductListDataSource implements IDataSource { // Renamed for clarity, can be ListDataSource
  private products: Product[] = []; // The current data subset shown in UI
  private dataChangeListener: DataChangeListener | undefined;
  private allAvailableProducts: Product[] = []; // All products that can be loaded
  private pageSize: number = 20; // Number of items to load per batch
  private currentLoadedCount: number = 0;
  private nextProductId: number = 1; // Used for generating mock IDs

  constructor() {
    this.generateAllInitialData(); // Generate all possible data upfront
    this.loadInitialData(); // Load the first batch for display
  }

  // Generates a larger pool of mock product data
  private generateAllInitialData() {
    const productNames = [
      "畅乐冰晶绿低脂新品",
      "奶茶自然清新亲近自然",
      "轻食沙拉活力均衡餐",
      "阳光谷物能量棒",
      "有机全麦面包醇香",
      "新鲜水果每日优选",
      "零卡气泡水多口味",
      "坚果混合营养装"
    ];
    const productDescriptions = [
      "重磅推荐，MD新品试用中！",
      "口感丝滑，清新自然，健康优选！",
      "轻体低卡，健康美味，享受无负担！",
      "补充能量，随时随地，活力十足！",
      "手工烘焙，麦香浓郁，健康早餐伴侣！",
      "每日配送，新鲜采摘，膳食均衡之选！",
      "清爽解渴，多种口味，畅饮无负担！",
      "精选坚果，科学配比，健康零食！"
    ];
    const imageNames = ['goodsImg', 'goodsImg_2', 'goodsImg_3', 'goodsImg_4']; // 使用你已有的图片名称

    for (let i = 0; i < 100; i++) {
      const nameIndex = i % productNames.length;
      const descIndex = i % productDescriptions.length;
      const imageIndex = i % imageNames.length; // 循环使用图片

      this.allAvailableProducts.push({
        id: this.nextProductId++,
        name: `【新品上市】${productNames[nameIndex]}`,
        description: productDescriptions[descIndex],
        price: 180.00 + (i * 0.5), // 价格稍作调整
        imageUrl: `$r('app.media.${imageNames[imageIndex]}')`, // 随机使用不同的图片
        ratingCount: 6000 + (i * 10), // 模拟评价数
        ratingPercentage: 90 + (i % 5), // 模拟好评率
      });
    }
    console.log(`Generated ${this.allAvailableProducts.length} total mock products.`);
  }

  // Loads the very first batch of data
  private loadInitialData() {
    const initialBatch = this.allAvailableProducts.slice(0, this.pageSize);
    this.products = initialBatch;
    this.currentLoadedCount = this.products.length;
    console.log(`Loaded initial ${this.products.length} products.`);
    if (this.dataChangeListener) {
      this.dataChangeListener.onDataReloaded();
    }
  }

  async loadMore() {
    if (this.currentLoadedCount < this.allAvailableProducts.length) {
      const newItems = await new Promise<Product[]>(resolve => {
        setTimeout(() => {
          const startIndex = this.currentLoadedCount;
          const endIndex = Math.min(startIndex + this.pageSize, this.allAvailableProducts.length);
          const fetched = this.allAvailableProducts.slice(startIndex, endIndex);
          console.log(`Fetched more products from index ${startIndex} to ${endIndex - 1}`);
          resolve(fetched);
        }, 800); // Simulate network delay for loading more
      });

      if (newItems.length > 0) {
        const startIndex = this.products.length;
        this.products.push(...newItems);
        this.currentLoadedCount = this.products.length;
        console.log(`Added ${newItems.length} new products. Total: ${this.products.length}`);
        if (this.dataChangeListener) {
          this.dataChangeListener.onDataAdd(startIndex);
        }
      }
    } else {
      console.log('No more products to load.');
    }
  }

  async refresh() {
    console.log('Refreshing data...');
    // Simulate a full reload from the beginning
    this.products = [];
    this.currentLoadedCount = 0;
    // You might want to regenerate allAvailableProducts here if data changes frequently
    // For this example, we'll just reload the first batch.
    this.loadInitialData();
    if (this.dataChangeListener) {
      this.dataChangeListener.onDataReloaded();
    }
  }

  totalCount(): number {
    return this.products.length;
  }

  getData(index: number): Product {
    return this.products[index];
  }

  registerDataChangeListener(listener: DataChangeListener): void {
    this.dataChangeListener = listener;
  }

  unregisterDataChangeListener(): void {
    this.dataChangeListener = undefined;
  }
}