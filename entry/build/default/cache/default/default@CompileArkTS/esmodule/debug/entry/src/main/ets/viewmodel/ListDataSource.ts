// entry/src/main/ets/viewmodel/ListDataSource.ets
// Define the Product interface here or in a shared common file
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}
// Data source that implements IDataSource for LazyForEach
export class ProductListDataSource implements IDataSource {
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
        for (let i = 0; i < 100; i++) { // Generate 100 mock products
            this.allAvailableProducts.push({
                id: this.nextProductId++,
                name: `新品上市 - 产品 ${i + 1}`,
                description: `这是产品 ${i + 1} 的详细描述。`,
                price: 199.00 + (i * 0.5),
                // Ensure this resource path is correct and the image exists
                imageUrl: `$r('app.media.goodsImg')`,
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
        }
        else {
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
