import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoredetailsPage } from './storedetails.page';

const routes: Routes = [
  {
    path: '',
    component: StoredetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoredetailsPageRoutingModule {}
