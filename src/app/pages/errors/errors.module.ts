import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ErrorsPageRoutingModule } from './errors-routing.module';

import { ErrorsPage } from './errors.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErrorsPageRoutingModule
  ],
  declarations: [ErrorsPage]
})
export class ErrorsPageModule {}
