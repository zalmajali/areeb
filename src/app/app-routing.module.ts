import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'first',
    loadChildren: () => import('./pages/first/first.module').then( m => m.FirstPageModule)
  },
  {
    path: 'connectus',
    loadChildren: () => import('./pages/connectus/connectus.module').then( m => m.ConnectusPageModule)
  },
  {
    path: 'errors',
    loadChildren: () => import('./pages/errors/errors.module').then( m => m.ErrorsPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./pages/registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'activation',
    loadChildren: () => import('./pages/activation/activation.module').then( m => m.ActivationPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'forgotpasssword',
    loadChildren: () => import('./pages/forgotpasssword/forgotpasssword.module').then( m => m.ForgotpassswordPageModule)
  },
  {
    path: 'offerdetails',
    loadChildren: () => import('./pages/offerdetails/offerdetails.module').then( m => m.OfferdetailsPageModule)
  },
  {
    path: 'storedetails',
    loadChildren: () => import('./pages/storedetails/storedetails.module').then( m => m.StoredetailsPageModule)
  },
  {
    path: 'stores',
    loadChildren: () => import('./pages/stores/stores.module').then( m => m.StoresPageModule)
  },
  {
    path: 'favouritestores',
    loadChildren: () => import('./pages/favouritestores/favouritestores.module').then( m => m.FavouritestoresPageModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./pages/account/account.module').then( m => m.AccountPageModule)
  },
  {
    path: 'shoppingcart',
    loadChildren: () => import('./pages/shoppingcart/shoppingcart.module').then( m => m.ShoppingcartPageModule)
  },
  {
    path: 'offers',
    loadChildren: () => import('./pages/offers/offers.module').then( m => m.OffersPageModule)
  },
  {
    path: 'productsdetails',
    loadChildren: () => import('./pages/productsdetails/productsdetails.module').then( m => m.ProductsdetailsPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./pages/orders/orders.module').then( m => m.OrdersPageModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./pages/categories/categories.module').then( m => m.CategoriesPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
