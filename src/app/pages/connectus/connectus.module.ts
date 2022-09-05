import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectusPageRoutingModule } from './connectus-routing.module';

import { ConnectusPage } from './connectus.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectusPageRoutingModule
  ],
  declarations: [ConnectusPage]
})
export class ConnectusPageModule {}
