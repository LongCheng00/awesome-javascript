import { NgModule } from '@angular/core';
import { ProductRepository } from './product.repository';
import { StaticDataSource } from './static.datasource';
import { Cart } from './cart.model';

@NgModule({
  providers: [StaticDataSource, ProductRepository, Cart],
})
export class ModelModule {}
