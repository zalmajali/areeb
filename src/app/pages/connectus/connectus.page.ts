import { Component, OnInit } from '@angular/core';
import {LoadingController, MenuController, NavController, Platform, ToastController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {UsersService} from "../../services/users.service";
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-connectus',
  templateUrl: './connectus.page.html',
  styleUrls: ['./connectus.page.scss'],
})
export class ConnectusPage implements OnInit {
  fullName:any;
  errorFullName:any="";
  isErrorFullName:any = 1;

  number:any;
  errorNumber:any="";
  isErrorNumber:any = 1;

  msg:any;
  errorMsg:any="";
  isErrorMsg:any = 1;

  isdisabled:boolean=true;
  backToPage:any;
  returnData:any;
  operationResult:any;
  message:any;
  returnFullName:any;
  returnNumber:any;
  fullNameLogin:any;
  emailLogin:any;
  productInShopingCart:any;
  constructor(private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private usersService:UsersService,private toastCtrl: ToastController,private loading: LoadingController) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','connectus');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.navigateRoot("/home");
    });
  }
  async ngOnInit() {
    this.storage.get('productInShopingCart').then(productInShopingCart=>{
      this.productInShopingCart = productInShopingCart;
      if(productInShopingCart==null || productInShopingCart=="" ||  productInShopingCart==0 )
        this.productInShopingCart = 0;
    });
    this.backToPage = await this.storage.get('internetBack');
    this.returnFullName = await this.storage.get('returnFullName');
    this.returnNumber = await this.storage.get('returnNumber');
    if(this.returnNumber!=null && this.returnNumber!=undefined && this.returnNumber!=0)
      this.number = this.returnNumber;
    if(this.returnFullName!=null && this.returnFullName!=undefined && this.returnFullName!=0)
      this.fullName = this.returnFullName;
    if(this.backToPage !='1'){
      this.navCtrl.navigateRoot("/errors");
    }
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','connectus');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
  }
  checkFullName(event){
    this.errorFullName = "succsessFiled";
    this.isErrorFullName = 1;
    this.fullName = event;
    this.isEnterAllValues();
  }
  checkMsg(event){
    this.errorMsg = "succsessFiled";
    this.isErrorMsg = 1;
    this.msg = event;
    this.isEnterAllValues();
  }
  checkNumber(event){
    this.errorNumber = "succsessFiled";
    this.isErrorNumber = 1;
    this.number = event;
    this.isEnterAllValues();
  }
  isEnterAllValues(){
    if(this.fullName != undefined && this.fullName != "" && this.number != undefined && this.number != "" && this.msg != undefined && this.msg != ""){
      this.isdisabled = true;
    }
  }
  async contactSend(){
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','connectus');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
    if((this.fullName == undefined || this.fullName == "") && (this.number == undefined || this.number == "") && (this.msg == undefined || this.msg == "")){
      this.errorFullName = "errorFiled";
      this.errorNumber = "errorFiled";
      this.errorMsg = "errorFiled";
      this.isErrorNumber = 0;
      this.isErrorFullName = 0;
      this.isErrorMsg = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.fullName == undefined || this.fullName == ""){
      this.errorFullName = "errorFiled";
      this.isErrorFullName = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.number == undefined || this.number == ""){
      this.errorNumber = "errorFiled";
      this.isErrorNumber = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.msg == undefined || this.msg == ""){
      this.errorMsg = "errorFiled";
      this.isErrorMsg = 0;
      this.isdisabled = false;
      return false;
    }
    this.returnFullName = await this.storage.set('returnFullName',this.fullName);
    this.returnNumber = await this.storage.set('returnNumber',this.number);
    if(this.fullName != undefined && this.number != undefined && this.msg != undefined){
      const loading = await this.loading.create({
        cssClass: 'my-custom-class',
        message: '',
        duration: 2500,
      });
      await loading.present();
      this.usersService.contactUs(this.fullName,this.number,this.msg).then(data=>{
        this.returnData = data;
        this.operationResult = this.returnData.Error.ErrorCode;
        if(this.operationResult==1){
          this.message = "تم إضافة ملاحظتك بنجاح";
          this.displayResult(this.message);
          this.msg = "";
        }
        else if(this.operationResult==2){
          this.message = "لم يتم إضافة ملاحظتك...البيانات فارغة";
          this.displayResult(this.message);
        }
        else{
          this.message = "لم يتم إضافة ملاحظتك...حاول مرة اخرى";
          this.displayResult(this.message);
        }
      }).catch(e=>{
        this.message = "لم يتم إضافة ملاحظتك...حاول مرة اخرى فيما بعد";
        this.displayResult(this.message);
      })
      this.isdisabled = true;
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
