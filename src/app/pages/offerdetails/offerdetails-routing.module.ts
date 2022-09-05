import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfferdetailsPage } from './offerdetails.page';

const routes: Routes = [
  {
    path: '',
    component: OfferdetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfferdetailsPageRoutingModule {}
