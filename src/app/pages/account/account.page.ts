import { Component, OnInit } from '@angular/core';
import {LoadingController, MenuController, NavController, Platform, ToastController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {UsersService} from "../../services/users.service";
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  number:any;
  errorNumber:any="";
  isErrorNumber:any = 1;

  fullName:any;
  errorFullName:any="";
  isErrorFullName:any = 1;

  isdisabled:boolean=true;
  backToPage:any;
  returnData:any;
  operationResult:any;
  message:any;
  returnFullName:any;
  returnNumber:any;
  showPassword: boolean = false;
  showLoginWithApple:any = 0;
  userId:any;
  fullNameLogin:any;
  emailLogin:any;
  productInShopingCart:any;
  constructor(private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private usersService:UsersService,private toastCtrl: ToastController,private loading: LoadingController) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','account');
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
    this.fullName = await this.storage.get('fullNameLogin');
    this.number = await this.storage.get('numberLogin');
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','account');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
  }
  checkNumber(event){
    this.errorNumber = "succsessFiled";
    this.isErrorNumber = 1;
    this.number = event;
    this.isEnterAllValues();
  }
  checkFullName(event){
    this.errorFullName = "succsessFiled";
    this.isErrorFullName = 1;
    this.fullName = event;
    this.isEnterAllValues();
  }
  isEnterAllValues(){
    if(this.fullName != undefined && this.fullName != "" && this.number != undefined && this.number != "" ){
      this.isdisabled = true;
    }
  }
  async updateAccount(){
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','registration');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
    if((this.fullName == undefined || this.fullName == "") && (this.number == undefined || this.number == "")){
      this.errorFullName = "errorFiled";
      this.errorNumber = "errorFiled";
      this.isErrorNumber = 0;
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
    if(this.fullName == undefined || this.fullName == ""){
      this.errorFullName = "errorFiled";
      this.isErrorFullName = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.fullName != undefined && this.number != undefined){
      const loading = await this.loading.create({
        cssClass: 'my-custom-class',
        message: '',
        duration: 2500,
      });
      await loading.present();
      this.userId = await this.storage.get('userId');
      this.usersService.updateAccount(this.number,this.fullName,this.userId).then(data=>{
        this.returnData = data;
        this.operationResult = this.returnData.Error.ErrorCode;
        if(this.operationResult==1){
          this.message = "تم تعديل بيانات حسابكم بنجاج";
          this.displayResult(this.message);
          this.storage.set('fullNameLogin',this.fullName);
          this.storage.set('numberLogin',this.number);
        }else if(this.operationResult==2){
          this.message = "لم تتم تعديل بيانات حسابكم بنجاج...البيانات فارغة";
          this.displayResult(this.message);
        }else if(this.operationResult==3){
          this.message = "لم تتم تعديل بيانات حسابكم بنجاج...حاول مرة اخرى";
          this.displayResult(this.message);
        }
      }).catch(e=>{
        this.message = "لم تتم تعديل بيانات حسابكم بنجاج...حاول مرة اخرى";
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
