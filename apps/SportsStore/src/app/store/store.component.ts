import { Component } from '@angular/core';
import { Product } from '../model/product.model';
import { ProductRepository } from '../model/product.repository';

@Component({
  standalone: false,
  selector: 'store',
  templateUrl: './store.component.html',
})
export class StoreComponent {
  public selectedCategory: string | undefined;
  public productsPerPage = 4;
  public selectedPage = 1;

  constructor(private readonly productRepository: ProductRepository) {}

  get products(): Product[] {
    let pageIndex = (this.selectedPage - 1) * this.productsPerPage;
    return this.productRepository
      .getProducts(this.selectedCategory)
      .slice(pageIndex, pageIndex + this.productsPerPage);
  }

  get categories(): string[] {
    return this.productRepository.getCategories();
  }

  changeCategory(newCategory?: string) {
    this.selectedCategory = newCategory;
  }
  changePage(newPage: number) {
    this.selectedPage = newPage;
  }
  changePageSize(newSize: number) {
    this.productsPerPage = Number(newSize);
    this.changePage(1);
  }
  changePageSizeFromEvent(event: Event) {
    this.changePageSize(Number((event.target as HTMLSelectElement).value));
  }
  get pageNumbers(): number[] {
    return Array(
      Math.ceil(
        this.productRepository.getProducts(this.selectedCategory).length / this.productsPerPage,
      ),
    )
      .fill(0)
      .map((x, i) => i + 1);
  }
  get pageCount(): number {
    return Math.ceil(
      this.productRepository.getProducts(this.selectedCategory).length / this.productsPerPage,
    );
  }
}
