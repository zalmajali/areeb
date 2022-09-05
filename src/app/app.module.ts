import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
//pacges for app
import {HttpClientModule} from "@angular/common/http";
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { SignInWithApple} from '@ionic-native/sign-in-with-apple/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
//services for app
import {UsersService} from "./services/users.service";
import {StoresService} from "./services/stores.service";
import {CategoriesService} from "./services/categories.service";
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(), AppRoutingModule,
    HttpClientModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy},StatusBar,Network,UsersService,SQLite,GooglePlus,CategoriesService,StoresService,Facebook,SignInWithApple,Geolocation,LaunchNavigator,CallNumber
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
