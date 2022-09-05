import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FavouritestoresPage } from './favouritestores.page';

const routes: Routes = [
  {
    path: '',
    component: FavouritestoresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavouritestoresPageRoutingModule {}
