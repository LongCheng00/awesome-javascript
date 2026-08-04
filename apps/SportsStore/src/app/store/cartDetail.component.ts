import { Component } from '@angular/core';
import { Cart } from '../model/cart.model';
import { Product } from '../model/product.model';

@Component({
  standalone: false,
  templateUrl: './cartDetail.component.html',
})
export class CartDetailComponent {
  constructor(public cart: Cart) {}

  updateQuantityFromEvent(product: Product, event: Event) {
    this.cart.updateQuantity(product, Number((event.target as HTMLInputElement).value));
  }
}
