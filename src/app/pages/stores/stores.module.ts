import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {SortandfilterComponent} from '../sortandfilter/sortandfilter.component';
import { IonicModule } from '@ionic/angular';

import { StoresPageRoutingModule } from './stores-routing.module';

import { StoresPage } from './stores.page';
import {StoredetailsPage} from "../storedetails/storedetails.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoresPageRoutingModule
  ],
  declarations: [StoresPage,SortandfilterComponent],
  entryComponents:[SortandfilterComponent]
})
export class StoresPageModule {}
