import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {OrderssearchComponent} from '../orderssearch/orderssearch.component';
import {OrdersfiltersComponent} from '../ordersfilters/ordersfilters.component';
import { IonicModule } from '@ionic/angular';
import {OrdersrateComponent} from '../ordersrate/ordersrate.component';
import { OrdersPageRoutingModule } from './orders-routing.module';

import { OrdersPage } from './orders.page';
import {SortandfilterComponent} from '../sortandfilter/sortandfilter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdersPageRoutingModule
  ],
  declarations: [OrdersPage,OrderssearchComponent,OrdersfiltersComponent,],
  entryComponents:[OrderssearchComponent,OrdersfiltersComponent,OrdersrateComponent]

})
export class OrdersPageModule {}
