import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConnectusPage } from './connectus.page';

const routes: Routes = [
  {
    path: '',
    component: ConnectusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectusPageRoutingModule {}
