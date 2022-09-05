import {Component, OnInit, ViewChild,Renderer2} from '@angular/core';
import {MenuController, Platform, NavController, IonSlides,ToastController,ModalController,IonInput} from '@ionic/angular';
import {StoresService} from "../../services/stores.service";
import { Network } from '@ionic-native/network/ngx';
import { Router,ActivatedRoute } from '@angular/router';
import {Storage} from "@ionic/storage";
import {OrderssearchComponent} from '../orderssearch/orderssearch.component';
import {OrdersfiltersComponent} from '../ordersfilters/ordersfilters.component';
import {OrdersrateComponent} from '../ordersrate/ordersrate.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  @ViewChild('searchInput', {static:true}) searchInput:IonInput;
  productsStoreSkeleton:boolean = true;
  orderNumber:any;
  storeName:any;
  productName:any;
  priceFrom:any;
  priceTo:any;
  fromDate:any;
  toDate:any;
  status:any;
  soarting:any;
  shoppingCart:any=0;
  userId:any;
  returnRateData:any;
  operationResult:any;
  returnAllOrdersArray:any=[];
  returnArrayAllOrdersFromServer:any;
  returnArraySubProductCartFromServer:any;
  searchValues:any;
  fullNameLogin:any;
  emailLogin:any;
  productInShopingCart:any;
  constructor(private activaterouter : ActivatedRoute,private toastCtrl: ToastController,private modalController: ModalController,private router : Router,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private storesService:StoresService) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','orders');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.navigateRoot("/home");
    });
  }
  returnAllDatafromServer(userId:any,orderNumber:any=0,storeName:any=0,productName:any=0,fromPrice:any=0,toPrice:any=0,fromDat:any=0,toDate:any=0,statuse:any=0,orderBy:any=1){
    this.productsStoreSkeleton=true;
    this.returnAllOrdersArray=[];
    this.storesService.ordersCart(userId,orderNumber,storeName,productName,fromPrice,toPrice,fromDat,toDate,statuse,orderBy).then(data=>{
      this.returnRateData = data;
      this.operationResult = this.returnRateData.Error.ErrorCode;
      this.returnArrayAllOrdersFromServer = this.returnRateData.Data.orders;
      if(this.operationResult == 1){
        for(let i = 0; i < this.returnArrayAllOrdersFromServer.length;i++){
          this.returnAllOrdersArray[i]=[];
          this.returnAllOrdersArray[i]['id'] = this.returnArrayAllOrdersFromServer[i].id;
          this.returnAllOrdersArray[i]['storeId'] = this.returnArrayAllOrdersFromServer[i].storeId;
          this.returnAllOrdersArray[i]['storeName'] = this.returnArrayAllOrdersFromServer[i].storeName;
          this.returnAllOrdersArray[i]['orderNumber'] = this.returnArrayAllOrdersFromServer[i].orderNumber;
          this.returnAllOrdersArray[i]['price'] = this.returnArrayAllOrdersFromServer[i].price;
          this.returnAllOrdersArray[i]['dateAdd'] = this.returnArrayAllOrdersFromServer[i].dateAdd;
          this.returnAllOrdersArray[i]['isOrderEval'] = this.returnArrayAllOrdersFromServer[i].isOrderEval;
          this.returnAllOrdersArray[i]['showData'] = 0;
          this.returnAllOrdersArray[i]['statusVal'] = this.returnArrayAllOrdersFromServer[i].status;
          if(this.returnArrayAllOrdersFromServer[i].status == 1 || this.returnArrayAllOrdersFromServer[i].status == 2)
            this.returnAllOrdersArray[i]['status'] = "قيد المعالجة";
          if(this.returnArrayAllOrdersFromServer[i].status == 3)
            this.returnAllOrdersArray[i]['status'] = "يتم توصيله";
          if(this.returnArrayAllOrdersFromServer[i].status == 4)
            this.returnAllOrdersArray[i]['status'] = "تم التوصيل";
          if(this.returnArrayAllOrdersFromServer[i].status == 5)
            this.returnAllOrdersArray[i]['status'] = "ملغي";
          this.returnArraySubProductCartFromServer = this.returnArrayAllOrdersFromServer[i].productCart;
          this.returnAllOrdersArray[i]['productCart'] = [];
          for(let j = 0; j < this.returnArraySubProductCartFromServer.length;j++){
            this.returnAllOrdersArray[i]['productCart'][j] = [];
            this.returnAllOrdersArray[i]['productCart'][j]['productName'] = this.returnArraySubProductCartFromServer[j].productName;
            this.returnAllOrdersArray[i]['productCart'][j]['additions'] = this.returnArraySubProductCartFromServer[j].additions;
            this.returnAllOrdersArray[i]['productCart'][j]['ingredients'] = this.returnArraySubProductCartFromServer[j].ingredients;
            this.returnAllOrdersArray[i]['productCart'][j]['options'] = this.returnArraySubProductCartFromServer[j].options;
            this.returnAllOrdersArray[i]['productCart'][j]['price'] = this.returnArraySubProductCartFromServer[j].price;
            this.returnAllOrdersArray[i]['productCart'][j]['quantity'] = this.returnArraySubProductCartFromServer[j].quantity;
            this.returnAllOrdersArray[i]['productCart'][j]['image'] = this.returnArraySubProductCartFromServer[j].imagePro;
          }
        }
        let countOfData = this.returnAllOrdersArray.length;
        if(countOfData == 0)
          this.shoppingCart = 0;
        else {
          this.shoppingCart = 1;
        }
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
  async ngOnInit() {
    this.storage.get('productInShopingCart').then(productInShopingCart=>{
      this.productInShopingCart = productInShopingCart;
      if(productInShopingCart==null || productInShopingCart=="" ||  productInShopingCart==0 )
        this.productInShopingCart = 0;
    });
    this.userId = await this.storage.get('userId');
    if(this.userId==null || this.userId==undefined && this.userId==0 && this.userId==""){
      this.navCtrl.navigateRoot("/home");
    }
    this.returnAllDatafromServer(this.userId,this.orderNumber,this.storeName,this.productName,this.priceFrom,this.priceTo,this.fromDate,this.toDate,this.status,this.soarting);
  }
  changeViewProduct(val:any,index:any){
    if(val == 1)
      this.returnAllOrdersArray[index]['showData'] = 0;
    if(val == 0)
      this.returnAllOrdersArray[index]['showData'] = 1;
  }
  async functionOrdersSearch(){
    let model = await this.modalController.create({
      component:OrderssearchComponent,
      animated:true,
      cssClass:"modalFilterSortCss"
    });
    model.onDidDismiss().then(data=>{
      this.orderNumber = data.data.orderNumber;
      this.storeName = data.data.storeName;
      this.productName = data.data.productName;
      this.priceFrom = data.data.priceFrom;
      this.priceTo = data.data.priceTo;
      this.fromDate = data.data.fromDate;
      this.toDate = data.data.toDate;
      this.status = data.data.status;
      this.returnAllDatafromServer(this.userId,this.orderNumber,this.storeName,this.productName,this.priceFrom,this.priceTo,this.fromDate,this.toDate,this.status,this.soarting);
    });
    await model.present();
  }
  async functionOrdersSortFilter(){
    let model = await this.modalController.create({
      component:OrdersfiltersComponent,
      animated:true,
      cssClass:"modalFilterSortCss"
    });
    model.onDidDismiss().then(data=>{
      this.soarting = data.data.soarting;
      this.returnAllDatafromServer(this.userId,this.orderNumber,this.storeName,this.productName,this.priceFrom,this.priceTo,this.fromDate,this.toDate,this.status,this.soarting);
    })
    await model.present();
  }
  async functionEvalueation(id:any,ordrNumber:any){
    let model = await this.modalController.create({
      component:OrdersrateComponent,
      animated:true,
      componentProps:{id:id,ordrNumber:ordrNumber},
      cssClass:"modalFilterSortCss"
    });
    model.onDidDismiss().then(data=>{
      let operation = data.data.operationResult;
      let message ="";
      if(operation == 1)
        message = "شكرا لك وقتك لتقييم هذا الطلب";
      else
        message = "لم تتم عملية التقييم بنجاج...حاول كرة أخرى";
      this.displayResult(message);
      this.returnAllDatafromServer(this.userId,this.orderNumber,this.storeName,this.productName,this.priceFrom,this.priceTo,this.fromDate,this.toDate,this.status,this.soarting);
    })
    await model.present();
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
  searchAllValues(){
    this.navCtrl.navigateRoot(['/search', {searchValues:this.searchValues}]);
  }
}
