import { describe, it, expect } from "@package:pkg_modules/.ohpm/@ohos+hypium@1.0.24/pkg_modules/@ohos/hypium/index";
import { ProductListDataSource, ProductCategory, SortOption, PriceFilter } from "@bundle:com.example.list_harmony/entry/ets/viewmodel/ListDataSource";
export default function productListDataSourceTest(): void {
    describe('ProductListDataSource', () => {
        it('initial load uses first page', 0, () => {
            const dataSource = new ProductListDataSource(ProductCategory.FEATURED);
            expect(dataSource.totalCount()).assertEqual(20);
            expect(dataSource.hasMore).assertTrue();
        });
        it('search filters by keyword', 0, () => {
            const dataSource = new ProductListDataSource(ProductCategory.FEATURED);
            dataSource.setSearchQuery('奶茶');
            expect(dataSource.totalCount()).assertEqual(15);
            const first = dataSource.getData(0);
            const matched = first.name.includes('奶茶') || first.description.includes('奶茶');
            expect(matched).assertTrue();
            expect(dataSource.hasMore).assertFalse();
        });
        it('price filter under 100 yields no results', 0, () => {
            const dataSource = new ProductListDataSource(ProductCategory.FEATURED);
            dataSource.setPriceFilter(PriceFilter.UNDER_100);
            expect(dataSource.totalCount()).assertEqual(0);
            expect(dataSource.hasMore).assertFalse();
        });
        it('sort by price desc orders items', 0, () => {
            const dataSource = new ProductListDataSource(ProductCategory.FEATURED);
            dataSource.setSortOption(SortOption.PRICE_DESC);
            const first = dataSource.getData(0);
            const second = dataSource.getData(1);
            expect(first.price >= second.price).assertTrue();
        });
        it('loadMore reaches end and stops', 0, async () => {
            const dataSource = new ProductListDataSource(ProductCategory.FEATURED);
            await dataSource.loadMore();
            await dataSource.loadMore();
            expect(dataSource.totalCount()).assertEqual(60);
            expect(dataSource.hasMore).assertFalse();
        });
    });
}
