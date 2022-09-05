import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsdetailsPage } from './productsdetails.page';

const routes: Routes = [
  {
    path: '',
    component: ProductsdetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsdetailsPageRoutingModule {}
