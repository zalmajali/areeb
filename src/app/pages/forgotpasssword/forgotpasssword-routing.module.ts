import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgotpassswordPage } from './forgotpasssword.page';

const routes: Routes = [
  {
    path: '',
    component: ForgotpassswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgotpassswordPageRoutingModule {}
