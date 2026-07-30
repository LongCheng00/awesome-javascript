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
  constructor(private readonly productRepository: ProductRepository) {}

  get products(): Product[] {
    return this.productRepository.getProducts(this.selectedCategory);
  }

  get categories(): string[] {
    return this.productRepository.getCategories();
  }

  changeCategory(newCategory?: string) {
    this.selectedCategory = newCategory;
  }
}
