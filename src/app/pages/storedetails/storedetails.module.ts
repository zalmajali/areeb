import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {SortandfilterComponent} from "../sortandfilter/sortandfilter.component";
import { IonicModule } from '@ionic/angular';

import { StoredetailsPageRoutingModule } from './storedetails-routing.module';

import { StoredetailsPage } from './storedetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoredetailsPageRoutingModule
  ],
  declarations: [StoredetailsPage,SortandfilterComponent],
  entryComponents:[SortandfilterComponent]
})
export class StoredetailsPageModule {}
