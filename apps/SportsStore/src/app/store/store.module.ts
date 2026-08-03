import { NgModule } from '@angular/core';
import { StoreComponent } from './store.component';
import { ModelModule } from '../model/model.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CounterDirective } from './counter.directive';
import { CartSummaryComponent } from './cartSummary.component';

@NgModule({
  imports: [ModelModule, BrowserModule, FormsModule],
  declarations: [StoreComponent, CounterDirective, CartSummaryComponent],
  providers: [],
  exports: [StoreComponent],
})
export class StoreModule {}
