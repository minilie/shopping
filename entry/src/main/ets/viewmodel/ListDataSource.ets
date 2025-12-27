export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: Resource;
  ratingCount?: number;
  ratingPercentage?: number;
  subCategory?: string;
}

// Enum for categories to make code cleaner and prevent typos
export enum ProductCategory {
  FEATURED = 'Featured',
  MOBILE = 'Mobile',
  FASHION = 'Fashion',
  WEAR = 'Wear',
  HOME = 'Home',
}

export enum SortOption {
  DEFAULT = 'Default',
  PRICE_ASC = 'PriceAsc',
  PRICE_DESC = 'PriceDesc',
  RATING_DESC = 'RatingDesc',
}

export enum PriceFilter {
  ALL = 'All',
  UNDER_100 = 'Under100',
  BETWEEN_100_200 = 'Between100200',
  OVER_200 = 'Over200',
}

export class ProductListDataSource implements IDataSource {
  private products: Product[] = [];
  private dataChangeListener: DataChangeListener | undefined;
  private allAvailableProducts: Product[] = [];
  private filteredProducts: Product[] = [];
  private pageSize: number = 20;
  private currentLoadedCount: number = 0;
  private nextProductId: number = 1;
  private totalProductCount: number = 60;

  public isLoadingMore: boolean = false;
  public hasMore: boolean = true;
  public isAtTop: boolean = true;
  private category: ProductCategory; // <--- Add category property
  private searchQuery: string = '';
  private sortOption: SortOption = SortOption.DEFAULT;
  private priceFilter: PriceFilter = PriceFilter.ALL;
  private subCategory: string = '';

  constructor(category: ProductCategory) { // <--- Accept category in constructor
    this.category = category; // Store the category
    this.generateAllInitialDataForCategory(this.category); // Call the new method
    this.rebuildFilteredProducts();
    this.loadInitialData();
  }

  // 暴露当前分类，便于外部传递到详情页
  getCategory(): ProductCategory {
    return this.category;
  }

  // 根据ID查找商品（在完整数据池中）
  findById(id: number): Product | undefined {
    return this.allAvailableProducts.find((p: Product) => p.id === id);
  }

  // Modified to generate data based on category
  private generateAllInitialDataForCategory(category: ProductCategory) {
    this.allAvailableProducts = [];
    let productNames: string[] = [];
    let productDescriptions: string[] = [];
    let imageResources: Resource[] = []; // Array of Resource objects
    let subcats: string[] = [];

    // Define different content based on the category
    switch (category) {
      case ProductCategory.FEATURED:
        productNames = [
          "畅乐冰晶绿低脂新品",
          "奶茶自然清新亲近自然",
          "轻食沙拉活力均衡餐",
          "阳光谷物能量棒",
        ];
        productDescriptions = [
          "重磅推荐，MD新品试用中！",
          "口感丝滑，清新自然，健康优选！",
          "轻体低卡，健康美味，享受无负担！",
          "补充能量，随时随地，活力十足！",
        ];
        imageResources = [
          $r('app.media.goodsImg_2'),
          $r('app.media.goodsImg_3'),
          $r('app.media.goodsImg_4'),
          $r('app.media.product_image_placeholder'),
        ];
        subcats = ["热门", "新品", "健康轻食", "零食饮品"];
        break;
      case ProductCategory.MOBILE:
        productNames = [
          "旗舰智能手机XPro",
          "超长续航商务手机",
          "摄影大师级手机Max",
          "入门级智能手机Lite",
        ];
        productDescriptions = [
          "性能卓越，体验非凡，您的智能新选择！",
          "一次充电，畅用两天，告别电量焦虑！",
          "三摄系统，专业级成像，记录生活精彩瞬间！",
          "价格实惠，功能全面，智能生活轻松开启！",
        ];
        imageResources = [
          $r('app.media.mobile_phone_1'), // Assume you have these assets
          $r('app.media.mobile_phone_2'),
          $r('app.media.mobile_phone_3'),
          $r('app.media.mobile_phone_4'),
        ];
        subcats = ["旗舰", "续航", "影像", "入门"];
        break;
      case ProductCategory.FASHION:
        productNames = [
          "潮流休闲卫衣",
          "时尚牛仔裤",
          "优雅连衣裙",
          "经典款风衣",
        ];
        productDescriptions = [
          "秋冬必备，舒适百搭，街头潮人首选！",
          "修身显瘦，多种款式，打造你的专属风格！",
          "法式浪漫，质感面料，出席各种场合皆宜！",
          "防风保暖，经典版型，永不过时的时尚单品！",
        ];
        imageResources = [
          $r('app.media.fashion_item_1'), // Assume you have these assets
          $r('app.media.fashion_item_2'),
          $r('app.media.fashion_item_3'),
          $r('app.media.fashion_item_4'),
        ];
        subcats = ["卫衣", "牛仔", "连衣裙", "风衣"];
        break;
      case ProductCategory.WEAR:
        productNames = [
          "运动速干T恤",
          "透气跑步鞋",
          "智能运动手环",
          "瑜伽健身套装",
        ];
        productDescriptions = [
          "吸湿排汗，轻盈舒适，助你突破极限！",
          "缓震防滑，包裹性强，享受畅快奔跑！",
          "心率监测，睡眠分析，您的健康管家！",
          "高弹透气，塑形美体，轻松打造完美身材！",
        ];
        imageResources = [
          $r('app.media.wear_item_1'), // Assume you have these assets
          $r('app.media.wear_item_2'),
          $r('app.media.wear_item_3'),
          $r('app.media.wear_item_4'),
        ];
        subcats = ["T恤", "跑鞋", "手环", "瑜伽"];
        break;
      case ProductCategory.HOME:
        productNames = [
          "智能扫地机器人",
          "北欧简约咖啡桌",
          "超声波香薰机",
          "记忆棉枕头",
        ];
        productDescriptions = [
          "解放双手，智能规划，洁净家居新体验！",
          "实木打造，造型独特，点亮客厅新空间！",
          "静音加湿，香气弥漫，营造舒适居家氛围！",
          "人体工学设计，深度承托，享受整夜好眠！",
        ];
        imageResources = [
          $r('app.media.home_item_1'), // Assume you have these assets
          $r('app.media.home_item_2'),
          $r('app.media.home_item_3'),
          $r('app.media.home_item_4'),
        ];
        subcats = ["清洁", "家具", "香薰", "寝具"];
        break;
      default: // Fallback for any unknown category
        productNames = ["默认商品"];
        productDescriptions = ["默认描述"];
        imageResources = [$r('app.media.product_image_placeholder')];
        subcats = ["默认"];
        break;
    }

    for (let i = 0; i < this.totalProductCount; i++) {
      const nameIndex = i % productNames.length;
      const descIndex = i % productDescriptions.length;
      const imageIndex = i % imageResources.length;
      const subIndex = i % subcats.length;

      this.allAvailableProducts.push({
        id: this.nextProductId++,
        name: `【${this.category}】${productNames[nameIndex]} ${i + 1}`, // Add index to avoid repeated-looking items
        description: productDescriptions[descIndex],
        price: 180.00 + (i * 0.5),
        imageUrl: imageResources[imageIndex],
        ratingCount: 6000 + (i * 10),
        ratingPercentage: 90 + (i % 5),
        subCategory: subcats[subIndex],
      });
    }
    console.log(`Generated ${this.allAvailableProducts.length} total mock products for ${category}.`);
  }

  setSearchQuery(query: string) {
    this.searchQuery = query.trim();
    this.applyFiltersAndReload();
  }

  setSortOption(option: SortOption) {
    this.sortOption = option;
    this.applyFiltersAndReload();
  }

  setPriceFilter(filter: PriceFilter) {
    this.priceFilter = filter;
    this.applyFiltersAndReload();
  }

  getSearchQuery(): string {
    return this.searchQuery;
  }

  getSortOption(): SortOption {
    return this.sortOption;
  }

  getPriceFilter(): PriceFilter {
    return this.priceFilter;
  }

  private applyFiltersAndReload() {
    this.rebuildFilteredProducts();
    this.loadInitialData();
  }

  private rebuildFilteredProducts() {
    let result = this.allAvailableProducts;
    if (this.searchQuery.length > 0) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter((product: Product) => {
        return product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query);
      });
    }

    if (this.priceFilter !== PriceFilter.ALL) {
      result = result.filter((product: Product) => {
        if (this.priceFilter === PriceFilter.UNDER_100) {
          return product.price < 100;
        }
        if (this.priceFilter === PriceFilter.BETWEEN_100_200) {
          return product.price >= 100 && product.price <= 200;
        }
        return product.price > 200;
      });
    }

    // 子类过滤（若设置）
    if (this.subCategory && this.subCategory.length > 0) {
      const sc = this.subCategory;
      result = result.filter((product: Product) => product.subCategory === sc);
    }

    result = result.slice();
    if (this.sortOption === SortOption.PRICE_ASC) {
      result.sort((a: Product, b: Product) => a.price - b.price);
    } else if (this.sortOption === SortOption.PRICE_DESC) {
      result.sort((a: Product, b: Product) => b.price - a.price);
    } else if (this.sortOption === SortOption.RATING_DESC) {
      result.sort((a: Product, b: Product) => {
        const ratingA = a.ratingPercentage ?? 0;
        const ratingB = b.ratingPercentage ?? 0;
        return ratingB - ratingA;
      });
    }

    this.filteredProducts = result;
  }

  private loadInitialData() {
    this.products = [];
    this.currentLoadedCount = 0;
    this.hasMore = true;
    this.isLoadingMore = false;
    const initialBatch = this.filteredProducts.slice(0, this.pageSize);
    this.products.push(...initialBatch);
    this.currentLoadedCount = this.products.length;
    console.log(`Loaded initial ${this.products.length} products for ${this.category}.`);
    if (this.dataChangeListener) {
      this.dataChangeListener.onDataReloaded();
    }
    if (this.currentLoadedCount >= this.filteredProducts.length) {
      this.hasMore = false;
    }
  }

  async loadMore() {
    if (this.isLoadingMore || !this.hasMore) {
      console.log('Already loading or no more data.');
      return;
    }

    this.isLoadingMore = true;
    if (this.currentLoadedCount >= this.filteredProducts.length) {
      this.hasMore = false;
      this.isLoadingMore = false;
      return;
    }
    const newItems = await new Promise<Product[]>(resolve => {
      setTimeout(() => {
        const startIndex = this.currentLoadedCount;
        const endIndex = Math.min(startIndex + this.pageSize, this.filteredProducts.length);
        const fetched = this.filteredProducts.slice(startIndex, endIndex);
        console.log(`Fetched more products from index ${startIndex} to ${endIndex - 1}`);
        resolve(fetched);
      }, 800); // Simulate network delay
    });

    if (newItems.length > 0) {
      const startIndex = this.products.length;
      this.products.push(...newItems);
      this.currentLoadedCount = this.products.length;
      console.log(`Added ${newItems.length} new products. Total: ${this.products.length}`);
      if (this.dataChangeListener) {
        this.dataChangeListener.onDataAdd(startIndex);
      }
      this.hasMore = this.currentLoadedCount < this.filteredProducts.length;
    } else {
      this.hasMore = false; // No more data to load
    }
    this.isLoadingMore = false;
  }

  async refresh() {
    console.log('Refreshing data...');
    // Simulate network delay for refresh
    await new Promise<void>(resolve => setTimeout(resolve, 1500));

    // For a real application, you would fetch fresh data from a server here.
    // For this mock, we'll just reload the initial batch.
    this.rebuildFilteredProducts();
    this.loadInitialData(); // This will clear and reload the first batch

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

  setIsAtTop(isAtTop: boolean): void {
    this.isAtTop = isAtTop;
  }

  setSubcategory(subcat: string): void {
    this.subCategory = subcat;
    this.applyFiltersAndReload();
  }

  getSubcategory(): string {
    return this.subCategory;
  }
}
