import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Product } from './product.model';

@Injectable()
export class StaticDataSource {
  private readonly products: Product[] = [
    new Product(1, 'Kayak', 'Watersports', 'A boat for one person', 275),
    new Product(2, 'Lifejacket', 'Watersports', 'Protective and fashionable', 48.95),
    new Product(3, 'Soccer Ball', 'Soccer', 'FIFA-approved size and weight', 19.5),
    new Product(4, 'Corner Flags', 'Soccer', 'Give your playing field a professional touch', 34.95),
    new Product(5, 'Stadium', 'Soccer', 'Flat-packed 35,000-seat stadium', 79500),
    new Product(6, 'Thinking Cap', 'Chess', 'Improve brain efficiency by 75%', 16),
    new Product(7, 'Unsteady Chair', 'Chess', 'Secretly give your opponent a disadvantage', 29.95),
    new Product(8, 'Human Chess Board', 'Chess', 'A fun game for the family', 75),
    new Product(9, 'Bling-Bling King', 'Chess', 'Gold-plated, diamond-studded King', 1200),
  ];

  getProducts(): Observable<Product[]> {
    return from([this.products]);
  }
}
