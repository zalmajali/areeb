import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Storage} from "@ionic/storage";
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private baseUrl = "https://myozone.online/areeb/api";
  public result:any;
  public fullNameLogin:any;
  public emailLogin:any;
  userId:any;
  constructor(private http:HttpClient,private storage: Storage) {

  }
  async regions(){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"regions").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async catHome(){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"catHome").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async offersHome(){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"offersHome").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async banners(){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"banners").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async bannerSp(){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+"/bannerSp").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async offersfirst30(){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"offersfirst30").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async subCatSpe(){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"subCatSpe").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async subCat(subCatSelect:any){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"subCat/"+subCatSelect).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async catName(storId:any){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"catName/"+storId).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async categories(){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"categories").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async allCategories(){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"allCategories").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async storesHome(){
    this.userId = 0
    this.fullNameLogin = await  this.storage.get('fullNameLogin');
    this.emailLogin = await  this.storage.get('emailLogin');
    if(this.fullNameLogin!=null && this.emailLogin!=null)
      this.userId = await  this.storage.get('userId');
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"storesHome/"+this.userId).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async storesFore(){
    this.userId = 0
    this.fullNameLogin = await  this.storage.get('fullNameLogin');
    this.emailLogin = await  this.storage.get('emailLogin');
    if(this.fullNameLogin!=null && this.emailLogin!=null)
      this.userId = await  this.storage.get('userId');
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"storesFore/"+this.userId).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
}
