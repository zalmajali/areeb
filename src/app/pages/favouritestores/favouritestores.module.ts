import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {SortandfilterComponent} from "../sortandfilter/sortandfilter.component";
import { IonicModule } from '@ionic/angular';

import { FavouritestoresPageRoutingModule } from './favouritestores-routing.module';

import { FavouritestoresPage } from './favouritestores.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavouritestoresPageRoutingModule
  ],
  declarations: [FavouritestoresPage,SortandfilterComponent],
  entryComponents:[SortandfilterComponent]
})
export class FavouritestoresPageModule {}
