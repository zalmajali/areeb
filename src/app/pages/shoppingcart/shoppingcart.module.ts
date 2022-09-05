import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactinformationComponent } from '../contactinformation/contactinformation.component';
import { IonicModule } from '@ionic/angular';

import { ShoppingcartPageRoutingModule } from './shoppingcart-routing.module';

import { ShoppingcartPage } from './shoppingcart.page';
import {StoresPage} from '../stores/stores.page';
import {SortandfilterComponent} from '../sortandfilter/sortandfilter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShoppingcartPageRoutingModule
  ],
  declarations: [ShoppingcartPage,ContactinformationComponent],
  entryComponents:[ContactinformationComponent]
})
export class ShoppingcartPageModule {}
