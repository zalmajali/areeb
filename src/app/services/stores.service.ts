import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Storage} from "@ionic/storage";
@Injectable({
  providedIn: 'root'
})
export class StoresService {
  private baseUrl = "https://myozone.online/areeb/api";
  public result:any;
  public fullNameLogin:any;
  public emailLogin:any;
  userId:any;
  constructor(private http:HttpClient,private storage: Storage) {
  }
  async addOrdersCart(userId:any,storeId:any,price:any,mobile:any,backupMobile:any,map:any,locationName:any,notes:any,time:any,selectPriceValues:any,discountCode:any){
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"addOrdersCart"+"/"+userId+"/"+storeId+"/"+price+"/"+mobile+"/"+backupMobile+"/"+map+"/"+locationName+"/"+notes+"/"+time+"/"+selectPriceValues+"/"+discountCode,"").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async ordersRate(id:any,valOne:any,valTow:any,valThree:any,valFor:any){
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"ordersRate"+"/"+id+"/"+valOne+"/"+valTow+"/"+valThree+"/"+valFor,"").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async addProductToOrderCart(orderId:any,storeId:any,productId:any,additions:any,ingredients:any,options:any,price:any,quantity:any,type:any){
    return new Promise(resolve => {
      if(additions == 0 || additions == "" || additions == undefined)
        additions = 0;
      if(ingredients == 0 || ingredients == "" || ingredients == undefined)
        ingredients = 0;
      if(options == 0 || options == "" || options == undefined)
        options = 0;
      if(quantity == 0 || quantity == "" || quantity == undefined)
        quantity = 0;
      this.http.post(this.baseUrl+'/'+"addProductToOrderCart"+"/"+orderId+"/"+storeId+"/"+productId+"/"+additions+"/"+ingredients+"/"+options+"/"+price+"/"+quantity+"/"+type,"").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  async storesInformation(storeId:any){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"storesInformation/"+storeId).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  async offersByStore(storeId:any,sortingData:any = 0){
    return new Promise(resolve => {
      if(sortingData == 0 || sortingData == "" || sortingData == undefined)
        sortingData = 0;
      this.http.get(this.baseUrl+'/'+"offersByStore/"+storeId+"/"+sortingData).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async storeCountVal(storeId:any){
    return new Promise(resolve => {
      if(storeId == 0 || storeId == "" || storeId == undefined)
        storeId = 0;
      this.http.get(this.baseUrl+'/'+"storeCountVal/"+storeId).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async ordersStat(userId:any){
    return new Promise(resolve => {
      if(userId == 0 || userId == "" || userId == undefined)
        userId = 0;
      this.http.get(this.baseUrl+'/'+"ordersStat/"+userId).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async ordersCart(userId:any,orderNumber:any=0,storeName:any=0,productName:any=0,fromPrice:any=0,toPrice:any=0,fromDat:any=0,toDate:any=0,statuse:any=0,orderBy:any=1){
    return new Promise(resolve => {
      if(userId == 0 || userId == "" || userId == undefined)
        userId = 0;
      if(orderNumber == 0 || orderNumber == "" || orderNumber == undefined)
        orderNumber = 0;
      if(storeName == 0 || storeName == "" || storeName == undefined)
        storeName = 0;
      if(productName == 0 || productName == "" || productName == undefined)
        productName = 0;
      if(fromPrice == 0 || fromPrice == "" || fromPrice == undefined)
        fromPrice = 0;
      if(toPrice == 0 || toPrice == "" || toPrice == undefined)
        toPrice = 0;
      if(fromDat == 0 || fromDat == "" || fromDat == undefined)
        fromDat = 0;
      if(toDate == 0 || toDate == "" || toDate == undefined)
        toDate = 0;
      if(statuse == 0 || statuse == "" || statuse == undefined)
        statuse = 0;
      if(orderBy == 0 || orderBy == "" || orderBy == undefined)
        orderBy = 0;
      this.http.get(this.baseUrl+'/'+"ordersCart/"+userId+"/"+orderNumber+"/"+storeName+"/"+productName+"/"+fromPrice+"/"+toPrice+"/"+fromDat+"/"+toDate+"/"+statuse+"/"+orderBy).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async allOffers(catId:any=0,subCatId:any=0,sortingData:any = 0,limit:any){
    return new Promise(resolve => {
      if(catId == 0 || catId == "" || catId == undefined)
        catId = 0;
      if(subCatId == 0 || subCatId == "" || subCatId == undefined)
        subCatId = 0;
      if(sortingData == 0 || sortingData == "" || sortingData == undefined)
        sortingData = 0;
      this.http.get(this.baseUrl+'/'+"allOffers/"+catId+"/"+subCatId+"/"+sortingData+"/"+limit).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async favouriteStores(catId:any=0,subCatId:any=0,sortingData:any=0,region:any = 0,limit:any,userId:any){
    return new Promise(resolve => {
      if(catId == 0 || catId == "" || catId == undefined)
        catId = 0;
      if(subCatId == 0 || subCatId == "" || subCatId == undefined)
        subCatId = 0;
      if(region == 0 || region == "" || region == undefined)
        region = 0;
      if(sortingData == 0 || sortingData == "" || sortingData == undefined)
        sortingData = 0;
      this.http.get(this.baseUrl+'/'+"favouriteStores/"+catId+"/"+subCatId+"/"+region+"/"+sortingData+"/"+limit+"/"+userId).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async allStores(catId:any=0,subCatId:any=0,sortingData:any=0,region:any = 0,limit:any,homeCategories:any=0){
    this.userId = 0
    this.fullNameLogin = await  this.storage.get('fullNameLogin');
    this.emailLogin = await  this.storage.get('emailLogin');
    if(this.fullNameLogin!=null && this.emailLogin!=null)
      this.userId = await  this.storage.get('userId');
    return new Promise(resolve => {
      if(catId == 0 || catId == "" || catId == undefined)
        catId = 0;
      if(subCatId == 0 || subCatId == "" || subCatId == undefined)
        subCatId = 0;
      if(region == 0 || region == "" || region == undefined)
        region = 0;
      if(sortingData == 0 || sortingData == "" || sortingData == undefined)
        sortingData = 0;
      this.http.get(this.baseUrl+'/'+"allStores/"+catId+"/"+subCatId+"/"+region+"/"+sortingData+"/"+limit+"/"+this.userId+"/"+homeCategories).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async searchStores(catId:any=0,subCatId:any=0,sortingData:any=0,region:any = 0,limit:any,searchValues:any){
    this.userId = 0
    this.fullNameLogin = await  this.storage.get('fullNameLogin');
    this.emailLogin = await  this.storage.get('emailLogin');
    if(this.fullNameLogin!=null && this.emailLogin!=null)
      this.userId = await  this.storage.get('userId');
    return new Promise(resolve => {
      if(catId == 0 || catId == "" || catId == undefined)
        catId = 0;
      if(subCatId == 0 || subCatId == "" || subCatId == undefined)
        subCatId = 0;
      if(region == 0 || region == "" || region == undefined)
        region = 0;
      if(sortingData == 0 || sortingData == "" || sortingData == undefined)
        sortingData = 0;
      this.http.get(this.baseUrl+'/'+"searchStores/"+catId+"/"+subCatId+"/"+region+"/"+sortingData+"/"+limit+"/"+this.userId+"/"+searchValues).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async storesfirst30(){
    this.userId = 0
    this.fullNameLogin = await  this.storage.get('fullNameLogin');
    this.emailLogin = await  this.storage.get('emailLogin');
    if(this.fullNameLogin!=null && this.emailLogin!=null)
      this.userId = await  this.storage.get('userId');
    return new Promise(resolve => {
      this.fullNameLogin = this.storage.get('fullNameLogin');
      this.emailLogin = this.storage.get('emailLogin');
      this.http.get(this.baseUrl+'/'+"storesfirst30/"+this.userId).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async addLike(storId:any,userId:any){
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"addLike"+"/"+storId+"/"+userId,"").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async dislike(storId:any,userId:any){
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"dislike"+"/"+storId+"/"+userId,"").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  async addFave(storId:any,userId:any){
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"addFave"+"/"+storId+"/"+userId,"").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async addVew(storId:any){
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"addVew"+"/"+storId,"").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async checkDiscountCode(discountCode:any,userId:any,allValues:any,storeId:any,getDeleverYprice:any){
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"checkDiscountCode"+"/"+discountCode+"/"+userId+"/"+allValues+"/"+storeId+"/"+getDeleverYprice,"").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async removFav(storId:any,userId:any){
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"removFav"+"/"+storId+"/"+userId,"").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async productsByStore(storeId:any,productsOneSorting:any=0,productsTowSorting:any=0,catId:any=0){
    return new Promise(resolve => {
      if(productsOneSorting == 0 || productsOneSorting == "" || productsOneSorting == undefined)
        productsOneSorting = 0;
      if(productsTowSorting == 0 || productsTowSorting == "" || productsTowSorting == undefined)
        productsTowSorting = 0;
      if(catId == 0 || catId == "" || catId == undefined)
        catId = 0;
      this.http.get(this.baseUrl+'/'+"productsByStore/"+storeId+"/"+productsOneSorting+"/"+productsTowSorting+"/"+catId).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async productsHome(){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"productsHome").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async productsStoreHome(){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"productsStoreHome").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async productsFields(productsId:any){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"productsFields/"+productsId).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async additions(productsId:any,type:any=0){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"additions/"+productsId+"/"+type).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async options(productsId:any,type:any=0){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"options/"+productsId+"/"+type).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async ingredients(productsId:any,type:any=0){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"ingredients/"+productsId+"/"+type).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async storesCategories(storeId:any){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"storesCategories/"+storeId).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async branchesByStore(storeId:any,regions:any=0){
    return new Promise(resolve => {
      if(regions == 0 || regions == "" || regions == undefined)
        regions = 0;
      this.http.get(this.baseUrl+'/'+"branchesByStore/"+storeId+"/"+regions).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
}
