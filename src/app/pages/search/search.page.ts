import {Component, OnInit,ViewChild,Renderer2,ElementRef} from '@angular/core';
import {MenuController, Platform, NavController, IonSlides,IonInput,ToastController,ModalController} from '@ionic/angular';
import {CategoriesService} from "../../services/categories.service";
import {StoresService} from "../../services/stores.service";
import { Network } from '@ionic-native/network/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Router,ActivatedRoute } from '@angular/router';
import {Storage} from "@ionic/storage";
import {SortandfilterComponent} from "../sortandfilter/sortandfilter.component";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  @ViewChild('searchInput', {static:true}) searchInput:IonInput;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild('showAllDivCat',{read:ElementRef}) showAllDivCat;
  @ViewChild('showDivCat',{read:ElementRef}) showDivCat;
  @ViewChild('slidesOffersHome',{static:false}) slides:IonSlides;
  storesStoreSkeleton:boolean=true;
  loopingNumber:any = 1;
  countOfAllValuesDivOnTen:any;
  lastAllStoresSortSelect:any;
  catSelected:any = [];
  subCatSelected:any = [];
  countOfAllValues:any;
  categoriesSkeleton:boolean=true;
  returnCategoriesArray:any = [];
  categories:any=1;
  subCategoriesSkeleton:boolean=true;
  returnSubCategoriesArray:any = [];
  subCategories:any=1;
  selectedTypaOfOperationFilter:any=0;
  lightFilter:any="filterIconNew";
  filterLight:any="filterNotLight";
  fullNameLogin:any;
  emailLogin:any;
  showLinkFavourite:any=0;
  stores:any=2;
  returnAllStoresArray:any = [];
  returnAllStoresDataNext :any;
  operationResult:any;
  returnArrayAllStoresNextFromServer:any;
  region:any=[];
  returnAllStoresData:any;
  returnArrayAllStoresFromServer:any;
  returnAllStoresNewData:any;
  returnArrayAllStoresNewFromServer:any = [];
  returnStoresHomeData:any;
  returnArrayStoresHomeFromServer:any;
  returnStoresForeData:any;
  returnArrayStoresForeFromServer:any;
  message:any;
  regionsStoreSelected:any;
  regionCount:any = "المناطق";
  showTypeOfShowData:any="filterIconNewLight";
  showTypeOfShowDataTow:any="filterIconShowData";
  typeShow:any=1;
  userId:any;
  homeCategories:any = 0;
  selectedCatValFromHome:any = 0;
  storageCat:any;
  storageSubCat:any;
  storageragion:any;
  searchValues:any;
  countOfStoresFav:any;
  productInShopingCart:any;
  constructor(private activaterouter : ActivatedRoute,private toastCtrl: ToastController,private callNumber: CallNumber,public geolocation: Geolocation,private launchNavigator: LaunchNavigator,private renderer:Renderer2,private modalController: ModalController,private router : Router,private sqlite: SQLite,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private categoriesService:CategoriesService,private storesService:StoresService) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','search');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.navigateRoot("/home");
    });
  }
  /*ionViewDidEnter() {
    setTimeout(() => {
      this.searchInput.setFocus();
    },500);
  }*/
  functionFeachDataFromServer(serverOrData:any=0,op:any=0){
    if(serverOrData == 0){
      this.returnAllStoresArray=[];
      let limit = this.loopingNumber*10;
      this.storesStoreSkeleton = true;
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(`select * FROM searchStores LIMIT ${limit}`, [])
          .then((resNew) =>{
            for(let i = 0; i < resNew.rows.length;i++){
              this.returnAllStoresArray[i]=[];
              this.returnAllStoresArray[i]['id'] = resNew.rows.item(i).id;
              this.returnAllStoresArray[i]['catName'] = resNew.rows.item(i).catName;
              this.returnAllStoresArray[i]['subCatName'] = resNew.rows.item(i).subCatName;
              this.returnAllStoresArray[i]['title'] = resNew.rows.item(i).title;
              this.returnAllStoresArray[i]['image'] = resNew.rows.item(i).image;
              this.returnAllStoresArray[i]['storeImage'] = resNew.rows.item(i).storeImage;
              this.returnAllStoresArray[i]['latlang'] = resNew.rows.item(i).latlang;
              this.returnAllStoresArray[i]['mobile'] = resNew.rows.item(i).mobile;
              this.returnAllStoresArray[i]['regionName'] = resNew.rows.item(i).regionName;
              this.returnAllStoresArray[i]['rate'] = resNew.rows.item(i).rate;
              this.returnAllStoresArray[i]['storeNote'] = resNew.rows.item(i).store_note;
              if(this.showLinkFavourite  == 1){
                if(resNew.rows.item(i).isFav == 1)
                  this.returnAllStoresArray[i]['checkFav'] = 1;
                else
                  this.returnAllStoresArray[i]['checkFav'] = 0;
                if(resNew.rows.item(i).isLike == 1)
                  this.returnAllStoresArray[i]['checkIsLike'] = 1;
                else
                  this.returnAllStoresArray[i]['checkIsLike'] = 0;
                if(resNew.rows.item(i).isDisLike == 1)
                  this.returnAllStoresArray[i]['checkDisLike'] = 1;
                else
                  this.returnAllStoresArray[i]['checkDisLike'] = 0;
              }
              this.returnAllStoresArray[i]['realCountRate'] = resNew.rows.item(i).countRate;
              this.returnAllStoresArray[i]['countRate'] = resNew.rows.item(i).countRate;
              if(resNew.rows.item(i).countRate > 1000){
                let val = Math.floor(resNew.rows.item(i).countRate/1000);
                this.returnAllStoresArray[i]['countRate']  = val+"K";
              }
              this.returnAllStoresArray[i]['realCountLike'] = resNew.rows.item(i).countLike;
              this.returnAllStoresArray[i]['countLike'] = resNew.rows.item(i).countLike;
              if(resNew.rows.item(i).countLike > 1000){
                let val = Math.floor(resNew.rows.item(i).countLike/1000);
                this.returnAllStoresArray[i]['countLike']  = val+"K";
              }
              this.returnAllStoresArray[i]['realCountDisLike'] = resNew.rows.item(i).countDisLike;
              this.returnAllStoresArray[i]['countDisLike'] = resNew.rows.item(i).countDisLike;
              if(resNew.rows.item(i).countDisLike > 1000){
                let val = Math.floor(resNew.rows.item(i).countDisLike/1000);
                this.returnAllStoresArray[i]['countDisLike']  = val+"K";
              }
              this.returnAllStoresArray[i]['realFollowers'] = resNew.rows.item(i).followers;
              this.returnAllStoresArray[i]['followers'] = resNew.rows.item(i).followers;
              if(resNew.rows.item(i).followers > 1000){
                let val = Math.floor(resNew.rows.item(i).followers/1000);
                this.returnAllStoresArray[i]['followers']  = val+"K";
              }
              this.returnAllStoresArray[i]['deliveryPrices'] = resNew.rows.item(i).deliveryPrices;
              this.returnAllStoresArray[i]['deliveryTime'] = resNew.rows.item(i).deliveryTime;
              this.returnAllStoresArray[i]['deliveryAnotherPrice'] = resNew.rows.item(i).deliveryAnotherPrice;
              this.returnAllStoresArray[i]['deliveryAnotherTime'] = resNew.rows.item(i).deliveryAnotherTime;
              this.returnAllStoresArray[i]['taxPrice'] = resNew.rows.item(i).taxPrice;
              this.returnAllStoresArray[i]['closeStore'] = resNew.rows.item(i).closeStore;
              this.returnAllStoresArray[i]['closeStoreByCat'] = resNew.rows.item(i).closeStoreByCat;
              this.returnAllStoresArray[i]['closeAllStores'] = resNew.rows.item(i).closeAllStores;

              if(this.returnAllStoresArray[i]['image'] == null || this.returnAllStoresArray[i]['image'] == undefined || this.returnAllStoresArray[i]['image']=="" || this.returnAllStoresArray[i]['image']==0)
                this.returnAllStoresArray[i]['image'] = "../../assets/imgs/def5.png";
              if(this.returnAllStoresArray[i]['storeImage'] == null || this.returnAllStoresArray[i]['storeImage'] == undefined || this.returnAllStoresArray[i]['storeImage']=="" || this.returnAllStoresArray[i]['storeImage']==0)
                this.returnAllStoresArray[i]['storeImage'] = "../../assets/imgs/def3.png";
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
              let closeStore = resNew.rows.item(i).closeStore;
              let closeStoreByCat = resNew.rows.item(i).closeStoreByCat;
              let closeAllStores = resNew.rows.item(i).closeAllStores;
              this.returnAllStoresArray[i]['closeStore'] = 0;
              if(closeStore == 1 || closeStoreByCat == 1 || closeAllStores == 1){
                this.returnAllStoresArray[i]['closeStore'] = 1;
              }else{
                if(devicTimeStamp < sroreStartTimeStamp || devicTimeStamp > sroreEndTimeStamp)
                  this.returnAllStoresArray[i]['closeStore'] = 1;
              }
            }
            let countOfData = this.returnAllStoresArray.length;
            if(countOfData == 0){
              this.stores = 0;
            }
            else{
              this.stores = 1;
              setTimeout(()=>{
                this.storesStoreSkeleton = false
              },2000);
            }
          }).catch(e => {
          this.stores = 0;
        });
      }).catch(e => {
        this.stores = 0;
      });
      let limitNew = this.loopingNumber+1;
      let selectedVal= this.catSelected.toString();
      let subCatSelected= this.subCatSelected.toString();
      if(this.lastAllStoresSortSelect == undefined || this.lastAllStoresSortSelect == "" || this.lastAllStoresSortSelect == 0 || this.lastAllStoresSortSelect == null)
        this.lastAllStoresSortSelect = 0;
      this.storesService.searchStores(selectedVal,subCatSelected,this.lastAllStoresSortSelect,this.regionsStoreSelected,limitNew,this.searchValues).then(data=>{
        this.returnAllStoresDataNext = data;
        this.operationResult = this.returnAllStoresDataNext.Error.ErrorCode;
        if(this.operationResult==1){
          this.returnArrayAllStoresNextFromServer = this.returnAllStoresDataNext.Data.stores;
          for(let i = 0; i < this.returnArrayAllStoresNextFromServer.length;i++) {
            let imageStore= this.returnArrayAllStoresNextFromServer[i].image;
            if(this.returnArrayAllStoresNextFromServer[i].image == null || this.returnArrayAllStoresNextFromServer[i].image == undefined || this.returnArrayAllStoresNextFromServer[i].image=="" || this.returnArrayAllStoresNextFromServer[i].image==0)
              imageStore = "../../assets/imgs/def5.png";
            let imageStoreLarg = this.returnArrayAllStoresNextFromServer[i].storeImage;
            if(this.returnArrayAllStoresNextFromServer[i].storeImage == null || this.returnArrayAllStoresNextFromServer[i].storeImage  == undefined || this.returnArrayAllStoresNextFromServer[i].storeImage=="" || this.returnArrayAllStoresNextFromServer[i].storeImage ==0)
              imageStoreLarg  = "../../assets/imgs/def3.png";
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO stores (id,catName,subCatName,title,image,storeImage,description,latlang,locationName,regionName,mobile,rate,countRate,countLike,countDisLike,followers,deliveryPrices,deliveryTime,startTime,endTime,numberOfProducts,numberOfOffers,numberOfBranches,special,four,isFav,isLike,isDisLike,deliveryAnotherPrice,deliveryAnotherTime,taxPrice,closeStore,closeStoreByCat,closeAllStores,store_note)
                VALUES ('${this.returnArrayAllStoresNextFromServer[i].id}','${this.returnArrayAllStoresNextFromServer[i].catName}'
                ,'${this.returnArrayAllStoresNextFromServer[i].subCatName}','${this.returnArrayAllStoresNextFromServer[i].title}'
                ,'${imageStore}','${imageStoreLarg}','${this.returnArrayAllStoresNextFromServer[i].description}'
                ,'${this.returnArrayAllStoresNextFromServer[i].latlang}','${this.returnArrayAllStoresNextFromServer[i].locationName}'
                ,'${this.returnArrayAllStoresNextFromServer[i].regionName}','${this.returnArrayAllStoresNextFromServer[i].mobile}'
                ,'${this.returnArrayAllStoresNextFromServer[i].rate}','${this.returnArrayAllStoresNextFromServer[i].countRate}'
                ,'${this.returnArrayAllStoresNextFromServer[i].countLike}','${this.returnArrayAllStoresNextFromServer[i].countDisLike}'
                ,'${this.returnArrayAllStoresNextFromServer[i].followers}','${this.returnArrayAllStoresNextFromServer[i].deliveryPrices}'
                ,'${this.returnArrayAllStoresNextFromServer[i].deliveryTime}','${this.returnArrayAllStoresNextFromServer[i].startTime}'
                ,'${this.returnArrayAllStoresNextFromServer[i].endTime}','${this.returnArrayAllStoresNextFromServer[i].numberOfProducts}'
                ,'${this.returnArrayAllStoresNextFromServer[i].numberOfOffers}','${this.returnArrayAllStoresNextFromServer[i].numberOfBranches}'
                ,'${this.returnArrayAllStoresNextFromServer[i].special}','${this.returnArrayAllStoresNextFromServer[i].four}'
                ,'${this.returnArrayAllStoresNextFromServer[i].isFav}','${this.returnArrayAllStoresNextFromServer[i].isLike}'
                ,'${this.returnArrayAllStoresNextFromServer[i].isDisLike}'
                ,'${this.returnArrayAllStoresNextFromServer[i].deliveryAnotherPrice}'
                ,'${this.returnArrayAllStoresNextFromServer[i].deliveryAnotherTime}'
                ,'${this.returnArrayAllStoresNextFromServer[i].taxPrice}'
                ,'${this.returnArrayAllStoresNextFromServer[i].closeStore}'
                ,'${this.returnArrayAllStoresNextFromServer[i].closeStoreByCat}'
                ,'${this.returnArrayAllStoresNextFromServer[i].closeAllStores}','${this.returnArrayAllStoresNextFromServer[i].storeNote}')`, [])
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO searchStores (id,catName,subCatName,title,image,storeImage,description,latlang,locationName,regionName,mobile,rate,countRate,countLike,countDisLike,followers,deliveryPrices,deliveryTime,startTime,endTime,numberOfProducts,numberOfOffers,numberOfBranches,special,four,isFav,isLike,isDisLike,deliveryAnotherPrice,deliveryAnotherTime,taxPrice,closeStore,closeStoreByCat,closeAllStores,store_note)
                VALUES ('${this.returnArrayAllStoresNextFromServer[i].id}','${this.returnArrayAllStoresNextFromServer[i].catName}'
                ,'${this.returnArrayAllStoresNextFromServer[i].subCatName}','${this.returnArrayAllStoresNextFromServer[i].title}'
                ,'${imageStore}','${imageStoreLarg}','${this.returnArrayAllStoresNextFromServer[i].description}'
                ,'${this.returnArrayAllStoresNextFromServer[i].latlang}','${this.returnArrayAllStoresNextFromServer[i].locationName}'
                ,'${this.returnArrayAllStoresNextFromServer[i].regionName}','${this.returnArrayAllStoresNextFromServer[i].mobile}'
                ,'${this.returnArrayAllStoresNextFromServer[i].rate}','${this.returnArrayAllStoresNextFromServer[i].countRate}'
                ,'${this.returnArrayAllStoresNextFromServer[i].countLike}','${this.returnArrayAllStoresNextFromServer[i].countDisLike}'
                ,'${this.returnArrayAllStoresNextFromServer[i].followers}','${this.returnArrayAllStoresNextFromServer[i].deliveryPrices}'
                ,'${this.returnArrayAllStoresNextFromServer[i].deliveryTime}','${this.returnArrayAllStoresNextFromServer[i].startTime}'
                ,'${this.returnArrayAllStoresNextFromServer[i].endTime}','${this.returnArrayAllStoresNextFromServer[i].numberOfProducts}'
                ,'${this.returnArrayAllStoresNextFromServer[i].numberOfOffers}','${this.returnArrayAllStoresNextFromServer[i].numberOfBranches}'
                ,'${this.returnArrayAllStoresNextFromServer[i].special}','${this.returnArrayAllStoresNextFromServer[i].four}'
                ,'${this.returnArrayAllStoresNextFromServer[i].isFav}','${this.returnArrayAllStoresNextFromServer[i].isLike}'
                ,'${this.returnArrayAllStoresNextFromServer[i].isDisLike}'
                ,'${this.returnArrayAllStoresNextFromServer[i].deliveryAnotherPrice}'
                ,'${this.returnArrayAllStoresNextFromServer[i].deliveryAnotherTime}'
                ,'${this.returnArrayAllStoresNextFromServer[i].taxPrice}'
                ,'${this.returnArrayAllStoresNextFromServer[i].closeStore}'
                ,'${this.returnArrayAllStoresNextFromServer[i].closeStoreByCat}'
                ,'${this.returnArrayAllStoresNextFromServer[i].closeAllStores}','${this.returnArrayAllStoresNextFromServer[i].storeNote}')`, [])
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
          }
        }
      });
    }else{
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DELETE FROM searchStores ',[])
          .then(() => {})
          .catch(e => {});
      }).catch(e => {});
      this.loopingNumber = 1;
      this.storesStoreSkeleton = true;
      let selectedVal= this.catSelected.toString();
      let subCatSelected= this.subCatSelected.toString();
      let region= this.region.toString();
      if(this.lastAllStoresSortSelect == undefined || this.lastAllStoresSortSelect == "" || this.lastAllStoresSortSelect == 0 || this.lastAllStoresSortSelect == null)
        this.lastAllStoresSortSelect = 0;
      this.storesService.searchStores(selectedVal,subCatSelected,this.lastAllStoresSortSelect,this.regionsStoreSelected,1,this.searchValues).then(data=>{
        this.returnAllStoresData = data;
        this.operationResult = this.returnAllStoresData.Error.ErrorCode;
        if(this.operationResult==1){
          this.returnAllStoresArray=[];
          this.returnArrayAllStoresFromServer = this.returnAllStoresData.Data.stores;
          this.countOfAllValues = this.returnAllStoresData.Data.countOfData;
          this.countOfAllValuesDivOnTen =  Math.ceil(this.countOfAllValues/10);
          for(let i = 0; i < this.returnArrayAllStoresFromServer.length;i++){
            this.returnAllStoresArray[i]=[];
            this.returnAllStoresArray[i]['id'] = this.returnArrayAllStoresFromServer[i].id;
            this.returnAllStoresArray[i]['catName'] = this.returnArrayAllStoresFromServer[i].catName;
            this.returnAllStoresArray[i]['subCatName'] = this.returnArrayAllStoresFromServer[i].subCatName;
            this.returnAllStoresArray[i]['title'] = this.returnArrayAllStoresFromServer[i].title;
            this.returnAllStoresArray[i]['image'] = this.returnArrayAllStoresFromServer[i].image;
            this.returnAllStoresArray[i]['storeImage'] = this.returnArrayAllStoresFromServer[i].storeImage;
            this.returnAllStoresArray[i]['latlang'] = this.returnArrayAllStoresFromServer[i].latlang;
            this.returnAllStoresArray[i]['mobile'] = this.returnArrayAllStoresFromServer[i].mobile;
            this.returnAllStoresArray[i]['storeNote'] = this.returnArrayAllStoresFromServer[i].storeNote;
            this.returnAllStoresArray[i]['regionName'] = this.returnArrayAllStoresFromServer[i].regionName;
            this.returnAllStoresArray[i]['rate'] = this.returnArrayAllStoresFromServer[i].rate;
            this.returnAllStoresArray[i]['isFav'] = this.returnArrayAllStoresFromServer[i].isFav;
            if(this.showLinkFavourite  == 1){
              if(this.returnArrayAllStoresFromServer[i].isFav == 1)
                this.returnAllStoresArray[i]['checkFav'] = 1;
              else
                this.returnAllStoresArray[i]['checkFav'] = 0;
              if(this.returnArrayAllStoresFromServer[i].isLike == 1)
                this.returnAllStoresArray[i]['checkIsLike'] = 1;
              else
                this.returnAllStoresArray[i]['checkIsLike'] = 0;
              if(this.returnArrayAllStoresFromServer[i].isDisLike == 1)
                this.returnAllStoresArray[i]['checkDisLike'] = 1;
              else
                this.returnAllStoresArray[i]['checkDisLike'] = 0;
            }
            this.returnAllStoresArray[i]['realCountRate'] = this.returnArrayAllStoresFromServer[i].countRate;
            this.returnAllStoresArray[i]['countRate'] = this.returnArrayAllStoresFromServer[i].countRate;
            if(this.returnArrayAllStoresFromServer[i].countRate > 1000){
              let val = Math.floor(this.returnArrayAllStoresFromServer[i].countRate/1000);
              this.returnAllStoresArray[i]['countRate']  = val+"K";
            }
            this.returnAllStoresArray[i]['realCountLike'] = this.returnArrayAllStoresFromServer[i].countLike;
            this.returnAllStoresArray[i]['countLike'] = this.returnArrayAllStoresFromServer[i].countLike;
            if(this.returnArrayAllStoresFromServer[i].countLike > 1000){
              let val = Math.floor(this.returnArrayAllStoresFromServer[i].countLike/1000);
              this.returnAllStoresArray[i]['countLike']  = val+"K";
            }
            this.returnAllStoresArray[i]['realCountDisLike'] = this.returnArrayAllStoresFromServer[i].countDisLike;
            this.returnAllStoresArray[i]['countDisLike'] = this.returnArrayAllStoresFromServer[i].countDisLike;
            if(this.returnArrayAllStoresFromServer[i].countDisLike > 1000){
              let val = Math.floor(this.returnArrayAllStoresFromServer[i].countDisLike/1000);
              this.returnAllStoresArray[i]['countDisLike']  = val+"K";
            }
            this.returnAllStoresArray[i]['realFollowers'] = this.returnArrayAllStoresFromServer[i].followers;
            this.returnAllStoresArray[i]['followers'] = this.returnArrayAllStoresFromServer[i].followers;
            if(this.returnArrayAllStoresFromServer[i].followers > 1000){
              let val = Math.floor(this.returnArrayAllStoresFromServer[i].followers/1000);
              this.returnAllStoresArray[i]['followers']  = val+"K";
            }
            this.returnAllStoresArray[i]['deliveryPrices'] = this.returnArrayAllStoresFromServer[i].deliveryPrices;
            this.returnAllStoresArray[i]['deliveryTime'] = this.returnArrayAllStoresFromServer[i].deliveryTime;
            this.returnAllStoresArray[i]['deliveryAnotherPrice'] = this.returnArrayAllStoresFromServer[i].deliveryAnotherPrice;
            this.returnAllStoresArray[i]['deliveryAnotherTime'] = this.returnArrayAllStoresFromServer[i].deliveryAnotherTime;
            this.returnAllStoresArray[i]['taxPrice'] = this.returnArrayAllStoresFromServer[i].taxPrice;
            this.returnAllStoresArray[i]['closeStore'] = this.returnArrayAllStoresFromServer[i].closeStore;
            this.returnAllStoresArray[i]['closeStoreByCat'] = this.returnArrayAllStoresFromServer[i].closeStoreByCat;
            this.returnAllStoresArray[i]['closeAllStores'] = this.returnArrayAllStoresFromServer[i].closeAllStores;
            if(this.returnAllStoresArray[i]['image'] == null || this.returnAllStoresArray[i]['image'] == undefined || this.returnAllStoresArray[i]['image']=="" || this.returnAllStoresArray[i]['image']==0)
              this.returnAllStoresArray[i]['image'] = "../../assets/imgs/def5.png";
            if(this.returnAllStoresArray[i]['storeImage'] == null || this.returnAllStoresArray[i]['storeImage'] == undefined || this.returnAllStoresArray[i]['storeImage']=="" || this.returnAllStoresArray[i]['storeImage']==0)
              this.returnAllStoresArray[i]['storeImage'] = "../../assets/imgs/def3.png";
            let Y = new Date().getFullYear();
            let m = new Date().getMonth();
            let d = new Date().getDate();
            let h = new Date().getHours();
            let min = new Date().getMinutes();
            let devicTime = new Date(Y, m, d, h, min);
            let devicTimeStamp = devicTime.getTime();
            let startTime  = this.returnArrayAllStoresFromServer[i].startTime.split(':');
            let endTime  = this.returnArrayAllStoresFromServer[i].endTime.split(':');
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
            let closeStore = this.returnArrayAllStoresFromServer[i].closeStore
            let closeStoreByCat = this.returnArrayAllStoresFromServer[i].closeStoreByCat
            let closeAllStores = this.returnArrayAllStoresFromServer[i].closeAllStores;
            this.returnAllStoresArray[i]['closeStore'] = 0;
            if(closeStore == 1 || closeStoreByCat == 1 || closeAllStores == 1){
              this.returnAllStoresArray[i]['closeStore'] = 1;
            }else{
              if(devicTimeStamp < sroreStartTimeStamp || devicTimeStamp > sroreEndTimeStamp)
                this.returnAllStoresArray[i]['closeStore'] = 1;
            }
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO stores (id,catName,subCatName,title,image,storeImage,description,latlang,locationName,regionName,mobile,rate,countRate,countLike,countDisLike,followers,deliveryPrices,deliveryTime,startTime,endTime,numberOfProducts,numberOfOffers,numberOfBranches,special,four,isFav,isLike,isDisLike,deliveryAnotherPrice,deliveryAnotherTime,taxPrice,closeStore,closeStoreByCat,closeAllStores,store_note)
                VALUES ('${this.returnArrayAllStoresFromServer[i].id}','${this.returnArrayAllStoresFromServer[i].catName}'
                ,'${this.returnArrayAllStoresFromServer[i].subCatName}','${this.returnArrayAllStoresFromServer[i].title}'
                ,'${this.returnAllStoresArray[i]['image']}','${this.returnAllStoresArray[i]['storeImage']}','${this.returnArrayAllStoresFromServer[i].description}'
                ,'${this.returnArrayAllStoresFromServer[i].latlang}','${this.returnArrayAllStoresFromServer[i].locationName}'
                ,'${this.returnArrayAllStoresFromServer[i].regionName}','${this.returnArrayAllStoresFromServer[i].mobile}'
                ,'${this.returnArrayAllStoresFromServer[i].rate}','${this.returnArrayAllStoresFromServer[i].countRate}'
                ,'${this.returnArrayAllStoresFromServer[i].countLike}','${this.returnArrayAllStoresFromServer[i].countDisLike}'
                ,'${this.returnArrayAllStoresFromServer[i].followers}','${this.returnArrayAllStoresFromServer[i].deliveryPrices}'
                ,'${this.returnArrayAllStoresFromServer[i].deliveryTime}','${this.returnArrayAllStoresFromServer[i].startTime}'
                ,'${this.returnArrayAllStoresFromServer[i].endTime}','${this.returnArrayAllStoresFromServer[i].numberOfProducts}'
                ,'${this.returnArrayAllStoresFromServer[i].numberOfOffers}','${this.returnArrayAllStoresFromServer[i].numberOfBranches}'
                ,'${this.returnArrayAllStoresFromServer[i].special}','${this.returnArrayAllStoresFromServer[i].four}'
                ,'${this.returnArrayAllStoresFromServer[i].isFav}','${this.returnArrayAllStoresFromServer[i].isLike}'
                ,'${this.returnArrayAllStoresFromServer[i].isDisLike}'
                ,'${this.returnArrayAllStoresFromServer[i].deliveryAnotherPrice}'
                ,'${this.returnArrayAllStoresFromServer[i].deliveryAnotherTime}'
                ,'${this.returnArrayAllStoresFromServer[i].taxPrice}'
                ,'${this.returnArrayAllStoresFromServer[i].closeStore}'
                ,'${this.returnArrayAllStoresFromServer[i].closeStoreByCat}'
                ,'${this.returnArrayAllStoresFromServer[i].closeAllStores}','${this.returnArrayAllStoresFromServer[i].storeNote}')`, [])
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO searchStores (id,catName,subCatName,title,image,storeImage,description,latlang,locationName,regionName,mobile,rate,countRate,countLike,countDisLike,followers,deliveryPrices,deliveryTime,startTime,endTime,numberOfProducts,numberOfOffers,numberOfBranches,special,four,isFav,isLike,isDisLike,deliveryAnotherPrice,deliveryAnotherTime,taxPrice,closeStore,closeStoreByCat,closeAllStores,store_note)
                VALUES ('${this.returnArrayAllStoresFromServer[i].id}','${this.returnArrayAllStoresFromServer[i].catName}'
                ,'${this.returnArrayAllStoresFromServer[i].subCatName}','${this.returnArrayAllStoresFromServer[i].title}'
                ,'${this.returnAllStoresArray[i]['image']}','${this.returnAllStoresArray[i]['storeImage']}','${this.returnArrayAllStoresFromServer[i].description}'
                ,'${this.returnArrayAllStoresFromServer[i].latlang}','${this.returnArrayAllStoresFromServer[i].locationName}'
                ,'${this.returnArrayAllStoresFromServer[i].regionName}','${this.returnArrayAllStoresFromServer[i].mobile}'
                ,'${this.returnArrayAllStoresFromServer[i].rate}','${this.returnArrayAllStoresFromServer[i].countRate}'
                ,'${this.returnArrayAllStoresFromServer[i].countLike}','${this.returnArrayAllStoresFromServer[i].countDisLike}'
                ,'${this.returnArrayAllStoresFromServer[i].followers}','${this.returnArrayAllStoresFromServer[i].deliveryPrices}'
                ,'${this.returnArrayAllStoresFromServer[i].deliveryTime}','${this.returnArrayAllStoresFromServer[i].startTime}'
                ,'${this.returnArrayAllStoresFromServer[i].endTime}','${this.returnArrayAllStoresFromServer[i].numberOfProducts}'
                ,'${this.returnArrayAllStoresFromServer[i].numberOfOffers}','${this.returnArrayAllStoresFromServer[i].numberOfBranches}'
                ,'${this.returnArrayAllStoresFromServer[i].special}','${this.returnArrayAllStoresFromServer[i].four}'
                ,'${this.returnArrayAllStoresFromServer[i].isFav}','${this.returnArrayAllStoresFromServer[i].isLike}'
                ,'${this.returnArrayAllStoresFromServer[i].isDisLike}'
                ,'${this.returnArrayAllStoresFromServer[i].deliveryAnotherPrice}'
                ,'${this.returnArrayAllStoresFromServer[i].deliveryAnotherTime}'
                ,'${this.returnArrayAllStoresFromServer[i].taxPrice}'
                ,'${this.returnArrayAllStoresFromServer[i].closeStore}'
                ,'${this.returnArrayAllStoresFromServer[i].closeStoreByCat}'
                ,'${this.returnArrayAllStoresFromServer[i].closeAllStores}','${this.returnArrayAllStoresFromServer[i].storeNote}')`, [])
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
          }
          let countOfData = this.returnAllStoresArray.length;
          if(countOfData == 0){
            this.stores = 0;
          }
          else{
            this.stores = 1;
            setTimeout(()=>{
              this.storesStoreSkeleton = false
            },2000);
          }
        }else
          this.stores = 0;
      });
      this.storesService.searchStores(selectedVal,subCatSelected,this.lastAllStoresSortSelect,this.regionsStoreSelected,2,this.searchValues).then(data=>{
        this.returnAllStoresNewData = data;
        this.operationResult = this.returnAllStoresNewData.Error.ErrorCode;
        if(this.operationResult==1){
          this.returnArrayAllStoresNewFromServer = this.returnAllStoresNewData.Data.stores;
          for(let i = 0; i < this.returnArrayAllStoresNewFromServer.length;i++){
            let image = this.returnArrayAllStoresNewFromServer[i].image;
            let storeImage = this.returnArrayAllStoresNewFromServer[i].storeImage;
            if(this.returnArrayAllStoresNewFromServer[i].image == null || this.returnArrayAllStoresNewFromServer[i].image == undefined || this.returnArrayAllStoresNewFromServer[i].image=="" || this.returnArrayAllStoresNewFromServer[i].image==0)
              image = "../../assets/imgs/def5.png";
            if(this.returnArrayAllStoresNewFromServer[i].storeImage == null || this.returnArrayAllStoresNewFromServer[i].storeImage == undefined || this.returnArrayAllStoresNewFromServer[i].storeImage =="" || this.returnArrayAllStoresNewFromServer[i].storeImage==0)
              storeImage = "../../assets/imgs/def3.png";
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO stores (id,catName,subCatName,title,image,storeImage,description,latlang,locationName,regionName,mobile,rate,countRate,countLike,countDisLike,followers,deliveryPrices,deliveryTime,startTime,endTime,numberOfProducts,numberOfOffers,numberOfBranches,special,four,isFav,isLike,isDisLike,deliveryAnotherPrice,deliveryAnotherTime,taxPrice,closeStore,closeStoreByCat,closeAllStores,store_note)
                VALUES ('${this.returnArrayAllStoresNewFromServer[i].id}','${this.returnArrayAllStoresNewFromServer[i].catName}'
                ,'${this.returnArrayAllStoresNewFromServer[i].subCatName}','${this.returnArrayAllStoresNewFromServer[i].title}'
                ,'${image}','${storeImage}','${this.returnArrayAllStoresNewFromServer[i].description}'
                ,'${this.returnArrayAllStoresNewFromServer[i].latlang}','${this.returnArrayAllStoresNewFromServer[i].locationName}'
                ,'${this.returnArrayAllStoresNewFromServer[i].regionName}','${this.returnArrayAllStoresNewFromServer[i].mobile}'
                ,'${this.returnArrayAllStoresNewFromServer[i].rate}','${this.returnArrayAllStoresNewFromServer[i].countRate}'
                ,'${this.returnArrayAllStoresNewFromServer[i].countLike}','${this.returnArrayAllStoresNewFromServer[i].countDisLike}'
                ,'${this.returnArrayAllStoresNewFromServer[i].followers}','${this.returnArrayAllStoresNewFromServer[i].deliveryPrices}'
                ,'${this.returnArrayAllStoresNewFromServer[i].deliveryTime}','${this.returnArrayAllStoresNewFromServer[i].startTime}'
                ,'${this.returnArrayAllStoresNewFromServer[i].endTime}','${this.returnArrayAllStoresNewFromServer[i].numberOfProducts}'
                ,'${this.returnArrayAllStoresNewFromServer[i].numberOfOffers}','${this.returnArrayAllStoresNewFromServer[i].numberOfBranches}'
                ,'${this.returnArrayAllStoresNewFromServer[i].special}','${this.returnArrayAllStoresNewFromServer[i].four}'
                ,'${this.returnArrayAllStoresNewFromServer[i].isFav}','${this.returnArrayAllStoresNewFromServer[i].isLike}'
                ,'${this.returnArrayAllStoresNewFromServer[i].isDisLike}'
                  ,'${this.returnArrayAllStoresNewFromServer[i].deliveryAnotherPrice}'
                ,'${this.returnArrayAllStoresNewFromServer[i].deliveryAnotherTime}'
                ,'${this.returnArrayAllStoresNewFromServer[i].taxPrice}'
                ,'${this.returnArrayAllStoresNewFromServer[i].closeStore}'
                ,'${this.returnArrayAllStoresNewFromServer[i].closeStoreByCat}'
                ,'${this.returnArrayAllStoresNewFromServer[i].closeAllStores}','${this.returnArrayAllStoresNewFromServer[i].storeNote}')`, [])
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`INSERT OR REPLACE INTO searchStores (id,catName,subCatName,title,image,storeImage,description,latlang,locationName,regionName,mobile,rate,countRate,countLike,countDisLike,followers,deliveryPrices,deliveryTime,startTime,endTime,numberOfProducts,numberOfOffers,numberOfBranches,special,four,isFav,isLike,isDisLike,deliveryAnotherPrice,deliveryAnotherTime,taxPrice,closeStore,closeStoreByCat,closeAllStores,store_note)
                VALUES ('${this.returnArrayAllStoresNewFromServer[i].id}','${this.returnArrayAllStoresNewFromServer[i].catName}'
                ,'${this.returnArrayAllStoresNewFromServer[i].subCatName}','${this.returnArrayAllStoresNewFromServer[i].title}'
                ,'${image}','${storeImage}','${this.returnArrayAllStoresNewFromServer[i].description}'
                ,'${this.returnArrayAllStoresNewFromServer[i].latlang}','${this.returnArrayAllStoresNewFromServer[i].locationName}'
                ,'${this.returnArrayAllStoresNewFromServer[i].regionName}','${this.returnArrayAllStoresNewFromServer[i].mobile}'
                ,'${this.returnArrayAllStoresNewFromServer[i].rate}','${this.returnArrayAllStoresNewFromServer[i].countRate}'
                ,'${this.returnArrayAllStoresNewFromServer[i].countLike}','${this.returnArrayAllStoresNewFromServer[i].countDisLike}'
                ,'${this.returnArrayAllStoresNewFromServer[i].followers}','${this.returnArrayAllStoresNewFromServer[i].deliveryPrices}'
                ,'${this.returnArrayAllStoresNewFromServer[i].deliveryTime}','${this.returnArrayAllStoresNewFromServer[i].startTime}'
                ,'${this.returnArrayAllStoresNewFromServer[i].endTime}','${this.returnArrayAllStoresNewFromServer[i].numberOfProducts}'
                ,'${this.returnArrayAllStoresNewFromServer[i].numberOfOffers}','${this.returnArrayAllStoresNewFromServer[i].numberOfBranches}'
                ,'${this.returnArrayAllStoresNewFromServer[i].special}','${this.returnArrayAllStoresNewFromServer[i].four}'
                ,'${this.returnArrayAllStoresNewFromServer[i].isFav}','${this.returnArrayAllStoresNewFromServer[i].isLike}'
                ,'${this.returnArrayAllStoresNewFromServer[i].isDisLike}'
                  ,'${this.returnArrayAllStoresNewFromServer[i].deliveryAnotherPrice}'
                ,'${this.returnArrayAllStoresNewFromServer[i].deliveryAnotherTime}'
                ,'${this.returnArrayAllStoresNewFromServer[i].taxPrice}'
                ,'${this.returnArrayAllStoresNewFromServer[i].closeStore}'
                ,'${this.returnArrayAllStoresNewFromServer[i].closeStoreByCat}'
                ,'${this.returnArrayAllStoresNewFromServer[i].closeAllStores}','${this.returnArrayAllStoresNewFromServer[i].storeNote}')`, [])
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
          }
        }
      });
      if(op==1)
        this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
    }
  }
  async ngOnInit() {
    this.storage.get('productInShopingCart').then(productInShopingCart=>{
      this.productInShopingCart = productInShopingCart;
      if(productInShopingCart==null || productInShopingCart=="" ||  productInShopingCart==0 )
        this.productInShopingCart = 0;
    });
    this.activaterouter.params.subscribe(params => {
      this.searchValues = params['searchValues'];
    });
    if(this.searchValues != "" && this.searchValues != "null" && this.searchValues != undefined  && this.searchValues != null){
      this.functionFeachDataFromServer(1,1);
    }else{
      this.searchValues = await this.storage.get('searchValues');
      if(this.searchValues!=null && this.searchValues !=undefined && this.searchValues!=0 && this.searchValues!="" && this.searchValues!="Null")
        this.functionFeachDataFromServer(1,1);
    }
    this.storageCat = await this.storage.get('selectedSearchVal');
    this.storageSubCat = await this.storage.get('subCatSearchSelected');
    this.storageragion = await this.storage.get('searchRegion');
    if(this.storageCat!=null && this.storageCat !=undefined && this.storageCat!=0 && this.storageCat!="")
      this.catSelected =this.storageCat.split(',');
    if(this.storageSubCat!=null && this.storageSubCat !=undefined && this.storageSubCat!=0 && this.storageSubCat!="")
      this.subCatSelected = this.storageSubCat.split(',');
    if(this.storageragion!=null && this.storageragion !=undefined && this.storageragion!=0 && this.storageragion!="")
      this.region = this.storageragion.split(',');
    this.lastAllStoresSortSelect = await this.storage.get('lastAllSearchSortSelect');
    this.fullNameLogin = await this.storage.get('fullNameLogin');
    this.emailLogin = await this.storage.get('emailLogin');
    let typeShow = await this.storage.get('typeShow');
    this.countOfAllValues = 0;
    this.countOfAllValuesDivOnTen =  Math.ceil(this.countOfAllValues/10);
    if(typeShow !=null && typeShow !=undefined){
      if(typeShow==1){
        this.showTypeOfShowData="filterIconNewLight";
        this.showTypeOfShowDataTow="filterIconShowData";
      }else{
        this.showTypeOfShowData="filterIconNew";
        this.showTypeOfShowDataTow="filterIconShowDataLight";
      }
      this.typeShow =  await this.storage.get('typeShow');
    }
    if(this.fullNameLogin!=null || this.emailLogin!=null)
      this.showLinkFavourite = 1;
    this.categoriesSkeleton = true;
  }
  searchAllValues(){
    this.functionFeachDataFromServer(1)
  }
  async changeTypeShow(type){
    await this.storage.set('typeShow',type);
    this.typeShow = type;
    if(type==1){
      this.typeShow = type;
      this.showTypeOfShowData="filterIconNewLight";
      this.showTypeOfShowDataTow="filterIconShowData";
    }else{
      this.showTypeOfShowData="filterIconNew";
      this.showTypeOfShowDataTow="filterIconShowDataLight";
    }
  }
  async functionAddFavorites(storeId:any,index:any,countOfData:any){
    this.userId = await this.storage.get('userId');
    this.countOfStoresFav = await this.storage.get('countOfStoresFav');
    this.storesService.addFave(storeId,this.userId ).then(data=>{
      this.returnStoresForeData = data;
      this.operationResult = this.returnStoresForeData.Error.ErrorCode;
      if(this.operationResult==1){
        if(this.countOfStoresFav == null || this.countOfStoresFav == undefined || this.countOfStoresFav =="" )
          this.countOfStoresFav = 0;
        let countOfVal = parseInt(this.countOfStoresFav, 10)+1;
        this.storage.set('countOfStoresFav',countOfVal);
        this.returnAllStoresArray[index]['checkFav']='1';
        this.returnAllStoresArray[index]['realFollowers']=parseInt(countOfData, 10)+1;
        this.returnAllStoresArray[index]['followers']  = this.returnAllStoresArray[index]['realFollowers'];
        if(this.returnAllStoresArray[index]['realFollowers'] > 1000){
          let val = Math.floor(this.returnAllStoresArray[index]['realFollowers']/1000);
          this.returnAllStoresArray[index]['followers']  = val+"K";
        }
        this.message = "تم  إضافة المتجر على قائمة المفضلة بنجاح";
        this.displayResult(this.message);
        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE stores SET followers='${this.returnAllStoresArray[index]['realFollowers']}',isFav=1 where id=?`, [storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});

        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE allstores SET followers='${this.returnAllStoresArray[index]['realFollowers']}',isFav=1 where id=?`, [storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});

        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE searchStores SET followers='${this.returnAllStoresArray[index]['realFollowers']}',isFav=1 where id=?`, [storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});

        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`INSERT OR REPLACE INTO favouriteStores (id,catName,subCatName,title,image,storeImage,description,latlang,locationName,regionName,mobile,rate,countRate,countLike,countDisLike,followers,deliveryPrices,deliveryTime,startTime,endTime,numberOfProducts,numberOfOffers,numberOfBranches,special,four,isFav,isLike,isDisLike,deliveryAnotherPrice,deliveryAnotherTime,taxPrice,closeStore,closeStoreByCat,closeAllStores,store_note)
                VALUES ('${this.returnAllStoresArray[index]['id']}','${this.returnAllStoresArray[index]['catName']}'
                ,'${this.returnAllStoresArray[index]['subCatName']}','${this.returnAllStoresArray[index]['title']}'
                ,'${this.returnAllStoresArray[index]['image']}','${this.returnAllStoresArray[index]['storeImage']}','${this.returnAllStoresArray[index]['description']}'
                ,'${this.returnAllStoresArray[index]['latlang']}','${this.returnAllStoresArray[index]['locationName']}'
                ,'${this.returnAllStoresArray[index]['regionName']}','${this.returnAllStoresArray[index]['mobile']}'
                ,'${this.returnAllStoresArray[index]['rate']}','${this.returnAllStoresArray[index]['countRate']}'
                ,'${this.returnAllStoresArray[index]['countLike']}','${this.returnAllStoresArray[index]['countDisLike']}'
                ,'${this.returnAllStoresArray[index]['realFollowers']}','${this.returnAllStoresArray[index]['deliveryPrices']}'
                ,'${this.returnAllStoresArray[index]['deliveryTime']}','${this.returnAllStoresArray[index]['startTime']}'
                ,'${this.returnAllStoresArray[index]['endTime']}','${this.returnAllStoresArray[index]['numberOfProducts']}'
                ,'${this.returnAllStoresArray[index]['numberOfOffers']}','${this.returnAllStoresArray[index]['numberOfBranches']}'
                ,'${this.returnAllStoresArray[index]['special']}','${this.returnAllStoresArray[index]['four']}','1','${this.returnAllStoresArray[index]['isLike']}','${this.returnAllStoresArray[index]['isDisLike']}')`, [])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});

      }
    });
  }
  async functionRemoveFavorites(storeId:any,index:any,countOfData:any){
    this.userId = await this.storage.get('userId');
    this.countOfStoresFav = await this.storage.get('countOfStoresFav');
    this.storesService.removFav(storeId,this.userId ).then(data=>{
      this.returnStoresForeData = data;
      this.operationResult = this.returnStoresForeData.Error.ErrorCode;
      if(this.operationResult==1){
        if(this.countOfStoresFav == null || this.countOfStoresFav == undefined || this.countOfStoresFav =="" )
          this.countOfStoresFav = 0;
        let countOfVal = parseInt(this.countOfStoresFav, 10)-1;
        this.storage.set('countOfStoresFav',countOfVal);
        this.returnAllStoresArray[index]['checkFav']='0';
        this.returnAllStoresArray[index]['realFollowers']=parseInt(countOfData, 10)-1;
        this.returnAllStoresArray[index]['followers']  = this.returnAllStoresArray[index]['realFollowers'];
        if(this.returnAllStoresArray[index]['realFollowers'] > 1000){
          let val = Math.floor(this.returnAllStoresArray[index]['realFollowers']/1000);
          this.returnAllStoresArray[index]['followers']  = val+"K";
        }
        this.message = "تم حذف المتجر من قائمة المفضلة بنجاح";
        this.displayResult(this.message);
        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE stores SET followers='${this.returnAllStoresArray[index]['realFollowers']}',isFav=0 where id=?`, [storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});

        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE allstores SET followers='${this.returnAllStoresArray[index]['realFollowers']}',isFav=0 where id=?`, [storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});

        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE searchStores SET followers='${this.returnAllStoresArray[index]['realFollowers']}',isFav=0 where id=?`, [storeId])
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
        this.returnAllStoresArray[index]['checkIsLike']='1';
        this.returnAllStoresArray[index]['checkDisLike']='1';
        this.returnAllStoresArray[index]['realCountLike']=parseInt(countOfData, 10)+1;
        this.returnAllStoresArray[index]['countLike']  = this.returnAllStoresArray[index]['realCountLike'];
        if(this.returnAllStoresArray[index]['countLike'] > 1000){
          let val = Math.floor(this.returnAllStoresArray[index]['realCountLike']/1000);
          this.returnAllStoresArray[index]['countLike']  = val+"K";
        }
        this.message = "شكرا...تم تسجيل إعجابك بالمتجر بنجاح";
        this.displayResult(this.message);
        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE stores SET countLike='${this.returnAllStoresArray[index]['realCountLike']}',isLike=1 where id=?`, [storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});
        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE allstores SET countLike='${this.returnAllStoresArray[index]['realCountLike']}',isLike=1 where id=?`, [storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});
        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE searchStores SET countLike='${this.returnAllStoresArray[index]['realCountLike']}',isLike=1 where id=?`, [storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});

        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE favouriteStores SET countLike='${this.returnAllStoresArray[index]['realCountLike']}',isLike=1 where id=?`, [storeId])
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
        this.returnAllStoresArray[index]['checkIsLike']='1';
        this.returnAllStoresArray[index]['checkDisLike']='1';
        this.returnAllStoresArray[index]['realCountDisLike']=parseInt(countOfData, 10)+1;
        this.returnAllStoresArray[index]['countDisLike']  = this.returnAllStoresArray[index]['realCountDisLike'];
        if(this.returnAllStoresArray[index]['countDisLike'] > 1000){
          let val = Math.floor(this.returnAllStoresArray[index]['realCountDisLike']/1000);
          this.returnAllStoresArray[index]['countDisLike']  = val+"K";
        }
        this.message = "شكرا...تم تسجيل عدم إعجابك بالمتجر بنجاح";
        this.displayResult(this.message);
        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE stores SET countDisLike='${this.returnAllStoresArray[index]['realCountDisLike']}',isDisLike=1 where id=?`, [storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});
        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE allstores SET countDisLike='${this.returnAllStoresArray[index]['realCountDisLike']}',isDisLike=1 where id=?`, [storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});
        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE searchStores SET countDisLike='${this.returnAllStoresArray[index]['realCountDisLike']}',isDisLike=1 where id=?`, [storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});
        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE favouriteStores SET countDisLike='${this.returnAllStoresArray[index]['realCountDisLike']}',isDisLike=1 where id=?`, [storeId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});
      }
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
  }
  functionSelectSubCat(catId:any,index:any,operation:any) {
    if (operation == 0) {
      this.returnSubCategoriesArray[index]['checked'] = "textSliderChecked";
      this.returnSubCategoriesArray[index]['operation'] = "1";
      this.subCatSelected.push(catId);
    } else {
      this.returnSubCategoriesArray[index]['checked'] = "textSlider";
      for (var j = 0; j < this.subCatSelected.length; j++) {
        if (this.subCatSelected[j] === catId)
          this.subCatSelected.splice(j, 1);
      }
      this.returnSubCategoriesArray[index]['operation'] = "0";
    }
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
      this.lastAllStoresSortSelect = data.data.allStoreSorting;
      this.regionsStoreSelected = data.data.regionsStore;
      if(data.data.regionsCount == 0)
        this.regionCount = "جميع المناطق";
      else
        this.regionCount = "المناطق : "+data.data.regionsCount;
      if(this.lastAllStoresSortSelect !=undefined && this.lastAllStoresSortSelect!=0 && this.lastAllStoresSortSelect!=null)
        this.functionFeachDataFromServer(1)
    })
    await model.present();
  }
  async functionSortAndFilterRegion(typeVal:any,segmentNumber:any=1,lastSelectData:any=0,lastTowSelectData:any=0){
    let model = await this.modalController.create({
      component:SortandfilterComponent,
      animated:true,
      componentProps:{typeVal:typeVal,segmentNumber:segmentNumber,lastSelectData:lastSelectData,lastTowSelectData:lastTowSelectData},
      cssClass:"modalFilterSortCss"
    });
    model.onDidDismiss().then(data=>{
      this.lastAllStoresSortSelect = data.data.allStoreSorting;
      this.regionsStoreSelected = data.data.regionsStore;
      if(data.data.regionsCount == 0)
        this.regionCount = "جميع المناطق";
      else
        this.regionCount = "المناطق : "+data.data.regionsCount;
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
  refrechAllPage(event) {
    this.loopingNumber = 1;
    this.lastAllStoresSortSelect = 1;
    this.catSelected = [];
    this.subCatSelected = [];
    this.regionsStoreSelected = 0;
    this.homeCategories = 0;
    for (var j = 0; j < this.subCatSelected.length; j++) {
      this.returnSubCategoriesArray[j]['checked'] = "textSlider";
      this.returnSubCategoriesArray[j]['operation'] = "0";
      this.subCatSelected.splice(j, 1);
    }
    for (var j = 0; j < this.catSelected.length; j++) {
      this.returnCategoriesArray[j]['checked'] = "catLabel";
      this.catSelected.splice(j, 1);
      this.returnCategoriesArray[j]['operation'] = "0";
    }
    this.lightFilter="filterIconNew";
    this.filterLight="filterNotLight"
    this.selectedTypaOfOperationFilter = 0;
    this.renderer.setStyle(this.showDivCat.nativeElement,'opacity','0');
    setTimeout(() => {
      this.renderer.setStyle(this.showAllDivCat.nativeElement,'height','0px')
    }, 2000);
    this.functionFeachDataFromServer(1);
    setTimeout(() => {
      event.target.complete();
    }, 2000);
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
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
    }).catch(e =>{
      this.message = "يرجى التحقق من تشغيل ميزة الموقع في الجهاز";
      this.displayResult(this.message);
    })
  }
  async functionStoreInformation(storeId:any){
    let selectedVal= this.catSelected;
    let subCatSelected= this.subCatSelected;
    let region= this.region;
    if(this.lastAllStoresSortSelect == undefined || this.lastAllStoresSortSelect == "" || this.lastAllStoresSortSelect == 0 || this.lastAllStoresSortSelect == null)
      this.lastAllStoresSortSelect = 0;
    await this.storage.set('selectedSearchVal',selectedVal);
    await this.storage.set('subCatSearchSelected',subCatSelected);
    await this.storage.set('searchRegion',region);
    await this.storage.set('lastAllSearchSortSelect',this.lastAllStoresSortSelect);
    await this.storage.set('searchValues',this.searchValues);
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
              this.router.navigate(['/storedetails', {storeId:storeId,pageBack:3}])
            else{
              this.message = "لا يمكنك الاطلاع على تفاصيل المتجر المتجر مغلق";
              this.displayResult(this.message);
            }
          }
        }).catch(e => {});
    }).catch(e => {});
  }
  functionGoToHome(){
    this.navCtrl.navigateRoot('/home');
  }
  functionGoToShoppingcart(){
    this.navCtrl.navigateRoot('/shoppingcart');
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
  functionGoToStores(){
    this.navCtrl.navigateRoot("/stores");
  }
}
