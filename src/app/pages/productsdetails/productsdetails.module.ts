import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsdetailsPageRoutingModule } from './productsdetails-routing.module';

import { ProductsdetailsPage } from './productsdetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsdetailsPageRoutingModule
  ],
  declarations: [ProductsdetailsPage]
})
export class ProductsdetailsPageModule {}
