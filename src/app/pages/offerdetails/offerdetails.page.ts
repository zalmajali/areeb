import {Component, OnInit, ViewChild} from '@angular/core';
import {MenuController, Platform, NavController, ToastController, ModalController, IonSlides,IonInput} from '@ionic/angular';
import {StoresService} from "../../services/stores.service";
import { Network } from '@ionic-native/network/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Router,ActivatedRoute } from '@angular/router';
import {Storage} from "@ionic/storage";
@Component({
  selector: 'app-offerdetails',
  templateUrl: './offerdetails.page.html',
  styleUrls: ['./offerdetails.page.scss'],
})
export class OfferdetailsPage implements OnInit {
  @ViewChild('searchInput', {static:true}) searchInput:IonInput;
  @ViewChild('slidesOffersHome',{static:false}) slides:IonSlides;
  proId:any;
  offersSkeleton: boolean=true;
  returnOffersByStoreId:any;
  returnOffersByStoreStoreId:any;
  returnOffersByStoreTitle:any;
  returnOffersByStoreDescription:any;
  returnOffersByStorePrice:any;
  returnOffersByStoreStartDate:any;
  returnOffersByStoreEndDate:any;
  returnOffersByStoreDuration:any;
  returnOffersByStoreImage:any;
  returnOffersByStoreImage1:any;
  returnOffersByStoreImage2:any;
  returnOffersByStoreImage3:any;
  returnOffersByStoreImage4:any;

  realPrice:any;
  oldPrice:any;
  returnAdditionsData:any;
  returnArrayAdditionsFromServer:any
  returnAdditionsArray:any = [];
  returnArraySubAdditionsFromServer:any = [];
  returnOptionsArray:any = [];
  operationResult:any
  returnIngredientsArray:any = [];
  selectAllOptions:any = [];
  selectAllAdditions:any = [];
  selectAllIngredients:any = [];
  insertAllOptions:any = [];
  insertAllAdditions:any = [];
  insertAllIngredients:any = [];
  offerId:any;
  pageBackOffers:any;
  showSlider:any;
  message:any;
  searchValues:any;
  fullNameLogin:any;
  emailLogin:any;
  productInShopingCart:any;
  realPriceCount:any;
  constructor(private activaterouter : ActivatedRoute,private toastCtrl: ToastController,private modalController: ModalController,private router : Router,private sqlite: SQLite,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private storesService:StoresService) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','home');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
    this.platform.backButton.subscribeWithPriority(10, () => {
      let pageBack = this.storage.get("pageBackOffers").then(pageBackOffers=>{
        if(pageBackOffers == 1)
          this.navCtrl.navigateRoot("/offers");
        if(pageBackOffers == 2)
          this.navCtrl.navigateRoot("/home");
        if(pageBackOffers == 3)
          this.router.navigate(['/storedetails', {storeId:this.returnOffersByStoreStoreId}])
      });
    });
  }
  slidesDidLoad(){
    this.slides.startAutoplay();
  }
  functionFeachDataFromServer(proId:any){
    this.offersSkeleton = true;
    this.sqlite.create({
      name: "arreb.db",
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql(`select * FROM offers where id= ?`, [proId])
        .then((resNew) =>{
          this.returnOffersByStoreId = resNew.rows.item(0).id;
          this.returnOffersByStoreStoreId = resNew.rows.item(0).storeId;
          this.returnOffersByStoreTitle = resNew.rows.item(0).title;
          this.returnOffersByStoreDescription = resNew.rows.item(0).description;
          this.returnOffersByStorePrice = resNew.rows.item(0).price;
          this.returnOffersByStoreStartDate = resNew.rows.item(0).startDate;
          this.returnOffersByStoreEndDate = resNew.rows.item(0).endDate;
          this.returnOffersByStoreDuration = resNew.rows.item(0).duration;
          this.returnOffersByStoreImage = resNew.rows.item(0).image;
          this.realPrice = resNew.rows.item(0).price;
          this.returnOffersByStoreImage1 = 0;
          this.returnOffersByStoreImage2 = 0;
          this.returnOffersByStoreImage3 = 0;
          this.returnOffersByStoreImage4 = 0;
          this.showSlider = 0;
          if(this.returnOffersByStoreImage1!="" && this.returnOffersByStoreImage1!=undefined && this.returnOffersByStoreImage1!=0 && this.returnOffersByStoreImage1!=null){
            this.showSlider = 1;
            this.returnOffersByStoreImage1 = resNew.rows.item(0).image1;
          }
          if(this.returnOffersByStoreImage2!="" && this.returnOffersByStoreImage2!=undefined && this.returnOffersByStoreImage2!=0 && this.returnOffersByStoreImage2!=null){
            this.showSlider = 1;
            this.returnOffersByStoreImage2 = resNew.rows.item(0).image2;
          }
          if(this.returnOffersByStoreImage3!="" && this.returnOffersByStoreImage3!=undefined && this.returnOffersByStoreImage3!=0 && this.returnOffersByStoreImage3!=null){
            this.showSlider = 1;
            this.returnOffersByStoreImage3 = resNew.rows.item(0).image3;
          }
          if(this.returnOffersByStoreImage4!="" && this.returnOffersByStoreImage4!=undefined && this.returnOffersByStoreImage4!=0 && this.returnOffersByStoreImage4!=null){
            this.showSlider = 1;
            this.returnOffersByStoreImage4 = resNew.rows.item(0).image4;
          }
        }).catch(e => {});
    }).catch(e => {})

    this.sqlite.create({
      name: "arreb.db",
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql(`select * FROM categoriesAdditionsOffer where productsId= ? AND type=?`, [proId,1])
        .then((resNew) =>{
          for(let i = 0; i < resNew.rows.length;i++){
            this.returnAdditionsArray[i] = [];
            this.returnAdditionsArray[i]['id'] = resNew.rows.item(i).id;
            this.returnAdditionsArray[i]['catName'] = resNew.rows.item(i).title;
            this.returnAdditionsArray[i]['additions'] = [];
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`select * FROM additionsOffer where productsId= ? AND catId=?`, [proId,resNew.rows.item(i).id])
                .then((resNewAdd) =>{
                  for(let j = 0; j < resNewAdd.rows.length;j++){
                    this.returnAdditionsArray[i]['additions'][j] = [];
                    this.returnAdditionsArray[i]['additions'][j]['id'] = resNewAdd.rows.item(j).id;
                    this.returnAdditionsArray[i]['additions'][j]['title'] = resNewAdd.rows.item(j).title;
                    this.returnAdditionsArray[i]['additions'][j]['price'] = resNewAdd.rows.item(j).price;
                  }
                }).catch(e => {});
            }).catch(e => {})
          }
        }).catch(e => {});
    }).catch(e => {})

    this.sqlite.create({
      name: "arreb.db",
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql(`select * FROM categoriesAdditionsOffer where productsId= ? AND type=?`, [proId,2])
        .then((resNew) =>{
          for(let i = 0; i < resNew.rows.length;i++){
            this.returnOptionsArray[i] = [];
            this.returnOptionsArray[i]['id'] = resNew.rows.item(i).id;
            this.returnOptionsArray[i]['catName'] = resNew.rows.item(i).title;
            this.returnOptionsArray[i]['options'] = [];
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`select * FROM optionsOffer where productsId= ? AND catId=?`, [proId,resNew.rows.item(i).id])
                .then((resNewAdd) =>{
                  for(let j = 0; j < resNewAdd.rows.length;j++){
                    this.returnOptionsArray[i]['options'][j] = [];
                    this.returnOptionsArray[i]['options'][j]['id'] = resNewAdd.rows.item(j).id;
                    this.returnOptionsArray[i]['options'][j]['title'] = resNewAdd.rows.item(j).title;
                    this.returnOptionsArray[i]['options'][j]['valType'] = 0;
                  }
                }).catch(e => {});
            }).catch(e => {})
          }
        }).catch(e => {});
    }).catch(e => {})
    this.sqlite.create({
      name: "arreb.db",
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql(`select * FROM ingredientsOffer where productsId= ?`, [proId])
        .then((resNew) =>{
          for(let i = 0; i < resNew.rows.length;i++){
            this.returnIngredientsArray[i] = [];
            this.returnIngredientsArray[i]['id'] = resNew.rows.item(i).id;
            this.returnIngredientsArray[i]['title'] = resNew.rows.item(i).title;
            this.returnIngredientsArray[i]['productsId'] = resNew.rows.item(i).productsId;
          }
        }).catch(e => {});
    }).catch(e => {})
    setTimeout(()=>{
      this.offersSkeleton = false
    },2000);
  }
  async ngOnInit() {
    this.storage.get('productInShopingCart').then(productInShopingCart=>{
      this.productInShopingCart = productInShopingCart;
      if(productInShopingCart==null || productInShopingCart=="" ||  productInShopingCart==0 )
        this.productInShopingCart = 0;
    });
    this.activaterouter.params.subscribe(params => {
      this.offerId = params['offerId'];
      this.pageBackOffers = params['pageBackOffers'];
    });
    await this.storage.set("pageBackOffers",this.pageBackOffers);
    this.functionFeachDataFromServer(this.offerId);
  }
  getTheIngredients(event:any,index){
    let val = this.returnIngredientsArray[index]['title'];
    if(event.detail.checked == true){
      let arrayAdd = [index, val];
      this.selectAllIngredients.push(arrayAdd);
    }else{
      for(let i=0;i<this.selectAllIngredients.length;i++){
        if(this.selectAllIngredients[i][0] == index)
          this.selectAllIngredients.splice(i,1);
      }
    }
  }
  getTheOptions(event:any,index){
    let val = this.returnOptionsArray[index]['options'][event.detail.value]['title'];
    for(let i=0;i<this.selectAllOptions.length;i++){
      if(this.selectAllOptions[i][0] == index)
        this.selectAllOptions.splice(i,1);
    }
    let arrayAdd = [index, val];
    this.selectAllOptions.push(arrayAdd);
  }
  getTheAdditions(event:any,index,subindex){
    let val = this.returnAdditionsArray[index]['additions'][subindex]['title'];
    if(event.detail.checked == true){
      let arrayAdd = [index, val];
      this.selectAllAdditions.push(arrayAdd);
      let allValPrice = this.returnAdditionsArray[index]['additions'][subindex]['price'];
      let countOfVal = parseFloat(this.realPrice)+parseFloat(allValPrice);
      this.realPriceCount = countOfVal;
    }else{
      let allValPrice = this.returnAdditionsArray[index]['additions'][subindex]['price'];
      let countOfVal = parseFloat(this.realPrice)-parseFloat(allValPrice);
      this.realPriceCount = countOfVal;
      for(let i=0;i<this.selectAllAdditions.length;i++){
        if(this.selectAllAdditions[i][0] == index)
          this.selectAllAdditions.splice(i,1);
      }
    }
    this.realPrice =this.realPriceCount.toFixed(2);
  }
  addProductToChart(){
    this.returnOffersByStoreStoreId;
    this.sqlite.create({
      name: "arreb.db",
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql(`select * FROM stores where id=?`, [this.returnOffersByStoreStoreId])
        .then((resNew) =>{
          //storesCat
          let storeName = resNew.rows.item(0).title;
          let deliveryTime = resNew.rows.item(0).deliveryTime;
          let deliveryPrices = resNew.rows.item(0).deliveryPrices;
          let deliveryAnotherTime = resNew.rows.item(0).deliveryAnotherTime;
          let deliveryAnotherPrice = resNew.rows.item(0).deliveryAnotherPrice;
          let taxPrice =  resNew.rows.item(0).taxPrice;
          //productsCart
          let id=this.returnOffersByStoreId;
          let storeId = this.returnOffersByStoreStoreId ;
          let productName = this.returnOffersByStoreTitle
          let price  = this.realPrice;
          let additions = "";
          let options = "";
          let ingredients = "";
          for(let i=0;i<this.selectAllIngredients.length;i++){
            ingredients = ingredients+','+this.selectAllIngredients[i][1];
          }
          for(let i=0;i<this.selectAllOptions.length;i++){
            options = options+','+this.selectAllOptions[i][1];
          }
          for(let i=0;i<this.selectAllAdditions.length;i++){
            additions = additions+','+this.selectAllAdditions[i][1];
          }
          let image = this.returnOffersByStoreImage;
          let quantity  = 1;
          let type = 2;
          if(additions!=""){
            this.insertAllAdditions  = additions.split(',');
            this.insertAllAdditions = this.insertAllAdditions.filter(item => item);
            additions = this.insertAllAdditions.toString();
          }
          if(options!=""){
            this.insertAllOptions  = options.split(',');
            this.insertAllOptions = this.insertAllOptions.filter(item => item);
            options = this.insertAllOptions.toString();
          }
          if(ingredients!=""){
            this.insertAllIngredients  = ingredients.split(',');
            this.insertAllIngredients = this.insertAllIngredients.filter(item => item);
            ingredients = this.insertAllIngredients.toString();
          }
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql(`select * FROM storesCart where id=?`, [this.returnOffersByStoreStoreId])
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
                    db.executeSql(`INSERT INTO productsCart (id,storeId,productName,price,additions,options,ingredients,quantity,image,type,addFrom)
                            VALUES ('${id}','${storeId}','${productName}','${price}','${additions}','${options}','${ingredients}','${quantity}','${image}','${type}','0')`, [])
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
                    VALUES ('${id}','${storeId}','${productName}','${price}','${additions}','${options}','${ingredients}','${quantity}','${image}','${type}','0')`, [])
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
  functionAllStores(){
    this.navCtrl.navigateRoot("/stores");
  }
  functionGoToShoppingcart(){
    this.navCtrl.navigateRoot("/shoppingcart");
  }
  searchAllValues(){
    this.navCtrl.navigateRoot(['/search', {searchValues:this.searchValues}]);
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
  async backToStore(){
    let pageBackOffers = await this.storage.get("pageBackOffers");
    if(pageBackOffers == 1)
      this.navCtrl.navigateRoot("/offers");
    if(pageBackOffers == 2)
      this.navCtrl.navigateRoot("/home");
    if(pageBackOffers == 3)
      this.navCtrl.navigateRoot(['/storedetails', {storeId:this.returnOffersByStoreStoreId}])
  }

}
