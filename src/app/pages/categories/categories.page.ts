import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import {MenuController, Platform, NavController, IonSlides, ModalController, ToastController,IonInput} from '@ionic/angular';
import {Storage} from "@ionic/storage";
import {CategoriesService} from "../../services/categories.service";
import { Network } from '@ionic-native/network/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import {ActivatedRoute, Router} from '@angular/router';
import {StoresService} from "../../services/stores.service";
@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  @ViewChild('searchInput', {static:true}) searchInput:IonInput;
  categoriesSkeleton:boolean = true;
  returnCategoriesData:any;
  returnArrayCategoriesFromServer:any;
  returnCategoriesArray:any = [];
  operationResult:any;
  categories:any=0;
  fullNameLogin:any;
  emailLogin:any;
  productInShopingCart:any;
  constructor(private toastCtrl: ToastController,private modalController: ModalController,private router : Router,private sqlite: SQLite,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private categoriesService:CategoriesService,private storesService:StoresService) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','categories');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });

  }
  async ngOnInit() {
    this.storage.get('productInShopingCart').then(productInShopingCart=>{
      this.productInShopingCart = productInShopingCart;
      if(productInShopingCart==null || productInShopingCart=="" ||  productInShopingCart==0 )
        this.productInShopingCart = 0;
    });
    this.categoriesService.allCategories().then(data=>{
      this.returnCategoriesData = data;
      this.operationResult = this.returnCategoriesData.Error.ErrorCode;
      if(this.operationResult==1){
        this.returnArrayCategoriesFromServer = this.returnCategoriesData.Data.allCategories;
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
  }
  functionGoToHome(){
    this.navCtrl.navigateRoot("/home");
  }
  functionStoresByCat(catId:any){
    this.router.navigate(['/stores', {selectedVal:catId}])
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
