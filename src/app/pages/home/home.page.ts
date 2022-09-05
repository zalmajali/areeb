import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import {MenuController, Platform, NavController, IonSlides, ModalController, ToastController,IonInput} from '@ionic/angular';
import {Storage} from "@ionic/storage";
import {CategoriesService} from "../../services/categories.service";
import { Network } from '@ionic-native/network/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import {ActivatedRoute, Router} from '@angular/router';
import {StoresService} from "../../services/stores.service";
import {BannarComponent} from "../bannar/bannar.component";
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('slidesOffersHome',{static:false}) slides:IonSlides;
  @ViewChild('slidesBanners',{static:false}) slidesBanners:IonSlides;
  @ViewChild('searchInput', {static:true}) searchInput:IonInput;
  @ViewChild('productsSlidHome',{static:false}) productsSlidHome:IonSlides;
  @ViewChild('productsStoreSlidHome',{static:false}) productsStoreSlidHome:IonSlides;
  categoriesHome:any=0;
  offersHome:any=0;
  categories:any=0;
  storesHome:any=0;
  storesFore:any=0;
  productsStoreHome:any=0;
  productsHome:any=0;
  message:any;
  categoriesHomeSkeleton:boolean = true;
  offersHomeSkeleton:boolean = true;
  categoriesSkeleton:boolean = true;
  storesHomeSkeleton:boolean = true;
  storesForeSkeleton:boolean = true;
  bannersHomeSkeleton:boolean = true;

  productsStoreHomeSkeleton:boolean = true;
  productsHomeSkeleton:boolean = true;
  returnSubCatSpeData:any;
  subCatSpe:any=0;
  subCatSpeSkeleton:boolean = true;
  returnArraySubCatSpeFromServer:any
  returnSubCatSpeArray:any=[];
  saveDataHomeLabel:any;
  operationResult:any;

  returnCatHomeData:any;
  returnArrayCatHomeFromServer:any;

  returnOffersHomeData:any;
  returnArrayOffersHomeFromServer:any;

  returnCategoriesData:any;
  returnArrayCategoriesFromServer:any;
  returnStoresHomeData:any;
  returnArrayStoresHomeFromServer:any;
  returnStoresForeData:any;
  returnArrayStoresForeFromServer:any;
  returnArraySubCatFromServer:any;
  returnCategoriesHomeArray:any = [];
  returnOffersHomeArray:any = [];
  returnCategoriesArray:any = [];
  returnStoresHomeArray:any = [];
  returnStoresForeArray:any = [];
  returnRegionsData:any;
  returnArrayRegionsFromServer:any;
  returnRegionsArray:any = [];
  returnProductsHomeData:any;
  returnArrayProductsHomeFromServer:any;
  returnProductsHomeArray:any = [];
  returnProductsFieldsData:any;
  returnArrayProductsFieldsFromServer:any;
  returnProductsFieldsArray:any = [];
  operationResultProductsFields:any;
  returnProductsStoreHomeData:any;
  returnArrayProductsStoreHomeFromServer:any;
  returnProductsStoreHomeArray:any = [];

  returnOffers30Data:any;
  returnArrayOffers30FromServer:any = [];
  returnOffers30Array:any = [];

  returnStores30Data:any;
  returnArrayStores30FromServer:any;
  returnArrayAllFavFromServer:any;
  returnAllFavData:any;
  userId:any;
  returnAdditionsData:any;
  returnArrayAdditionsFromServer:any
  returnArraySubAdditionsFromServer:any = [];
  returnOptionsData:any;
  returnArrayOptionsFromServer:any
  returnArraySubOptionsFromServer:any = [];
  returnIngredientsData:any;
  returnArrayIngredientsFromServer:any;

  banners:any
  returnBannersHomeArray:any = [];
  returnArrayBannersHomeFromServer:any;
  returnBannersHomeData:any;

  closeStore:any=0;
  searchValues:any;
  showBanner:any;
  fullNameLogin:any;
  emailLogin:any;
  productInShopingCart:any;
  returnRateData:any;
  orderImage:any=0;
  productsStoreSkeleton:boolean = true;
  shoppingCart:any=0;
  storeNameOfProSt:any;
  catNameOfProSt:any;
  constructor(private toastCtrl: ToastController,private modalController: ModalController,private router : Router,private sqlite: SQLite,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private categoriesService:CategoriesService,private storesService:StoresService) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','home');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
  }

  slidesDidLoad(){
    this.slides.startAutoplay();
  }
  slidesBannersLoad(){
    this.slidesBanners.startAutoplay();
  }
  productsSlidHomeLoad(){
    this.productsSlidHome.startAutoplay();
  }
  productsStoreSlidHomeLoad(){
    this.productsStoreSlidHome.startAutoplay();
  }

  async ngOnInit() {
    this.storage.remove('selectedStoreVal');
    this.storage.remove('subCatStoreSelected');
    this.storage.remove('storeRegion');
    this.storage.remove('lastAllStoresSortSelect');
    this.storage.remove('homeCategories');
   this.userId = await  this.storage.get('userId');
   if(this.userId!=null && this.userId !=undefined && this.userId!=0 && this.userId!=""){
     this.storesService.ordersStat(this.userId).then(data=>{
       this.returnRateData = data;
       this.operationResult = this.returnRateData.Error.ErrorCode;
       if(this.operationResult == 1){
         this.orderImage = this.returnRateData.Data.image;
         this.shoppingCart = 1;
       }else{
         this.shoppingCart = 0;
       }
     }).catch(e=>{
       this.shoppingCart = 0;
     })
     setTimeout(()=>{
       this.productsStoreSkeleton = false
     },2000);
   }
    this.storage.get('productInShopingCart').then(productInShopingCart=>{
      this.productInShopingCart = productInShopingCart;
      if(productInShopingCart==null || productInShopingCart=="" ||  productInShopingCart==0 )
        this.productInShopingCart = 0;
    });
    this.categoriesService.bannerSp().then(async data=>{
      this.returnBannersHomeData = data;
      this.operationResult = this.returnBannersHomeData.Error.ErrorCode;
      if(this.operationResult==1){
        this.showBanner = await this.storage.get('showBanner');
        if(this.showBanner!=1){
          await this.storage.set('showBanner', '1');
          let model = await this.modalController.create({
            component:BannarComponent,
            animated:true,
            cssClass:"modalFilterSortCss"
          });
          await model.present();
        }
      }
    });
    await this.storage.set('homeCategories', '0');
    await this.storage.set('internetBack','1');
    this.categoriesHomeSkeleton = true;
    this.offersHomeSkeleton = true;
    this.categoriesSkeleton = true;
    this.storesHomeSkeleton = true;
    this.storesForeSkeleton = true;
    this.bannersHomeSkeleton = true;
    this.saveDataHomeLabel = await this.storage.get('saveDataHome');
    this.sqlite.create({
      name: "arreb.db",
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS subCategories (id INT(11) UNIQUE ,title VARCHAR(255),catId INT(11))', [])
        .then(() => console.log())
        .catch(e => console.log());
    }).catch(e => console.log());
    this.categoriesService.subCat(0).then(data=>{
      this.returnCatHomeData = data;
      this.operationResult = this.returnCatHomeData.Error.ErrorCode;
      if(this.operationResult==1){
        this.returnArraySubCatFromServer = this.returnCatHomeData.Data.categories;
        for(let i = 0; i < this.returnArraySubCatFromServer.length;i++) {
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql(`INSERT OR REPLACE INTO subCategories (id,title,catId) VALUES ('${this.returnArraySubCatFromServer[i].id}','${this.returnArraySubCatFromServer[i].title}','${this.returnArraySubCatFromServer[i].catId}')`, [])
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
        }
      }
    });
    if(this.saveDataHomeLabel==1){
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(`select * FROM products_stores_home`, [])
          .then(async (resNew) =>{
            for(let i = 0; i < resNew.rows.length;i++){
              this.returnProductsStoreHomeArray[i]=[];
              this.returnProductsStoreHomeArray[i]['id'] = resNew.rows.item(i).id;
              this.returnProductsStoreHomeArray[i]['storeId'] = resNew.rows.item(i).store_id;
              this.returnProductsStoreHomeArray[i]['image'] = resNew.rows.item(i).image;
              this.returnProductsStoreHomeArray[i]['title'] = resNew.rows.item(i).title;
              this.returnProductsStoreHomeArray[i]['offerPrice'] = resNew.rows.item(i).offerPrice;
              this.returnProductsStoreHomeArray[i]['price'] = resNew.rows.item(i).price;
              this.returnProductsStoreHomeArray[i]['smallImageTow'] = resNew.rows.item(i).smallImageTow;
              alert(this.returnProductsStoreHomeArray[i]['smallImageTow'])
              if(this.returnProductsStoreHomeArray[i]['image'] == null || this.returnProductsStoreHomeArray[i]['image'] == undefined || this.returnProductsStoreHomeArray[i]['image']=="" || this.returnProductsStoreHomeArray[i]['image']==0)
                this.returnProductsStoreHomeArray[i]['image'] = "../../assets/imgs/def6.png";
            }
            await this.storesService.storeCountVal(this.returnProductsStoreHomeArray[0]['storeId']).then(async data=>{
              this.returnRateData = data;
              this.storeNameOfProSt = await this.returnRateData.Data.name;
            })
            let countOfData = this.returnProductsStoreHomeArray.length;
            if(countOfData == 0)
              this.productsStoreHome = 0;
            else{
              this.productsStoreHome = 1;
            }
            setTimeout(()=>{
              this.productsStoreHomeSkeleton = false
            },2000);
          }).catch(e => {});
      }).catch(e => {});
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(`select * FROM subCategoriesSpe`, [])
          .then(async (resNew) =>{
            for(let i = 0; i < resNew.rows.length;i++){
              this.returnSubCatSpeArray[i]=[];
              this.returnSubCatSpeArray[i]['id'] = resNew.rows.item(i).id;
              this.returnSubCatSpeArray[i]['title'] = resNew.rows.item(i).title;
              this.returnSubCatSpeArray[i]['image'] = resNew.rows.item(i).image;
              this.returnSubCatSpeArray[i]['catId'] = resNew.rows.item(i).catId;
              if(this.returnSubCatSpeArray[i]['image'] == null || this.returnSubCatSpeArray[i]['image'] == undefined || this.returnSubCatSpeArray[i]['image']=="" || this.returnSubCatSpeArray[i]['image']==0)
                this.returnSubCatSpeArray[i]['image'] = "../../assets/imgs/def5.png";
            }
            await this.categoriesService.catName(this.returnSubCatSpeArray[0]['catId']).then(async data=>{
              this.returnRateData = data;
              this.catNameOfProSt = await this.returnRateData.Data.name;
            })
            let countOfData = this.returnSubCatSpeArray.length;
            if(countOfData == 0)
              this.subCatSpe = 0;
            else{
              this.subCatSpe = 1;
            }
            setTimeout(()=>{
              this.subCatSpeSkeleton = false
            },2000);
          }).catch(e => {});
      }).catch(e => {});
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(`select * FROM products_home`, [])
          .then((resNew) =>{
            for(let i = 0; i < resNew.rows.length;i++){
              this.returnProductsHomeArray[i]=[];
              this.returnProductsHomeArray[i]['id'] = resNew.rows.item(i).id;
              this.returnProductsHomeArray[i]['storeId'] = resNew.rows.item(i).store_id;
              this.returnProductsHomeArray[i]['image'] = resNew.rows.item(i).image;
              this.returnProductsHomeArray[i]['title'] = resNew.rows.item(i).title;
              this.returnProductsHomeArray[i]['offerPrice'] = resNew.rows.item(i).offerPrice;
              this.returnProductsHomeArray[i]['price'] = resNew.rows.item(i).price;
              this.returnProductsHomeArray[i]['smallImageTow'] = resNew.rows.item(i).smallImageTow;
              if(this.returnProductsHomeArray[i]['image'] == null || this.returnProductsHomeArray[i]['image'] == undefined || this.returnProductsHomeArray[i]['image']=="" || this.returnProductsHomeArray[i]['image']==0)
                this.returnProductsHomeArray[i]['image'] = "../../assets/imgs/def4.png";
            }
            let countOfData = this.returnProductsHomeArray.length;
            if(countOfData == 0)
              this.productsHome = 0;
            else{
              this.productsHome = 1;
            }
            setTimeout(()=>{
              this.productsHomeSkeleton = false
            },2000);
          }).catch(e => {});
      }).catch(e => {});
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(`select * FROM categories_home`, [])
          .then((resNew) =>{
            for(let i = 0; i < resNew.rows.length;i++){
              this.returnCategoriesHomeArray[i]=[];
              this.returnCategoriesHomeArray[i]['id'] = resNew.rows.item(i).id;
              this.returnCategoriesHomeArray[i]['title'] = resNew.rows.item(i).title;
              this.returnCategoriesHomeArray[i]['image'] = resNew.rows.item(i).image;
              if(this.returnCategoriesHomeArray[i]['image'] == null || this.returnCategoriesHomeArray[i]['image'] == undefined || this.returnCategoriesHomeArray[i]['image']=="" || this.returnCategoriesHomeArray[i]['image']==0)
                this.returnCategoriesHomeArray[i]['image'] = "../../assets/imgs/def4.png";
            }
            let countOfData = this.returnCategoriesHomeArray.length;
            if(countOfData == 0)
              this.categoriesHome = 0;
            else{
              this.categoriesHome = 1;
            }
            setTimeout(()=>{
              this.categoriesHomeSkeleton = false
            },2000);
          }).catch(e => {});
      }).catch(e => {});

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(`select * FROM offers WHERE isOfferHome=?`, [1])
          .then((resNew) =>{
            for(let i = 0; i < resNew.rows.length;i++){
              this.returnOffersHomeArray[i]=[];
              this.returnOffersHomeArray[i]['id'] = resNew.rows.item(i).id;
              this.returnOffersHomeArray[i]['storeId'] = resNew.rows.item(i).storeId;
              this.returnOffersHomeArray[i]['title'] = resNew.rows.item(i).title;
              this.returnOffersHomeArray[i]['description'] = resNew.rows.item(i).description;
              this.returnOffersHomeArray[i]['image'] = resNew.rows.item(i).image;
              if(this.returnOffersHomeArray[i]['image'] == null || this.returnOffersHomeArray[i]['image'] == undefined || this.returnOffersHomeArray[i]['image']=="" || this.returnOffersHomeArray[i]['image']==0)
                this.returnOffersHomeArray[i]['image'] = "../../assets/imgs/def3.png";
              this.returnOffersHomeArray[i]['type'] = resNew.rows.item(i).type;
            }
            let countOfData = this.returnOffersHomeArray.length;
            if(countOfData == 0)
              this.offersHome = 0;
            else{
              this.offersHome = 1;
            }
            setTimeout(()=>{
              this.offersHomeSkeleton = false
            },2000);
          }).catch(e => {});
      }).catch(e => {});

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(`select * FROM banners`, [])
          .then((resNew) =>{
            for(let i = 0; i < resNew.rows.length;i++){
              this.returnBannersHomeArray[i]=[];
              this.returnBannersHomeArray[i]['id'] = resNew.rows.item(i).id;
              this.returnBannersHomeArray[i]['image'] = resNew.rows.item(i).image;
            }
            let countOfData = this.returnBannersHomeArray.length;
            if(countOfData == 0)
              this.banners = 0;
            else{
              this.banners = 1;
            }
            setTimeout(()=>{
              this.bannersHomeSkeleton = false
            },2000);
          }).catch(e => {});
      }).catch(e => {});
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(`select * FROM categories`, [])
          .then((resNew) =>{
            for(let i = 0; i < resNew.rows.length;i++){
              this.returnCategoriesArray[i]=[];
              this.returnCategoriesArray[i]['id'] = resNew.rows.item(i).id;
              this.returnCategoriesArray[i]['title'] = resNew.rows.item(i).title;
              this.returnCategoriesArray[i]['image'] = resNew.rows.item(i).image;
              if(this.returnCategoriesArray[i]['image'] == null || this.returnCategoriesArray[i]['image'] == undefined || this.returnCategoriesArray[i]['image']=="" || this.returnCategoriesArray[i]['image']==0)
                this.returnCategoriesArray[i]['image'] = "../../assets/imgs/def4.png";
            }
            let countOfData = this.returnCategoriesArray.length;
            if(countOfData == 0)
              this.categories = 0;
            else{
              this.categories = 1;
              setTimeout(()=>{
                this.categoriesSkeleton = false
              },2000);
            }
          }).catch(e => {});
      }).catch(e => {});
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(`select * FROM stores WHERE special=?`, [1])
          .then((resNew) =>{
            for(let i = 0; i < resNew.rows.length;i++){
              this.returnStoresHomeArray[i]=[];
              this.returnStoresHomeArray[i]['id'] =  resNew.rows.item(i).id;
              this.returnStoresHomeArray[i]['title'] =  resNew.rows.item(i).title;
              this.returnStoresHomeArray[i]['rate'] = resNew.rows.item(i).rate;
              this.returnStoresHomeArray[i]['categorie'] = resNew.rows.item(i).catName;
              this.returnStoresHomeArray[i]['subCategories'] = resNew.rows.item(i).subCatName;
              this.returnStoresHomeArray[i]['image'] = resNew.rows.item(i).image;
              if(this.returnStoresHomeArray[i]['image'] == null || this.returnStoresHomeArray[i]['image'] == undefined || this.returnStoresHomeArray[i]['image']=="" || this.returnStoresHomeArray[i]['image']==0)
                this.returnStoresHomeArray[i]['image'] = "../../assets/imgs/def5.png";
              this.returnStoresHomeArray[i]['storeImage'] = resNew.rows.item(i).storeImage;
              if(this.returnStoresHomeArray[i]['storeImage']  == null || this.returnStoresHomeArray[i]['storeImage']  == undefined || this.returnStoresHomeArray[i]['storeImage'] =="" || this.returnStoresHomeArray[i]['storeImage'] ==0)
                this.returnStoresHomeArray[i]['storeImage']  = "../../assets/imgs/def3.png";
              this.returnStoresHomeArray[i]['countRate'] = resNew.rows.item(i).countRate;
              if(resNew.rows.item(i).countRate > 1000){
                let val = Math.floor(resNew.rows.item(i).countRate/1000);
                this.returnStoresHomeArray[i]['countRate'] = val+"K";
              }
              let Y = new Date().getFullYear();
              let m = new Date().getMonth();
              let d = new Date().getDate();
              let h = new Date().getHours();
              let min = new Date().getMinutes();
              let devicTime = new Date(Y, m, d, h, min);
              let devicTimeStamp = devicTime.getTime();
              let startTime  = resNew.rows.item(i).startTime.split(':');
              let endTime  = resNew.rows.item(i).endTime.split(':');
              let YStart = new Date().getFullYear();
              let mStart = new Date().getMonth();
              let dStart = new Date().getDate();
              let hStart = startTime[0];
              let minStart = startTime[1];
              let sroreStartTime = new Date(YStart, mStart, dStart, hStart, minStart);
              let sroreStartTimeStamp = sroreStartTime.getTime();
              let YEnd = new Date().getFullYear();
              let mEnd = new Date().getMonth();
              let dEnd = new Date().getDate();
              let hEnd = endTime[0];
              let minEnd = endTime[1];
              let sroreEndTime = new Date(YEnd, mEnd, dEnd, hEnd, minEnd);
              let sroreEndTimeStamp = sroreEndTime.getTime();
              let closeStore = resNew.rows.item(i).closeStore
              let closeStoreByCat = resNew.rows.item(i).closeStoreByCat
              let closeAllStores = resNew.rows.item(i).closeAllStores;
              this.returnStoresHomeArray[i]['closeStore'] = 0;
              if(closeStore == 1 || closeStoreByCat == 1 || closeAllStores == 1){
                this.returnStoresHomeArray[i]['closeStore'] = 1;
              }else{
                if(devicTimeStamp < sroreStartTimeStamp || devicTimeStamp > sroreEndTimeStamp)
                  this.returnStoresHomeArray[i]['closeStore'] = 1;
              }
            }
            let countOfData = this.returnStoresHomeArray.length;
            if(countOfData == 0)
              this.storesHome = 0;
            else{
              this.storesHome = 1;
            }
            setTimeout(()=>{
              this.storesHomeSkeleton = false
            },2000);
          }).catch(e => {});
      }).catch(e => {});
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(`select * FROM stores WHERE four=?`, [1])
          .then((resNew) =>{
            for(let i = 0; i < resNew.rows.length;i++){
              this.returnStoresForeArray[i]=[];
              this.returnStoresForeArray[i]['id'] =  resNew.rows.item(i).id;
              this.returnStoresForeArray[i]['title'] =  resNew.rows.item(i).title;
              this.returnStoresForeArray[i]['rate'] = resNew.rows.item(i).rate;
              this.returnStoresForeArray[i]['categorie'] = resNew.rows.item(i).catName;
              this.returnStoresForeArray[i]['subCategories'] = resNew.rows.item(i).subCatName;
              this.returnStoresForeArray[i]['image'] = resNew.rows.item(i).image;
              if(this.returnStoresForeArray[i]['image'] == null || this.returnStoresForeArray[i]['image'] == undefined || this.returnStoresForeArray[i]['image']=="" || this.returnStoresForeArray[i]['image']==0)
                this.returnStoresForeArray[i]['image'] = "../../assets/imgs/def5.png";
              this.returnStoresForeArray[i]['storeImage'] = resNew.rows.item(i).storeImage;
              if(this.returnStoresForeArray[i]['storeImage'] == null || this.returnStoresForeArray[i]['storeImage'] == undefined || this.returnStoresForeArray[i]['storeImage']=="" || this.returnStoresForeArray[i]['storeImage']==0)
                this.returnStoresForeArray[i]['image'] = "../../assets/imgs/def3.png";
              this.returnStoresForeArray[i]['countRate'] = resNew.rows.item(i).countRate;
              if(resNew.rows.item(i).countRate > 1000){
                let val = Math.floor(resNew.rows.item(i).countRate/1000);
                this.returnStoresForeArray[i]['countRate'] = val+"K";
              }
              let Y = new Date().getFullYear();
              let m = new Date().getMonth();
              let d = new Date().getDate();
              let h = new Date().getHours();
              let min = new Date().getMinutes();
              let devicTime = new Date(Y, m, d, h, min);
              let devicTimeStamp = devicTime.getTime();
              let startTime  = resNew.rows.item(i).startTime.split(':');
              let endTime  = resNew.rows.item(i).endTime.split(':');
              let YStart = new Date().getFullYear();
              let mStart = new Date().getMonth();
              let dStart = new Date().getDate();
              let hStart = startTime[0];
              let minStart = startTime[1];
              let sroreStartTime = new Date(YStart, mStart, dStart, hStart, minStart);
              let sroreStartTimeStamp = sroreStartTime.getTime();
              let YEnd = new Date().getFullYear();
              let mEnd = new Date().getMonth();
              let dEnd = new Date().getDate();
              let hEnd = endTime[0];
              let minEnd = endTime[1];
              let sroreEndTime = new Date(YEnd, mEnd, dEnd, hEnd, minEnd);
              let sroreEndTimeStamp = sroreEndTime.getTime();
              let closeStore = resNew.rows.item(i).closeStore
              let closeStoreByCat = resNew.rows.item(i).closeStoreByCat
              let closeAllStores = resNew.rows.item(i).closeAllStores;
              this.returnStoresForeArray[i]['closeStore'] = 0;
              if(closeStore == 1 || closeStoreByCat == 1 || closeAllStores == 1){
                this.returnStoresForeArray[i]['closeStore'] = 1;
              }else{
                if(devicTimeStamp < sroreStartTimeStamp || devicTimeStamp > sroreEndTimeStamp)
                  this.returnStoresForeArray[i]['closeStore'] = 1;
              }
            }
            let countOfData = this.returnStoresForeArray.length;
            if(countOfData == 0)
              this.storesFore = 0;
            else{
              this.storesFore = 1;
            }
            setTimeout(()=>{
              this.storesForeSkeleton = false
            },2000);
          }).catch(e => {});
      }).catch(e => {});
    }
    else{
      await this.storage.set('saveDataHome',1);
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS sub_categories_home (id INT(11) UNIQUE,cat_id INT(11),cat_title VARCHAR(255),title VARCHAR(255),image VARCHAR(500))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS products_stores_home (id INT(11) UNIQUE,store_id INT(11),image VARCHAR(500),title VARCHAR(255),price VARCHAR(255),offerPrice VARCHAR(255),smallImageTow VARCHAR(255))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS products_home (id INT(11) UNIQUE,store_id INT(11),image VARCHAR(500),title VARCHAR(255),price VARCHAR(255),offerPrice VARCHAR(255),smallImageTow VARCHAR(255))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());



      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS categories_home (id INT(11) UNIQUE ,title VARCHAR(255),image VARCHAR(500))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS categories (id INT(11) UNIQUE ,title VARCHAR(255),image VARCHAR(255))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS offers (id INT(11) UNIQUE ,storeId INT(11),title VARCHAR(255),description TEXT NULL,price VARCHAR(255),startDate VARCHAR(255),endDate VARCHAR(255),duration VARCHAR(255),type INT(11),image VARCHAR(255),image1 VARCHAR(255),image2 VARCHAR(255),image3 VARCHAR(255),image4 VARCHAR(255),isOfferHome INT(11))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS banners (id INT(11) UNIQUE,image VARCHAR(255))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS storesCart (id INT(11) UNIQUE ,storeName VARCHAR(255),allPrice VARCHAR(255),deliveryTime VARCHAR(255),deliveryPrices VARCHAR(255),deliveryAnotherTime VARCHAR(255),deliveryAnotherPrice VARCHAR(255),taxPrice VARCHAR(255))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS productsCart (id INT(11),storeId INT(11) ,productName VARCHAR(255),price VARCHAR(255),additions TEXT NULL,options TEXT NULL,ingredients TEXT NULL,quantity INT(11),image VARCHAR(255),type INT(11),addFrom INT(11))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS additionsPro (id INT(11) UNIQUE ,productsId INT(11),catId INT(11),title VARCHAR(255),price VARCHAR(255))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS optionsPro (id INT(11) UNIQUE ,productsId INT(11),catId INT(11),title VARCHAR(255))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS ingredientsPro (id INT(11) UNIQUE ,productsId INT(11),title VARCHAR(255))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS categoriesAdditions (id INT(11) UNIQUE ,productsId INT(11),title VARCHAR(255),type INT(11))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS categoriesAdditionsOffer (id INT(11) UNIQUE ,productsId INT(11),title VARCHAR(255),type INT(11))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS additionsOffer (id INT(11) UNIQUE ,productsId INT(11),catId INT(11),title VARCHAR(255),price VARCHAR(255))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS optionsOffer(id INT(11) UNIQUE ,productsId INT(11),catId INT(11),title VARCHAR(255))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS ingredientsOffer (id INT(11) UNIQUE ,productsId INT(11),title VARCHAR(255))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS offersHome (id INT(11) UNIQUE ,storeId INT(11),title VARCHAR(255),description TEXT NULL,price VARCHAR(255),startDate VARCHAR(255),endDate VARCHAR(255),duration VARCHAR(255),type INT(11),image VARCHAR(255),image1 VARCHAR(255),image2 VARCHAR(255),image3 VARCHAR(255),image4 VARCHAR(255),isOfferHome INT(11))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS regions (id INT(11) UNIQUE ,title VARCHAR(255) NOT NULL)', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS stores (id INT(11) UNIQUE ,catName VARCHAR(255) NOT NULL,subCatName VARCHAR(255) NOT NULL,title VARCHAR(255) NOT NULL,image VARCHAR(500),storeImage VARCHAR(500),description TEXT NULL,latlang VARCHAR(255),locationName VARCHAR(255),regionName VARCHAR(255),mobile VARCHAR(255),rate VARCHAR(255),countRate VARCHAR(255),countLike VARCHAR(255),countDisLike VARCHAR(255),followers VARCHAR(255),deliveryPrices VARCHAR(255),deliveryTime VARCHAR(255),startTime VARCHAR(255),endTime VARCHAR(255),numberOfProducts VARCHAR(255),numberOfOffers VARCHAR(255),numberOfBranches VARCHAR(255),special INT(11),four INT(11),isFav INT(11),isLike INT(11),isDisLike INT(11),deliveryAnotherPrice VARCHAR(255),deliveryAnotherTime VARCHAR(255),taxPrice VARCHAR(255),closeStore INT(11),closeStoreByCat INT(11),closeAllStores INT(11),store_note VARCHAR(255))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS allstores (id INT(11) UNIQUE ,catName VARCHAR(255) NOT NULL,subCatName VARCHAR(255) NOT NULL,title VARCHAR(255) NOT NULL,image VARCHAR(500),storeImage VARCHAR(500),description TEXT NULL,latlang VARCHAR(255),locationName VARCHAR(255),regionName VARCHAR(255),mobile VARCHAR(255),rate VARCHAR(255),countRate VARCHAR(255),countLike VARCHAR(255),countDisLike VARCHAR(255),followers VARCHAR(255),deliveryPrices VARCHAR(255),deliveryTime VARCHAR(255),startTime VARCHAR(255),endTime VARCHAR(255),numberOfProducts VARCHAR(255),numberOfOffers VARCHAR(255),numberOfBranches VARCHAR(255),special INT(11),four INT(11),isFav INT(11),isLike INT(11),isDisLike INT(11),deliveryAnotherPrice VARCHAR(255),deliveryAnotherTime VARCHAR(255),taxPrice VARCHAR(255),closeStore INT(11),closeStoreByCat INT(11),closeAllStores INT(11),store_note VARCHAR(255))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS favouriteStores (id INT(11) UNIQUE ,catName VARCHAR(255) NOT NULL,subCatName VARCHAR(255) NOT NULL,title VARCHAR(255) NOT NULL,image VARCHAR(500),storeImage VARCHAR(500),description TEXT NULL,latlang VARCHAR(255),locationName VARCHAR(255),regionName VARCHAR(255),mobile VARCHAR(255),rate VARCHAR(255),countRate VARCHAR(255),countLike VARCHAR(255),countDisLike VARCHAR(255),followers VARCHAR(255),deliveryPrices VARCHAR(255),deliveryTime VARCHAR(255),startTime VARCHAR(255),endTime VARCHAR(255),numberOfProducts VARCHAR(255),numberOfOffers VARCHAR(255),numberOfBranches VARCHAR(255),special INT(11),four INT(11),isFav INT(11),isLike INT(11),isDisLike INT(11),deliveryAnotherPrice VARCHAR(255),deliveryAnotherTime VARCHAR(255),taxPrice VARCHAR(255),closeStore INT(11),closeStoreByCat INT(11),closeAllStores INT(11),store_note VARCHAR(255))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS searchStores (id INT(11) UNIQUE ,catName VARCHAR(255) NOT NULL,subCatName VARCHAR(255) NOT NULL,title VARCHAR(255) NOT NULL,image VARCHAR(500),storeImage VARCHAR(500),description TEXT NULL,latlang VARCHAR(255),locationName VARCHAR(255),regionName VARCHAR(255),mobile VARCHAR(255),rate VARCHAR(255),countRate VARCHAR(255),countLike VARCHAR(255),countDisLike VARCHAR(255),followers VARCHAR(255),deliveryPrices VARCHAR(255),deliveryTime VARCHAR(255),startTime VARCHAR(255),endTime VARCHAR(255),numberOfProducts VARCHAR(255),numberOfOffers VARCHAR(255),numberOfBranches VARCHAR(255),special INT(11),four INT(11),isFav INT(11),isLike INT(11),isDisLike INT(11),deliveryAnotherPrice VARCHAR(255),deliveryAnotherTime VARCHAR(255),taxPrice VARCHAR(255),closeStore INT(11),closeStoreByCat INT(11),closeAllStores INT(11),store_note VARCHAR(255))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS storesHome (id INT(11) UNIQUE ,title VARCHAR(255) NOT NULL,rate VARCHAR(255),categories VARCHAR(255) NOT NULL,subCategories VARCHAR(255) NOT NULL,image VARCHAR(500),storeImage VARCHAR(500),countRate VARCHAR(255))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS storesFore (id INT(11) UNIQUE ,title VARCHAR(255) NOT NULL,rate VARCHAR(255),categories VARCHAR(255) NOT NULL,subCategories VARCHAR(255) NOT NULL,image VARCHAR(500),storeImage VARCHAR(500),countRate VARCHAR(255))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS products (id INT(11) UNIQUE ,storeId INT(11),storesCatName VARCHAR(255),storesCatId VARCHAR(255),title VARCHAR(255),description TEXT NULL,smallDescription TEXT NULL,image VARCHAR(255),smallImage VARCHAR(255),price VARCHAR(255),offerPrice VARCHAR(255),special VARCHAR(255))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS productsFields (id INT(11) UNIQUE ,productId INT(11),title VARCHAR(255),valuesFields TEXT NULL,type VARCHAR(255))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS branches (id INT(11) UNIQUE ,storeId INT(11),title VARCHAR(255),description TEXT NULL,regionName INT(11),latlang VARCHAR(255),locationName VARCHAR(255),mobile VARCHAR(255),image VARCHAR(255))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS storesCategories (id INT(11) UNIQUE ,title VARCHAR(255),storeId INT(11))', [])
          .then(() =>{})
          .catch(e => {});
      }).catch(e => {});

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS subCategoriesSpe (id INT(11) UNIQUE ,title VARCHAR(255),catId INT(11),image VARCHAR(255))', [])
          .then(() => console.log())
          .catch(e => console.log());
      }).catch(e => console.log());
      this.categoriesService.subCatSpe().then(async data=>{
        this.returnSubCatSpeData = data;
        this.operationResult = this.returnSubCatSpeData.Error.ErrorCode;
        if(this.operationResult==1){
          this.returnArraySubCatSpeFromServer = this.returnSubCatSpeData.Data.subCategories;
          for(let i = 0; i < this.returnArraySubCatSpeFromServer.length;i++) {
            this.returnSubCatSpeArray[i]=[];
            this.returnSubCatSpeArray[i]['id'] = this.returnArraySubCatSpeFromServer[i].id;
            this.returnSubCatSpeArray[i]['title'] = this.returnArraySubCatSpeFromServer[i].title;
            this.returnSubCatSpeArray[i]['catId'] = this.returnArraySubCatSpeFromServer[i].catId;
            this.returnSubCatSpeArray[i]['image'] = this.returnArraySubCatSpeFromServer[i].image;
            if(this.returnSubCatSpeArray[i]['image'] == null || this.returnSubCatSpeArray[i]['image'] == undefined || this.returnSubCatSpeArray[i]['image']=="" || this.returnSubCatSpeArray[i]['image']==0)
              this.returnSubCatSpeArray[i]['image'] = "../../assets/imgs/def5.png";
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO subCategories (id,title,catId) VALUES ('${this.returnArraySubCatSpeFromServer[i].id}','${this.returnArraySubCatSpeFromServer[i].title}','${this.returnArraySubCatSpeFromServer[i].catId}')`, [])
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO subCategoriesSpe (id,title,catId,image) VALUES ('${this.returnArraySubCatSpeFromServer[i].id}','${this.returnArraySubCatSpeFromServer[i].title}','${this.returnArraySubCatSpeFromServer[i].catId}','${this.returnArraySubCatSpeFromServer[i].image}')`, [])
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
          }
          await this.categoriesService.catName(this.returnSubCatSpeArray[0]['catId']).then(async data=>{
            this.returnRateData = data;
            this.catNameOfProSt = await this.returnRateData.Data.name;
          })

          let countOfData = this.returnSubCatSpeArray.length;
          if(countOfData == 0)
            this.subCatSpe = 0;
          else{
            this.subCatSpe = 1;
          }
        }else
          this.subCatSpe = 0;
        setTimeout(()=>{
          this.subCatSpeSkeleton = false
        },2000);
      });
      this.storesService.productsStoreHome().then(async data=>{
        this.returnProductsStoreHomeData = data;
        this.operationResult = this.returnProductsStoreHomeData.Error.ErrorCode;
        if(this.operationResult==1){
          this.returnArrayProductsStoreHomeFromServer = this.returnProductsStoreHomeData.Data.products;
          for(let i = 0; i < this.returnArrayProductsStoreHomeFromServer.length;i++) {
            this.returnProductsStoreHomeArray[i]=[];
            this.returnProductsStoreHomeArray[i]['id'] = this.returnArrayProductsStoreHomeFromServer[i].id;
            this.returnProductsStoreHomeArray[i]['storeId'] = this.returnArrayProductsStoreHomeFromServer[i].storeId;
            this.returnProductsStoreHomeArray[i]['image'] = this.returnArrayProductsStoreHomeFromServer[i].smallImageTow;
            this.returnProductsStoreHomeArray[i]['title'] = this.returnArrayProductsStoreHomeFromServer[i].title;
            this.returnProductsStoreHomeArray[i]['offerPrice'] = this.returnArrayProductsStoreHomeFromServer[i].offerPrice;
            this.returnProductsStoreHomeArray[i]['price'] = this.returnArrayProductsStoreHomeFromServer[i].price;
            this.returnProductsStoreHomeArray[i]['smallImageTow'] = this.returnArrayProductsStoreHomeFromServer[i].smallImageTow;
            if(this.returnProductsStoreHomeArray[i]['image'] == null || this.returnProductsStoreHomeArray[i]['image'] == undefined || this.returnProductsStoreHomeArray[i]['image']=="" || this.returnProductsStoreHomeArray[i]['image']==0)
              this.returnProductsStoreHomeArray[i]['image'] = "../../assets/imgs/def6.png";
            this.storesService.additions(this.returnArrayProductsStoreHomeFromServer[i].id).then(data=>{
              this.returnAdditionsData = data;
              this.operationResult = this.returnAdditionsData.Error.ErrorCode;
              if(this.operationResult==1) {
                this.returnArrayAdditionsFromServer = this.returnAdditionsData.Data.additions;
                for (let jj = 0; jj < this.returnArrayAdditionsFromServer.length;jj++) {
                  this.sqlite.create({
                    name: "arreb.db",
                    location: 'default'
                  }).then((db: SQLiteObject) => {
                    db.executeSql(`INSERT OR REPLACE INTO categoriesAdditions (id,productsId,title,type) VALUES ('${this.returnArrayAdditionsFromServer[jj].id}','${this.returnArrayAdditionsFromServer[jj].productsId}','${this.returnArrayAdditionsFromServer[jj].catName}','${this.returnArrayAdditionsFromServer[jj].type}')`, [])
                      .then(() => {})
                      .catch(e => {});
                  }).catch(e => {});
                  this.returnArraySubAdditionsFromServer = this.returnArrayAdditionsFromServer[jj].additionsVal;
                  for (let j = 0; j < this.returnArraySubAdditionsFromServer.length; j++) {
                    this.saveDataAddtion(this.returnArraySubAdditionsFromServer[j].id,this.returnArraySubAdditionsFromServer[j].productsId,this.returnArraySubAdditionsFromServer[j].catId,this.returnArraySubAdditionsFromServer[j].title,this.returnArraySubAdditionsFromServer[j].price,0);
                  }
                }
              }
            });
            this.storesService.options(this.returnArrayProductsStoreHomeFromServer[i].id).then(data=>{
              this.returnOptionsData = data;
              this.operationResult = this.returnOptionsData.Error.ErrorCode;
              if(this.operationResult==1) {
                this.returnArrayOptionsFromServer = this.returnOptionsData.Data.options;
                for (let jj = 0; jj < this.returnArrayOptionsFromServer.length; jj++) {
                  this.sqlite.create({
                    name: "arreb.db",
                    location: 'default'
                  }).then((db: SQLiteObject) => {
                    db.executeSql(`INSERT OR REPLACE INTO categoriesAdditions (id,productsId,title,type) VALUES ('${this.returnArrayOptionsFromServer[jj].id}','${this.returnArrayOptionsFromServer[jj].productsId}','${this.returnArrayOptionsFromServer[jj].catName}','${this.returnArrayOptionsFromServer[jj].type}')`, [])
                      .then(() => {})
                      .catch(e => {});
                  }).catch(e => {});
                  this.returnArraySubOptionsFromServer = this.returnArrayOptionsFromServer[jj].options;
                  for (let j = 0; j < this.returnArraySubOptionsFromServer.length; j++) {
                    this.saveDataOptions(this.returnArraySubOptionsFromServer[j].id,this.returnArraySubOptionsFromServer[j].productsId,this.returnArraySubOptionsFromServer[j].catId,this.returnArraySubOptionsFromServer[j].title,0);

                  }
                }
              }
            });
            this.storesService.ingredients(this.returnArrayProductsStoreHomeFromServer[i].id).then(data=>{
              this.returnIngredientsData = data;
              this.operationResult = this.returnIngredientsData.Error.ErrorCode;
              if(this.operationResult==1) {
                this.returnArrayIngredientsFromServer = this.returnIngredientsData.Data.ingredients;
                for (let jj = 0; jj < this.returnArrayIngredientsFromServer.length; jj++) {
                  this.saveDataIngredients(this.returnArrayIngredientsFromServer[jj].id,this.returnArrayIngredientsFromServer[jj].productsId,this.returnArrayIngredientsFromServer[jj].title,0);
                }
              }
            });
            this.storesService.productsFields(this.returnArrayProductsStoreHomeFromServer[i].id).then(data=>{
              this.returnProductsFieldsData = data;
              this.operationResultProductsFields = this.returnProductsFieldsData.Error.ErrorCode;
              if(this.operationResultProductsFields==1){
                this.returnArrayProductsFieldsFromServer = this.returnProductsFieldsData.Data.fields;
                for(let j = 0; j < this.returnArrayProductsFieldsFromServer.length;j++) {
                  this.returnProductsFieldsArray[j]=[];
                  this.returnProductsFieldsArray[j]['productId'] = this.returnArrayProductsFieldsFromServer[j].productId;
                  this.returnProductsFieldsArray[j]['id'] = this.returnArrayProductsFieldsFromServer[j].id;
                  this.returnProductsFieldsArray[j]['title'] = this.returnArrayProductsFieldsFromServer[j].title;
                  this.returnProductsFieldsArray[j]['values'] = this.returnArrayProductsFieldsFromServer[j].values;
                  this.returnProductsFieldsArray[j]['type'] = this.returnArrayProductsFieldsFromServer[j].type;
                  this.saveDataFields(this.returnArrayProductsFieldsFromServer[j].id,this.returnArrayProductsFieldsFromServer[j].productId,this.returnArrayProductsFieldsFromServer[j].title,this.returnArrayProductsFieldsFromServer[j].values,this.returnArrayProductsFieldsFromServer[j].type)
                }
              }
            });
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO products (id,storeId,storesCatName,storesCatId,title,description,smallDescription,image,smallImage,price,offerPrice,special) VALUES ('${this.returnArrayProductsStoreHomeFromServer[i].id}','${this.returnArrayProductsStoreHomeFromServer[i].storeId}','${this.returnArrayProductsStoreHomeFromServer[i].storesCatName}','${this.returnArrayProductsStoreHomeFromServer[i].storesCatId}','${this.returnArrayProductsStoreHomeFromServer[i].title}','${this.returnArrayProductsStoreHomeFromServer[i].description}','${this.returnArrayProductsStoreHomeFromServer[i].smallDescription}','${this.returnArrayProductsStoreHomeFromServer[i].image}','${this.returnArrayProductsStoreHomeFromServer[i].smallImage}','${this.returnArrayProductsStoreHomeFromServer[i].price}','${this.returnArrayProductsStoreHomeFromServer[i].offerPrice}','${this.returnArrayProductsStoreHomeFromServer[i].special}')`, [])
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO products_stores_home (id,store_id,image,title,price,offerPrice,smallImageTow) VALUES ('${this.returnArrayProductsStoreHomeFromServer[i].id}','${this.returnArrayProductsStoreHomeFromServer[i].storeId}','${this.returnArrayProductsStoreHomeFromServer[i].smallImageTow}','${this.returnArrayProductsStoreHomeFromServer[i].title}','${this.returnArrayProductsStoreHomeFromServer[i].price}','${this.returnArrayProductsStoreHomeFromServer[i].offerPrice}','${this.returnArrayProductsStoreHomeFromServer[i].smallImageTow}')`, [])
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
          }
          await this.storesService.storeCountVal(this.returnProductsStoreHomeArray[0]['storeId']).then(async data=>{
            this.returnRateData = data;
            this.storeNameOfProSt = await this.returnRateData.Data.name;
          })
          let countOfData = this.returnProductsStoreHomeArray.length;
          if(countOfData == 0)
            this.productsStoreHome = 0;
          else{
            this.productsStoreHome = 1;
          }
        }else
          this.productsStoreHome = 0;
        setTimeout(()=>{
          this.productsStoreHomeSkeleton = false
        },2000);
      });
      this.storesService.productsHome().then(data=>{
        this.returnProductsHomeData = data;
        this.operationResult = this.returnProductsHomeData.Error.ErrorCode;
        if(this.operationResult==1){
          this.returnArrayProductsHomeFromServer = this.returnProductsHomeData.Data.products;
          for(let i = 0; i < this.returnArrayProductsHomeFromServer.length;i++) {
            this.returnProductsHomeArray[i]=[];
            this.returnProductsHomeArray[i]['id'] = this.returnArrayProductsHomeFromServer[i].id;
            this.returnProductsHomeArray[i]['storeId'] = this.returnArrayProductsHomeFromServer[i].storeId;
            this.returnProductsHomeArray[i]['image'] = this.returnArrayProductsHomeFromServer[i].image;
            this.returnProductsHomeArray[i]['title'] = this.returnArrayProductsHomeFromServer[i].title;
            this.returnProductsHomeArray[i]['offerPrice'] = this.returnArrayProductsHomeFromServer[i].offerPrice;
            this.returnProductsHomeArray[i]['price'] = this.returnArrayProductsHomeFromServer[i].price;
            this.returnProductsHomeArray[i]['smallImageTow'] = this.returnArrayProductsHomeFromServer[i].smallImageTow;
            if(this.returnProductsHomeArray[i]['image'] == null || this.returnProductsHomeArray[i]['image'] == undefined || this.returnProductsHomeArray[i]['image']=="" || this.returnProductsHomeArray[i]['image']==0)
              this.returnProductsHomeArray[i]['image'] = "../../assets/imgs/def3.png";
            this.storesService.additions(this.returnArrayProductsHomeFromServer[i].id).then(data=>{
              this.returnAdditionsData = data;
              this.operationResult = this.returnAdditionsData.Error.ErrorCode;
              if(this.operationResult==1) {
                this.returnArrayAdditionsFromServer = this.returnAdditionsData.Data.additions;
                for (let jj = 0; jj < this.returnArrayAdditionsFromServer.length;jj++) {
                  this.sqlite.create({
                    name: "arreb.db",
                    location: 'default'
                  }).then((db: SQLiteObject) => {
                    db.executeSql(`INSERT OR REPLACE INTO categoriesAdditions (id,productsId,title,type) VALUES ('${this.returnArrayAdditionsFromServer[jj].id}','${this.returnArrayAdditionsFromServer[jj].productsId}','${this.returnArrayAdditionsFromServer[jj].catName}','${this.returnArrayAdditionsFromServer[jj].type}')`, [])
                      .then(() => {})
                      .catch(e => {});
                  }).catch(e => {});
                  this.returnArraySubAdditionsFromServer = this.returnArrayAdditionsFromServer[jj].additionsVal;
                  for (let j = 0; j < this.returnArraySubAdditionsFromServer.length; j++) {
                    this.saveDataAddtion(this.returnArraySubAdditionsFromServer[j].id,this.returnArraySubAdditionsFromServer[j].productsId,this.returnArraySubAdditionsFromServer[j].catId,this.returnArraySubAdditionsFromServer[j].title,this.returnArraySubAdditionsFromServer[j].price,0);
                  }
                }
              }
            });
            this.storesService.options(this.returnArrayProductsHomeFromServer[i].id).then(data=>{
              this.returnOptionsData = data;
              this.operationResult = this.returnOptionsData.Error.ErrorCode;
              if(this.operationResult==1) {
                this.returnArrayOptionsFromServer = this.returnOptionsData.Data.options;
                for (let jj = 0; jj < this.returnArrayOptionsFromServer.length; jj++) {
                  this.sqlite.create({
                    name: "arreb.db",
                    location: 'default'
                  }).then((db: SQLiteObject) => {
                    db.executeSql(`INSERT OR REPLACE INTO categoriesAdditions (id,productsId,title,type) VALUES ('${this.returnArrayOptionsFromServer[jj].id}','${this.returnArrayOptionsFromServer[jj].productsId}','${this.returnArrayOptionsFromServer[jj].catName}','${this.returnArrayOptionsFromServer[jj].type}')`, [])
                      .then(() => {})
                      .catch(e => {});
                  }).catch(e => {});
                  this.returnArraySubOptionsFromServer = this.returnArrayOptionsFromServer[jj].options;
                  for (let j = 0; j < this.returnArraySubOptionsFromServer.length; j++) {
                    this.saveDataOptions(this.returnArraySubOptionsFromServer[j].id,this.returnArraySubOptionsFromServer[j].productsId,this.returnArraySubOptionsFromServer[j].catId,this.returnArraySubOptionsFromServer[j].title,0);

                  }
                }
              }
            });
            this.storesService.ingredients(this.returnArrayProductsHomeFromServer[i].id).then(data=>{
              this.returnIngredientsData = data;
              this.operationResult = this.returnIngredientsData.Error.ErrorCode;
              if(this.operationResult==1) {
                this.returnArrayIngredientsFromServer = this.returnIngredientsData.Data.ingredients;
                for (let jj = 0; jj < this.returnArrayIngredientsFromServer.length; jj++) {
                  this.saveDataIngredients(this.returnArrayIngredientsFromServer[jj].id,this.returnArrayIngredientsFromServer[jj].productsId,this.returnArrayIngredientsFromServer[jj].title,0);
                }
              }
            });
            this.storesService.productsFields(this.returnArrayProductsHomeFromServer[i].id).then(data=>{
              this.returnProductsFieldsData = data;
              this.operationResultProductsFields = this.returnProductsFieldsData.Error.ErrorCode;
              if(this.operationResultProductsFields==1){
                this.returnArrayProductsFieldsFromServer = this.returnProductsFieldsData.Data.fields;
                for(let j = 0; j < this.returnArrayProductsFieldsFromServer.length;j++) {
                  this.returnProductsFieldsArray[j]=[];
                  this.returnProductsFieldsArray[j]['productId'] = this.returnArrayProductsFieldsFromServer[j].productId;
                  this.returnProductsFieldsArray[j]['id'] = this.returnArrayProductsFieldsFromServer[j].id;
                  this.returnProductsFieldsArray[j]['title'] = this.returnArrayProductsFieldsFromServer[j].title;
                  this.returnProductsFieldsArray[j]['values'] = this.returnArrayProductsFieldsFromServer[j].values;
                  this.returnProductsFieldsArray[j]['type'] = this.returnArrayProductsFieldsFromServer[j].type;
                  this.saveDataFields(this.returnArrayProductsFieldsFromServer[j].id,this.returnArrayProductsFieldsFromServer[j].productId,this.returnArrayProductsFieldsFromServer[j].title,this.returnArrayProductsFieldsFromServer[j].values,this.returnArrayProductsFieldsFromServer[j].type)
                }
              }
            });

            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO products (id,storeId,storesCatName,storesCatId,title,description,smallDescription,image,smallImage,price,offerPrice,special) VALUES ('${this.returnArrayProductsHomeFromServer[i].id}','${this.returnArrayProductsHomeFromServer[i].storeId}','${this.returnArrayProductsHomeFromServer[i].storesCatName}','${this.returnArrayProductsHomeFromServer[i].storesCatId}','${this.returnArrayProductsHomeFromServer[i].title}','${this.returnArrayProductsHomeFromServer[i].description}','${this.returnArrayProductsHomeFromServer[i].smallDescription}','${this.returnArrayProductsHomeFromServer[i].image}','${this.returnArrayProductsHomeFromServer[i].smallImage}','${this.returnArrayProductsHomeFromServer[i].price}','${this.returnArrayProductsHomeFromServer[i].offerPrice}','${this.returnArrayProductsHomeFromServer[i].special}')`, [])
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});

            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO products_home (id,store_id,image,title,price,offerPrice,smallImageTow) VALUES ('${this.returnArrayProductsHomeFromServer[i].id}','${this.returnArrayProductsHomeFromServer[i].storeId}','${this.returnArrayProductsHomeFromServer[i].image}','${this.returnArrayProductsHomeFromServer[i].title}','${this.returnArrayProductsHomeFromServer[i].price}','${this.returnArrayProductsHomeFromServer[i].offerPrice}','${this.returnArrayProductsHomeFromServer[i].smallImageTow}')`, [])
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
          }
          let countOfData = this.returnProductsHomeArray.length;
          if(countOfData == 0)
            this.productsHome = 0;
          else{
            this.productsHome = 1;
          }
        }else
          this.productsHome = 0;
        setTimeout(()=>{
          this.productsHomeSkeleton = false
        },2000);
      });
      this.categoriesService.regions().then(data=>{
        this.returnRegionsData = data;
        this.operationResult = this.returnRegionsData.Error.ErrorCode;
        if(this.operationResult==1){
          this.returnArrayRegionsFromServer = this.returnRegionsData.Data.regions;
          for(let i = 0; i < this.returnArrayRegionsFromServer.length;i++) {
            this.returnRegionsArray[i]=[];
            this.returnRegionsArray[i]['id'] = this.returnArrayRegionsFromServer[i].id;
            this.returnRegionsArray[i]['title'] = this.returnArrayRegionsFromServer[i].title;
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO regions (id,title) VALUES ('${this.returnArrayRegionsFromServer[i].id}','${this.returnArrayRegionsFromServer[i].title}')`, [])
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
          }
        }
      });
      this.categoriesService.catHome().then(data=>{
        this.returnCatHomeData = data;
        this.operationResult = this.returnCatHomeData.Error.ErrorCode;
        if(this.operationResult==1){
          this.returnArrayCatHomeFromServer = this.returnCatHomeData.Data.categories;
          for(let i = 0; i < this.returnArrayCatHomeFromServer.length;i++) {
            this.returnCategoriesHomeArray[i]=[];
            this.returnCategoriesHomeArray[i]['id'] = this.returnArrayCatHomeFromServer[i].id;
            this.returnCategoriesHomeArray[i]['title'] = this.returnArrayCatHomeFromServer[i].title;
            this.returnCategoriesHomeArray[i]['image'] = this.returnArrayCatHomeFromServer[i].imageIcon;
            if(this.returnCategoriesHomeArray[i]['image'] == null || this.returnCategoriesHomeArray[i]['image'] == undefined || this.returnCategoriesHomeArray[i]['image']=="" || this.returnCategoriesHomeArray[i]['image']==0)
              this.returnCategoriesHomeArray[i]['image'] = "../../assets/imgs/def4.png";
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO categories_home (id,title,image) VALUES ('${this.returnArrayCatHomeFromServer[i].id}','${this.returnArrayCatHomeFromServer[i].title}','${this.returnArrayCatHomeFromServer[i].imageIcon}')`, [])
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
          }
          let countOfData = this.returnCategoriesHomeArray.length;
          if(countOfData == 0)
            this.categoriesHome = 0;
          else{
            this.categoriesHome = 1;
          }
        }else
          this.categoriesHome = 0;
        setTimeout(()=>{
          this.categoriesHomeSkeleton = false
        },2000);
      });
      this.categoriesService.offersfirst30().then(data=>{
        this.returnOffers30Data = data;
        this.operationResult = this.returnOffers30Data.Error.ErrorCode;
        if(this.operationResult==1) {
          this.returnArrayOffers30FromServer = this.returnOffers30Data.Data.offersHome;
          this.storage.set('countOfOffer',this.returnOffers30Data.Data.countOfData);
          for (let i = 0; i < this.returnArrayOffers30FromServer.length; i++) {
            let image = this.returnArrayOffers30FromServer[i].image;
            if(this.returnArrayOffers30FromServer[i].image== null || this.returnArrayOffers30FromServer[i].image== undefined || this.returnArrayOffers30FromServer[i].image=="" || this.returnArrayOffers30FromServer[i].image==0)
              image = "../../assets/imgs/def3.png";
            this.storesService.additions(this.returnArrayOffers30FromServer[i].id,2).then(data=>{
              this.returnAdditionsData = data;
              this.operationResult = this.returnAdditionsData.Error.ErrorCode;
              if(this.operationResult==1) {
                this.returnArrayAdditionsFromServer = this.returnAdditionsData.Data.additions;
                for (let jj = 0; jj < this.returnArrayAdditionsFromServer.length; jj++) {
                  this.sqlite.create({
                    name: "arreb.db",
                    location: 'default'
                  }).then((db: SQLiteObject) => {
                    db.executeSql(`INSERT OR REPLACE INTO categoriesAdditionsOffer (id,productsId,title,type) VALUES ('${this.returnArrayAdditionsFromServer[jj].id}','${this.returnArrayAdditionsFromServer[jj].productsId}','${this.returnArrayAdditionsFromServer[jj].catName}','${this.returnArrayAdditionsFromServer[jj].type}')`, [])
                      .then(() => {})
                      .catch(e => {});
                  }).catch(e => {});
                  this.returnArraySubAdditionsFromServer = this.returnArrayAdditionsFromServer[jj].additionsVal;
                  for (let j = 0; j < this.returnArraySubAdditionsFromServer.length; j++) {
                    this.saveDataAddtion(this.returnArraySubAdditionsFromServer[j].id,this.returnArraySubAdditionsFromServer[j].productsId,this.returnArraySubAdditionsFromServer[j].catId,this.returnArraySubAdditionsFromServer[j].title,this.returnArraySubAdditionsFromServer[j].price);
                  }
                }
              }
            });
            this.storesService.options(this.returnArrayOffers30FromServer[i].id,2).then(data=>{
              this.returnOptionsData = data;
              this.operationResult = this.returnOptionsData.Error.ErrorCode;
              if(this.operationResult==1) {
                this.returnArrayOptionsFromServer = this.returnOptionsData.Data.options;
                for (let jj = 0; jj < this.returnArrayOptionsFromServer.length; jj++) {
                  this.sqlite.create({
                    name: "arreb.db",
                    location: 'default'
                  }).then((db: SQLiteObject) => {
                    db.executeSql(`INSERT OR REPLACE INTO categoriesAdditionsOffer (id,productsId,title,type) VALUES ('${this.returnArrayOptionsFromServer[jj].id}','${this.returnArrayOptionsFromServer[jj].productsId}','${this.returnArrayOptionsFromServer[jj].catName}','${this.returnArrayOptionsFromServer[jj].type}')`, [])
                      .then(() => {})
                      .catch(e => {});
                  }).catch(e => {});
                  this.returnArraySubOptionsFromServer = this.returnArrayOptionsFromServer[jj].options;
                  for (let j = 0; j < this.returnArraySubOptionsFromServer.length; j++) {
                    this.saveDataOptions(this.returnArraySubOptionsFromServer[j].id,this.returnArraySubOptionsFromServer[j].productsId,this.returnArraySubOptionsFromServer[j].catId,this.returnArraySubOptionsFromServer[j].title);
                  }
                }
              }
            });
            this.storesService.ingredients(this.returnArrayOffers30FromServer[i].id,2).then(data=>{
              this.returnIngredientsData = data;
              this.operationResult = this.returnIngredientsData.Error.ErrorCode;
              if(this.operationResult==1) {
                this.returnArrayIngredientsFromServer = this.returnIngredientsData.Data.ingredients;
                for (let ji = 0; ji < this.returnArrayIngredientsFromServer.length; ji++) {
                  this.saveDataIngredients(this.returnArrayIngredientsFromServer[ji].id,this.returnArrayIngredientsFromServer[ji].productsId,this.returnArrayIngredientsFromServer[ji].title,1);
                }
              }
            });
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO offers (id,storeId,title,description,price,startDate,endDate,duration,type,image,image1,image2,image3,image4,isOfferHome) VALUES ('${this.returnArrayOffers30FromServer[i].id}','${this.returnArrayOffers30FromServer[i].storeId}','${this.returnArrayOffers30FromServer[i].title}','${this.returnArrayOffers30FromServer[i].description}','${this.returnArrayOffers30FromServer[i].price}','${this.returnArrayOffers30FromServer[i].startDate}','${this.returnArrayOffers30FromServer[i].endDate}','${this.returnArrayOffers30FromServer[i].duration}','${this.returnArrayOffers30FromServer[i].type}','${image}','${this.returnArrayOffers30FromServer[i].image1}','${this.returnArrayOffers30FromServer[i].image2}','${this.returnArrayOffers30FromServer[i].image3}','${this.returnArrayOffers30FromServer[i].image4}','1')`, [])
                .then(() => {
                })
                .catch(e => {
                });
            }).catch(e => {
            });
          }
        }else{
          this.storage.set('countOfOffer','0');
        }
      });
      this.storesService.storesfirst30().then(data=>{
        this.returnStores30Data = data;
        this.operationResult = this.returnStores30Data.Error.ErrorCode;
        if(this.operationResult==1) {
          this.returnArrayStores30FromServer = this.returnStores30Data.Data.stores;
          this.storage.set('countOfStores',this.returnStores30Data.Data.countOfData);
          for (let i = 0; i < this.returnArrayStores30FromServer.length; i++) {
            let imageStore= this.returnArrayStores30FromServer[i].image;
            if(this.returnArrayStores30FromServer[i].image == null || this.returnArrayStores30FromServer[i].image == undefined || this.returnArrayStores30FromServer[i].image=="" || this.returnArrayStores30FromServer[i].image==0)
              imageStore = "../../assets/imgs/def5.png";
            let imageStoreLarg = this.returnArrayStores30FromServer[i].storeImage;
            if(this.returnArrayStores30FromServer[i].storeImage == null || this.returnArrayStores30FromServer[i].storeImage  == undefined || this.returnArrayStores30FromServer[i].storeImage=="" || this.returnArrayStores30FromServer[i].storeImage ==0)
              imageStoreLarg  = "../../assets/imgs/def3.png";
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO stores (id,catName,subCatName,title,image,storeImage,description,latlang,locationName,regionName,mobile,rate,countRate,countLike,countDisLike,followers,deliveryPrices,deliveryTime,startTime,endTime,numberOfProducts,numberOfOffers,numberOfBranches,special,four,isFav,isLike,isDisLike,deliveryAnotherPrice,deliveryAnotherTime,taxPrice,closeStore,closeStoreByCat,closeAllStores,store_note)
                VALUES ('${this.returnArrayStores30FromServer[i].id}','${this.returnArrayStores30FromServer[i].catName}'
                ,'${this.returnArrayStores30FromServer[i].subCatName}','${this.returnArrayStores30FromServer[i].title}'
                ,'${imageStore}','${imageStoreLarg}','${this.returnArrayStores30FromServer[i].description}'
                ,'${this.returnArrayStores30FromServer[i].latlang}','${this.returnArrayStores30FromServer[i].locationName}'
                ,'${this.returnArrayStores30FromServer[i].regionName}','${this.returnArrayStores30FromServer[i].mobile}'
                ,'${this.returnArrayStores30FromServer[i].rate}','${this.returnArrayStores30FromServer[i].countRate}'
                ,'${this.returnArrayStores30FromServer[i].countLike}','${this.returnArrayStores30FromServer[i].countDisLike}'
                ,'${this.returnArrayStores30FromServer[i].followers}','${this.returnArrayStores30FromServer[i].deliveryPrices}'
                ,'${this.returnArrayStores30FromServer[i].deliveryTime}','${this.returnArrayStores30FromServer[i].startTime}'
                ,'${this.returnArrayStores30FromServer[i].endTime}','${this.returnArrayStores30FromServer[i].numberOfProducts}'
                ,'${this.returnArrayStores30FromServer[i].numberOfOffers}','${this.returnArrayStores30FromServer[i].numberOfBranches}'
                ,'${this.returnArrayStores30FromServer[i].special}','${this.returnArrayStores30FromServer[i].four}','${this.returnArrayStores30FromServer[i].isFav}','${this.returnArrayStores30FromServer[i].isLike}'
                ,'${this.returnArrayStores30FromServer[i].isDisLike}'
                ,'${this.returnArrayStores30FromServer[i].deliveryAnotherPrice}'
                ,'${this.returnArrayStores30FromServer[i].deliveryAnotherTime}'
                ,'${this.returnArrayStores30FromServer[i].taxPrice}'
                ,'${this.returnArrayStores30FromServer[i].closeStore}'
                ,'${this.returnArrayStores30FromServer[i].closeStoreByCat}'
                ,'${this.returnArrayStores30FromServer[i].closeAllStores}'
                ,'${this.returnArrayStores30FromServer[i].storeNote}'
                )`, [])
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO allstores (id,catName,subCatName,title,image,storeImage,description,latlang,locationName,regionName,mobile,rate,countRate,countLike,countDisLike,followers,deliveryPrices,deliveryTime,startTime,endTime,numberOfProducts,numberOfOffers,numberOfBranches,special,four,isFav,isLike,isDisLike,deliveryAnotherPrice,deliveryAnotherTime,taxPrice,closeStore,closeStoreByCat,closeAllStores,store_note)
                VALUES ('${this.returnArrayStores30FromServer[i].id}','${this.returnArrayStores30FromServer[i].catName}'
                ,'${this.returnArrayStores30FromServer[i].subCatName}','${this.returnArrayStores30FromServer[i].title}'
                ,'${imageStore}','${imageStoreLarg}','${this.returnArrayStores30FromServer[i].description}'
                ,'${this.returnArrayStores30FromServer[i].latlang}','${this.returnArrayStores30FromServer[i].locationName}'
                ,'${this.returnArrayStores30FromServer[i].regionName}','${this.returnArrayStores30FromServer[i].mobile}'
                ,'${this.returnArrayStores30FromServer[i].rate}','${this.returnArrayStores30FromServer[i].countRate}'
                ,'${this.returnArrayStores30FromServer[i].countLike}','${this.returnArrayStores30FromServer[i].countDisLike}'
                ,'${this.returnArrayStores30FromServer[i].followers}','${this.returnArrayStores30FromServer[i].deliveryPrices}'
                ,'${this.returnArrayStores30FromServer[i].deliveryTime}','${this.returnArrayStores30FromServer[i].startTime}'
                ,'${this.returnArrayStores30FromServer[i].endTime}','${this.returnArrayStores30FromServer[i].numberOfProducts}'
                ,'${this.returnArrayStores30FromServer[i].numberOfOffers}','${this.returnArrayStores30FromServer[i].numberOfBranches}'
                ,'${this.returnArrayStores30FromServer[i].special}','${this.returnArrayStores30FromServer[i].four}','${this.returnArrayStores30FromServer[i].isFav}','${this.returnArrayStores30FromServer[i].isLike}','${this.returnArrayStores30FromServer[i].isDisLike}'
                ,'${this.returnArrayStores30FromServer[i].deliveryAnotherPrice}'
                ,'${this.returnArrayStores30FromServer[i].deliveryAnotherTime}'
                ,'${this.returnArrayStores30FromServer[i].taxPrice}'
                ,'${this.returnArrayStores30FromServer[i].closeStore}'
                ,'${this.returnArrayStores30FromServer[i].closeStoreByCat}'
                ,'${this.returnArrayStores30FromServer[i].closeAllStores}','${this.returnArrayStores30FromServer[i].storeNote}')`, [])

                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
          }
        }else{
          this.storage.set('countOfStores','0');
        }
      });
      this.userId = await  this.storage.get('userId');
      if(this.userId!=null && this.userId !=undefined && this.userId!=0 && this.userId!=""){
        this.storesService.favouriteStores(0,0,1,0,'all',this.userId).then(data=>{
        this.returnAllFavData = data;
        this.operationResult = this.returnAllFavData.Error.ErrorCode;
        this.storage.set('countOfStoresFav',this.returnAllFavData.Data.countOfData);
        if(this.operationResult==1){
          this.returnArrayAllFavFromServer = this.returnAllFavData.Data.stores;
          for(let i = 0; i < this.returnArrayAllFavFromServer.length;i++){
            let image = this.returnArrayAllFavFromServer[i].image;
            let storeImage = this.returnArrayAllFavFromServer[i].storeImage;
            if(this.returnArrayAllFavFromServer[i].image == null || this.returnArrayAllFavFromServer[i].image == undefined || this.returnArrayAllFavFromServer[i].image=="" || this.returnArrayAllFavFromServer[i].image==0)
              image = "../../assets/imgs/def5.png";
            if(this.returnArrayAllFavFromServer[i].storeImage == null || this.returnArrayAllFavFromServer[i].storeImage == undefined || this.returnArrayAllFavFromServer[i].storeImage =="" || this.returnArrayAllFavFromServer[i].storeImage==0)
              storeImage = "../../assets/imgs/def3.png";
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO stores (id,catName,subCatName,title,image,storeImage,description,latlang,locationName,regionName,mobile,rate,countRate,countLike,countDisLike,followers,deliveryPrices,deliveryTime,startTime,endTime,numberOfProducts,numberOfOffers,numberOfBranches,special,four,isFav,isLike,isDisLike,deliveryAnotherPrice,deliveryAnotherTime,taxPrice,closeStore,closeStoreByCat,closeAllStores,store_note)
                VALUES ('${this.returnArrayAllFavFromServer[i].id}','${this.returnArrayAllFavFromServer[i].catName}'
                ,'${this.returnArrayAllFavFromServer[i].subCatName}','${this.returnArrayAllFavFromServer[i].title}'
                ,'${image}','${storeImage}','${this.returnArrayAllFavFromServer[i].description}'
                ,'${this.returnArrayAllFavFromServer[i].latlang}','${this.returnArrayAllFavFromServer[i].locationName}'
                ,'${this.returnArrayAllFavFromServer[i].regionName}','${this.returnArrayAllFavFromServer[i].mobile}'
                ,'${this.returnArrayAllFavFromServer[i].rate}','${this.returnArrayAllFavFromServer[i].countRate}'
                ,'${this.returnArrayAllFavFromServer[i].countLike}','${this.returnArrayAllFavFromServer[i].countDisLike}'
                ,'${this.returnArrayAllFavFromServer[i].followers}','${this.returnArrayAllFavFromServer[i].deliveryPrices}'
                ,'${this.returnArrayAllFavFromServer[i].deliveryTime}','${this.returnArrayAllFavFromServer[i].startTime}'
                ,'${this.returnArrayAllFavFromServer[i].endTime}','${this.returnArrayAllFavFromServer[i].numberOfProducts}'
                ,'${this.returnArrayAllFavFromServer[i].numberOfOffers}','${this.returnArrayAllFavFromServer[i].numberOfBranches}'
                ,'${this.returnArrayAllFavFromServer[i].special}','${this.returnArrayAllFavFromServer[i].four}','${this.returnArrayAllFavFromServer[i].isFav}','${this.returnArrayAllFavFromServer[i].isLike}','${this.returnArrayAllFavFromServer[i].isDisLike}'
                ,'${this.returnArrayAllFavFromServer[i].deliveryAnotherPrice}'
                ,'${this.returnArrayAllFavFromServer[i].deliveryAnotherTime}'
                ,'${this.returnArrayAllFavFromServer[i].taxPrice}'
                ,'${this.returnArrayAllFavFromServer[i].closeStore}'
                ,'${this.returnArrayAllFavFromServer[i].closeStoreByCat}'
                ,'${this.returnArrayAllFavFromServer[i].closeAllStores}','${this.returnArrayAllFavFromServer[i].storeNote}')`, [])
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO favouriteStores (id,catName,subCatName,title,image,storeImage,description,latlang,locationName,regionName,mobile,rate,countRate,countLike,countDisLike,followers,deliveryPrices,deliveryTime,startTime,endTime,numberOfProducts,numberOfOffers,numberOfBranches,special,four,isFav,isLike,isDisLike,deliveryAnotherPrice,deliveryAnotherTime,taxPrice,closeStore,closeStoreByCat,closeAllStores,store_note)
                VALUES ('${this.returnArrayAllFavFromServer[i].id}','${this.returnArrayAllFavFromServer[i].catName}'
                ,'${this.returnArrayAllFavFromServer[i].subCatName}','${this.returnArrayAllFavFromServer[i].title}'
                ,'${image}','${storeImage}','${this.returnArrayAllFavFromServer[i].description}'
                ,'${this.returnArrayAllFavFromServer[i].latlang}','${this.returnArrayAllFavFromServer[i].locationName}'
                ,'${this.returnArrayAllFavFromServer[i].regionName}','${this.returnArrayAllFavFromServer[i].mobile}'
                ,'${this.returnArrayAllFavFromServer[i].rate}','${this.returnArrayAllFavFromServer[i].countRate}'
                ,'${this.returnArrayAllFavFromServer[i].countLike}','${this.returnArrayAllFavFromServer[i].countDisLike}'
                ,'${this.returnArrayAllFavFromServer[i].followers}','${this.returnArrayAllFavFromServer[i].deliveryPrices}'
                ,'${this.returnArrayAllFavFromServer[i].deliveryTime}','${this.returnArrayAllFavFromServer[i].startTime}'
                ,'${this.returnArrayAllFavFromServer[i].endTime}','${this.returnArrayAllFavFromServer[i].numberOfProducts}'
                ,'${this.returnArrayAllFavFromServer[i].numberOfOffers}','${this.returnArrayAllFavFromServer[i].numberOfBranches}'
                ,'${this.returnArrayAllFavFromServer[i].special}','${this.returnArrayAllFavFromServer[i].four}','${this.returnArrayAllFavFromServer[i].isFav}','${this.returnArrayAllFavFromServer[i].isLike}','${this.returnArrayAllFavFromServer[i].isDisLike}'
                ,'${this.returnArrayAllFavFromServer[i].deliveryAnotherPrice}'
                ,'${this.returnArrayAllFavFromServer[i].deliveryAnotherTime}'
                ,'${this.returnArrayAllFavFromServer[i].taxPrice}'
                ,'${this.returnArrayAllFavFromServer[i].closeStore}'
                ,'${this.returnArrayAllFavFromServer[i].closeStoreByCat}'
                ,'${this.returnArrayAllFavFromServer[i].closeAllStores}','${this.returnArrayAllFavFromServer[i].storeNote}')`, [])
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
          }
        }else{
          this.storage.set('countOfStoresFav','0');
        }
      });
      }
      this.categoriesService.banners().then(data=>{
        this.returnBannersHomeData = data;
        this.operationResult = this.returnBannersHomeData.Error.ErrorCode;
        if(this.operationResult==1){
          this.returnArrayBannersHomeFromServer = this.returnBannersHomeData.Data.banners;
          for(let i = 0; i < this.returnArrayBannersHomeFromServer.length;i++) {
            this.returnBannersHomeArray[i]=[];
            this.returnBannersHomeArray[i]['id'] = this.returnArrayBannersHomeFromServer[i].id;
            this.returnBannersHomeArray[i]['image'] = this.returnArrayBannersHomeFromServer[i].image;
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO banners (id,image) VALUES ('${this.returnArrayBannersHomeFromServer[i].id}','${this.returnBannersHomeArray[i]['image']}')`, [])
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
          }
          let countOfData = this.returnBannersHomeArray.length;
          if(countOfData == 0)
            this.banners = 0;
          else{
            this.banners = 1;
          }
        }else
          this.banners = 0;
        setTimeout(()=>{
          this.bannersHomeSkeleton = false
        },2000);
      });
      this.categoriesService.offersHome().then(data=>{
        this.returnOffersHomeData = data;
        this.operationResult = this.returnOffersHomeData.Error.ErrorCode;
        if(this.operationResult==1){
          this.returnArrayOffersHomeFromServer = this.returnOffersHomeData.Data.offersHome;
          for(let i = 0; i < this.returnArrayOffersHomeFromServer.length;i++) {
            this.returnOffersHomeArray[i]=[];
            this.returnOffersHomeArray[i]['id'] = this.returnArrayOffersHomeFromServer[i].id;
            this.returnOffersHomeArray[i]['storeId'] = this.returnArrayOffersHomeFromServer[i].storeId;
            this.returnOffersHomeArray[i]['title'] = this.returnArrayOffersHomeFromServer[i].title;
            this.returnOffersHomeArray[i]['description'] = this.returnArrayOffersHomeFromServer[i].description;
            this.returnOffersHomeArray[i]['price'] = this.returnArrayOffersHomeFromServer[i].price;
            this.returnOffersHomeArray[i]['startDate'] = this.returnArrayOffersHomeFromServer[i].startDate;
            this.returnOffersHomeArray[i]['endDate'] = this.returnArrayOffersHomeFromServer[i].endDate;
            this.returnOffersHomeArray[i]['duration'] = this.returnArrayOffersHomeFromServer[i].duration;
            this.returnOffersHomeArray[i]['type'] = this.returnArrayOffersHomeFromServer[i].type;
            this.returnOffersHomeArray[i]['image'] = this.returnArrayOffersHomeFromServer[i].image;
            if(this.returnOffersHomeArray[i]['image'] == null || this.returnOffersHomeArray[i]['image'] == undefined || this.returnOffersHomeArray[i]['image']=="" || this.returnOffersHomeArray[i]['image']==0)
              this.returnOffersHomeArray[i]['image'] = "../../assets/imgs/def3.png";
            this.returnOffersHomeArray[i]['image1'] = this.returnArrayOffersHomeFromServer[i].image1;
            this.returnOffersHomeArray[i]['image2'] = this.returnArrayOffersHomeFromServer[i].image2;
            this.returnOffersHomeArray[i]['image3'] = this.returnArrayOffersHomeFromServer[i].image3;
            this.returnOffersHomeArray[i]['image4'] = this.returnArrayOffersHomeFromServer[i].image4;
            this.storesService.additions(this.returnArrayOffersHomeFromServer[i].id,2).then(data=>{
              this.returnAdditionsData = data;
              this.operationResult = this.returnAdditionsData.Error.ErrorCode;
              if(this.operationResult==1) {
                this.returnArrayAdditionsFromServer = this.returnAdditionsData.Data.additions;
                for (let jj = 0; jj < this.returnArrayAdditionsFromServer.length; jj++) {
                  this.sqlite.create({
                    name: "arreb.db",
                    location: 'default'
                  }).then((db: SQLiteObject) => {
                    db.executeSql(`INSERT OR REPLACE INTO categoriesAdditionsOffer (id,productsId,title,type) VALUES ('${this.returnArrayAdditionsFromServer[jj].id}','${this.returnArrayAdditionsFromServer[jj].productsId}','${this.returnArrayAdditionsFromServer[jj].catName}','${this.returnArrayAdditionsFromServer[jj].type}')`, [])
                      .then(() => {})
                      .catch(e => {});
                  }).catch(e => {});
                  this.returnArraySubAdditionsFromServer = this.returnArrayAdditionsFromServer[jj].additionsVal;
                  for (let j = 0; j < this.returnArraySubAdditionsFromServer.length; j++) {
                    this.saveDataAddtion(this.returnArraySubAdditionsFromServer[j].id,this.returnArraySubAdditionsFromServer[j].productsId,this.returnArraySubAdditionsFromServer[j].catId,this.returnArraySubAdditionsFromServer[j].title,this.returnArraySubAdditionsFromServer[j].price);
                  }
                }
              }
            });
            this.storesService.options(this.returnArrayOffersHomeFromServer[i].id,2).then(data=>{
              this.returnOptionsData = data;
              this.operationResult = this.returnOptionsData.Error.ErrorCode;
              if(this.operationResult==1) {
                this.returnArrayOptionsFromServer = this.returnOptionsData.Data.options;
                for (let jj = 0; jj < this.returnArrayOptionsFromServer.length; jj++) {
                  this.sqlite.create({
                    name: "arreb.db",
                    location: 'default'
                  }).then((db: SQLiteObject) => {
                    db.executeSql(`INSERT OR REPLACE INTO categoriesAdditionsOffer (id,productsId,title,type) VALUES ('${this.returnArrayOptionsFromServer[jj].id}','${this.returnArrayOptionsFromServer[jj].productsId}','${this.returnArrayOptionsFromServer[jj].catName}','${this.returnArrayOptionsFromServer[jj].type}')`, [])
                      .then(() => {})
                      .catch(e => {});
                  }).catch(e => {});
                  this.returnArraySubOptionsFromServer = this.returnArrayOptionsFromServer[jj].options;
                  for (let j = 0; j < this.returnArraySubOptionsFromServer.length; j++) {
                    this.saveDataOptions(this.returnArraySubOptionsFromServer[j].id,this.returnArraySubOptionsFromServer[j].productsId,this.returnArraySubOptionsFromServer[j].catId,this.returnArraySubOptionsFromServer[j].title);

                  }
                }
              }
            });
            this.storesService.ingredients(this.returnArrayOffersHomeFromServer[i].id,2).then(data=>{
              this.returnIngredientsData = data;
              this.operationResult = this.returnIngredientsData.Error.ErrorCode;
              if(this.operationResult==1) {
                this.returnArrayIngredientsFromServer = this.returnIngredientsData.Data.ingredients;
                for (let ji = 0; ji < this.returnArrayIngredientsFromServer.length; ji++) {
                  this.saveDataIngredients(this.returnArrayIngredientsFromServer[ji].id,this.returnArrayIngredientsFromServer[ji].productsId,this.returnArrayIngredientsFromServer[ji].title,1);
                }
              }
            });
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO offers (id,storeId,title,description,price,startDate,endDate,duration,type,image,image1,image2,image3,image4,isOfferHome) VALUES ('${this.returnArrayOffersHomeFromServer[i].id}','${this.returnArrayOffersHomeFromServer[i].storeId}','${this.returnArrayOffersHomeFromServer[i].title}','${this.returnArrayOffersHomeFromServer[i].description}','${this.returnArrayOffersHomeFromServer[i].price}','${this.returnArrayOffersHomeFromServer[i].startDate}','${this.returnArrayOffersHomeFromServer[i].endDate}','${this.returnArrayOffersHomeFromServer[i].duration}','${this.returnArrayOffersHomeFromServer[i].type}','${this.returnOffersHomeArray[i]['image']}','${this.returnArrayOffersHomeFromServer[i].image1}','${this.returnArrayOffersHomeFromServer[i].image2}','${this.returnArrayOffersHomeFromServer[i].image3}','${this.returnArrayOffersHomeFromServer[i].image4}','1')`, [])
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});

            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO offersHome (id,storeId,title,description,price,startDate,endDate,duration,type,image,image1,image2,image3,image4,isOfferHome) VALUES ('${this.returnArrayOffersHomeFromServer[i].id}','${this.returnArrayOffersHomeFromServer[i].storeId}','${this.returnArrayOffersHomeFromServer[i].title}','${this.returnArrayOffersHomeFromServer[i].description}','${this.returnArrayOffersHomeFromServer[i].price}','${this.returnArrayOffersHomeFromServer[i].startDate}','${this.returnArrayOffersHomeFromServer[i].endDate}','${this.returnArrayOffersHomeFromServer[i].duration}','${this.returnArrayOffersHomeFromServer[i].type}','${this.returnOffersHomeArray[i]['image']}','${this.returnArrayOffersHomeFromServer[i].image1}','${this.returnArrayOffersHomeFromServer[i].image2}','${this.returnArrayOffersHomeFromServer[i].image3}','${this.returnArrayOffersHomeFromServer[i].image4}','1')`, [])
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
          }
          let countOfData = this.returnOffersHomeArray.length;
          if(countOfData == 0)
            this.offersHome = 0;
          else{
            this.offersHome = 1;
          }
        }else
          this.offersHome = 0;
        setTimeout(()=>{
          this.offersHomeSkeleton = false
        },2000);
      });
      this.categoriesService.categories().then(data=>{
        this.returnCategoriesData = data;
        this.operationResult = this.returnCategoriesData.Error.ErrorCode;
        if(this.operationResult==1){
          this.returnArrayCategoriesFromServer = this.returnCategoriesData.Data.categories;
          for(let i = 0; i < this.returnArrayCategoriesFromServer.length;i++) {
            this.returnCategoriesArray[i]=[];
            this.returnCategoriesArray[i]['id'] = this.returnArrayCategoriesFromServer[i].id;
            this.returnCategoriesArray[i]['title'] = this.returnArrayCategoriesFromServer[i].title;
            this.returnCategoriesArray[i]['image'] = this.returnArrayCategoriesFromServer[i].image;
            if(this.returnCategoriesArray[i]['image'] == null || this.returnCategoriesArray[i]['image'] == undefined || this.returnCategoriesArray[i]['image']=="" || this.returnCategoriesArray[i]['image']==0)
              this.returnCategoriesArray[i]['image'] = "../../assets/imgs/def4.png";
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO categories (id,title,image) VALUES ('${this.returnArrayCategoriesFromServer[i].id}','${this.returnArrayCategoriesFromServer[i].title}','${this.returnArrayCategoriesFromServer[i].image}')`, [])
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
          }
          let countOfData = this.returnCategoriesArray.length;
          if(countOfData == 0)
            this.categories = 0;
          else{
            this.categories = 1;
          }
        }else
          this.categories = 0;
        setTimeout(()=>{
          this.categoriesSkeleton = false
        },2000);
      });
      this.categoriesService.storesHome().then(data=>{
        this.returnStoresHomeData = data;
        this.operationResult = this.returnStoresHomeData.Error.ErrorCode;
        if(this.operationResult==1){
          this.returnArrayStoresHomeFromServer = this.returnStoresHomeData.Data.stores;
          for(let i = 0; i < this.returnArrayStoresHomeFromServer.length;i++) {
            this.returnStoresHomeArray[i]=[];
            this.returnStoresHomeArray[i]['id'] = this.returnArrayStoresHomeFromServer[i].id;
            this.returnStoresHomeArray[i]['title'] = this.returnArrayStoresHomeFromServer[i].title;
            this.returnStoresHomeArray[i]['rate'] = this.returnArrayStoresHomeFromServer[i].rate;
            this.returnStoresHomeArray[i]['categorie'] = this.returnArrayStoresHomeFromServer[i].catName;
            this.returnStoresHomeArray[i]['subCategories'] = this.returnArrayStoresHomeFromServer[i].subCatName;
            this.returnStoresHomeArray[i]['image'] = this.returnArrayStoresHomeFromServer[i].image;
            if(this.returnStoresHomeArray[i]['image'] == null || this.returnStoresHomeArray[i]['image'] == undefined || this.returnStoresHomeArray[i]['image']=="" || this.returnStoresHomeArray[i]['image']==0)
              this.returnStoresHomeArray[i]['image'] = "../../assets/imgs/def5.png";
            this.returnStoresHomeArray[i]['storeImage'] = this.returnArrayStoresHomeFromServer[i].storeImage;
            if(this.returnStoresHomeArray[i]['storeImage']  == null || this.returnStoresHomeArray[i]['storeImage']  == undefined || this.returnStoresHomeArray[i]['storeImage'] =="" || this.returnStoresHomeArray[i]['storeImage'] ==0)
              this.returnStoresHomeArray[i]['storeImage']  = "../../assets/imgs/def3.png";
            this.returnStoresHomeArray[i]['countRate'] = this.returnArrayStoresHomeFromServer[i].countRate;
            if(this.returnArrayStoresHomeFromServer[i].countRate > 1000){
              let val = Math.floor(this.returnArrayStoresHomeFromServer[i].countRate/1000);
              this.returnStoresHomeArray[i]['countRate'] = val+"K";
            }
            let Y = new Date().getFullYear();
            let m = new Date().getMonth();
            let d = new Date().getDate();
            let h = new Date().getHours();
            let min = new Date().getMinutes();
            let devicTime = new Date(Y, m, d, h, min);
            let devicTimeStamp = devicTime.getTime();
            let startTime  = this.returnArrayStoresHomeFromServer[i].startTime.split(':');
            let endTime  = this.returnArrayStoresHomeFromServer[i].endTime.split(':');
            let YStart = new Date().getFullYear();
            let mStart = new Date().getMonth();
            let dStart = new Date().getDate();
            let hStart = startTime[0];
            let minStart = startTime[1];
            let sroreStartTime = new Date(YStart, mStart, dStart, hStart, minStart);
            let sroreStartTimeStamp = sroreStartTime.getTime();
            let YEnd = new Date().getFullYear();
            let mEnd = new Date().getMonth();
            let dEnd = new Date().getDate();
            let hEnd = endTime[0];
            let minEnd = endTime[1];
            let sroreEndTime = new Date(YEnd, mEnd, dEnd, hEnd, minEnd);
            let sroreEndTimeStamp = sroreEndTime.getTime();
            let closeStore = this.returnArrayStoresHomeFromServer[i].closeStore
            let closeStoreByCat = this.returnArrayStoresHomeFromServer[i].closeStoreByCat
            let closeAllStores = this.returnArrayStoresHomeFromServer[i].closeAllStores;
            this.returnStoresHomeArray[i]['closeStore'] = 0;
            if(closeStore == 1 || closeStoreByCat == 1 || closeAllStores == 1){
              this.returnStoresHomeArray[i]['closeStore'] = 1;
            }else{
              if(devicTimeStamp < sroreStartTimeStamp || devicTimeStamp > sroreEndTimeStamp)
                this.returnStoresHomeArray[i]['closeStore'] = 1;
            }
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO stores (id,catName,subCatName,title,image,storeImage,description,latlang,locationName,regionName,mobile,rate,countRate,countLike,countDisLike,followers,deliveryPrices,deliveryTime,startTime,endTime,numberOfProducts,numberOfOffers,numberOfBranches,special,four,isFav,isLike,isDisLike,deliveryAnotherPrice,deliveryAnotherTime,taxPrice,closeStore,closeStoreByCat,closeAllStores,store_note)
                VALUES ('${this.returnArrayStoresHomeFromServer[i].id}','${this.returnArrayStoresHomeFromServer[i].catName}'
                ,'${this.returnArrayStoresHomeFromServer[i].subCatName}','${this.returnArrayStoresHomeFromServer[i].title}'
                ,'${this.returnStoresHomeArray[i]['image']}','${this.returnStoresHomeArray[i]['storeImage']}','${this.returnArrayStoresHomeFromServer[i].description}'
                ,'${this.returnArrayStoresHomeFromServer[i].latlang}','${this.returnArrayStoresHomeFromServer[i].locationName}'
                ,'${this.returnArrayStoresHomeFromServer[i].regionName}','${this.returnArrayStoresHomeFromServer[i].mobile}'
                ,'${this.returnArrayStoresHomeFromServer[i].rate}','${this.returnArrayStoresHomeFromServer[i].countRate}'
                ,'${this.returnArrayStoresHomeFromServer[i].countLike}','${this.returnArrayStoresHomeFromServer[i].countDisLike}'
                ,'${this.returnArrayStoresHomeFromServer[i].followers}','${this.returnArrayStoresHomeFromServer[i].deliveryPrices}'
                ,'${this.returnArrayStoresHomeFromServer[i].deliveryTime}','${this.returnArrayStoresHomeFromServer[i].startTime}'
                ,'${this.returnArrayStoresHomeFromServer[i].endTime}','${this.returnArrayStoresHomeFromServer[i].numberOfProducts}'
                ,'${this.returnArrayStoresHomeFromServer[i].numberOfOffers}','${this.returnArrayStoresHomeFromServer[i].numberOfBranches}'
                ,'1','${this.returnArrayStoresHomeFromServer[i].four}','${this.returnArrayStoresHomeFromServer[i].isFav}'
                ,'${this.returnArrayStoresHomeFromServer[i].isLike}','${this.returnArrayStoresHomeFromServer[i].isDisLike}'
                ,'${this.returnArrayStoresHomeFromServer[i].deliveryAnotherPrice}','${this.returnArrayStoresHomeFromServer[i].deliveryAnotherTime}'
                ,'${this.returnArrayStoresHomeFromServer[i].taxPrice}','${this.returnArrayStoresHomeFromServer[i].closeStore}'
                ,'${this.returnArrayStoresHomeFromServer[i].closeStoreByCat}','${this.returnArrayStoresHomeFromServer[i].closeAllStores}','${this.returnArrayStoresHomeFromServer[i].storeNote}')`, [])
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
          }
          let countOfData = this.returnStoresHomeArray.length;
          if(countOfData == 0)
            this.storesHome = 0;
          else{
            this.storesHome = 1;
          }
        }else
          this.storesHome = 0;
        setTimeout(()=>{
          this.storesHomeSkeleton = false
        },2000);
      });
      this.categoriesService.storesFore().then(data=>{
        this.returnStoresForeData = data;
        this.operationResult = this.returnStoresForeData.Error.ErrorCode;
        if(this.operationResult==1){
          this.returnArrayStoresForeFromServer = this.returnStoresForeData.Data.stores;
          for(let i = 0; i < this.returnArrayStoresForeFromServer.length;i++) {
            this.returnStoresForeArray[i]=[];
            this.returnStoresForeArray[i]['id'] = this.returnArrayStoresForeFromServer[i].id;
            this.returnStoresForeArray[i]['title'] = this.returnArrayStoresForeFromServer[i].title;
            this.returnStoresForeArray[i]['rate'] = this.returnArrayStoresForeFromServer[i].rate;
            this.returnStoresForeArray[i]['categorie'] = this.returnArrayStoresForeFromServer[i].catName;
            this.returnStoresForeArray[i]['subCategories'] = this.returnArrayStoresForeFromServer[i].subCatName;
            this.returnStoresForeArray[i]['image'] = this.returnArrayStoresForeFromServer[i].image;
            if(this.returnStoresForeArray[i]['image'] == null || this.returnStoresForeArray[i]['image'] == undefined || this.returnStoresForeArray[i]['image']=="" || this.returnStoresForeArray[i]['image']==0)
              this.returnStoresForeArray[i]['image'] = "../../assets/imgs/def5.png";
            this.returnStoresForeArray[i]['storeImage'] = this.returnArrayStoresForeFromServer[i].storeImage;
            if(this.returnStoresForeArray[i]['storeImage'] == null || this.returnStoresForeArray[i]['storeImage'] == undefined || this.returnStoresForeArray[i]['storeImage']=="" || this.returnStoresForeArray[i]['storeImage']==0)
              this.returnStoresForeArray[i]['storeImage'] = "../../assets/imgs/def3.png";
            this.returnStoresForeArray[i]['countRate'] = this.returnArrayStoresForeFromServer[i].countRate;
            if(this.returnArrayStoresForeFromServer[i].countRate > 1000){
              let val = Math.floor(this.returnArrayStoresForeFromServer[i].countRate/1000);
              this.returnStoresForeArray[i]['countRate'] = val+"K";
            }
            let Y = new Date().getFullYear();
            let m = new Date().getMonth();
            let d = new Date().getDate();
            let h = new Date().getHours();
            let min = new Date().getMinutes();
            let devicTime = new Date(Y, m, d, h, min);
            let devicTimeStamp = devicTime.getTime();
            let startTime  = this.returnArrayStoresForeFromServer[i].startTime.split(':');
            let endTime  = this.returnArrayStoresForeFromServer[i].endTime.split(':');
            let YStart = new Date().getFullYear();
            let mStart = new Date().getMonth();
            let dStart = new Date().getDate();
            let hStart = startTime[0];
            let minStart = startTime[1];
            let sroreStartTime = new Date(YStart, mStart, dStart, hStart, minStart);
            let sroreStartTimeStamp = sroreStartTime.getTime();
            let YEnd = new Date().getFullYear();
            let mEnd = new Date().getMonth();
            let dEnd = new Date().getDate();
            let hEnd = endTime[0];
            let minEnd = endTime[1];
            let sroreEndTime = new Date(YEnd, mEnd, dEnd, hEnd, minEnd);
            let sroreEndTimeStamp = sroreEndTime.getTime();
            let closeStore = this.returnArrayStoresForeFromServer[i].closeStore
            let closeStoreByCat = this.returnArrayStoresForeFromServer[i].closeStoreByCat
            let closeAllStores = this.returnArrayStoresForeFromServer[i].closeAllStores;
            this.returnStoresForeArray[i]['closeStore'] = 0;
            if(closeStore == 1 || closeStoreByCat == 1 || closeAllStores == 1){
              this.returnStoresForeArray[i]['closeStore'] = 1;
            }else{
              if(devicTimeStamp < sroreStartTimeStamp || devicTimeStamp > sroreEndTimeStamp)
                this.returnStoresForeArray[i]['closeStore'] = 1;
            }
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO stores (id,catName,subCatName,title,image,storeImage,description,latlang,locationName,regionName,mobile,rate,countRate,countLike,countDisLike,followers,deliveryPrices,deliveryTime,startTime,endTime,numberOfProducts,numberOfOffers,numberOfBranches,special,four,isFav,isLike,isDisLike,deliveryAnotherPrice,deliveryAnotherTime,taxPrice,closeStore,closeStoreByCat,closeAllStores,store_note)
                VALUES ('${this.returnArrayStoresForeFromServer[i].id}','${this.returnArrayStoresForeFromServer[i].catName}'
                ,'${this.returnArrayStoresForeFromServer[i].subCatName}','${this.returnArrayStoresForeFromServer[i].title}'
                ,'${this.returnStoresForeArray[i]['image']}','${this.returnStoresForeArray[i]['storeImage']}','${this.returnArrayStoresForeFromServer[i].description}'
                ,'${this.returnArrayStoresForeFromServer[i].latlang}','${this.returnArrayStoresForeFromServer[i].locationName}'
                ,'${this.returnArrayStoresForeFromServer[i].regionName}','${this.returnArrayStoresForeFromServer[i].mobile}'
                ,'${this.returnArrayStoresForeFromServer[i].rate}','${this.returnArrayStoresForeFromServer[i].countRate}'
                ,'${this.returnArrayStoresForeFromServer[i].countLike}','${this.returnArrayStoresForeFromServer[i].countDisLike}'
                ,'${this.returnArrayStoresForeFromServer[i].followers}','${this.returnArrayStoresForeFromServer[i].deliveryPrices}'
                ,'${this.returnArrayStoresForeFromServer[i].deliveryTime}','${this.returnArrayStoresForeFromServer[i].startTime}'
                ,'${this.returnArrayStoresForeFromServer[i].endTime}','${this.returnArrayStoresForeFromServer[i].numberOfProducts}'
                ,'${this.returnArrayStoresForeFromServer[i].numberOfOffers}','${this.returnArrayStoresForeFromServer[i].numberOfBranches}'
                ,'${this.returnArrayStoresForeFromServer[i].special}','1','${this.returnArrayStoresForeFromServer[i].isFav}'
                ,'${this.returnArrayStoresForeFromServer[i].isLike}','${this.returnArrayStoresForeFromServer[i].isDisLike}'
                ,'${this.returnArrayStoresForeFromServer[i].deliveryAnotherPrice}','${this.returnArrayStoresForeFromServer[i].deliveryAnotherTime}'
                ,'${this.returnArrayStoresForeFromServer[i].taxPrice}','${this.returnArrayStoresForeFromServer[i].closeStore}'
                ,'${this.returnArrayStoresForeFromServer[i].closeStoreByCat}','${this.returnArrayStoresForeFromServer[i].closeAllStores}','${this.returnArrayStoresForeFromServer[i].storeNote}'
                )`, [])
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
          }
          let countOfData = this.returnStoresForeArray.length;
          if(countOfData == 0)
            this.storesFore = 0;
          else{
            this.storesFore = 1;
          }
        }else
          this.storesFore = 0;
        setTimeout(()=>{
          this.storesForeSkeleton = false
        },2000);
      });
    }
  }
  async saveDataFields(id:any,productId:any,title:any,valuesFields:any,type:any){
    this.sqlite.create({
      name: "arreb.db",
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql(`INSERT OR REPLACE INTO productsFields (id,productId,title,valuesFields,type) VALUES ('${id}','${productId}','${title}','${valuesFields}','${type}')`, [])
        .then(() => {})
        .catch(e => {});
    }).catch(e => {});
  }
  async saveDataAddtion(id:any,productsId:any,catId:any,title:any,price:any,type:any=0){
    await this.sqlite.create({
      name: "arreb.db",
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql(`INSERT OR REPLACE INTO additionsOffer (id,productsId,catId,title,price) VALUES ('${id}','${productsId}','${catId}','${title}','${price}')`, [])
        .then(() => {})
        .catch((e) => {});
    }).catch((e) => {});
  }
  async saveDataOptions(id:any,productsId:any,catId:any,title:any,type:any=0){
    await this.sqlite.create({
      name: "arreb.db",
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql(`INSERT OR REPLACE INTO optionsOffer (id,productsId,catId,title) VALUES ('${id}','${productsId}','${catId}','${title}')`, [])
        .then(() => {})
        .catch((e) => {});
    }).catch((e) => {});
  }
  async saveDataIngredients(id:any,productsId:any,title:any,type:any=0){
    await this.sqlite.create({
      name: "arreb.db",
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql(`INSERT OR REPLACE INTO ingredientsOffer (id,productsId,title) VALUES ('${id}','${productsId}','${title}')`, [])
        .then(() => {})
        .catch((e) => {});
    }).catch((e) => {});
  }
  searchAllValues(){
    this.navCtrl.navigateRoot(['/search', {searchValues:this.searchValues}]);
  }
  functionStoresByHomeCat(homCatId:any){
    this.router.navigate(['/stores', {homeCategories:homCatId}])
  }
  async functionAllOffers(){
    this.navCtrl.navigateRoot("/offers");
  }
  functionOffersInformation(offerId:any,storeId:any){
    this.router.navigate(['/offerdetails', {offerId:offerId,pageBackOffers:2}])
  }
  functionStoreInformation(storeId:any){
    this.sqlite.create({
      name: "arreb.db",
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql(`select * FROM stores where id= ?`, [storeId])
        .then((resNew) =>{
          let Y = new Date().getFullYear();
          let m = new Date().getMonth();
          let d = new Date().getDate();
          let h = new Date().getHours();
          let min = new Date().getMinutes();
          let devicTime = new Date(Y, m, d, h, min);
          let devicTimeStamp = devicTime.getTime();

          let startTime  = resNew.rows.item(0).startTime.split(':');
          let endTime  = resNew.rows.item(0).endTime.split(':');


          let YStart = new Date().getFullYear();
          let mStart = new Date().getMonth();
          let dStart = new Date().getDate();
          let hStart = startTime[0];
          let minStart = startTime[1];
          let sroreStartTime = new Date(YStart, mStart, dStart, hStart, minStart);
          let sroreStartTimeStamp = sroreStartTime.getTime();

          let YEnd = new Date().getFullYear();
          let mEnd = new Date().getMonth();
          let dEnd = new Date().getDate();
          let hEnd = endTime[0];
          let minEnd = endTime[1];
          let sroreEndTime = new Date(YEnd, mEnd, dEnd, hEnd, minEnd);
          let sroreEndTimeStamp = sroreEndTime.getTime();

          let closeStore = resNew.rows.item(0).closeStore
          let closeStoreByCat = resNew.rows.item(0).closeStoreByCat
          let closeAllStores = resNew.rows.item(0).closeAllStores
          if(closeStore == 1 || closeStoreByCat == 1 || closeAllStores == 1){
            this.message = "لا يمكنك الاطلاع على تفاصيل المتجر المتجر مغلق";
            this.displayResult(this.message);
          }else{
            if(devicTimeStamp > sroreStartTimeStamp && devicTimeStamp < sroreEndTimeStamp)
              this.router.navigate(['/storedetails', {storeId:storeId,pageBack:4}])
            else{
              this.message = "لا يمكنك الاطلاع على تفاصيل المتجر المتجر مغلق";
              this.displayResult(this.message);
            }
          }

        }).catch(e => {});
    }).catch(e => {});
  }
  functionStoresByCat(catId:any){
    this.router.navigate(['/stores', {selectedVal:catId}])
  }
  functionStoresByCatAnsSubCat(catId:any,subCatId:any){
    this.router.navigate(['/stores', {selectedVal:catId,selectedSubVal:subCatId}])
  }
  functionAllStores(){
    this.navCtrl.navigateRoot("/stores");
  }
  functionGoToShoppingcart(){
    this.navCtrl.navigateRoot("/shoppingcart");
  }
  functionCategories(){
    this.navCtrl.navigateRoot("/categories");
  }
  functionOrders(){
    this.navCtrl.navigateRoot("/orders");
  }
  functionProductsInformation(productsId:any,storeId:any){
    this.router.navigate(['/productsdetails', {proId:productsId,storeId:storeId}])
  }
  async functionOpenMenue(){
    this.fullNameLogin = await this.storage.get('fullNameLogin');
    this.emailLogin = await this.storage.get('emailLogin');
    if(this.fullNameLogin!=null || this.emailLogin!=null) {
      this.menu.enable(true,"last");
      this.menu.open("last");
    }else{
      this.menu.enable(true,"first");
      this.menu.open("first");
    }
  }
  async displayResult(message){
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: 'bottom',
      cssClass:"toastStyle",
      color:""
    });
    await toast.present();
  }
}
