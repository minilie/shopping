import { describe, it, expect } from '@ohos/hypium';
import {
  ProductListDataSource,
  ProductCategory,
  SortOption,
  PriceFilter
} from '../../../main/ets/viewmodel/ListDataSource';

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

    it('search is case-insensitive', 0, () => {
      const dataSource = new ProductListDataSource(ProductCategory.FEATURED);
      dataSource.setSearchQuery('featured');
      expect(dataSource.totalCount()).assertEqual(20);
      expect(dataSource.hasMore).assertTrue();
      const first = dataSource.getData(0);
      expect(first.name.toLowerCase().includes('featured')).assertTrue();
    });

    it('price filter under 100 yields no results', 0, () => {
      const dataSource = new ProductListDataSource(ProductCategory.FEATURED);
      dataSource.setPriceFilter(PriceFilter.UNDER_100);
      expect(dataSource.totalCount()).assertEqual(0);
      expect(dataSource.hasMore).assertFalse();
    });

    it('price filter between 100 and 200 keeps items in range', 0, () => {
      const dataSource = new ProductListDataSource(ProductCategory.FEATURED);
      dataSource.setPriceFilter(PriceFilter.BETWEEN_100_200);
      expect(dataSource.totalCount()).assertEqual(20);
      expect(dataSource.hasMore).assertTrue();
      for (let i = 0; i < dataSource.totalCount(); i++) {
        const price = dataSource.getData(i).price;
        expect(price >= 100).assertTrue();
        expect(price <= 200).assertTrue();
      }
    });

    it('price filter over 200 yields a single page', 0, () => {
      const dataSource = new ProductListDataSource(ProductCategory.FEATURED);
      dataSource.setPriceFilter(PriceFilter.OVER_200);
      expect(dataSource.totalCount()).assertEqual(19);
      expect(dataSource.hasMore).assertFalse();
      for (let i = 0; i < dataSource.totalCount(); i++) {
        const price = dataSource.getData(i).price;
        expect(price > 200).assertTrue();
      }
    });

    it('sort by price desc orders items', 0, () => {
      const dataSource = new ProductListDataSource(ProductCategory.FEATURED);
      dataSource.setSortOption(SortOption.PRICE_DESC);
      const first = dataSource.getData(0);
      const second = dataSource.getData(1);
      expect(first.price >= second.price).assertTrue();
    });

    it('sort by rating desc orders items', 0, () => {
      const dataSource = new ProductListDataSource(ProductCategory.FEATURED);
      dataSource.setSortOption(SortOption.RATING_DESC);
      const first = dataSource.getData(0);
      const second = dataSource.getData(1);
      const firstRating = first.ratingPercentage ?? 0;
      const secondRating = second.ratingPercentage ?? 0;
      expect(firstRating >= secondRating).assertTrue();
    });

    it('loadMore reaches end and stops', 0, async () => {
      const dataSource = new ProductListDataSource(ProductCategory.FEATURED);
      await dataSource.loadMore();
      await dataSource.loadMore();
      expect(dataSource.totalCount()).assertEqual(60);
      expect(dataSource.hasMore).assertFalse();
    });

    it('refresh resets to first page', 0, async () => {
      const dataSource = new ProductListDataSource(ProductCategory.FEATURED);
      await dataSource.loadMore();
      await dataSource.loadMore();
      expect(dataSource.hasMore).assertFalse();
      await dataSource.refresh();
      expect(dataSource.totalCount()).assertEqual(20);
      expect(dataSource.hasMore).assertTrue();
    });
  });
}
