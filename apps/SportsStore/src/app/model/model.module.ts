import { NgModule } from '@angular/core';
import { ProductRepository } from './product.repository';
import { StaticDataSource } from './static.datasource';

@NgModule({
  providers: [StaticDataSource, ProductRepository],
})
export class ModelModule {}
