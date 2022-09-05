import { Component, OnInit } from '@angular/core';
import {LoadingController, MenuController, NavController, Platform, ToastController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {UsersService} from "../../services/users.service";
import { Network } from '@ionic-native/network/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import {SQLite, SQLiteObject} from "@ionic-native/sqlite/ngx";
import {HttpClient} from "@angular/common/http";
import { SignInWithApple, AppleSignInResponse, AppleSignInErrorResponse, ASAuthorizationAppleIDRequest } from '@ionic-native/sign-in-with-apple/ngx';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  number:any;
  errorNumber:any="";
  isErrorNumber:any = 1;
  password:any;
  errorPassword:any="";
  isErrorPassword:any = 1;
  isdisabled:boolean=true;
  backToPage:any;
  returnData:any;
  operationResult:any;
  message:any;
  loadingShow:any = 0;
  returnFullName:any;
  returnNumber:any;
  showPassword: boolean = false;
  showLoginWithApple:any = 0;
  facebookToken:any;
  facebookUserId:any;
  result:any;
  firstTime:any;
  lastTime:any;
  fullNameLogin:any;
  emailLogin:any;
  productInShopingCart:any;
  constructor(private http:HttpClient,private signInWithApple: SignInWithApple,private facebook: Facebook,private sqlite: SQLite,private googlePlus:GooglePlus,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private usersService:UsersService,private toastCtrl: ToastController,private loading: LoadingController) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','login');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.navigateRoot("/login");
    });
  }
  async ngOnInit() {
    this.storage.get('productInShopingCart').then(productInShopingCart=>{
      this.productInShopingCart = productInShopingCart;
      if(productInShopingCart==null || productInShopingCart=="" ||  productInShopingCart==0 )
        this.productInShopingCart = 0;
    });
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','login');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
    if(this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'))
      this.showLoginWithApple = 1;
    this.backToPage = await this.storage.get('internetBack');
    if(this.backToPage !='1'){
      this.navCtrl.navigateRoot("/errors");
    }
  }
  checkNumber(event){
    this.errorNumber = "succsessFiled";
    this.isErrorNumber = 1;
    this.number = event;
    if(this.number == "" || this.number == undefined){
      this.errorNumber = "errorFiled";
      this.isErrorNumber = 0;
    }
    this.isEnterAllValues();
  }
  checkPassword(event){
    this.errorPassword = "succsessFiled";
    this.isErrorPassword = 1;
    this.password = event;
    if(this.password == "" || this.password == undefined){
      this.errorPassword = "errorFiled";
      this.isErrorPassword = 0;
    }
    this.isEnterAllValues();
  }
  isEnterAllValues(){
    if(this.number != undefined && this.number != "" && this.password != undefined && this.password != ""){
      this.isdisabled = true;
    }
  }
  async googlePluseLogin(){
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','login');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
    this.googlePlus.login({})
      .then(result => {
        let name = result.displayName;
        let email = result.email;
        let userGoogleId = result.userId;
          this.usersService.checkUserGoogle(name,email,userGoogleId).then(data=>{
          this.returnData = data;
          this.operationResult = this.returnData.Error.ErrorCode;
          if(this.operationResult==1){
            this.storage.remove('saveDataHome');
            this.storage.remove('selectedStoreVal');
            this.storage.remove('subCatStoreSelected');
            this.storage.remove('storeRegion');
            this.storage.remove('lastAllStoresSortSelect');
            this.storage.remove('homeCategories');
            this.storage.remove('selectedFavVal');
            this.storage.remove('subCatFavSelected');
            this.storage.remove('favRegion');
            this.storage.remove('lastAllFavSortSelect');
            this.storage.remove('typeShow');
            this.storage.remove('selectedSearchVal');
            this.storage.remove('subCatSearchSelected');
            this.storage.remove('searchRegion');
            this.storage.remove('lastAllSearchSortSelect');
            this.storage.remove('orderNumber');
            this.storage.remove('productName');
            this.storage.remove('storeName');
            this.storage.remove('priceFrom');
            this.storage.remove('priceTo');
            this.storage.remove('fromDate');
            this.storage.remove('toDate');
            this.storage.remove('status');
            this.storage.remove('selectValues');
            this.storage.remove('allStoresShow');
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('DROP TABLE IF EXISTS categories_home')
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('DROP TABLE IF EXISTS products_stores_home')
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});


            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('DROP TABLE IF EXISTS products_home')
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});


            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('DROP TABLE IF EXISTS sub_categories_home')
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('DROP TABLE IF EXISTS banners')
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('DROP TABLE IF EXISTS offers')
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('DROP TABLE IF EXISTS categories')
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('DROP TABLE IF EXISTS stores')
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('DROP TABLE IF EXISTS allstores')
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('DROP TABLE IF EXISTS favouriteStores')
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});

            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('DROP TABLE IF EXISTS searchStores')
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('DROP TABLE IF EXISTS products')
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('DROP TABLE IF EXISTS productsFields')
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('DROP TABLE IF EXISTS branches')
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('DROP TABLE IF EXISTS storesCategories')
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('DROP TABLE IF EXISTS subCategories')
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});

            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('DROP TABLE IF EXISTS categoriesAdditions')
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});

            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('DROP TABLE IF EXISTS categoriesAdditionsOffer')
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});

            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('DROP TABLE IF EXISTS additionsPro')
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('DROP TABLE IF EXISTS optionsPro')
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('DROP TABLE IF EXISTS ingredientsPro')
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});

            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('DROP TABLE IF EXISTS additionsOffer')
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('DROP TABLE IF EXISTS optionsOffer')
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
            this.sqlite.create({
              name: "arreb.db",
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('DROP TABLE IF EXISTS ingredientsOffer')
                .then(() => {})
                .catch(e => {});
            }).catch(e => {});
            this.loadingShow = 0;
            this.storage.set('fullNameLogin',name);
            this.storage.set('emailLogin',email);
            this.storage.set('numberLogin',"");
            this.storage.set('passwordLogin',"");
            this.storage.set('userId',this.returnData.Error.insertId);
            this.navCtrl.navigateRoot("/home");
          }else if(this.operationResult==2){
            this.message = "لم تتم عملية الدخول بنجاح...البيانات فارغة";
            this.displayResult(this.message);
          }else if(this.operationResult==3){
            this.message = "لم تتم عملية الدخول بنجاح...البيانات غير صحيحة";
            this.displayResult(this.message);
          }else{
            this.message = "لم تتم عملية الدخول بنجاح...حاول مرة اخرى";
            this.displayResult(this.message);
          }
        }).catch(e=>{
          this.message = "لم تتم عملية الدخول بنجاح...حاول مرة اخرى";
          this.displayResult(this.message);
        })
      })
      .catch(err => {
        this.message = "لم تتم عملية الدخول بنجاح...حاول مرة اخرى";
        this.displayResult(this.message);
      });
  }
  async facebookLogin(){
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','login');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
    this.facebook.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => {
        if(res.status){
          this.facebookToken = res.authResponse.accessToken;
          this.facebookUserId = res.authResponse.userID;
          this.getFacebookData(this.facebookToken,this.facebookUserId)
        }else{
          this.message = "لم تتم عملية الدخول بنجاح...حاول مرة اخرى";
          this.displayResult(this.message);
        }
      })
      .catch(e => {
        this.message = "لم تتم عملية الدخول بنجاح...حاول مرة اخرى";
        this.displayResult(this.message);
      });
  }
  getFacebookData(token:any,userId:any){
    let url = "https://graph.facebook.com/v2.9/me?fields=email,name&access_token="+token;
    this.http.get(url).subscribe(data => {
      this.result = data;
      this.usersService.functionFacebookLogIn(this.result.name,this.result.email,this.result.id).then(data=>{
        this.returnData = data;
        this.operationResult = this.returnData.Error.ErrorCode;
        if(this.operationResult==1){
          this.storage.remove('saveDataHome');
          this.storage.remove('selectedStoreVal');
          this.storage.remove('subCatStoreSelected');
          this.storage.remove('storeRegion');
          this.storage.remove('lastAllStoresSortSelect');
          this.storage.remove('homeCategories');
          this.storage.remove('selectedFavVal');
          this.storage.remove('subCatFavSelected');
          this.storage.remove('favRegion');
          this.storage.remove('lastAllFavSortSelect');
          this.storage.remove('typeShow');
          this.storage.remove('selectedSearchVal');
          this.storage.remove('subCatSearchSelected');
          this.storage.remove('searchRegion');
          this.storage.remove('lastAllSearchSortSelect');
          this.storage.remove('orderNumber');
          this.storage.remove('productName');
          this.storage.remove('storeName');
          this.storage.remove('priceFrom');
          this.storage.remove('priceTo');
          this.storage.remove('fromDate');
          this.storage.remove('toDate');
          this.storage.remove('status');
          this.storage.remove('selectValues');
          this.storage.remove('allStoresShow');
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS categories_home')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS products_stores_home')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});


          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS products_home')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});


          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS sub_categories_home')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS offers')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS categories')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS stores')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS allstores')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS favouriteStores')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});

          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS searchStores')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS products')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS productsFields')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS branches')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS storesCategories')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS subCategories')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});

          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS categoriesAdditions')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});

          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS categoriesAdditionsOffer')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});

          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS additionsPro')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS optionsPro')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS ingredientsPro')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});

          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS additionsOffer')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS optionsOffer')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS ingredientsOffer')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.loadingShow = 0;
          this.storage.set('fullNameLogin',this.result.name);
          this.storage.set('emailLogin',this.result.email);
          this.storage.set('numberLogin',"");
          this.storage.set('passwordLogin',"");
          this.storage.set('userId',this.returnData.Error.insertId);
          this.navCtrl.navigateRoot("/home");
        }else if(this.operationResult==2){
          this.message = "لم تتم عملية الدخول بنجاح...البيانات فارغة";
          this.displayResult(this.message);
        }else if(this.operationResult==3){
          this.message = "لم تتم عملية الدخول بنجاح...البيانات غير صحيحة";
          this.displayResult(this.message);
        }else if(this.operationResult==4){
          this.message = "لم تتم عملية الدخول بنجاح...البيانات غير صحيحة";
          this.displayResult(this.message);
        }else{
          this.message = "لم تتم عملية الدخول بنجاح...حاول مرة اخرى";
          this.displayResult(this.message);
        }
      }).catch(e=>{
        this.message = "لم تتم عملية الدخول بنجاح...حاول مرة اخرى";
        this.displayResult(this.message);
      })
    }, err => {
      this.message = "لم تتم عملية الدخول بنجاح...حاول مرة اخرى";
      this.displayResult(this.message);
    });
  }
  async appleLogin(){
    this.signInWithApple.signin({requestedScopes: [ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName, ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail]
     }).then((res: AppleSignInResponse) =>{
      let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
        this.storage.set('thisPageReturn','login');
        this.storage.set('internetBack','0');
        this.navCtrl.navigateRoot("/errors");
      });
      this.usersService.checkUserAppel(res.user).then(data=>{
        this.returnData = data;
        this.operationResult = this.returnData.Error.ErrorCode;
        if(this.operationResult==1){
          this.storage.remove('saveDataHome');
          this.storage.remove('selectedStoreVal');
          this.storage.remove('subCatStoreSelected');
          this.storage.remove('storeRegion');
          this.storage.remove('lastAllStoresSortSelect');
          this.storage.remove('homeCategories');
          this.storage.remove('selectedFavVal');
          this.storage.remove('subCatFavSelected');
          this.storage.remove('favRegion');
          this.storage.remove('lastAllFavSortSelect');
          this.storage.remove('typeShow');
          this.storage.remove('selectedSearchVal');
          this.storage.remove('subCatSearchSelected');
          this.storage.remove('searchRegion');
          this.storage.remove('lastAllSearchSortSelect');
          this.storage.remove('orderNumber');
          this.storage.remove('productName');
          this.storage.remove('storeName');
          this.storage.remove('priceFrom');
          this.storage.remove('priceTo');
          this.storage.remove('fromDate');
          this.storage.remove('toDate');
          this.storage.remove('status');
          this.storage.remove('selectValues');
          this.storage.remove('allStoresShow');
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS categories_home')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS products_stores_home')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});


          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS products_home')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});


          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS sub_categories_home')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS offers')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS categories')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS stores')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS allstores')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS favouriteStores')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});

          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS searchStores')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS products')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS productsFields')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS branches')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS storesCategories')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS subCategories')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});

          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS categoriesAdditions')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});

          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS categoriesAdditionsOffer')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});

          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS additionsPro')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS optionsPro')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS ingredientsPro')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});

          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS additionsOffer')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS optionsOffer')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS ingredientsOffer')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.loadingShow = 0;
          this.storage.set('fullNameLogin',this.returnData.Error.name);
          this.storage.set('emailLogin',this.returnData.Error.email);
          this.storage.set('numberLogin',"");
          this.storage.set('passwordLogin',"");
          this.storage.set('userId',this.returnData.Error.insertId);
          this.navCtrl.navigateRoot("/home");
        }else if(this.operationResult==2){
          this.message = "لم تتم عملية الدخول بنجاح...البيانات فارغة";
          this.displayResult(this.message);
        }else if(this.operationResult==3){
          this.message = "لم تتم عملية الدخول بنجاح...البيانات غير صحيحة";
          this.displayResult(this.message);
        }else{
          this.message = "لم تتم عملية الدخول بنجاح...حاول مرة اخرى";
          this.displayResult(this.message);
        }
      }).catch(e=>{
        this.message = "لم تتم عملية الدخول بنجاح...حاول مرة اخرى";
        this.displayResult(this.message);
      })
      }).catch((error: AppleSignInErrorResponse) => {
        this.message = "لم تتم عملية الدخول بنجاح...حاول مرة اخرى";
        this.displayResult(this.message);
      });
  }
  async checkUser(){

    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: '',
      duration: 1000,
    });
    await loading.present();

    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','login');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
    if((this.number == undefined || this.number == "") && (this.password == undefined || this.password == "")){
      this.errorNumber = "errorFiled";
      this.errorPassword = "errorFiled";
      this.isErrorNumber = 0;
      this.isErrorPassword = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.number == undefined || this.number == ""){
      this.errorNumber = "errorFiled";
      this.isErrorNumber = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.password == undefined || this.password == ""){
      this.errorPassword = "errorFiled";
      this.isErrorPassword = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.number != undefined && this.password != undefined){
      const loading = await this.loading.create({
        cssClass: 'my-custom-class',
        message: '',
        duration: 2500,
      });
      await loading.present();
      this.usersService.checkUser(this.number,this.password).then(data=>{
        this.returnData = data;
        this.operationResult = this.returnData.Error.ErrorCode;
        if(this.operationResult==1){
        this.storage.remove('saveDataHome');
          this.storage.remove('selectedStoreVal');
          this.storage.remove('subCatStoreSelected');
          this.storage.remove('storeRegion');
          this.storage.remove('lastAllStoresSortSelect');
          this.storage.remove('homeCategories');
          this.storage.remove('selectedFavVal');
          this.storage.remove('subCatFavSelected');
          this.storage.remove('favRegion');
          this.storage.remove('lastAllFavSortSelect');
          this.storage.remove('typeShow');
          this.storage.remove('selectedSearchVal');
          this.storage.remove('subCatSearchSelected');
          this.storage.remove('searchRegion');
          this.storage.remove('lastAllSearchSortSelect');
          this.storage.remove('orderNumber');
          this.storage.remove('productName');
          this.storage.remove('storeName');
          this.storage.remove('priceFrom');
          this.storage.remove('priceTo');
          this.storage.remove('fromDate');
          this.storage.remove('toDate');
          this.storage.remove('status');
          this.storage.remove('selectValues');
          this.storage.remove('allStoresShow');
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS categories_home')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS products_stores_home')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});


          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS products_home')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});


          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS sub_categories_home')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS offers')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS categories')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS stores')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS allstores')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS favouriteStores')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});

          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS searchStores')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS products')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS productsFields')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS branches')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS storesCategories')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS subCategories')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});

          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS categoriesAdditions')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});

          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS categoriesAdditionsOffer')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});

          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS additionsPro')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS optionsPro')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS ingredientsPro')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});

          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS additionsOffer')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS optionsOffer')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.sqlite.create({
            name: "arreb.db",
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('DROP TABLE IF EXISTS ingredientsOffer')
              .then(() => {})
              .catch(e => {});
          }).catch(e => {});
          this.storage.set('fullNameLogin',this.returnData.Data.name);
          this.storage.set('numberLogin',this.number);
          this.storage.set('passwordLogin',this.password);
          this.storage.set('emailLogin',this.returnData.Data.email);
          this.storage.set('userId',this.returnData.Data.id);
          this.navCtrl.navigateRoot("/home");
        }else if(this.operationResult==2){
          this.message = "لم تتم عملية الدخول بنجاح...البيانات فارغة";
          this.displayResult(this.message);
        }else if(this.operationResult==3){
          this.message = "لم تتم عملية الدخول بنجاح...كلمة المرور غير صحيحة";
          this.displayResult(this.message);
        }else if(this.operationResult==4){
          this.message = "لم تتم عملية الدخول بنجاح...لم يتم تفعيل الحساب للان";
          this.displayResult(this.message);
          this.storage.set('fullNameLoginReg',this.result.name);
          this.storage.set('emailLoginReg',this.result.email);
          this.storage.set('userIdReg',this.returnData.Error.insertId);
          this.storage.set('numberLoginReg',this.number);
          this.storage.set('passwordLoginReg',this.password);
          this.message = "لم تتم عملية الدخول بنجاح...الحساب غير مفعل";
          this.displayResult(this.message);
          this.navCtrl.navigateRoot("/activation");
        }else{
          this.message = "لم تتم عملية الدخول بنجاح...رقم الجوال غير صحيح";
          this.displayResult(this.message);
        }
      }).catch(e=>{
        this.message = "لم تتم عملية الدخول بنجاح...حاول مرة اخرى";
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
  forgotPasssword(){
    this.navCtrl.navigateRoot("/forgotpasssword");
  }
  changeInputType(){
    this.showPassword = !this.showPassword;
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
