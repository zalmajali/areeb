import { Component, OnInit,ViewChild } from '@angular/core';
import {MenuController, Platform, NavController,ToastController,ModalController,AlertController,IonInput} from '@ionic/angular';
import {Storage} from "@ionic/storage";
import {StoresService} from "../../services/stores.service";
import { Network } from '@ionic-native/network/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import {ActivatedRoute, Router} from '@angular/router';
import {IonSlides} from '@ionic/angular';
import { ContactinformationComponent } from '../contactinformation/contactinformation.component';
@Component({
  selector: 'app-shoppingcart',
  templateUrl: './shoppingcart.page.html',
  styleUrls: ['./shoppingcart.page.scss'],
})
export class ShoppingcartPage implements OnInit {
  @ViewChild('slides',{static:false}) slides:IonSlides;
  @ViewChild('searchInput', {static:true}) searchInput:IonInput;
  productsStoreSkeleton:boolean = false;
  discount:any;
  returnProductAndStoreCartArray:any=[];
  address: string;
  latlong:any;
  locationName:any;
  number:any;
  numberBackUp:any;
  msg:any;
  productInCart:any = 2;
  message:any;
  userId : any;
  discountCode:any;
  operationResult:any;
  returnisSaveValues:any;
  selectPriceValues:any = 0;
  returnCheckDiscountCodeData:any;
  returnArrayCheckDiscountCode:any;
  returnArrayCheckDiscountCodeVal:any;
  searchValues:any;
  getDeleverYprice:any;
  valuesForDelete:any;
  fullNameLogin:any;
  emailLogin:any;
  productInShopingCart:any;
  checkDiscountValues:any = 0;
  returnRateData:any;
  showDelvaryPriceOfVal:any;
  stopeLoading:any=1;
  constructor(private alertController:AlertController,private modalController: ModalController,private router:Router,private activaterouter:ActivatedRoute,private sqlite: SQLite,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private storesService:StoresService,private toastCtrl: ToastController) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn', 'shoppingcart');
      this.storage.set('internetBack', '0');
      this.navCtrl.navigateRoot("/errors");
    });
  }
  async getTheOptions(event,index,id,allValues:any){
    let newPrice = 0;
    if(event.detail.value == 1){
      this.selectPriceValues = 1;
      newPrice = this.returnProductAndStoreCartArray[index]['realAllPrice']+this.returnProductAndStoreCartArray[index]['deliveryPrices'];
    }else{
      this.selectPriceValues = 2;
      newPrice = this.returnProductAndStoreCartArray[index]['realAllPrice']+this.returnProductAndStoreCartArray[index]['deliveryAnotherPrice'];
    }
    newPrice = newPrice+parseFloat(this.returnProductAndStoreCartArray[index]['taxPrice']);
    this.returnProductAndStoreCartArray[index]['allPrice'] = newPrice;
    await this.checkValBeforAddValues(id,index,newPrice);
  }

///هنا سحب البيانات
  async functionReturnData(){
    this.returnProductAndStoreCartArray = [];
    this.productsStoreSkeleton = true;
    await this.sqlite.create({
      name: "arreb.db",
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql(`select * FROM storesCart`, [])
        .then(async (resNew) =>{
          for(let i = 0; i < resNew.rows.length;i++){
            this.returnProductAndStoreCartArray[i] = [];
            this.returnProductAndStoreCartArray[i]['id'] = resNew.rows.item(i).id;
            this.returnProductAndStoreCartArray[i]['storeName'] = resNew.rows.item(i).storeName;
            this.returnProductAndStoreCartArray[i]['allPrice'] = parseFloat(resNew.rows.item(i).allPrice);
            this.returnProductAndStoreCartArray[i]['realAllPrice'] =parseFloat(resNew.rows.item(i).allPrice);
            this.returnProductAndStoreCartArray[i]['deliveryTime'] = resNew.rows.item(i).deliveryTime;
            this.returnProductAndStoreCartArray[i]['deliveryPrices'] = parseFloat(resNew.rows.item(i).deliveryPrices);
            this.returnProductAndStoreCartArray[i]['deliveryAnotherPrice'] = parseFloat(resNew.rows.item(i).deliveryAnotherPrice);
            this.returnProductAndStoreCartArray[i]['deliveryAnotherTime'] = resNew.rows.item(i).deliveryAnotherTime;
            this.returnProductAndStoreCartArray[i]['taxPrice'] = parseFloat(resNew.rows.item(i).taxPrice);
            this.returnProductAndStoreCartArray[i]['showLargValues'] = 1;
            await this.storesService.storeCountVal(resNew.rows.item(i).id).then(async data=>{
              this.returnRateData = data;
              this.checkDiscountValues = await this.returnRateData.Data.value;
            })
            this.showDelvaryPriceOfVal = 1;
            this.returnProductAndStoreCartArray[i]['products'] = [];
            this.returnProductAndStoreCartArray[i]['allPrice'] = this.returnProductAndStoreCartArray[i]['allPrice']+this.returnProductAndStoreCartArray[i]['taxPrice'];
            if(this.checkDiscountValues==0 || this.returnProductAndStoreCartArray[i]['realAllPrice'] < this.checkDiscountValues){
              this.showDelvaryPriceOfVal = 0;
              if(this.returnProductAndStoreCartArray[i]['deliveryAnotherPrice'] == 0 && this.returnProductAndStoreCartArray[i]['deliveryPrices'] != 0){
                this.selectPriceValues = 1;
                this.returnProductAndStoreCartArray[i]['allPrice'] = this.returnProductAndStoreCartArray[i]['deliveryPrices']+this.returnProductAndStoreCartArray[i]['allPrice'];
              }else if(this.returnProductAndStoreCartArray[i]['deliveryPrices'] == 0 && this.returnProductAndStoreCartArray[i]['deliveryAnotherPrice'] != 0){
                this.selectPriceValues = 2;
                this.returnProductAndStoreCartArray[i]['allPrice'] = this.returnProductAndStoreCartArray[i]['deliveryAnotherPrice']+this.returnProductAndStoreCartArray[i]['allPrice'];
              }else if(this.returnProductAndStoreCartArray[i]['deliveryPrices']== 0 && this.returnProductAndStoreCartArray[i]['deliveryAnotherPrice'] == 0){
                this.selectPriceValues = 2;
                this.returnProductAndStoreCartArray[i]['allPrice'] = this.returnProductAndStoreCartArray[i]['deliveryAnotherPrice']+this.returnProductAndStoreCartArray[i]['allPrice'];
              }else{
                this.selectPriceValues = 2;
                this.returnProductAndStoreCartArray[i]['allPrice'] = this.returnProductAndStoreCartArray[i]['deliveryAnotherPrice']+this.returnProductAndStoreCartArray[i]['allPrice'];
              }
            }
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql(`select * FROM productsCart where storeId= ?`, [resNew.rows.item(i).id])
                .then((resNewAdd) =>{
                  for(let j = 0; j < resNewAdd.rows.length;j++){
                    this.returnProductAndStoreCartArray[i]['products'][j] = [];
                    this.returnProductAndStoreCartArray[i]['products'][j]['id'] = resNewAdd.rows.item(j).id;
                    this.returnProductAndStoreCartArray[i]['products'][j]['storeId'] = resNewAdd.rows.item(j).storeId;
                    this.returnProductAndStoreCartArray[i]['products'][j]['productName'] = resNewAdd.rows.item(j).productName;
                    this.returnProductAndStoreCartArray[i]['products'][j]['price'] = parseFloat(resNewAdd.rows.item(j).price);
                    this.returnProductAndStoreCartArray[i]['products'][j]['additions'] = resNewAdd.rows.item(j).additions;
                    this.returnProductAndStoreCartArray[i]['products'][j]['options'] = resNewAdd.rows.item(j).options;
                    this.returnProductAndStoreCartArray[i]['products'][j]['ingredients'] = resNewAdd.rows.item(j).ingredients;
                    this.returnProductAndStoreCartArray[i]['products'][j]['quantity'] = Number(resNewAdd.rows.item(j).quantity);
                    this.returnProductAndStoreCartArray[i]['products'][j]['image'] = resNewAdd.rows.item(j).image;
                    this.returnProductAndStoreCartArray[i]['products'][j]['type'] = resNewAdd.rows.item(j).type;
                    this.returnProductAndStoreCartArray[i]['products'][j]['showSmallValues'] = 1;
                  }
                }).catch(e => {this.productInCart = 0;});
            }).catch(e => {this.productInCart = 0;})
          }
          let countOfData = this.returnProductAndStoreCartArray.length;
          if(countOfData == 0)
            this.productInCart = 0;
          else {
            this.productInCart = 1;
          }
        }).catch(e => {this.productInCart = 0;});
    }).catch(e => {this.productInCart = 0;})
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
    this.productInCart = 0;
    this.number = await this.storage.get('numberInformation');
    this.numberBackUp = await this.storage.get('numberBackUpInformation');
    this.msg = await this.storage.get('msgInformation');
    this.address = await this.storage.get('addressmsgInformation');
    this.latlong = await this.storage.get('latitudeInformation')+","+await this.storage.get('longitudeInformation');
    await this.functionReturnData();
  }
  async contactInformation(){
    let model = await this.modalController.create({
      component:ContactinformationComponent,
      animated:true,
      cssClass:"modalFilterSortCss"
    });
    model.onDidDismiss().then(data=>{
     this.address = data.data.address;
      this.number = data.data.number;
      this.latlong = data.data.latlong;
      this.msg = data.data.msg;
      this.numberBackUp = data.data.numberBackUp;
    });
    await model.present();
  }
  ///هنا السحب البيانات اذا كانت التكلفة اقل او اكثر
  async functionQuantity(id:any,largIndex:any,smaillIndex:any,operationType:any){
    this.stopeLoading=0;
    setTimeout(()=>{
      this.stopeLoading = 1
    },1000);
    let storeCartId = this.returnProductAndStoreCartArray[largIndex]['products'][smaillIndex]['storeId']
    if(operationType == 1){
      let allQuantity = parseInt(this.returnProductAndStoreCartArray[largIndex]['products'][smaillIndex]['quantity'])+1;
      let allPrice  = parseFloat(this.returnProductAndStoreCartArray[largIndex]['realAllPrice'])+parseFloat(this.returnProductAndStoreCartArray[largIndex]['products'][smaillIndex]['price']);
      let allPriceTow  = parseFloat(this.returnProductAndStoreCartArray[largIndex]['allPrice'])+parseFloat(this.returnProductAndStoreCartArray[largIndex]['products'][smaillIndex]['price']);
      this.returnProductAndStoreCartArray[largIndex]['products'][smaillIndex]['quantity'] = allQuantity;
      if(this.showDelvaryPriceOfVal == 0){
        if(allPrice >= this.checkDiscountValues){
          this.showDelvaryPriceOfVal = 1;
          allPriceTow = allPrice+parseFloat(this.returnProductAndStoreCartArray[largIndex]['taxPrice']);
        }
      }
      this.returnProductAndStoreCartArray[largIndex]['allPrice'] = allPriceTow;
      this.returnProductAndStoreCartArray[largIndex]['realAllPrice'] = allPrice;
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then(async (db: SQLiteObject) => {
        db.executeSql(`UPDATE storesCart SET allPrice='${allPrice}' where id=?`, [storeCartId])
          .then(() => {})
          .catch(e => {});
      }).catch(e => {});

      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then(async (db: SQLiteObject) => {
        db.executeSql(`UPDATE productsCart SET quantity='${allQuantity}' where id=?`, [id])
          .then(() => {})
          .catch(e => {});
      }).catch(e => {});
    }else{
      this.stopeLoading=0;
      setTimeout(()=>{
        this.stopeLoading = 1
      },1000);
      let allQuantity = this.returnProductAndStoreCartArray[largIndex]['products'][smaillIndex]['quantity']-1;
      if(allQuantity!=0){
        let allPrice  = parseFloat(this.returnProductAndStoreCartArray[largIndex]['realAllPrice'])-parseFloat(this.returnProductAndStoreCartArray[largIndex]['products'][smaillIndex]['price']);
        let allPriceTow  = allPrice+parseFloat(this.returnProductAndStoreCartArray[largIndex]['taxPrice']);
        this.returnProductAndStoreCartArray[largIndex]['products'][smaillIndex]['quantity'] = allQuantity;
        await this.storesService.storeCountVal(id).then(async data=>{
          this.returnRateData = data;
          this.checkDiscountValues = await this.returnRateData.Data.value;
        })
          if(this.showDelvaryPriceOfVal == 1){
            if(allPrice < this.checkDiscountValues) {
              this.showDelvaryPriceOfVal = 0;
              if (this.selectPriceValues == 1) {
                allPriceTow = allPriceTow + parseFloat(this.returnProductAndStoreCartArray[largIndex]['deliveryPrices']);
              } else if (this.selectPriceValues == 2) {
                allPriceTow = allPriceTow + parseFloat(this.returnProductAndStoreCartArray[largIndex]['deliveryAnotherPrice']);
              } else {
                this.selectPriceValues = 2;
                allPriceTow = allPriceTow + parseFloat(this.returnProductAndStoreCartArray[largIndex]['deliveryAnotherPrice']);
              }
            }
          }else{
            if(allPrice >= this.checkDiscountValues){
              this.showDelvaryPriceOfVal = 1;
              if(this.selectPriceValues==1){
                allPriceTow = allPrice+parseFloat(this.returnProductAndStoreCartArray[largIndex]['taxPrice']);
              }else if(this.selectPriceValues==2){
                allPriceTow = allPrice+parseFloat(this.returnProductAndStoreCartArray[largIndex]['taxPrice']);
              }
            }else{
              if (this.selectPriceValues == 1) {
                allPriceTow = allPriceTow + parseFloat(this.returnProductAndStoreCartArray[largIndex]['deliveryPrices']);
              } else if (this.selectPriceValues == 2) {
                allPriceTow = allPriceTow + parseFloat(this.returnProductAndStoreCartArray[largIndex]['deliveryAnotherPrice']);
              } else {
                this.selectPriceValues = 2;
                allPriceTow = allPriceTow + parseFloat(this.returnProductAndStoreCartArray[largIndex]['deliveryAnotherPrice']);
              }
            }
          }
        this.returnProductAndStoreCartArray[largIndex]['allPrice'] = allPriceTow;
        this.returnProductAndStoreCartArray[largIndex]['realAllPrice'] = allPrice;
        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE storesCart SET allPrice='${allPrice}' where id=?`, [storeCartId])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});

        this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`UPDATE productsCart SET quantity='${allQuantity}' where id=?`, [id])
            .then(() => {})
            .catch(e => {});
        }).catch(e => {});
      }else{
        this.message = "عذرأ...لقد قمت بتحديد اقل كمية ممكنة من المنتج";
        this.displayResult(this.message);
      }
    }
  }
  ///هنا السحب البيانات اذا كانت التكلفة اقل او اكثر
  async functionDeletePro(id:any,largIndex:any,smaillIndex:any,proType:any){
    let allPriceCalculate = this.returnProductAndStoreCartArray[largIndex]['products'][smaillIndex]['quantity'] * parseFloat(this.returnProductAndStoreCartArray[largIndex]['products'][smaillIndex]['price']);
    let allPrice  = parseFloat(this.returnProductAndStoreCartArray[largIndex]['realAllPrice'])-allPriceCalculate;
    this.returnProductAndStoreCartArray[largIndex]['products'][smaillIndex]['showSmallValues'] = 0;
    let idData = this.returnProductAndStoreCartArray[largIndex]['id'];
    if(allPrice == 0){
      this.returnProductAndStoreCartArray[largIndex]['showLargValues'] = 0;
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DELETE FROM storesCart where id=?',[idData])
          .then(() => {
            this.storage.get('productInShopingCart').then(productInShopingCart=>{
              this.productInShopingCart = productInShopingCart-1;
              if(productInShopingCart==null || productInShopingCart=="" ||  productInShopingCart==0 )
                this.productInShopingCart = 1;
              this.storage.set('productInShopingCart',this.productInShopingCart);
            });

          })
          .catch(e => {});
      }).catch(e => {});
      await this.functionReturnData();
    }else{
      let allPriceTow  = allPrice+parseFloat(this.returnProductAndStoreCartArray[largIndex]['taxPrice']);
      await this.storesService.storeCountVal(id).then(async data=>{
        this.returnRateData = data;
        this.checkDiscountValues = await this.returnRateData.Data.value;
      })
      if(this.showDelvaryPriceOfVal == 1){
        if(allPrice < this.checkDiscountValues) {
          this.showDelvaryPriceOfVal = 0;
          if (this.selectPriceValues == 1) {
            allPriceTow = allPriceTow + parseFloat(this.returnProductAndStoreCartArray[largIndex]['deliveryPrices']);
          } else if (this.selectPriceValues == 2) {
            allPriceTow = allPriceTow + parseFloat(this.returnProductAndStoreCartArray[largIndex]['deliveryAnotherPrice']);
          } else {
            this.selectPriceValues = 2;
            allPriceTow = allPriceTow + parseFloat(this.returnProductAndStoreCartArray[largIndex]['deliveryAnotherPrice']);
          }
        }
      }else{
        if(allPrice >= this.checkDiscountValues){
          this.showDelvaryPriceOfVal = 1;
          if(this.selectPriceValues==1){
            allPriceTow = allPrice+parseFloat(this.returnProductAndStoreCartArray[largIndex]['taxPrice']);
          }else if(this.selectPriceValues==2){
            allPriceTow = allPrice+parseFloat(this.returnProductAndStoreCartArray[largIndex]['taxPrice']);
          }
        }else{
          if (this.selectPriceValues == 1) {
            allPriceTow = allPriceTow + parseFloat(this.returnProductAndStoreCartArray[largIndex]['deliveryPrices']);
          } else if (this.selectPriceValues == 2) {
            allPriceTow = allPriceTow + parseFloat(this.returnProductAndStoreCartArray[largIndex]['deliveryAnotherPrice']);
          } else {
            this.selectPriceValues = 2;
            allPriceTow = allPriceTow + parseFloat(this.returnProductAndStoreCartArray[largIndex]['deliveryAnotherPrice']);
          }
        }
      }
      this.returnProductAndStoreCartArray[largIndex]['allPrice'] = allPriceTow;
      this.returnProductAndStoreCartArray[largIndex]['realAllPrice'] = allPrice;
      this.sqlite.create({
        name: "arreb.db",
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(`UPDATE storesCart SET allPrice='${allPrice}' where id=?`, [idData])
          .then(() => {
            this.storage.get('productInShopingCart').then(productInShopingCart=>{
              this.productInShopingCart = productInShopingCart-1;
              if(productInShopingCart==null || productInShopingCart=="" ||  productInShopingCart==0 )
                this.productInShopingCart = 1;
              this.storage.set('productInShopingCart',this.productInShopingCart);
            });
          })
          .catch(e => {});
      }).catch(e => {});
    }
    this.sqlite.create({
      name: "arreb.db",
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('DELETE FROM productsCart where id=? AND type=?',[id,proType])
        .then(() => {
        })
        .catch(e => {});
    }).catch(e => {});
    await this.functionReturnData();
    this.message = "تم إزالة المنتج من قائمة طلبات المتجر";
    this.displayResult(this.message);
  }
  async functionDeleteAll(id:any,index){
    this.returnProductAndStoreCartArray[index]['showLargValues'] = 0;
    this.sqlite.create({
      name: "arreb.db",
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('DELETE FROM productsCart where storeId=?',[id])
        .then(() => {
          this.storage.get('productInShopingCart').then(productInShopingCart=>{
              this.productInShopingCart = 0;
            this.storage.set('productInShopingCart',this.productInShopingCart);
          });
        })
        .catch(e => {});
    }).catch(e => {});
    this.sqlite.create({
      name: "arreb.db",
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('DELETE FROM storesCart where id=?',[id])
        .then(() => {
        })
        .catch(e => {});
    }).catch(e => {});
    this.message = "تم إزالة الطلب من قائمة الطلبات";
    await this.functionReturnData();
    this.displayResult(this.message);
  }
  async checkValBeforAddValues(id:any,index:any,allValues:any){
    if(this.selectPriceValues==1)
      this.getDeleverYprice = this.returnProductAndStoreCartArray[index]['deliveryPrices'];
    else
      this.getDeleverYprice = this.returnProductAndStoreCartArray[index]['deliveryAnotherPrice'];
    this.userId = await this.storage.get('userId');
    let message="";
    if(this.discountCode!="" && this.discountCode !="" && this.discountCode!=undefined){
      this.storesService.checkDiscountCode(this.discountCode,this.userId,allValues,id,this.getDeleverYprice).then(data=>{
        this.returnCheckDiscountCodeData = data;
        this.operationResult = this.returnCheckDiscountCodeData.Error.ErrorCode;
        if(this.operationResult==1){
          this.returnArrayCheckDiscountCode = this.returnCheckDiscountCodeData.Error.ErrorNumber;
          this.returnArrayCheckDiscountCodeVal = this.returnCheckDiscountCodeData.Error.number;
          if(this.returnArrayCheckDiscountCode == 1)
            message = "كود الخصم المدخل غير صحيح";
          if(this.returnArrayCheckDiscountCode == 2)
            message = "كود الخصم المدخل تم إستخدامه من قبل";
          if(this.returnArrayCheckDiscountCode == 3){
            this.returnProductAndStoreCartArray[index]['allPrice'] = this.returnArrayCheckDiscountCodeVal
            message = "كود الخصم المدخل صحيح...تم تعديل قيمة الطلب";
          }
        }else{
          message = "هناك مشكلة في النظام لم يتم تحديد كود الخصم";
        }
      });
    }else{
      message = "هناك مشكلة في النظام لم يتم تحديد كود الخصم";
    }
  }
  async alertDataReturn(id:any,index:any,allValues:any,message:any){
  let alert = await this.alertController.create({
    cssClass: 'alertBac',
    mode: 'ios',
    message: message,
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
          this.addValuesToServer(id,index);
        }
      }
    ]
  });
  await alert.present();
}
  ///التحقق من البيانات قبل السحب
  async addValuesToServer(id:any,index:any){
    if(this.selectPriceValues != 0){
      this.userId = await  this.storage.get('userId');
      if(this.userId!=null && this.userId !=undefined && this.userId!=0 && this.userId!=""){
        await this.sqlite.create({
          name: "arreb.db",
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(`select * FROM storesCart where id=?`, [id])
            .then(async (resNew) =>{
              for(let i = 0; i < resNew.rows.length; i++){
                let allPriceGetVal = resNew.rows.item(i).allPrice;
                let time = resNew.rows.item(i).deliveryAnotherTime;
                if(this.showDelvaryPriceOfVal == 0){
                  if(this.selectPriceValues == 1){
                    allPriceGetVal = parseFloat(resNew.rows.item(i).allPrice)+parseFloat(resNew.rows.item(i).deliveryPrices)+parseFloat(resNew.rows.item(i).taxPrice);
                    time = resNew.rows.item(i).deliveryTime;
                  }
                  else if(this.selectPriceValues == 2){
                    allPriceGetVal = parseFloat(resNew.rows.item(i).allPrice)+parseFloat(resNew.rows.item(i).deliveryAnotherPrice)+parseFloat(resNew.rows.item(i).taxPrice);
                    time = resNew.rows.item(i).deliveryAnotherTime;
                  }
                }
                let allPrice =allPriceGetVal;
                if(this.number!="" && this.number!=null && this.number!=0 && this.number!=undefined && this.latlong!="" && this.latlong!=null && this.latlong!=0 && this.latlong!=undefined && this.address!=""){
                  this.storesService.addOrdersCart(this.userId,resNew.rows.item(i).id,allPrice,this.number,this.numberBackUp,this.latlong,this.address,this.msg,time,this.selectPriceValues,this.discountCode).then(async data=>{
                    this.returnisSaveValues = data;
                    this.operationResult = this.returnisSaveValues.Error.ErrorCode;
                    let orderId = this.returnisSaveValues.Error.insertId;
                    let storeIdFromDb = resNew.rows.item(i).id;
                    if(this.operationResult==1){
                      this.valuesForDelete = 0;
                      this.sqlite.create({
                        name: "arreb.db",
                        location: 'default'
                      }).then((db: SQLiteObject) => {
                        db.executeSql(`select * FROM productsCart where storeId= ?`, [storeIdFromDb])
                          .then(async (resNewAdd) =>{
                            for(let j = 0; j < resNewAdd.rows.length;j++){
                              this.storesService.addProductToOrderCart(orderId,resNewAdd.rows.item(j).storeId,resNewAdd.rows.item(j).id,resNewAdd.rows.item(j).additions,resNewAdd.rows.item(j).ingredients,resNewAdd.rows.item(j).options,resNewAdd.rows.item(j).price,resNewAdd.rows.item(j).quantity,resNewAdd.rows.item(j).type).then(async data=>{
                                this.returnisSaveValues = data;
                                this.operationResult = this.returnisSaveValues.Error.ErrorCode;
                                if(this.operationResult==1) {
                                  await this.sqlite.create({
                                    name: "arreb.db",
                                    location: 'default'
                                  }).then((db: SQLiteObject) => {
                                    db.executeSql('DELETE FROM productsCart where id=?',[resNewAdd.rows.item(j).id])
                                      .then(() => {

                                      })
                                      .catch(e => {});
                                  }).catch(e => {});
                                }
                              });
                            }
                          }).catch(e => {});
                      }).catch(e => {});
                      this.returnProductAndStoreCartArray[index]['showLargValues'] = 0;
                      await this.sqlite.create({
                        name: "arreb.db",
                        location: 'default'
                      }).then((db: SQLiteObject) => {
                        db.executeSql('DELETE FROM storesCart where id=?',[id])
                          .then(() => {})
                          .catch(e => {});
                      }).catch(e => {});
                      this.storage.get('productInShopingCart').then(productInShopingCart=>{
                        this.productInShopingCart = productInShopingCart-1;
                        if(productInShopingCart==null || productInShopingCart=="" ||  productInShopingCart==0 )
                          this.productInShopingCart = 1;
                        this.storage.set('productInShopingCart',this.productInShopingCart);
                      });
                      this.message = "طلبك قيد المتابعة للتحقق من حالة طلبك يرجى الانتقال الى قائمة طلباتي";
                      this.displayResult(this.message);
                      this.functionReturnData();
                    }else if(this.operationResult==2){
                      this.message = "لم تتم المحاولة بنجاح...البيانات فارغة";
                      this.displayResult(this.message);
                    }else{
                      this.message = "لم تتم المحاولة بنجاح...حاول مرة أخرى";
                      this.displayResult(this.message);
                    }
                  });
                }else{
                  this.message = "لاتمام عملية الشراء من التطبيق يرجى تحديد معلومات التوصيل";
                  this.displayResult(this.message);
                }
              }
            }).catch(e => {});
        }).catch(e => {});
      }else{
        this.message = "لاتمام عملية الشراء من التطبيق يرجى تسجيل الدخول على حسابك";
        this.displayResult(this.message);
      }
    }else{
      this.message = "لاتمام عملية الشراء من التطبيق يرجى تسجيل الدخول على حسابك";
      this.displayResult(this.message);
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
  searchAllValues(){
    this.navCtrl.navigateRoot(['/search', {searchValues:this.searchValues}]);
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
  slidePrev() {
    this.slides.slidePrev();
  }
  slideNext() {
    this.slides.slideNext();
  }
}
