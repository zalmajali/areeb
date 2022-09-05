import {Component, OnInit,ViewChild,Renderer2,ElementRef} from '@angular/core';
import {MenuController, Platform, NavController, IonSlides,ToastController,ModalController,IonInput} from '@ionic/angular';
import {CategoriesService} from "../../services/categories.service";
import {StoresService} from "../../services/stores.service";
import { Network } from '@ionic-native/network/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Router } from '@angular/router';
import {Storage} from "@ionic/storage";
import {SortandfilterComponent} from "../sortandfilter/sortandfilter.component";
import { IonInfiniteScroll } from '@ionic/angular';
@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild('showAllDivCat',{read:ElementRef}) showAllDivCat;
  @ViewChild('showDivCat',{read:ElementRef}) showDivCat;
  @ViewChild('slidesOffersHome',{static:false}) slides:IonSlides;
  @ViewChild('searchInput', {static:true}) searchInput:IonInput;
  loopingNumber:any = 1;
  categoriesSkeleton:boolean = true;
  offersSkeleton:any=false;
  subCategoriesSkeleton:any=false;
  returnCategoriesArray:any = [];
  categories:any=1;
  returnArraySubCatFromServer:any;
  subCategories:any=1;
  returnSubCategoriesArray:any = [];
  returnSubCategoriesData:any
  catSelected:any = [];
  subCatSelected:any = [];
  selectedTypaOfOperationFilter:any=0;
  lastAllOfferSortSelect:any;
  returnAllOffersArray:any = [];
  operationResult:any;
  returnAllOffersData:any;
  returnArrayAllOffersFromServer:any;
  offers:any=1;
  countOfAllValues:any;
  countOfAllValuesDivOnTen:any;
  lightFilter:any="filterIconNew";
  filterLight:any="filterNotLight";
  fullNameLogin:any;
  emailLogin:any;
  showLinkFavourite:any=0;

  returnAdditionsData:any;
  returnArrayAdditionsFromServer:any
  returnArraySubAdditionsFromServer:any = [];
  returnOptionsData:any;
  returnArrayOptionsFromServer:any
  returnArraySubOptionsFromServer:any = [];
  returnIngredientsData:any;
  returnArrayIngredientsFromServer:any;
  insertAllIngredientsOffer:any = [];
  searchValues:any;
  message:any;
  productInShopingCart:any;
  constructor(private renderer:Renderer2,private toastCtrl: ToastController,private modalController: ModalController,private router : Router,private sqlite: SQLite,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private categoriesService:CategoriesService,private storesService:StoresService) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','offers');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.navigateRoot("/home");
    });
  }
  functionFeachDataFromServer(fromWhereGetData:any=0){
    if(fromWhereGetData==0){
      let limit = this.loopingNumber*10;
      this.offersSkeleton = true;
      this.returnAllOffersArray=[];
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(`select * FROM offers LIMIT ${limit}`, [])
          .then((resNew) =>{
            for(let i = 0; i < resNew.rows.length;i++){
              this.returnAllOffersArray[i]=[];
              this.returnAllOffersArray[i]['id'] = resNew.rows.item(i).id;
              this.returnAllOffersArray[i]['storeId'] = resNew.rows.item(i).storeId;
              this.returnAllOffersArray[i]['title'] = resNew.rows.item(i).title;
              this.returnAllOffersArray[i]['description'] = resNew.rows.item(i).description;
              this.returnAllOffersArray[i]['price'] = resNew.rows.item(i).price;
              this.returnAllOffersArray[i]['startDate'] = resNew.rows.item(i).startDate;
              this.returnAllOffersArray[i]['endDate'] = resNew.rows.item(i).endDate;
              this.returnAllOffersArray[i]['duration'] = resNew.rows.item(i).duration;
              this.returnAllOffersArray[i]['type'] = resNew.rows.item(i).type;
              this.returnAllOffersArray[i]['image'] = resNew.rows.item(i).image;
              if(this.returnAllOffersArray[i]['image'] == null || this.returnAllOffersArray[i]['image'] == undefined || this.returnAllOffersArray[i]['image']=="" || this.returnAllOffersArray[i]['image']==0)
                this.returnAllOffersArray[i]['image'] = "../../assets/imgs/def3.png";
            }
            let countOfData = this.returnAllOffersArray.length;
            if(countOfData == 0){
              this.offers = 0;
            }
            else{
              this.offers = countOfData;
              setTimeout(()=>{
                this.offersSkeleton = false
              },2000);
            }
          }).catch(e => {});
      }).catch(e => {});

      let limitNew = this.loopingNumber+1;
      let selectedVal= this.catSelected.toString();
      let subCatSelected= this.subCatSelected.toString();
      if(this.lastAllOfferSortSelect == undefined || this.lastAllOfferSortSelect == "" || this.lastAllOfferSortSelect == 0 || this.lastAllOfferSortSelect == null)
        this.lastAllOfferSortSelect = 0;
      this.storesService.allOffers(selectedVal,subCatSelected,this.lastAllOfferSortSelect,limitNew).then(data=>{
        this.returnAllOffersData = data;
        this.operationResult = this.returnAllOffersData.Error.ErrorCode;
        if(this.operationResult==1){
          this.returnArrayAllOffersFromServer = this.returnAllOffersData.Data.offersHome;
          for(let i = 0; i < this.returnArrayAllOffersFromServer.length;i++) {
            this.storesService.additions(this.returnArrayAllOffersFromServer[i].id,2).then(data=>{
              this.returnAdditionsData = data;
              this.operationResult = this.returnAdditionsData.Error.ErrorCode;
              if(this.operationResult==1) {
                this.returnArrayAdditionsFromServer = this.returnAdditionsData.Data.additions;
                for (let i = 0; i < this.returnArrayAdditionsFromServer.length; i++) {
                  this.sqlite.create({
                    name: "arreb.db",
                    location: 'default'
                  }).then((db: SQLiteObject) => {
                    db.executeSql(`INSERT OR REPLACE INTO categoriesAdditionsOffer (id,productsId,title,type) VALUES ('${this.returnArrayAdditionsFromServer[i].id}','${this.returnArrayAdditionsFromServer[i].productsId}','${this.returnArrayAdditionsFromServer[i].catName}','${this.returnArrayAdditionsFromServer[i].type}')`, [])
                      .then(() => {})
                      .catch(e => {});
                  }).catch(e => {});
                  this.returnArraySubAdditionsFromServer = this.returnArrayAdditionsFromServer[i].additions;
                  for (let j = 0; j < this.returnArraySubAdditionsFromServer.length; j++) {
                    this.sqlite.create({
                      name: "arreb.db",
                      location: 'default'
                    }).then((db: SQLiteObject) => {
                      db.executeSql(`INSERT OR REPLACE INTO additionsOffer (id,productsId,catId,title,price) VALUES ('${this.returnArraySubAdditionsFromServer[j].id}','${this.returnArraySubAdditionsFromServer[j].productsId}','${this.returnArraySubAdditionsFromServer[j].catId}','${this.returnArraySubAdditionsFromServer[j].title}','${this.returnArraySubAdditionsFromServer[j].price}')`, [])
                        .then(() => {})
                        .catch(e => {});
                    }).catch(e => {});
                  }
                }
              }
            });
            this.storesService.options(this.returnArrayAllOffersFromServer[i].id,2).then(data=>{
              this.returnOptionsData = data;
              this.operationResult = this.returnOptionsData.Error.ErrorCode;
              if(this.operationResult==1) {
                this.returnArrayOptionsFromServer = this.returnOptionsData.Data.options;
                for (let i = 0; i < this.returnArrayOptionsFromServer.length; i++) {
                  this.sqlite.create({
                    name: "arreb.db",
                    location: 'default'
                  }).then((db: SQLiteObject) => {
                    db.executeSql(`INSERT OR REPLACE INTO categoriesAdditionsOffer (id,productsId,title,type) VALUES ('${this.returnArrayOptionsFromServer[i].id}','${this.returnArrayOptionsFromServer[i].productsId}','${this.returnArrayOptionsFromServer[i].catName}','${this.returnArrayOptionsFromServer[i].type}')`, [])
                      .then(() => {})
                      .catch(e => {});
                  }).catch(e => {});
                  this.returnArraySubOptionsFromServer = this.returnArrayOptionsFromServer[i].options;
                  for (let j = 0; j < this.returnArraySubOptionsFromServer.length; j++) {
                    this.sqlite.create({
                      name: "arreb.db",
                      location: 'default'
                    }).then((db: SQLiteObject) => {
                      db.executeSql(`INSERT OR REPLACE INTO optionsOffer (id,productsId,catId,title) VALUES ('${this.returnArraySubOptionsFromServer[j].id}','${this.returnArraySubOptionsFromServer[j].productsId}','${this.returnArraySubOptionsFromServer[j].catId}','${this.returnArraySubOptionsFromServer[j].title}')`, [])
                        .then(() => {})
                        .catch(e => {});
                    }).catch(e => {});
                  }
                }
              }
            });
            this.storesService.ingredients(this.returnArrayAllOffersFromServer[i].id,2).then(data=>{
              this.returnIngredientsData = data;
              this.operationResult = this.returnIngredientsData.Error.ErrorCode;
              if(this.operationResult==1) {
                this.returnArrayIngredientsFromServer = this.returnIngredientsData.Data.ingredients;
                for (let i = 0; i < this.returnArrayIngredientsFromServer.length; i++) {
                  this.sqlite.create({
                    name: "arreb.db",
                    location: 'default'
                  }).then((db: SQLiteObject) => {
                    db.executeSql(`INSERT OR REPLACE INTO ingredientsOffer (id,productsId,title) VALUES ('${this.returnArrayIngredientsFromServer[i].id}','${this.returnArrayIngredientsFromServer[i].productsId}','${this.returnArrayIngredientsFromServer[i].title}')`, [])
                      .then(() => {})
                      .catch(e => {});
                  }).catch(e => {});
                }
              }
            });
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO offers (id,storeId,title,description,price,startDate,endDate,duration,type,image,image1,image2,image3,image4,isOfferHome) VALUES ('${this.returnArrayAllOffersFromServer[i].id}','${this.returnArrayAllOffersFromServer[i].storeId}','${this.returnArrayAllOffersFromServer[i].title}','${this.returnArrayAllOffersFromServer[i].description}','${this.returnArrayAllOffersFromServer[i].price}','${this.returnArrayAllOffersFromServer[i].startDate}','${this.returnArrayAllOffersFromServer[i].endDate}','${this.returnArrayAllOffersFromServer[i].duration}','${this.returnArrayAllOffersFromServer[i].type}','${this.returnArrayAllOffersFromServer[i].image}','${this.returnArrayAllOffersFromServer[i].image1}','${this.returnArrayAllOffersFromServer[i].image2}','${this.returnArrayAllOffersFromServer[i].image3}','${this.returnArrayAllOffersFromServer[i].image4}','1')`, [])
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
          }
        }
      });
    }else
      {
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DELETE FROM  offers ',[])
          .then(() => {})
          .catch(e => {});
      }).catch(e => {});
      this.loopingNumber = 1;
      this.offersSkeleton = true;
      //بس بجيب من السيرفر مباشرةو بجيب 10 ثانية
        this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
        this.returnAllOffersArray=[];
      let selectedVal= this.catSelected.toString();
      let subCatSelected= this.subCatSelected.toString();
      if(this.lastAllOfferSortSelect == undefined || this.lastAllOfferSortSelect == "" || this.lastAllOfferSortSelect == 0 || this.lastAllOfferSortSelect == null)
        this.lastAllOfferSortSelect = 0;
      this.storesService.allOffers(selectedVal,subCatSelected,this.lastAllOfferSortSelect,1).then(data=>{
        this.returnAllOffersData = data;
        this.operationResult = this.returnAllOffersData.Error.ErrorCode;
        if(this.operationResult==1){
          this.returnArrayAllOffersFromServer = this.returnAllOffersData.Data.offers;
          this.countOfAllValues =  this.returnAllOffersData.Data.countOfData;
          this.countOfAllValuesDivOnTen =  Math.ceil(this.countOfAllValues/10);
          for(let i = 0; i < this.returnArrayAllOffersFromServer.length;i++) {
            this.returnAllOffersArray[i]=[];
            this.returnAllOffersArray[i]['id'] = this.returnArrayAllOffersFromServer[i].id;
            this.returnAllOffersArray[i]['storeId'] = this.returnArrayAllOffersFromServer[i].storeId;
            this.returnAllOffersArray[i]['title'] = this.returnArrayAllOffersFromServer[i].title;
            this.returnAllOffersArray[i]['description'] = this.returnArrayAllOffersFromServer[i].description;
            this.returnAllOffersArray[i]['price'] = this.returnArrayAllOffersFromServer[i].price;
            this.returnAllOffersArray[i]['startDate'] = this.returnArrayAllOffersFromServer[i].startDate;
            this.returnAllOffersArray[i]['endDate'] = this.returnArrayAllOffersFromServer[i].endDate;
            this.returnAllOffersArray[i]['duration'] = this.returnArrayAllOffersFromServer[i].duration;
            this.returnAllOffersArray[i]['type'] = this.returnArrayAllOffersFromServer[i].type;
            this.returnAllOffersArray[i]['image'] = this.returnArrayAllOffersFromServer[i].image;
            if(this.returnAllOffersArray[i]['image'] == null || this.returnAllOffersArray[i]['image'] == undefined || this.returnAllOffersArray[i]['image']=="" || this.returnAllOffersArray[i]['image']==0)
              this.returnAllOffersArray[i]['image'] = "../../assets/imgs/def3.png";
            this.storesService.additions(this.returnArrayAllOffersFromServer[i].id,2).then(data=>{
              this.returnAdditionsData = data;
              this.operationResult = this.returnAdditionsData.Error.ErrorCode;
              if(this.operationResult==1) {
                this.returnArrayAdditionsFromServer = this.returnAdditionsData.Data.additions;
                for (let i = 0; i < this.returnArrayAdditionsFromServer.length; i++) {
                  this.sqlite.create({
                    name: "arreb.db",
                    location: 'default'
                  }).then((db: SQLiteObject) => {
                    db.executeSql(`INSERT OR REPLACE INTO categoriesAdditionsOffer (id,productsId,title,type) VALUES ('${this.returnArrayAdditionsFromServer[i].id}','${this.returnArrayAdditionsFromServer[i].productsId}','${this.returnArrayAdditionsFromServer[i].catName}','${this.returnArrayAdditionsFromServer[i].type}')`, [])
                      .then(() => {})
                      .catch(e => {});
                  }).catch(e => {});
                  this.returnArraySubAdditionsFromServer = this.returnArrayAdditionsFromServer[i].additions;
                  for (let j = 0; j < this.returnArraySubAdditionsFromServer.length; j++) {
                    this.sqlite.create({
                      name: "arreb.db",
                      location: 'default'
                    }).then((db: SQLiteObject) => {
                      db.executeSql(`INSERT OR REPLACE INTO additionsOffer (id,productsId,catId,title,price) VALUES ('${this.returnArraySubAdditionsFromServer[j].id}','${this.returnArraySubAdditionsFromServer[j].productsId}','${this.returnArraySubAdditionsFromServer[j].catId}','${this.returnArraySubAdditionsFromServer[j].title}','${this.returnArraySubAdditionsFromServer[j].price}')`, [])
                        .then(() => {})
                        .catch(e => {});
                    }).catch(e => {});
                  }
                }
              }
            });
            this.storesService.options(this.returnArrayAllOffersFromServer[i].id,2).then(data=>{
              this.returnOptionsData = data;
              this.operationResult = this.returnOptionsData.Error.ErrorCode;
              if(this.operationResult==1) {
                this.returnArrayOptionsFromServer = this.returnOptionsData.Data.options;
                for (let i = 0; i < this.returnArrayOptionsFromServer.length; i++) {
                  this.sqlite.create({
                    name: "arreb.db",
                    location: 'default'
                  }).then((db: SQLiteObject) => {
                    db.executeSql(`INSERT OR REPLACE INTO categoriesAdditionsOffer (id,productsId,title,type) VALUES ('${this.returnArrayOptionsFromServer[i].id}','${this.returnArrayOptionsFromServer[i].productsId}','${this.returnArrayOptionsFromServer[i].catName}','${this.returnArrayOptionsFromServer[i].type}')`, [])
                      .then(() => {})
                      .catch(e => {});
                  }).catch(e => {});
                  this.returnArraySubOptionsFromServer = this.returnArrayOptionsFromServer[i].options;
                  for (let j = 0; j < this.returnArraySubOptionsFromServer.length; j++) {
                    this.sqlite.create({
                      name: "arreb.db",
                      location: 'default'
                    }).then((db: SQLiteObject) => {
                      db.executeSql(`INSERT OR REPLACE INTO optionsOffer (id,productsId,catId,title) VALUES ('${this.returnArraySubOptionsFromServer[j].id}','${this.returnArraySubOptionsFromServer[j].productsId}','${this.returnArraySubOptionsFromServer[j].catId}','${this.returnArraySubOptionsFromServer[j].title}')`, [])
                        .then(() => {})
                        .catch(e => {});
                    }).catch(e => {});
                  }
                }
              }
            });
            this.storesService.ingredients(this.returnArrayAllOffersFromServer[i].id,2).then(data=>{
              this.returnIngredientsData = data;
              this.operationResult = this.returnIngredientsData.Error.ErrorCode;
              if(this.operationResult==1) {
                this.returnArrayIngredientsFromServer = this.returnIngredientsData.Data.ingredients;
                for (let i = 0; i < this.returnArrayIngredientsFromServer.length; i++) {
                  this.sqlite.create({
                    name: "arreb.db",
                    location: 'default'
                  }).then((db: SQLiteObject) => {
                    db.executeSql(`INSERT OR REPLACE INTO ingredientsOffer (id,productsId,title) VALUES ('${this.returnArrayIngredientsFromServer[i].id}','${this.returnArrayIngredientsFromServer[i].productsId}','${this.returnArrayIngredientsFromServer[i].title}')`, [])
                      .then(() => {})
                      .catch(e => {});
                  }).catch(e => {});
                }
              }
            });
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO offers (id,storeId,title,description,price,startDate,endDate,duration,type,image,image1,image2,image3,image4,isOfferHome) VALUES ('${this.returnArrayAllOffersFromServer[i].id}','${this.returnArrayAllOffersFromServer[i].storeId}','${this.returnArrayAllOffersFromServer[i].title}','${this.returnArrayAllOffersFromServer[i].description}','${this.returnArrayAllOffersFromServer[i].price}','${this.returnArrayAllOffersFromServer[i].startDate}','${this.returnArrayAllOffersFromServer[i].endDate}','${this.returnArrayAllOffersFromServer[i].duration}','${this.returnArrayAllOffersFromServer[i].type}','${this.returnArrayAllOffersFromServer[i].image}','${this.returnArrayAllOffersFromServer[i].image1}','${this.returnArrayAllOffersFromServer[i].image2}','${this.returnArrayAllOffersFromServer[i].image3}','${this.returnArrayAllOffersFromServer[i].image4}','1')`, [])
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
          }
          let countOfData = this.returnAllOffersArray.length;
          if(countOfData == 0){
            this.offers = 0;
          }
          else{
            this.offers = 1;
          }
        }else{
          this.offers = 0;
        }
        setTimeout(()=>{
          this.offersSkeleton = false
        },2000);
      });
      this.storesService.allOffers(selectedVal,subCatSelected,this.lastAllOfferSortSelect,2).then(data=>{
        this.returnAllOffersData = data;
        this.operationResult = this.returnAllOffersData.Error.ErrorCode;
        if(this.operationResult==1){
          this.returnArrayAllOffersFromServer = this.returnAllOffersData.Data.offers;
          for(let i = 0; i < this.returnArrayAllOffersFromServer.length;i++) {
            this.storesService.additions(this.returnArrayAllOffersFromServer[i].id,2).then(data=>{
              this.returnAdditionsData = data;
              this.operationResult = this.returnAdditionsData.Error.ErrorCode;
              if(this.operationResult==1) {
                this.returnArrayAdditionsFromServer = this.returnAdditionsData.Data.additions;
                for (let i = 0; i < this.returnArrayAdditionsFromServer.length; i++) {
                  this.sqlite.create({
                    name: "arreb.db",
                    location: 'default'
                  }).then((db: SQLiteObject) => {
                    db.executeSql(`INSERT OR REPLACE INTO categoriesAdditionsOffer (id,productsId,title,type) VALUES ('${this.returnArrayAdditionsFromServer[i].id}','${this.returnArrayAdditionsFromServer[i].productsId}','${this.returnArrayAdditionsFromServer[i].catName}','${this.returnArrayAdditionsFromServer[i].type}')`, [])
                      .then(() => {})
                      .catch(e => {});
                  }).catch(e => {});
                  this.returnArraySubAdditionsFromServer = this.returnArrayAdditionsFromServer[i].additions;
                  for (let j = 0; j < this.returnArraySubAdditionsFromServer.length; j++) {
                    this.sqlite.create({
                      name: "arreb.db",
                      location: 'default'
                    }).then((db: SQLiteObject) => {
                      db.executeSql(`INSERT OR REPLACE INTO additionsOffer (id,productsId,catId,title,price) VALUES ('${this.returnArraySubAdditionsFromServer[j].id}','${this.returnArraySubAdditionsFromServer[j].productsId}','${this.returnArraySubAdditionsFromServer[j].catId}','${this.returnArraySubAdditionsFromServer[j].title}','${this.returnArraySubAdditionsFromServer[j].price}')`, [])
                        .then(() => {})
                        .catch(e => {});
                    }).catch(e => {});
                  }
                }
              }
            });
            this.storesService.options(this.returnArrayAllOffersFromServer[i].id,2).then(data=>{
              this.returnOptionsData = data;
              this.operationResult = this.returnOptionsData.Error.ErrorCode;
              if(this.operationResult==1) {
                this.returnArrayOptionsFromServer = this.returnOptionsData.Data.options;
                for (let i = 0; i < this.returnArrayOptionsFromServer.length; i++) {
                  this.sqlite.create({
                    name: "arreb.db",
                    location: 'default'
                  }).then((db: SQLiteObject) => {
                    db.executeSql(`INSERT OR REPLACE INTO categoriesAdditionsOffer (id,productsId,title,type) VALUES ('${this.returnArrayOptionsFromServer[i].id}','${this.returnArrayOptionsFromServer[i].productsId}','${this.returnArrayOptionsFromServer[i].catName}','${this.returnArrayOptionsFromServer[i].type}')`, [])
                      .then(() => {})
                      .catch(e => {});
                  }).catch(e => {});
                  this.returnArraySubOptionsFromServer = this.returnArrayOptionsFromServer[i].options;
                  for (let j = 0; j < this.returnArraySubOptionsFromServer.length; j++) {
                    this.sqlite.create({
                      name: "arreb.db",
                      location: 'default'
                    }).then((db: SQLiteObject) => {
                      db.executeSql(`INSERT OR REPLACE INTO optionsOffer (id,productsId,catId,title) VALUES ('${this.returnArraySubOptionsFromServer[j].id}','${this.returnArraySubOptionsFromServer[j].productsId}','${this.returnArraySubOptionsFromServer[j].catId}','${this.returnArraySubOptionsFromServer[j].title}')`, [])
                        .then(() => {})
                        .catch(e => {});
                    }).catch(e => {});
                  }
                }
              }
            });
            this.storesService.ingredients(this.returnArrayAllOffersFromServer[i].id,2).then(data=>{
              this.returnIngredientsData = data;
              this.operationResult = this.returnIngredientsData.Error.ErrorCode;
              if(this.operationResult==1) {
                this.returnArrayIngredientsFromServer = this.returnIngredientsData.Data.ingredients;
                for (let i = 0; i < this.returnArrayIngredientsFromServer.length; i++) {
                  this.sqlite.create({
                    name: "arreb.db",
                    location: 'default'
                  }).then((db: SQLiteObject) => {
                    db.executeSql(`INSERT OR REPLACE INTO ingredientsOffer (id,productsId,title) VALUES ('${this.returnArrayIngredientsFromServer[i].id}','${this.returnArrayIngredientsFromServer[i].productsId}','${this.returnArrayIngredientsFromServer[i].title}')`, [])
                      .then(() => {})
                      .catch(e => {});
                  }).catch(e => {});
                }
              }
            });
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO offers (id,storeId,title,description,price,startDate,endDate,duration,type,image,image1,image2,image3,image4,isOfferHome) VALUES ('${this.returnArrayAllOffersFromServer[i].id}','${this.returnArrayAllOffersFromServer[i].storeId}','${this.returnArrayAllOffersFromServer[i].title}','${this.returnArrayAllOffersFromServer[i].description}','${this.returnArrayAllOffersFromServer[i].price}','${this.returnArrayAllOffersFromServer[i].startDate}','${this.returnArrayAllOffersFromServer[i].endDate}','${this.returnArrayAllOffersFromServer[i].duration}','${this.returnArrayAllOffersFromServer[i].type}','${this.returnArrayAllOffersFromServer[i].image}','${this.returnArrayAllOffersFromServer[i].image1}','${this.returnArrayAllOffersFromServer[i].image2}','${this.returnArrayAllOffersFromServer[i].image3}','${this.returnArrayAllOffersFromServer[i].image4}','1')`, [])
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
          }
        }
      });
    }
  }
  async ngOnInit() {
    this.storage.get('productInShopingCart').then(productInShopingCart=>{
      this.productInShopingCart = productInShopingCart;
      if(productInShopingCart==null || productInShopingCart=="" ||  productInShopingCart==0 )
        this.productInShopingCart = 0;
    });
    this.fullNameLogin = await this.storage.get('fullNameLogin');
    this.emailLogin = await this.storage.get('emailLogin');
    if(this.fullNameLogin!=null || this.emailLogin!=null)
      this.showLinkFavourite = 1;

    this.countOfAllValues = await this.storage.get('countOfOffer');
    this.countOfAllValuesDivOnTen =  Math.ceil(this.countOfAllValues/10);
    this.functionFeachDataFromServer()
    this.categoriesSkeleton = true;
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
            this.returnCategoriesArray[i]['checked'] = "catLabel";
            this.returnCategoriesArray[i]['operation'] = "0";
          }
          let countOfData = this.returnCategoriesArray.length;
          if(countOfData == 0)
            this.categories = 0;
          else{
            this.categories = 1;
          }
          setTimeout(()=>{
            this.categoriesSkeleton = false
          },2000);
        }).catch(e => {
        setTimeout(()=>{
          this.categoriesSkeleton = false
        },2000);
      });
    }).catch(e => {
      setTimeout(()=>{
        this.categoriesSkeleton = false
      },2000);
    });
  }
  functionGetSubCatAndSelectCat(catId:any,index:any,operation:any) {
    if (operation == 0) {
      this.returnCategoriesArray[index]['checked'] = "catLabelCheck";
      this.returnCategoriesArray[index]['operation'] = "1";
      this.catSelected.push(catId);
    } else {
      this.returnCategoriesArray[index]['checked'] = "catLabel";
      for (var j = 0; j < this.catSelected.length; j++) {
        if (this.catSelected[j] === catId)
          this.catSelected.splice(j, 1);
      }
      this.returnCategoriesArray[index]['operation'] = "0";
    }
      this.showSubCatBySelectCat(this.catSelected);
    this.functionFeachDataFromServer(1);
  }
  functionSelectSubCat(catId:any,index:any,operation:any) {
    if (operation == 0) {
      this.returnSubCategoriesArray[index]['checked'] = "textSliderChecked";
      this.returnSubCategoriesArray[index]['operation'] = "1";
      this.subCatSelected.push(catId);
    } else {
      this.returnSubCategoriesArray[index]['checked'] = "textSlider";
      for (var j = 0; j < this.catSelected.length; j++) {
        if (this.subCatSelected[j] === catId)
          this.subCatSelected.splice(j, 1);
      }
      this.returnSubCategoriesArray[index]['operation'] = "0";
    }
    this.functionFeachDataFromServer(1);
  }
  showSubCatBySelectCat(selectedCat:any){
    this.subCategoriesSkeleton = true;
    let selectedVal= selectedCat.toString();
    this.returnSubCategoriesArray=[];
    this.sqlite.create({
      name: "arreb.db",
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql(`select * FROM subCategories WHERE catId IN (${selectedVal})`, [])
        .then((resNew) =>{
          for(let i = 0; i < resNew.rows.length;i++){
            this.returnSubCategoriesArray[i]=[];
            this.returnSubCategoriesArray[i]['id'] = resNew.rows.item(i).id;
            this.returnSubCategoriesArray[i]['title'] = resNew.rows.item(i).title;
            this.returnSubCategoriesArray[i]['checked'] = "textSlider";
            this.returnSubCategoriesArray[i]['operation'] = "0";
          }
          let countOfData = this.returnSubCategoriesArray.length;
          if(countOfData == 0)
            this.subCategories = 0;
          else{
            this.subCategories = 1;
          }
          setTimeout(()=>{
            this.subCategoriesSkeleton = false
          },2000);
        }).catch(e => {});
    }).catch(e => {});
  }
  functionShowFilterInfo(valType:any){
    if(valType == 0){
      this.selectedTypaOfOperationFilter = 1;
      this.lightFilter="filterIconNewLight";
      this.filterLight="filterLight"
      setTimeout(() => {
        this.renderer.setStyle(this.showAllDivCat.nativeElement,'height','auto')
      }, 700);
      setTimeout(() => {
        this.renderer.setStyle(this.showDivCat.nativeElement,'opacity','1')
      }, 500);
    }else{
      this.lightFilter="filterIconNew";
      this.filterLight="filterNotLight"
      this.selectedTypaOfOperationFilter = 0;
      this.renderer.setStyle(this.showDivCat.nativeElement,'opacity','0');
      setTimeout(() => {
        this.renderer.setStyle(this.showAllDivCat.nativeElement,'height','0px')
      }, 2000);
    }
  }
  async functionSortAndFilter(typeVal:any,segmentNumber:any=1,lastSelectData:any=0,lastTowSelectData:any=0){
    let model = await this.modalController.create({
      component:SortandfilterComponent,
      animated:true,
      componentProps:{typeVal:typeVal,segmentNumber:segmentNumber,lastSelectData:lastSelectData,lastTowSelectData:lastTowSelectData},
      cssClass:"modalFilterSortCss"
    });
    model.onDidDismiss().then(data=>{
      this.lastAllOfferSortSelect = data.data.allOfferSorting;
      if(this.lastAllOfferSortSelect !=undefined && this.lastAllOfferSortSelect!=0 && this.lastAllOfferSortSelect!=null)
        this.functionFeachDataFromServer(1)
    })
    await model.present();
  }
  loadMoreData(event) {
    this.loopingNumber++;
    setTimeout(() => {
      this.functionFeachDataFromServer()
      event.target.complete();
      if (this.loopingNumber >= this.countOfAllValuesDivOnTen) {
        event.target.disabled = true;
      }
    }, 2000);
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
      db.executeSql(`select * FROM stores where id=?`, [this.returnAllOffersArray[index]['storeId']])
        .then((resNew) =>{
          //storesCat
          let storeName = resNew.rows.item(0).title;
          let deliveryTime = resNew.rows.item(0).deliveryTime;
          let deliveryPrices = resNew.rows.item(0).deliveryPrices;
          //productsCart
          let id=offerId;
          let storeId = this.returnAllOffersArray[index]['storeId'] ;
          let productName = this.returnAllOffersArray[index]['title'];
          let price  = this.returnAllOffersArray[index]['price'];
          let additions = "";
          let options = "";
          let ingredients = "";
          if(this.insertAllIngredientsOffer.length!=0)
            ingredients = this.insertAllIngredientsOffer.toString();
          let image = this.returnAllOffersArray[index]['image'];
          let quantity  = 1;
          let type = 2;

          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql(`select * FROM storesCart where id=?`, [storeId])
              .then((resNewCart) =>{
                if(resNewCart.rows.length!=0){
                  let allPrice = parseFloat(price)+parseFloat(resNewCart.rows.item(0).allPrice);
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
                  let allPrice = price;
                  this.sqlite.create({
                    name: "arreb.db",
                    location: 'default'
                  }).then((db: SQLiteObject) => {
                    db.executeSql(`INSERT OR REPLACE INTO storesCart (id,storeName,allPrice,deliveryTime,deliveryPrices)
                    VALUES ('${storeId}','${storeName}','${allPrice}','${deliveryTime}','${deliveryPrices}')`, [])
                      .then(() => {})
                      .catch(e => {});
                  }).catch(e => {});

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
                }
                this.message = "تم إضافة المنتج على سلة الشراء";
                this.displayResult(this.message);
              }).catch(e => {});
          }).catch(e => {})
        }).catch(e => {});
    }).catch(e => {})
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
  async backToStores(){
    this.navCtrl.navigateRoot("/home");
  }
  refrechAllPage(event) {
    this.loopingNumber = 1;
    this.lastAllOfferSortSelect = 1;
    this.catSelected = [];
    this.subCatSelected = [];
    this.functionFeachDataFromServer(1);
    setTimeout(() => {
      event.target.complete();
    }, 2000);
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }
  searchAllValues(){
    this.navCtrl.navigateRoot(['/search', {searchValues:this.searchValues}]);
  }
  functionOffersInformation(offerId:any){
    this.router.navigate(['/offerdetails', {offerId:offerId,pageBackOffers:1}])
  }
}
