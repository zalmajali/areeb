import { Component, OnInit,Input } from '@angular/core';
import {ModalController, NavController, Platform} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import {CategoriesService} from "../../services/categories.service";
@Component({
  selector: 'app-sortandfilter',
  templateUrl: './sortandfilter.component.html',
  styleUrls: ['./sortandfilter.component.scss'],
})
export class SortandfilterComponent implements OnInit {
  @Input() typeVal: string;
  @Input() segmentNumber: string;
  @Input() lastSelectData: any;
  @Input() lastTowSelectData: string;
  typeOperation:any
  offerSortingVal:any;
  allOfferSortingVal:any;
  productsOneSortingVal:any;
  productsTowSortingVal:any;
  returnRegionsData:any;
  returnArrayRegionsFromServer:any;
  returnRegionsArray:any = [];
  selected:any = [];
  operationResult:any;
  returnRegionsBranches:any = [];
  allRegion:any;
  allRegionStore:any;
  returnRegionsStore:any = [];
  allStoreSortingVal:any;
  constructor(private sqlite: SQLite,private storage: Storage,private platform: Platform,private modalController:ModalController,private categoriesService:CategoriesService) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.modalController.dismiss();
    });
  }
  ngOnInit() {
    if (this.typeVal == "offers") {
      this.typeOperation = 1;
      this.offerSortingVal = this.lastSelectData;
    }
    if (this.typeVal == "productsOne") {
      this.productsOneSortingVal = this.lastSelectData
      this.productsTowSortingVal = this.lastTowSelectData
      this.typeOperation = 2;
    }
    if (this.typeVal == "productsTow"){
      this.productsOneSortingVal = this.lastSelectData
      this.productsTowSortingVal = this.lastTowSelectData
      this.typeOperation = 3;
    }
    if(this.typeVal == "branches")
      this.typeOperation = 4;
    if (this.typeVal == "alloffers") {
      this.typeOperation = 5;
      this.allOfferSortingVal = this.lastSelectData;
    }
    if (this.typeVal == "allStoresSorting") {
      this.typeOperation = 6;
      this.allStoreSortingVal = this.segmentNumber;
    }
    if (this.typeVal == "allStores") {
      this.typeOperation = 7;
      this.allStoreSortingVal = this.segmentNumber;
    }
   this.sqlite.create({
      name: "arreb.db",
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql(`select * FROM regions`, [])
        .then((resNew) =>{
          for(let i = 0; i < resNew.rows.length;i++) {
            this.returnRegionsArray[i] = [];
            this.returnRegionsArray[i]['id'] = resNew.rows.item(i).id;
            this.returnRegionsArray[i]['title'] = resNew.rows.item(i).title;
            this.returnRegionsArray[i]['checked'] = 0;
            if(this.typeOperation == 4 || this.typeOperation == 7 || this.typeOperation == 6)
            if (this.lastSelectData.length != undefined && this.lastSelectData.length != 0) {
              let val  = this.lastSelectData.split(',');
              for(var j = 0; j < val.length; j++){
                if(val[j] == this.returnRegionsArray[i]['id']) {
                  this.returnRegionsArray[i]['checked'] = 1;
                  this.returnRegionsBranches.push(this.returnRegionsArray[i]['id']);
                }
              }
            }
          }
        }).catch(e => {});
    }).catch(e => {});
  }
  closeModel(){
    this.modalController.dismiss();
  }
  saveDataAndBackOffers(){
    this.modalController.dismiss({
      "offersSoarting":this.offerSortingVal,
      "segmentNumber":this.segmentNumber
    })
  }
  saveDataAndBackAllOffers(){
    this.modalController.dismiss({
      "allOfferSorting":this.allOfferSortingVal,
    })
  }
  saveDataAndBackProductsOne(){
    this.modalController.dismiss({
      "productsOneSorting":this.productsOneSortingVal,
      "productsTowSorting":this.productsTowSortingVal,
      "segmentNumber":this.segmentNumber
    })
  }
  saveDataAndBackProductsTow(){
    this.modalController.dismiss({
      "productsOneSorting":this.productsOneSortingVal,
      "productsTowSorting":this.productsTowSortingVal,
      "segmentNumber":this.segmentNumber
    })
  }
  isSelectRegionForStore(event){
    if(event.detail.checked == true){
      this.returnRegionsStore.push(event.detail.value);
    }else{
      for( var i = 0; i < this.returnRegionsStore.length; i++){
        if(this.returnRegionsStore[i] == event.detail.value)
          this.returnRegionsStore.splice(i,1);
      }
    }
  }
  isSelectdVal(event){
    if(event.detail.checked == true){
      this.returnRegionsBranches.push(event.detail.value);
    }else{
      for( var i = 0; i < this.returnRegionsBranches.length; i++){
        if(this.returnRegionsBranches[i] == event.detail.value)
          this.returnRegionsBranches.splice(i,1);
      }
    }
  }
  saveDataAndBackAllStores(){
    let Val = 0;
    if(this.returnRegionsStore!="" && this.returnRegionsStore!=undefined && this.returnRegionsStore!=null)
      Val =this.returnRegionsStore.length;
    this.modalController.dismiss({
      "allStoreSorting":this.allStoreSortingVal,
      "regionsCount":Val,
      "regionsStore":this.returnRegionsStore.toString(),
    })
  }
  applySelectdVal(){
    this.modalController.dismiss({
      "regionsBranches":this.returnRegionsBranches.toString(),
      "segmentNumber":this.segmentNumber
    })
  }
  applySelectdValStore(){
    let Val = 0;
    console.log(this.returnRegionsStore)
    if(this.returnRegionsStore!="" && this.returnRegionsStore!=undefined && this.returnRegionsStore!=null)
      Val = this.returnRegionsStore.length;
    this.modalController.dismiss({
      "regionsCount":Val,
      "regionsStore":this.returnRegionsStore.toString(),
      "allStoreSorting":this.allStoreSortingVal
    })
  }
}
