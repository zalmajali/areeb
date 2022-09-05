import { Component, OnInit,ViewChild } from '@angular/core';
import {MenuController, Platform, NavController,ToastController,ModalController,IonInput} from '@ionic/angular';
import {Storage} from "@ionic/storage";
import {StoresService} from "../../services/stores.service";
import { Network } from '@ionic-native/network/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import {ActivatedRoute, Router} from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import {SortandfilterComponent} from "../sortandfilter/sortandfilter.component";
@Component({
  selector: 'app-storedetails',
  templateUrl: './storedetails.page.html',
  styleUrls: ['./storedetails.page.scss'],
})
export class StoredetailsPage implements OnInit {
  @ViewChild('searchInput', {static:true}) searchInput:IonInput;
  selectSegment:any="1";
  storeId:any;
  saveData:any = 0;
  segmentValues:any=1;

  returnStoresInformationData:any;
  returnArrayInformationFromServer:any;
  storesInformationSkeleton:boolean = true;

  returnStoresInformationId:any;
  returnStoresInformationCatId:any;
  returnStoresInformationSubCatId:any;
  returnStoresInformationTitle:any;
  returnStoresInformationImage:any;
  returnStoresInformationStoreImage:any;
  returnStoresInformationDescription:any;
  returnStoresInformationLatlang:any;
  returnStoresInformationLocationName:any;
  returnStoresInformationRegion:any;
  returnStoresInformationMobile:any;
  returnStoresInformationFollowers:any;
  returnStoresInformationDeliveryPrices:any;
  returnStoresInformationDeliveryTime:any;
  returnStoresInformationStartTime:any;
  returnStoresInformationEndTime:any;
  returnStoresInformationRate:any;
  returnStoresInformationCountRate:any;
  returnStoresInformationCountLike:any;
  returnStoresInformationCountDisLike:any;
  returnStoresInformationNumberOfProducts:any;
  returnStoresInformationNumberOfOffers:any;
  returnStoresInformationNumberOfBranches:any;
  returnStoresInformationSpecial:any;
  returnStoresInformationFour:any;
  returnStoresInformationIsLike:any;
  returnStoresInformationIsDisLike:any;
  returnStoresInformationDeliveryAnotherPrices:any;
  returnStoresInformationDeliveryAnotherTime:any;

  operationResult:any;
  message:any;

  storesOffersByStoreSkeleton:boolean = true;
  returnOffersByStoreData:any;
  returnArrayOffersByStoreFromServer:any;
  returnOffersByStoreArray:any = [];
  offersByStore:any;

  storesProductsByStoreSkeleton:boolean = true;
  returnProductsByStoreData:any;
  returnArrayProductsByStoreFromServer:any;
  returnProductsByStoreArray:any = [];

  returnStoresCategoriesData:any;
  returnArrayStoresCategoriesFromServer:any;
  returnStoresCategoriesArray:any = [];
  productsByStore:any;

  storesBranchesByStoreSkeleton:boolean = true;
  returnBranchesByStoreData:any;
  returnArrayBranchesByStoreFromServer:any;
  returnBranchesByStoreArray:any = [];
  branchesByStore:any;
  returnProductsFieldsData:any;
  returnArrayProductsFieldsFromServer:any;
  returnProductsFieldsArray:any = [];
  operationResultProductsFields:any;
  countOfBranches:any;
  countOfProducts:any;
  countOfOffers:any;

  storesCategories:any;
  countOfStoresCategories:any;
  storesCategoriesSkeleton:any;
  allStoresShow:any;
  lastOfferSortSelect:any;
  lastProductsOneSortSelect:any;
  lastProductsTowFilterSelect:any;
  lastBranchesFilterSelect:any;
  selectedData:any;
  showLinkFavourite:any=0;
  isStoreInFaverate:any;
  realFollowers:any;
  userId:any;
  returnStoresForeData:any;
  countOfStoresFav:any;

  returnAdditionsData:any;
  returnArrayAdditionsFromServer:any;
  returnArrayAdditionsOffersFromServer:any;
  returnArraySubAdditionsFromServer:any = [];
  returnArraySubAdditionsOffersFromServer:any = [];
  returnOptionsData:any;
  returnArrayOptionsFromServer:any
  returnArrayOptionsOffersFromServer:any
  returnArraySubOptionsFromServer:any = [];
  returnArraySubOptionsOffersFromServer:any = [];
  returnIngredientsData:any;
  returnArrayIngredientsFromServer:any;
  insertAllIngredientsPro:any = [];
  insertAllIngredientsOffer:any = [];
  realPrice:any;
  pageBack:any;
  searchValues:any;
  fullNameLogin:any;
  emailLogin:any;
  productInShopingCart:any;
  checkIsLike:any;
  checkDisLike:any;
  constructor(private modalController: ModalController,private callNumber: CallNumber,public geolocation: Geolocation,private launchNavigator: LaunchNavigator,private router : Router,private activaterouter : ActivatedRoute,private sqlite: SQLite,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private storesService:StoresService,private toastCtrl: ToastController) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','home');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
    this.platform.backButton.subscribeWithPriority(10, () => {
      let pageBack = this.storage.get("pageBack").then(pageBack=>{
        if(pageBack == 1)
          this.navCtrl.navigateRoot("/stores");
        if(pageBack == 2)
          this.navCtrl.navigateRoot("/favouritestores");
        if(pageBack == 3)
          this.navCtrl.navigateRoot("/search");
        if(pageBack == 4)
          this.navCtrl.navigateRoot("/home");
      });
    });
  }
  async functionReturnProducts(catSelectId:any=0,productsOneSorting:any=0,productsTowSorting:any=0,indexCat:any=0){
    if(this.returnStoresCategoriesArray.length)
    for(let i = 0; i < this.returnStoresCategoriesArray.length;i++) {
      this.returnStoresCategoriesArray[i]['classSlidesCheck'] = "textSlider";
    }
    if(catSelectId!=0)
      this.returnStoresCategoriesArray[indexCat]['classSlidesCheck'] = "textSliderCheck";
    this.storesProductsByStoreSkeleton = true;
    this.activaterouter.params.subscribe(params => {
      this.storeId = params['storeId'];
    });
    this.sqlite.create({
      name: "arreb.db",
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('delete from products where storeId= ?', [this.storeId])
        .then(() => console.log())
        .catch(e => console.log());
    }).catch(e => console.log());
    await this.storesService.productsByStore(this.storeId,productsOneSorting,productsTowSorting,catSelectId).then(data=>{
      this.returnProductsByStoreData = data;
      this.operationResult = this.returnProductsByStoreData.Error.ErrorCode;
      this.returnProductsByStoreArray=[];
      if(this.operationResult==1){
        this.returnArrayProductsByStoreFromServer = this.returnProductsByStoreData.Data.products;
        for(let i = 0; i < this.returnArrayProductsByStoreFromServer.length;i++) {
          this.returnProductsByStoreArray[i]=[];
          this.returnProductsByStoreArray[i]['id'] = this.returnArrayProductsByStoreFromServer[i].id;
          this.returnProductsByStoreArray[i]['storeId'] = this.returnArrayProductsByStoreFromServer[i].storeId;
          this.returnProductsByStoreArray[i]['storesCatName'] = this.returnArrayProductsByStoreFromServer[i].storesCatName;
          this.returnProductsByStoreArray[i]['storesCatId'] = this.returnArrayProductsByStoreFromServer[i].storesCatId;
          this.returnProductsByStoreArray[i]['title'] = this.returnArrayProductsByStoreFromServer[i].title;
          this.returnProductsByStoreArray[i]['description'] = this.returnArrayProductsByStoreFromServer[i].description;
          this.returnProductsByStoreArray[i]['smallDescription'] = this.returnArrayProductsByStoreFromServer[i].smallDescription;
          this.returnProductsByStoreArray[i]['image'] = this.returnArrayProductsByStoreFromServer[i].image;
          if(this.returnProductsByStoreArray[i]['image'] == null || this.returnProductsByStoreArray[i]['image'] == undefined || this.returnProductsByStoreArray[i]['image']=="" || this.returnProductsByStoreArray[i]['image']==0)
            this.returnProductsByStoreArray[i]['image'] = "../../assets/imgs/def3.png";
          this.returnProductsByStoreArray[i]['smallImage'] = this.returnArrayProductsByStoreFromServer[i].smallImage;
          if(this.returnProductsByStoreArray[i]['smallImage'] == null || this.returnProductsByStoreArray[i]['smallImage'] == undefined || this.returnProductsByStoreArray[i]['smallImage']=="" || this.returnProductsByStoreArray[i]['smallImage']==0)
            this.returnProductsByStoreArray[i]['smallImage'] = "../../assets/imgs/def5.png";
          this.returnProductsByStoreArray[i]['price'] = this.returnArrayProductsByStoreFromServer[i].price;
          this.returnProductsByStoreArray[i]['offerPrice'] = this.returnArrayProductsByStoreFromServer[i].offerPrice;
          this.returnProductsByStoreArray[i]['special'] = this.returnArrayProductsByStoreFromServer[i].special;



          this.storesService.additions(this.returnProductsByStoreArray[i]['id']).then(data=>{
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
          this.storesService.options(this.returnProductsByStoreArray[i]['id']).then(data=>{
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
          this.storesService.ingredients(this.returnProductsByStoreArray[i]['id']).then(data=>{
            this.returnIngredientsData = data;
            this.operationResult = this.returnIngredientsData.Error.ErrorCode;
            if(this.operationResult==1) {
              this.returnArrayIngredientsFromServer = this.returnIngredientsData.Data.ingredients;
              for (let jj = 0; jj < this.returnArrayIngredientsFromServer.length; jj++) {
                this.saveDataIngredients(this.returnArrayIngredientsFromServer[jj].id,this.returnArrayIngredientsFromServer[jj].productsId,this.returnArrayIngredientsFromServer[jj].title,0);
              }
            }
          });
          this.storesService.productsFields(this.returnArrayProductsByStoreFromServer[i].id).then(data=>{
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
            db.executeSql(`INSERT OR REPLACE INTO products (id,storeId,storesCatName,storesCatId,title,description,smallDescription,image,smallImage,price,offerPrice,special) VALUES ('${this.returnArrayProductsByStoreFromServer[i].id}','${this.returnArrayProductsByStoreFromServer[i].storeId}','${this.returnArrayProductsByStoreFromServer[i].storesCatName}','${this.returnArrayProductsByStoreFromServer[i].storesCatId}','${this.returnArrayProductsByStoreFromServer[i].title}','${this.returnArrayProductsByStoreFromServer[i].description}','${this.returnArrayProductsByStoreFromServer[i].smallDescription}','${this.returnArrayProductsByStoreFromServer[i].image}','${this.returnArrayProductsByStoreFromServer[i].smallImage}','${this.returnArrayProductsByStoreFromServer[i].price}','${this.returnArrayProductsByStoreFromServer[i].offerPrice}','${this.returnArrayProductsByStoreFromServer[i].special}')`, [])
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
        }
        let countOfData = this.returnProductsByStoreArray.length;
        this.countOfProducts = countOfData;
      }else
        this.countOfProducts = 0;
    }).catch(e=>{
      this.countOfProducts = 0;});
    setTimeout(()=>{
      this.storesProductsByStoreSkeleton = false
    },2000);
  }
  async saveDataAddtion(id:any,productsId:any,catId:any,title:any,price:any,type:any=0){
   if(type==0){
     await this.sqlite.create({
       name: "arreb.db",
       location: 'default'
     }).then((db: SQLiteObject) => {
       db.executeSql(`INSERT OR REPLACE INTO additionsPro (id,productsId,catId,title,price) VALUES ('${id}','${productsId}','${catId}','${title}','${price}')`, [])
         .then(() => {})
         .catch((e) => {});
     }).catch((e) => {});
   }else{
     await this.sqlite.create({
       name: "arreb.db",
       location: 'default'
     }).then((db: SQLiteObject) => {
       db.executeSql(`INSERT OR REPLACE INTO additionsOffer (id,productsId,catId,title,price) VALUES ('${id}','${productsId}','${catId}','${title}','${price}')`, [])
         .then(() => {})
         .catch((e) => {});
     }).catch((e) => {});
   }
  }
  async saveDataOptions(id:any,productsId:any,catId:any,title:any,type:any=0){
    if(type==0){
      await this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(`INSERT OR REPLACE INTO optionsPro (id,productsId,catId,title) VALUES ('${id}','${productsId}','${catId}','${title}')`, [])
          .then(() => {})
          .catch((e) => {});
      }).catch((e) => {});
    }else{
      await this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(`INSERT OR REPLACE INTO optionsOffer (id,productsId,catId,title) VALUES ('${id}','${productsId}','${catId}','${title}')`, [])
          .then(() => {})
          .catch((e) => {});
      }).catch((e) => {});
    }
  }
  async saveDataIngredients(id:any,productsId:any,title:any,type:any=0){
    if(type==0){
      await this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(`INSERT OR REPLACE INTO ingredientsPro (id,productsId,title) VALUES ('${id}','${productsId}','${title}')`, [])
          .then(() => {})
          .catch((e) => {});
      }).catch((e) => {});
    }else{
      await this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(`INSERT OR REPLACE INTO ingredientsOffer (id,productsId,title) VALUES ('${id}','${productsId}','${title}')`, [])
          .then(() => {})
          .catch((e) => {});
      }).catch((e) => {});
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
  async functionReturnOffers (sortingData:any=0){
    this.storesOffersByStoreSkeleton = true;
    this.activaterouter.params.subscribe(params => {
      this.storeId = params['storeId'];
    });
    this.sqlite.create({
      name: "arreb.db",
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('delete from offers where storeId= ?', [this.storeId])
        .then(() => console.log())
        .catch(e => console.log());
    }).catch(e => console.log());
    this.storesService.offersByStore(this.storeId,sortingData).then(data=>{
      this.returnOffersByStoreData = data;
      this.operationResult = this.returnOffersByStoreData.Error.ErrorCode;
      this.returnOffersByStoreArray=[];
      if(this.operationResult==1){
        this.returnArrayOffersByStoreFromServer = this.returnOffersByStoreData.Data.offers;
        for(let i = 0; i < this.returnArrayOffersByStoreFromServer.length;i++) {
          this.returnOffersByStoreArray[i]=[];
          this.returnOffersByStoreArray[i]['id'] = this.returnArrayOffersByStoreFromServer[i].id;
          this.returnOffersByStoreArray[i]['storeId'] = this.returnArrayOffersByStoreFromServer[i].storeId;
          this.returnOffersByStoreArray[i]['title'] = this.returnArrayOffersByStoreFromServer[i].title;
          this.returnOffersByStoreArray[i]['description'] = this.returnArrayOffersByStoreFromServer[i].description;
          this.returnOffersByStoreArray[i]['price'] = this.returnArrayOffersByStoreFromServer[i].price;
          this.returnOffersByStoreArray[i]['startDate'] = this.returnArrayOffersByStoreFromServer[i].startDate;
          this.returnOffersByStoreArray[i]['endDate'] = this.returnArrayOffersByStoreFromServer[i].endDate;
          this.returnOffersByStoreArray[i]['duration'] = this.returnArrayOffersByStoreFromServer[i].duration;
          this.returnOffersByStoreArray[i]['type'] = this.returnArrayOffersByStoreFromServer[i].type;
          this.returnOffersByStoreArray[i]['image'] = this.returnArrayOffersByStoreFromServer[i].image;
          if(this.returnOffersByStoreArray[i]['image'] == null || this.returnOffersByStoreArray[i]['image'] == undefined || this.returnOffersByStoreArray[i]['image']=="" || this.returnOffersByStoreArray[i]['image']==0)
            this.returnOffersByStoreArray[i]['image'] = "../../assets/imgs/def3.png";
          this.returnOffersByStoreArray[i]['image1'] = this.returnArrayOffersByStoreFromServer[i].image1;
          this.returnOffersByStoreArray[i]['image2'] = this.returnArrayOffersByStoreFromServer[i].image2;
          this.returnOffersByStoreArray[i]['image3'] = this.returnArrayOffersByStoreFromServer[i].image3;
          this.returnOffersByStoreArray[i]['image4'] = this.returnArrayOffersByStoreFromServer[i].image4;
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql(`INSERT OR REPLACE INTO offers (id,storeId,title,description,price,startDate,endDate,duration,type,image,image1,image2,image3,image4,isOfferHome) VALUES ('${this.returnArrayOffersByStoreFromServer[i].id}','${this.returnArrayOffersByStoreFromServer[i].storeId}','${this.returnArrayOffersByStoreFromServer[i].title}','${this.returnArrayOffersByStoreFromServer[i].description}','${this.returnArrayOffersByStoreFromServer[i].price}','${this.returnArrayOffersByStoreFromServer[i].startDate}','${this.returnArrayOffersByStoreFromServer[i].endDate}','${this.returnArrayOffersByStoreFromServer[i].duration}','${this.returnArrayOffersByStoreFromServer[i].type}','${this.returnArrayOffersByStoreFromServer[i].image}','${this.returnArrayOffersByStoreFromServer[i].image1}','${this.returnArrayOffersByStoreFromServer[i].image2}','${this.returnArrayOffersByStoreFromServer[i].image3}','${this.returnArrayOffersByStoreFromServer[i].image4}','${this.returnArrayOffersByStoreFromServer[i].isOfferHome}')`, [])
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.storesService.additions(this.returnOffersByStoreArray[i]['id'],2).then(data=>{
            this.returnAdditionsData = data;
            this.operationResult = this.returnAdditionsData.Error.ErrorCode;
            if(this.operationResult==1) {
              this.returnArrayAdditionsOffersFromServer = this.returnAdditionsData.Data.additions;
              for (let ji = 0; ji < this.returnArrayAdditionsOffersFromServer.length; ji++) {
                this.sqlite.create({
                  name: "arreb.db",
                  location: 'default'
                }).then((db: SQLiteObject) => {
                  db.executeSql(`INSERT OR REPLACE INTO categoriesAdditionsOffer (id,productsId,title,type) VALUES ('${this.returnArrayAdditionsOffersFromServer[ji].id}','${this.returnArrayAdditionsOffersFromServer[ji].productsId}','${this.returnArrayAdditionsOffersFromServer[ji].catName}','${this.returnArrayAdditionsOffersFromServer[ji].type}')`, [])
                    .then(() => {})
                    .catch(e => {});
                }).catch(e => {});
                this.returnArraySubAdditionsOffersFromServer = this.returnArrayAdditionsOffersFromServer[ji].additionsVal;
                for (let j = 0; j < this.returnArraySubAdditionsOffersFromServer.length; j++) {
                  this.saveDataAddtion(this.returnArraySubAdditionsOffersFromServer[j].id,this.returnArraySubAdditionsOffersFromServer[j].productsId,this.returnArraySubAdditionsOffersFromServer[j].catId,this.returnArraySubAdditionsOffersFromServer[j].title,this.returnArraySubAdditionsOffersFromServer[j].price,1);
                }
              }
            }
          });
          this.storesService.options(this.returnOffersByStoreArray[i]['id'],2).then(data=>{
            this.returnOptionsData = data;
            this.operationResult = this.returnOptionsData.Error.ErrorCode;
            if(this.operationResult==1) {
              this.returnArrayOptionsOffersFromServer = this.returnOptionsData.Data.options;
              for (let ji = 0; ji < this.returnArrayOptionsOffersFromServer.length; ji++) {
                this.sqlite.create({
                  name: "arreb.db",
                  location: 'default'
                }).then((db: SQLiteObject) => {
                  db.executeSql(`INSERT OR REPLACE INTO categoriesAdditionsOffer (id,productsId,title,type) VALUES ('${this.returnArrayOptionsOffersFromServer[ji].id}','${this.returnArrayOptionsOffersFromServer[ji].productsId}','${this.returnArrayOptionsOffersFromServer[ji].catName}','${this.returnArrayOptionsOffersFromServer[ji].type}')`, [])
                    .then(() => {})
                    .catch(e => {});
                }).catch(e => {});
                this.returnArraySubOptionsOffersFromServer = this.returnArrayOptionsOffersFromServer[ji].options;
                for (let j = 0; j < this.returnArraySubOptionsOffersFromServer.length; j++) {
                  this.saveDataOptions(this.returnArraySubOptionsOffersFromServer[j].id,this.returnArraySubOptionsOffersFromServer[j].productsId,this.returnArraySubOptionsOffersFromServer[j].catId,this.returnArraySubOptionsOffersFromServer[j].title,1);
                }
              }
            }
          });
          this.storesService.ingredients(this.returnOffersByStoreArray[i]['id'],2).then(data=>{
            this.returnIngredientsData = data;
            this.operationResult = this.returnIngredientsData.Error.ErrorCode;
            if(this.operationResult==1) {
              this.returnArrayIngredientsFromServer = this.returnIngredientsData.Data.ingredients;
              for (let ji = 0; ji < this.returnArrayIngredientsFromServer.length; ji++) {
                this.saveDataIngredients(this.returnArrayIngredientsFromServer[ji].id,this.returnArrayIngredientsFromServer[ji].productsId,this.returnArrayIngredientsFromServer[ji].title,1);
              }
            }
          });
        }
        let countOfData = this.returnOffersByStoreArray.length;
        this.countOfOffers = countOfData;
      }else{
        this.countOfOffers = 0;
      }
    }).catch(e=>{this.countOfOffers = 0;});
    setTimeout(()=>{
      this.storesOffersByStoreSkeleton = false
    },2000);
  }
  async functionReturnBranches(regions:any=0){
    this.storesBranchesByStoreSkeleton = true;
    this.activaterouter.params.subscribe(params => {
      this.storeId = params['storeId'];
    });
    this.sqlite.create({
      name: "arreb.db",
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('delete from branches where storeId= ?', [this.storeId])
        .then(() => console.log())
        .catch(e => console.log());
    }).catch(e => console.log());
    this.storesService.branchesByStore(this.storeId,regions).then(data=>{
      this.returnBranchesByStoreArray=[];
      this.returnBranchesByStoreData = data;
      this.operationResult = this.returnBranchesByStoreData.Error.ErrorCode;
      if(this.operationResult==1){
        this.returnArrayBranchesByStoreFromServer = this.returnBranchesByStoreData.Data.branches;
        for(let i = 0; i < this.returnArrayBranchesByStoreFromServer.length;i++) {
          this.returnBranchesByStoreArray[i]=[];
          this.returnBranchesByStoreArray[i]['id'] = this.returnArrayBranchesByStoreFromServer[i].id;
          this.returnBranchesByStoreArray[i]['storeId'] = this.returnArrayBranchesByStoreFromServer[i].storeId;
          this.returnBranchesByStoreArray[i]['title'] = this.returnArrayBranchesByStoreFromServer[i].title;
          this.returnBranchesByStoreArray[i]['description'] = this.returnArrayBranchesByStoreFromServer[i].description;
          this.returnBranchesByStoreArray[i]['regionName'] = this.returnArrayBranchesByStoreFromServer[i].regionName;
          this.returnBranchesByStoreArray[i]['latlang'] = this.returnArrayBranchesByStoreFromServer[i].latlang;
          this.returnBranchesByStoreArray[i]['locationName'] = this.returnArrayBranchesByStoreFromServer[i].locationName;
          this.returnBranchesByStoreArray[i]['mobile'] = this.returnArrayBranchesByStoreFromServer[i].mobile;
          this.returnBranchesByStoreArray[i]['image'] = this.returnArrayBranchesByStoreFromServer[i].image;
          if(this.returnBranchesByStoreArray[i]['image'] == null || this.returnBranchesByStoreArray[i]['image'] == undefined || this.returnBranchesByStoreArray[i]['image']=="" || this.returnBranchesByStoreArray[i]['image']==0)
            this.returnBranchesByStoreArray[i]['image'] = "../../assets/imgs/def5.png";
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql(`INSERT OR REPLACE INTO branches (id,storeId,title,description,regionName,latlang,locationName,mobile,image) VALUES ('${this.returnArrayBranchesByStoreFromServer[i].id}','${this.returnArrayBranchesByStoreFromServer[i].storeId}','${this.returnArrayBranchesByStoreFromServer[i].title}','${this.returnArrayBranchesByStoreFromServer[i].description}','${this.returnArrayBranchesByStoreFromServer[i].regionName}','${this.returnArrayBranchesByStoreFromServer[i].latlang}','${this.returnArrayBranchesByStoreFromServer[i].locationName}','${this.returnArrayBranchesByStoreFromServer[i].mobile}','${this.returnArrayBranchesByStoreFromServer[i].image}')`, [])
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
        }
        let countOfData = this.returnBranchesByStoreArray.length;
        this.countOfBranches = countOfData;
      }else
        this.countOfBranches = 0;
    }).catch(e=>{this.countOfBranches = 0;});
    setTimeout(()=>{
      this.storesBranchesByStoreSkeleton = false
    },2000);
  }
 async ngOnInit() {
   this.fullNameLogin = await this.storage.get('fullNameLogin');
   this.emailLogin = await this.storage.get('emailLogin');
   if(this.fullNameLogin!=null || this.emailLogin!=null)
     this.showLinkFavourite = 1;
    this.storage.get('productInShopingCart').then(productInShopingCart=>{
     this.productInShopingCart = productInShopingCart;
     if(productInShopingCart==null || productInShopingCart=="" ||  productInShopingCart==0 )
       this.productInShopingCart = 0;
   });
    this.activaterouter.params.subscribe(params => {
      this.storeId = params['storeId'];
      this.pageBack = params['pageBack'];
    });
    await this.storage.set("pageBack",this.pageBack);
    this.storesService.addVew(this.storeId ).then(data=>{});
     this.sqlite.create({
       name: "arreb.db",
       location: 'default'
     }).then((db: SQLiteObject) => {
       db.executeSql(`select * FROM storesCategories where storeId= ?`, [this.storeId])
         .then((resNew) =>{
           if(resNew.rows.length == 0){
             this.storesService.storesCategories(this.storeId).then(data=>{
               this.returnStoresCategoriesData = data;
               this.operationResult = this.returnStoresCategoriesData.Error.ErrorCode;
               if(this.operationResult==1){
                 this.returnArrayStoresCategoriesFromServer = this.returnStoresCategoriesData.Data.storesCategories;
                 for(let i = 0; i < this.returnArrayStoresCategoriesFromServer.length;i++) {
                   this.returnStoresCategoriesArray[i]=[];
                   this.returnStoresCategoriesArray[i]['id'] = this.returnArrayStoresCategoriesFromServer[i].id;
                   this.returnStoresCategoriesArray[i]['title'] = this.returnArrayStoresCategoriesFromServer[i].title;
                   this.returnStoresCategoriesArray[i]['classSlidesCheck'] = "textSlider";
                   this.sqlite.create({
                     name: "arreb.db",
                     location: 'default'
                   }).then((db: SQLiteObject) => {
                     db.executeSql(`INSERT OR REPLACE INTO storesCategories (id,title,storeId) VALUES ('${this.returnArrayStoresCategoriesFromServer[i].id}','${this.returnArrayStoresCategoriesFromServer[i].title}','${this.storeId}')`, [])
                       .then(() => {})
                       .catch(e => {});
                   }).catch(e => {});
                 }
                 let countOfData = this.returnStoresCategoriesArray.length;
                 this.countOfStoresCategories = countOfData;
                 if(countOfData!=0)
                   this.storesCategories = 1;
                 else
                   this.storesCategories = 0;
               }else
                 this.storesCategories = 0;
               setTimeout(()=>{
                 this.storesCategoriesSkeleton = false
               },2000);
             });
           }else{
             for(let i = 0; i < resNew.rows.length;i++){
               this.returnStoresCategoriesArray[i]=[];
               this.returnStoresCategoriesArray[i]['id'] = resNew.rows.item(i).id;
               this.returnStoresCategoriesArray[i]['title'] = resNew.rows.item(i).title;
               this.returnStoresCategoriesArray[i]['classSlidesCheck'] = "textSlider";
             }
             let countOfData = this.returnStoresCategoriesArray.length;
             this.countOfStoresCategories = countOfData;
             if(countOfData!=0)
               this.storesCategories = 1;
             else
               this.storesCategories = 0;
             setTimeout(()=>{
               this.storesCategoriesSkeleton = false
             },2000);
           }
         }).catch(e => {});
     }).catch(e => {});
  this.functionReturnBranches();
  this.functionReturnOffers();
   this.functionReturnProducts();
   this.sqlite.create({
     name: "arreb.db",
     location: 'default'
   }).then((db: SQLiteObject) => {
     db.executeSql(`select * FROM stores where id= ?`, [this.storeId])
       .then((resNew) =>{
         this.returnStoresInformationId = resNew.rows.item(0).id;
         this.returnStoresInformationCatId = resNew.rows.item(0).catName;
         this.returnStoresInformationSubCatId = resNew.rows.item(0).subCatName;
         this.returnStoresInformationTitle = resNew.rows.item(0).title;
         this.returnStoresInformationImage = resNew.rows.item(0).image;
         this.returnStoresInformationStoreImage = resNew.rows.item(0).storeImage;
         this.returnStoresInformationDescription = resNew.rows.item(0).description;
         this.returnStoresInformationLatlang = resNew.rows.item(0).latlang;
         this.returnStoresInformationLocationName = resNew.rows.item(0).locationName;
         this.returnStoresInformationRegion = resNew.rows.item(0).regionName;
         this.returnStoresInformationMobile = resNew.rows.item(0).mobile;
         this.returnStoresInformationFollowers = resNew.rows.item(0).followers;
         this.realFollowers = resNew.rows.item(0).followers;
         if(resNew.rows.item(0).followers > 1000){
           let val = Math.floor(resNew.rows.item(0).followers/1000);
           this.returnStoresInformationFollowers  = val+"K";
         }
         this.returnStoresInformationDeliveryPrices = resNew.rows.item(0).deliveryPrices;
         this.returnStoresInformationDeliveryTime = resNew.rows.item(0).deliveryTime;
         this.returnStoresInformationDeliveryAnotherPrices = resNew.rows.item(0).deliveryAnotherPrice;
         this.returnStoresInformationDeliveryAnotherTime = resNew.rows.item(0).deliveryAnotherTime;
         this.returnStoresInformationStartTime = resNew.rows.item(0).startTime;
         this.returnStoresInformationEndTime = resNew.rows.item(0).endTime;
         this.returnStoresInformationRate = resNew.rows.item(0).rate;
         this.returnStoresInformationCountRate= resNew.rows.item(0).countRate;
         this.returnStoresInformationCountLike = resNew.rows.item(0).countLike;
         this.returnStoresInformationCountDisLike = resNew.rows.item(0).countDisLike;
         this.returnStoresInformationNumberOfProducts = resNew.rows.item(0).numberOfProducts;
         this.returnStoresInformationNumberOfOffers= resNew.rows.item(0).numberOfOffers;
         this.returnStoresInformationNumberOfBranches = resNew.rows.item(0).numberOfBranches;
         this.returnStoresInformationSpecial = resNew.rows.item(0).special;
         this.returnStoresInformationFour = resNew.rows.item(0).four;
         this.returnStoresInformationIsLike = resNew.rows.item(0).isLike;
         this.returnStoresInformationIsDisLike = resNew.rows.item(0).isDisLike;
         if(this.showLinkFavourite  == 1){
           if(resNew.rows.item(0).isFav == 1)
             this.isStoreInFaverate = 1;
           else
             this.isStoreInFaverate = 0;
           if(resNew.rows.item(0).isLike == 1)
             this.checkIsLike = 1;
           else
             this.checkIsLike = 0;
           if(resNew.rows.item(0).isDisLike == 1)
             this.checkDisLike = 1;
           else
             this.checkDisLike = 0;
         }
         if(resNew.rows.item(0).numberOfProducts != 0){
           this.segmentValues = 1;
           this.productsByStore = 1;
         }
         if(resNew.rows.item(0).numberOfOffers != 0){
           if(resNew.rows.item(0).numberOfProducts == 0)
             this.segmentValues = 2;
           this.offersByStore = 1;
         }
         if(resNew.rows.item(0).numberOfBranches != 0){
           if(resNew.rows.item(0).numberOfProducts == 0 && resNew.rows.item(0).numberOfOffers == 0)
             this.segmentValues = 3;
           this.branchesByStore = 1;
         }
         if(resNew.rows.item(0).numberOfProducts == 0 && resNew.rows.item(0).numberOfProducts == 0 && resNew.rows.item(0).numberOfProducts == 0) {
           this.segmentValues = 0;
           this.offersByStore = 0;
           this.productsByStore =0;
           this.branchesByStore = 0;
         }
         setTimeout(()=>{
           this.storesInformationSkeleton = false
         },2000);
       }).catch(e => {});
   }).catch(e => {});
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
  callStoreNumber(number:any){
    this.callNumber.callNumber(number, true)
      .then(res => {
        this.message = "يرجى الانتظار...";
        this.displayResult(this.message);
      })
      .catch(err => {
        this.message = "لم تتم عملية الاتصال بامتجر بنجاح...حاول مرة اخرى";
        this.displayResult(this.message);
      });
  }
  getLocationMap(address:any){
    this.geolocation.getCurrentPosition().then(position=>{
      let options: LaunchNavigatorOptions = {
        app: this.launchNavigator.APP.GOOGLE_MAPS,
      };
      let res = address.split(",");
      this.launchNavigator.navigate([res[0], res[1]],options)
        .then(success =>{
          this.message = "يرجى الانتظار...";
          this.displayResult(this.message);
        },error=>{
          this.message = "يرجى التحقق من تشغيل ميزة الموقع في الجهاز";
          this.displayResult(this.message);
        })
    }).catch(e=>{
      this.message = "يرجى التحقق من تشغيل ميزة الموقع في الجهاز";
      this.displayResult(this.message);
    })
  }
  async functionSortAndFilter(typeVal:any,segmentNumber:any,lastSelectData:any=0,lastTowSelectData:any=0){
    let model = await this.modalController.create({
      component:SortandfilterComponent,
      animated:true,
      componentProps:{typeVal:typeVal,segmentNumber:segmentNumber,lastSelectData:lastSelectData,lastTowSelectData:lastTowSelectData},
      cssClass:"modalFilterSortCss"
    });
    model.onDidDismiss().then(data=>{
      this.lastOfferSortSelect = data.data.offersSoarting;
      if(this.lastOfferSortSelect !=0 && this.lastOfferSortSelect!=0 && this.lastOfferSortSelect!=null)
        this.functionReturnOffers(this.lastOfferSortSelect)
      this.lastProductsOneSortSelect = data.data.productsOneSorting;
      this.lastProductsTowFilterSelect = data.data.productsTowSorting;
        this.functionReturnProducts(this.selectedData,this.lastProductsOneSortSelect,this.lastProductsTowFilterSelect)
      this.lastBranchesFilterSelect = data.data.regionsBranches;
        this.functionReturnBranches(this.lastBranchesFilterSelect)
      this.segmentValues = data.data.segmentNumber;
    })
    await model.present();
  }
  functionOffersInformation(offerId:any){
    this.router.navigate(['/offerdetails', {offerId:offerId,pageBackOffers:3}])
  }
  functionProductsInformation(productsId:any,storeId:any){
    this.router.navigate(['/productsdetails', {proId:productsId,storeId:storeId}])
  }
  searchAllValues(){
    this.navCtrl.navigateRoot(['/search', {searchValues:this.searchValues}]);
  }
  async functionAddProductToCart(proId,index){
    this.insertAllIngredientsPro=[];
    await this.sqlite.create({
      name: "arreb.db",
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql(`select * FROM ingredientsPro where productsId= ?`, [proId])
        .then((resNew) =>{
          for(let i = 0; i < resNew.rows.length;i++){
            this.insertAllIngredientsPro.push(resNew.rows.item(i).title);
          }
        }).catch(e => {});
    }).catch(e => {});
    this.sqlite.create({
      name: "arreb.db",
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql(`select * FROM stores where id=?`, [this.storeId])
        .then((resNew) =>{
          //storesCat
          let storeName = resNew.rows.item(0).title;
          let deliveryTime = resNew.rows.item(0).deliveryTime;
          let deliveryPrices = resNew.rows.item(0).deliveryPrices;
          let deliveryAnotherTime = resNew.rows.item(0).deliveryAnotherTime;
          let deliveryAnotherPrice = resNew.rows.item(0).deliveryAnotherPrice;
          let taxPrice =  resNew.rows.item(0).taxPrice;
          //productsCart
          let id=proId;
          let storeId = this.storeId ;
          let productName = this.returnProductsByStoreArray[index]['title'];
          this.realPrice = this.returnProductsByStoreArray[index]['price'];
          if(this.returnProductsByStoreArray[index]['offerPrice']!="" && this.returnProductsByStoreArray[index]['offerPrice']!=undefined  && this.returnProductsByStoreArray[index]['offerPrice']!=null  && this.returnProductsByStoreArray[index]['offerPrice']!=0){
            this.realPrice = this.returnProductsByStoreArray[index]['offerPrice'];
          }
          let price  = this.realPrice
          let additions = "";
          let options = "";
          let ingredients = "";
          if(this.insertAllIngredientsPro.length!=0)
            ingredients = this.insertAllIngredientsPro.toString();
          let image = this.returnProductsByStoreArray[index]['smallImage'];
          let quantity  = 1;
          let type = 1;

          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql(`select * FROM storesCart where id=?`, [this.storeId])
              .then((resNewCart) =>{
                if(resNewCart.rows.length!=0){
                  let allPrice = parseFloat(this.realPrice)+parseFloat(resNewCart.rows.item(0).allPrice);
                  this.sqlite.create({
                    name: "arreb.db",
                    location: 'default'
                  }).then((db: SQLiteObject) => {
                    db.executeSql(`UPDATE storesCart SET allPrice='${allPrice}' where id=?`, [storeId])
                      .then(() => {})
                      .catch(e => {});
                  }).catch(e => {});
                  this.sqlite.create({
                    name: "arreb.db",
                    location: 'default'
                  }).then((db: SQLiteObject) => {
                    db.executeSql(`select * FROM productsCart where id=? AND type=? AND addFrom=?`, [id,1,1])
                      .then((resNewproductsCart) => {
                        if(resNewproductsCart.rows.length==0){
                          this.sqlite.create({
                            name: "arreb.db",
                            location: 'default'
                          }).then((db: SQLiteObject) => {
                            db.executeSql(`INSERT INTO productsCart (id,storeId,productName,price,additions,options,ingredients,quantity,image,type)
                             VALUES ('${id}','${storeId}','${productName}','${price}','${additions}','${options}','${ingredients}','${quantity}','${image}','${type}')`, [])
                              .then(() => {
                                this.storage.get('productInShopingCart').then(productInShopingCart=>{
                                  this.productInShopingCart = productInShopingCart+1;
                                  if(productInShopingCart==null || productInShopingCart=="" ||  productInShopingCart==0 )
                                    this.productInShopingCart = 1;
                                  this.storage.set('productInShopingCart',this.productInShopingCart);
                                });
                              })
                              .catch(e => {});
                          }).catch(e => {});
                        }else{
                          quantity = parseInt(resNewproductsCart.rows.item(0).quantity)+1;
                          this.sqlite.create({
                            name: "arreb.db",
                            location: 'default'
                          }).then((db: SQLiteObject) => {
                            db.executeSql(`UPDATE productsCart SET quantity='${quantity}' where id=?`, [id])
                              .then(() => {})
                              .catch(e => {});
                          }).catch(e => {});
                        }
                      })
                      .catch(e => {});
                  }).catch(e => {});
                }else{
                  let allPrice = this.realPrice;
                  this.sqlite.create({
                    name: "arreb.db",
                    location: 'default'
                  }).then((db: SQLiteObject) => {
                    db.executeSql(`INSERT OR REPLACE INTO storesCart (id,storeName,allPrice,deliveryTime,deliveryPrices,deliveryAnotherTime,deliveryAnotherPrice,taxPrice)
                    VALUES ('${storeId}','${storeName}','${allPrice}','${deliveryTime}','${deliveryPrices}','${deliveryAnotherTime}','${deliveryAnotherPrice}','${taxPrice}')`, [])
                      .then(() => {})
                      .catch(e => {});
                  }).catch(e => {});

                  this.sqlite.create({
                    name: "arreb.db",
                    location: 'default'
                  }).then((db: SQLiteObject) => {
                    db.executeSql(`INSERT INTO productsCart (id,storeId,productName,price,additions,options,ingredients,quantity,image,type,addFrom)
                    VALUES ('${id}','${storeId}','${productName}','${price}','${additions}','${options}','${ingredients}','${quantity}','${image}','${type}','1')`, [])
                      .then(() => {
                        this.storage.get('productInShopingCart').then(productInShopingCart=>{
                          this.productInShopingCart = productInShopingCart+1;
                          if(productInShopingCart==null || productInShopingCart=="" ||  productInShopingCart==0 )
                            this.productInShopingCart = 1;
                          this.storage.set('productInShopingCart',this.productInShopingCart);
                        });
                      })
                      .catch(e => {});
                  }).catch(e => {});
                }
                this.message = "تم إضافة المنتج على سلة الشراء";
                this.displayResult(this.message);
              }).catch(e => {});
          }).catch(e => {})
        }).catch(e => {});
    }).catch(e => {})
  }
  async functionAddOffersToCart(offerId,index){
    this.insertAllIngredientsOffer=[];
    await this.sqlite.create({
      name: "arreb.db",
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql(`select * FROM ingredientsOffer where productsId= ?`, [offerId])
        .then((resNew) =>{
          for(let i = 0; i < resNew.rows.length;i++){
            this.insertAllIngredientsOffer.push(resNew.rows.item(i).title);
          }
        }).catch(e => {});
    }).catch(e => {});
    this.sqlite.create({
      name: "arreb.db",
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql(`select * FROM stores where id=?`, [this.storeId])
        .then((resNew) =>{
          //storesCat
          let storeName = resNew.rows.item(0).title;
          let deliveryTime = resNew.rows.item(0).deliveryTime;
          let deliveryPrices = resNew.rows.item(0).deliveryPrices;
          let deliveryAnotherTime = resNew.rows.item(0).deliveryAnotherTime;
          let deliveryAnotherPrice = resNew.rows.item(0).deliveryAnotherPrice;
          let taxPrice =  resNew.rows.item(0).taxPrice;
          //productsCart
          let id=offerId;
          let storeId = this.storeId ;
          let productName = this.returnOffersByStoreArray[index]['title'];
          this.realPrice = this.returnOffersByStoreArray[index]['price'];
          let price  = this.realPrice
          let additions = "";
          let options = "";
          let ingredients = "";
          if(this.insertAllIngredientsOffer.length!=0)
            ingredients = this.insertAllIngredientsOffer.toString();
          let image = this.returnOffersByStoreArray[index]['image'];
          let quantity  = 1;
          let type = 2;
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql(`select * FROM storesCart where id=?`, [this.storeId])
              .then((resNewCart) =>{
                if(resNewCart.rows.length!=0){
                  let allPrice = parseFloat(this.realPrice)+parseFloat(resNewCart.rows.item(0).allPrice);
                  this.sqlite.create({
                    name: "arreb.db",
                    location: 'default'
                  }).then((db: SQLiteObject) => {
                    db.executeSql(`UPDATE storesCart SET allPrice='${allPrice}' where id=?`, [storeId])
                      .then(() => {})
                      .catch(e => {});
                  }).catch(e => {});
                  this.sqlite.create({
                    name: "arreb.db",
                    location: 'default'
                  }).then((db: SQLiteObject) => {
                    db.executeSql(`select * FROM productsCart where id=? AND type=? AND addFrom=?`, [id,2,1])
                      .then((resNewOffersCart) => {
                        if(resNewOffersCart.rows.length==0){
                          this.sqlite.create({
                            name: "arreb.db",
                            location: 'default'
                          }).then((db: SQLiteObject) => {
                            db.executeSql(`INSERT INTO productsCart (id,storeId,productName,price,additions,options,ingredients,quantity,image,type,addFrom)
                            VALUES ('${id}','${storeId}','${productName}','${price}','${additions}','${options}','${ingredients}','${quantity}','${image}','${type}','1')`, [])
                              .then(() => {
                                this.storage.get('productInShopingCart').then(productInShopingCart=>{
                                  this.productInShopingCart = productInShopingCart+1;
                                  if(productInShopingCart==null || productInShopingCart=="" ||  productInShopingCart==0 )
                                    this.productInShopingCart = 1;
                                  this.storage.set('productInShopingCart',this.productInShopingCart);
                                });
                              })
                              .catch(e => {});
                          }).catch(e => {});
                        }else{
                          quantity = parseInt(resNewOffersCart.rows.item(0).quantity)+1;
                          this.sqlite.create({
                            name: "arreb.db",
                            location: 'default'
                          }).then((db: SQLiteObject) => {
                            db.executeSql(`UPDATE productsCart SET quantity='${quantity}' where id=?`, [id])
                              .then(() => {})
                              .catch(e => {});
                          }).catch(e => {});
                        }
                      })
                      .catch(e => {});
                  }).catch(e => {});
                }else{
                  let allPrice = this.realPrice;
                  this.sqlite.create({
                    name: "arreb.db",
                    location: 'default'
                  }).then((db: SQLiteObject) => {
                    db.executeSql(`INSERT OR REPLACE INTO storesCart (id,storeName,allPrice,deliveryTime,deliveryPrices,deliveryAnotherTime,deliveryAnotherPrice,taxPrice)
                    VALUES ('${storeId}','${storeName}','${allPrice}','${deliveryTime}','${deliveryPrices}','${deliveryAnotherTime}','${deliveryAnotherPrice}','${taxPrice}')`, [])
                      .then(() => {})
                      .catch(e => {});
                  }).catch(e => {});

                  this.sqlite.create({
                    name: "arreb.db",
                    location: 'default'
                  }).then((db: SQLiteObject) => {
                    db.executeSql(`INSERT INTO productsCart (id,storeId,productName,price,additions,options,ingredients,quantity,image,type,addFrom)
                    VALUES ('${id}','${storeId}','${productName}','${price}','${additions}','${options}','${ingredients}','${quantity}','${image}','${type}','1')`, [])
                      .then(() => {
                        this.storage.get('productInShopingCart').then(productInShopingCart=>{
                          this.productInShopingCart = productInShopingCart+1;
                          if(productInShopingCart==null || productInShopingCart=="" ||  productInShopingCart==0 )
                            this.productInShopingCart = 1;
                          this.storage.set('productInShopingCart',this.productInShopingCart);
                        });
                      })
                      .catch(e => {});
                  }).catch(e => {});
                }
                this.message = "تم إضافة العرض على سلة الشراء";
                this.displayResult(this.message);
              }).catch(e => {});
          }).catch(e => {})
        }).catch(e => {});
    }).catch(e => {})
  }

  async functionAddFavorites(storeId:any,countOfData:any){
    this.userId = await this.storage.get('userId');
    this.storesService.addFave(storeId,this.userId ).then(data=>{
      this.returnStoresForeData = data;
      this.operationResult = this.returnStoresForeData.Error.ErrorCode;
      if(this.operationResult==1){
        this.isStoreInFaverate='1';
        if(this.countOfStoresFav == null || this.countOfStoresFav == undefined || this.countOfStoresFav =="" )
          this.countOfStoresFav = 0;
        let countOfVal = parseInt(countOfData, 10)+1;
        this.storage.set('countOfStoresFav',countOfVal);
        this.realFollowers=countOfVal;
        this.returnStoresInformationFollowers =  this.realFollowers;
        if(this.realFollowers > 1000){
          let val = Math.floor( this.realFollowers/1000);
          this.returnStoresInformationFollowers  = val+"K";
        }
        this.message = "تم  إضافة المتجر على قائمة المفضلة بنجاح";
        this.displayResult(this.message);

        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE stores SET followers='${this.realFollowers}',isFav=1 where id=?`, [storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});

        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE stores SET followers='${this.realFollowers}',isFav=1 where id=?`, [storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});

        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE allstores SET followers='${this.realFollowers}',isFav=1 where id=?`, [storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});

        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE searchStores SET followers='${this.realFollowers}',isFav=1 where id=?`, [storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});

        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`INSERT OR REPLACE INTO favouriteStores (id,catName,subCatName,title,image,storeImage,description,latlang,locationName,regionName,mobile,rate,countRate,countLike,countDisLike,followers,deliveryPrices,deliveryTime,startTime,endTime,numberOfProducts,numberOfOffers,numberOfBranches,special,four,isFav,isLike,isDisLike)
                VALUES ('${this.returnStoresInformationId}','${this.returnStoresInformationCatId}'
                ,'${this.returnStoresInformationSubCatId}','${this.returnStoresInformationTitle}'
                ,'${this.returnStoresInformationImage}','${this.returnStoresInformationStoreImage}','${this.returnStoresInformationDescription}'
                ,'${this.returnStoresInformationLatlang}','${this.returnStoresInformationLocationName}'
                ,'${this.returnStoresInformationRegion}','${this.returnStoresInformationMobile}'
                ,'${this.returnStoresInformationRate}','${this.returnStoresInformationCountRate}'
                ,'${this.returnStoresInformationCountLike}','${this.returnStoresInformationCountDisLike}'
                ,'${this.realFollowers}','${this.returnStoresInformationDeliveryPrices}'
                ,'${this.returnStoresInformationDeliveryTime}','${this.returnStoresInformationStartTime}'
                ,'${this.returnStoresInformationEndTime}','${this.returnStoresInformationNumberOfProducts}'
                ,'${this.returnStoresInformationNumberOfOffers}','${this.returnStoresInformationNumberOfBranches}'
                ,'${this.returnStoresInformationSpecial}','${this.returnStoresInformationFour}','1','${this.returnStoresInformationIsLike}','${this.returnStoresInformationIsDisLike}')`, [])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});
      }
    });
  }
  async functionRemoveFavorites(storeId:any,countOfData:any){
    this.userId = await this.storage.get('userId');
    this.countOfStoresFav = await this.storage.get('countOfStoresFav');
    this.storesService.removFav(storeId,this.userId ).then(data=>{
      this.returnStoresForeData = data;
      this.operationResult = this.returnStoresForeData.Error.ErrorCode;
      if(this.operationResult==1){
        this.isStoreInFaverate='0';
        if(this.countOfStoresFav == null || this.countOfStoresFav == undefined || this.countOfStoresFav =="" )
          this.countOfStoresFav = 0;
        let countOfVal = parseInt(this.countOfStoresFav, 10)-1;
        this.storage.set('countOfStoresFav',countOfVal);
        this.realFollowers= parseInt(countOfData, 10)-1;
        this.returnStoresInformationFollowers =  this.realFollowers;
        if(this.realFollowers > 1000){
          let val = Math.floor( this.realFollowers/1000);
          this.returnStoresInformationFollowers  = val+"K";
        }
        this.message = "تم حذف المتجر من قائمة المفضلة بنجاح";
        this.displayResult(this.message);
        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE stores SET followers='${this.realFollowers}',isFav=0 where id=?`, [storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});

        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE allstores SET followers='${this.realFollowers}',isFav=0 where id=?`, [storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});

        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE searchStores SET followers='${this.realFollowers}',isFav=0 where id=?`, [storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});

        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('DELETE FROM favouriteStores WHERE  id=?',[storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});

      }
    });
  }
  async functionAddLike(storeId:any,index:any,countOfData:any){
    this.userId = await this.storage.get('userId');
    this.storesService.addLike(storeId,this.userId ).then(data=>{
      this.returnStoresForeData = data;
      this.operationResult = this.returnStoresForeData.Error.ErrorCode;
      if(this.operationResult==1){
        this.checkIsLike='1';
        this.checkDisLike='1';
        this.returnStoresInformationCountLike=parseInt(countOfData, 10)+1;
        if(this.returnStoresInformationCountLike > 1000){
          let val = Math.floor(this.returnStoresInformationCountLike/1000);
          this.returnStoresInformationCountLike  = val+"K";
        }
        this.message = "شكرا...تم تسجيل إعجابك بالمتجر بنجاح";
        this.displayResult(this.message);
        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE stores SET countLike='${this.returnStoresInformationCountLike}',isLike=1 where id=?`, [storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});
        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE allstores SET countLike='${this.returnStoresInformationCountLike}',isLike=1 where id=?`, [storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});
        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE searchStores SET countLike='${this.returnStoresInformationCountLike}',isLike=1 where id=?`, [storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});
        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE favouriteStores SET countLike='${this.returnStoresInformationCountLike}',isLike=1 where id=?`, [storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});
      }
    });
  }
  async functionAddDislike(storeId:any,index:any,countOfData:any){
    this.userId = await this.storage.get('userId');
    this.storesService.dislike(storeId,this.userId ).then(data=>{
      this.returnStoresForeData = data;
      this.operationResult = this.returnStoresForeData.Error.ErrorCode;
      if(this.operationResult==1){
        this.checkIsLike='1';
        this.checkDisLike='1';
        this.returnStoresInformationCountDisLike=parseInt(countOfData, 10)+1;
        if(this.returnStoresInformationCountDisLike > 1000){
          let val = Math.floor(this.returnStoresInformationCountDisLike/1000);
          this.returnStoresInformationCountDisLike  = val+"K";
        }
        this.message = "شكرا...تم تسجيل عدم إعجابك بالمتجر بنجاح";
        this.displayResult(this.message);
        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE stores SET countDisLike='${this.returnStoresInformationCountDisLike}',isDisLike=1 where id=?`, [storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});
        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE allstores SET countDisLike='${this.returnStoresInformationCountDisLike}',isDisLike=1 where id=?`, [storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});
        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE searchStores SET countDisLike='${this.returnStoresInformationCountDisLike}',isDisLike=1 where id=?`, [storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});

        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE favouriteStores SET countDisLike='${this.returnStoresInformationCountDisLike}',isDisLike=1 where id=?`, [storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});
      }
    });
  }
  async backToStores(){
    let pageBack = await this.storage.get("pageBack");
    if(pageBack == 1)
      this.navCtrl.navigateRoot("/stores");
    if(pageBack == 2)
      this.navCtrl.navigateRoot("/favouritestores");
    if(pageBack == 3)
      this.navCtrl.navigateRoot("/search");
    if(pageBack == 4)
      this.navCtrl.navigateRoot("/home");
  }
  segmentChanged(event){
    this.selectSegment = event.target.value
  }
  functionGoToHome(){
    this.navCtrl.navigateRoot("/home");
  }
  functionGoToStores(){
    this.navCtrl.navigateRoot("/stores");
  }
  functionGoToShoppingcart(){
    this.navCtrl.navigateRoot("/shoppingcart");
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
}
