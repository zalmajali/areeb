import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AlertController, Platform} from '@ionic/angular';
import {Storage} from "@ionic/storage";
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  showFirstPage:any;
  fullNameLogin:any;
  emailLogin:any;
  public appPagesfirst = [
    { title: 'الرئيسية', url: '/home'},
    { title: 'تسجيل الدخول', url: '/login'},
    { title: 'إنشاء حساب', url: '/registration'},
    { title: 'تواصل معنا', url: '/connectus'},
    { title: 'حول التطبيق', url: '/about'},
  ];
  public appPagesLast = [
    { title: 'الرئيسية', url: '/home'},
    { title: 'حسابي', url: '/account' },
    { title: 'مفضلتي', url: '/favouritestores' },
    { title: 'طلباتي', url: '/orders' },
    { title: 'تواصل معنا', url: '/connectus' },
    { title: 'حول التطبيق', url: '/about'},
    { title: 'تسجيل الخروج', url: ''},
  ];
  appPages:any;
  constructor(private alertController:AlertController,private statusBar:StatusBar,private router : Router,private platform : Platform,private storage: Storage,private sqlite: SQLite) {
    this.platform.ready().then(() => {

// set status bar to white
     this.statusBar.backgroundColorByHexString('#f9475c');
   this.storage.remove('showBanner');
     this.storage.remove('saveDataHome');
      this.storage.remove('selectedStoreVal');
      this.storage.remove('subCatStoreSelected');
      this.storage.remove('storeRegion');
      this.storage.remove('lastAllStoresSortSelect');
      this.storage.remove('homeCategories');
      this.storage.remove('selectedFavVal');
      this.storage.remove('subCatFavSelected');
      this.storage.remove('favRegion');
      this.storage.remove('lastAllFavSortSelect');
      this.storage.remove('typeShow');
      this.storage.remove('selectedSearchVal');
      this.storage.remove('subCatSearchSelected');
      this.storage.remove('searchRegion');
      this.storage.remove('lastAllSearchSortSelect');
       this.storage.remove('orderNumber');
       this.storage.remove('productName');
       this.storage.remove('storeName');
       this.storage.remove('priceFrom');
       this.storage.remove('priceTo');
       this.storage.remove('fromDate');
       this.storage.remove('toDate');
       this.storage.remove('status');
       this.storage.remove('selectValues');
      this.storage.remove('allStoresShow');
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DROP TABLE IF EXISTS categories_home')
          .then(() => {})
          .catch(e => {});
      }).catch(e => {});

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DROP TABLE IF EXISTS products_stores_home')
          .then(() => {})
          .catch(e => {});
      }).catch(e => {});
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DROP TABLE IF EXISTS products_home')
          .then(() => {})
          .catch(e => {});
      }).catch(e => {});
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DROP TABLE IF EXISTS sub_categories_home')
          .then(() => {})
          .catch(e => {});
      }).catch(e => {});
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DROP TABLE IF EXISTS offers')
          .then(() => {})
          .catch(e => {});
      }).catch(e => {});
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DROP TABLE IF EXISTS categories')
          .then(() => {})
          .catch(e => {});
      }).catch(e => {});
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DROP TABLE IF EXISTS stores')
          .then(() => {})
          .catch(e => {});
      }).catch(e => {});
       this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DROP TABLE IF EXISTS banners')
          .then(() => {})
          .catch(e => {});
      }).catch(e => {});
    this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DROP TABLE IF EXISTS allstores')
          .then(() => {})
          .catch(e => {});
      }).catch(e => {});
      this.sqlite.create({
      name: "arreb.db",
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('DROP TABLE IF EXISTS favouriteStores')
        .then(() => {})
        .catch(e => {});
    }).catch(e => {});

    this.sqlite.create({
      name: "arreb.db",
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('DROP TABLE IF EXISTS searchStores')
        .then(() => {})
        .catch(e => {});
    }).catch(e => {});
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DROP TABLE IF EXISTS products')
          .then(() => {})
          .catch(e => {});
      }).catch(e => {});
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DROP TABLE IF EXISTS productsFields')
          .then(() => {})
          .catch(e => {});
      }).catch(e => {});
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DROP TABLE IF EXISTS branches')
          .then(() => {})
          .catch(e => {});
      }).catch(e => {});
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DROP TABLE IF EXISTS storesCategories')
          .then(() => {})
          .catch(e => {});
      }).catch(e => {});
     this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DROP TABLE IF EXISTS subCategories')
          .then(() => {})
          .catch(e => {});
      }).catch(e => {});

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DROP TABLE IF EXISTS categoriesAdditions')
          .then(() => {})
          .catch(e => {});
      }).catch(e => {});

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DROP TABLE IF EXISTS categoriesAdditionsOffer')
          .then(() => {})
          .catch(e => {});
      }).catch(e => {});

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DROP TABLE IF EXISTS additionsPro')
          .then(() => {})
          .catch(e => {});
      }).catch(e => {});
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DROP TABLE IF EXISTS optionsPro')
          .then(() => {})
          .catch(e => {});
      }).catch(e => {});
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DROP TABLE IF EXISTS ingredientsPro')
          .then(() => {})
          .catch(e => {});
      }).catch(e => {});

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DROP TABLE IF EXISTS additionsOffer')
          .then(() => {})
          .catch(e => {});
      }).catch(e => {});
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DROP TABLE IF EXISTS optionsOffer')
          .then(() => {})
          .catch(e => {});
      }).catch(e => {});
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DROP TABLE IF EXISTS ingredientsOffer')
          .then(() => {})
          .catch(e => {});
      }).catch(e => {});
      this.goToPageHome();
    });
  }
  async goToPageHome(){
    this.showFirstPage = await this.storage.get('showFirstPage');
    if(this.showFirstPage==1)
      this.router.navigateByUrl('home');
    else
      this.router.navigateByUrl('first');
  }
  async signOut(){
    const alert = await this.alertController.create({
      cssClass: 'alertBac',
      mode: 'ios',
      message: '! هل انت متأكد',
      buttons: [
        {
          text: 'لا',
          cssClass: 'alertButton',
          handler: () => {
          }
        }, {
          text: 'نعم',
          cssClass: 'alertButton',
          handler: () => {
            this.storage.remove('fullNameLogin');
            this.storage.remove('emailLogin');
            this.router.navigateByUrl('home');
          }
        }
      ]
    });
    await alert.present();
  }
}
