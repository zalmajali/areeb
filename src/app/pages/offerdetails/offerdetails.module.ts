import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfferdetailsPageRoutingModule } from './offerdetails-routing.module';

import { OfferdetailsPage } from './offerdetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfferdetailsPageRoutingModule
  ],
  declarations: [OfferdetailsPage]
})
export class OfferdetailsPageModule {}
