import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = "https://myozone.online/areeb/api";
  public result:any;
  google_api_key:any='AIzaSyCoEHb4objwIA3mUrr1F4LTTe7Dj41iakw';
  constructor(private http:HttpClient) {
  }
  async getAddresFromMap(lat:any,lang:any){
    return new Promise(resolve => {
      this.http.get("https://maps.googleapis.com/maps/api/geocode/json?key="+this.google_api_key+"&latlng="+lat+","+lang).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  async checkUserGoogle(name:any,email:any,googlUserId:any){
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"checkUserGoogle"+"/"+name+"/"+email+"/"+googlUserId,"").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async checkUserAppel(token:any){
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"checkUserAppel"+"/"+token,"").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async functionFacebookLogIn(name:any,email:any,userId:any){
    return new Promise(resolve => {
        this.http.post(this.baseUrl+'/'+"checkUserFacebook"+"/"+name+"/"+email+"/"+userId,"").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async aboutApp(){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"about").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  async contactUs(fullName:any,number:any,msg:any){
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"contactUs"+"/"+fullName+"/"+number+"/"+msg,"").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async registration(number:any,fullName:any,password:any){
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"registration"+"/"+number+"/"+fullName+"/"+password,"").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async updateAccount(number:any,fullName:any,userId:any){
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"updateAccount"+"/"+number+"/"+fullName+"/"+userId,"").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async forgotPassword(number:any){
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"forgotPassword"+"/"+number,"").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async activationUser(number:any,activeCode:any){
    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/'+"activation"+"/"+number+"/"+activeCode,"").subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  async checkUser(number:any,password:any){
    return new Promise(resolve => {
      this.http.get(this.baseUrl+'/'+"checkUser"+"/"+number+"/"+password).subscribe(data => {
        return this.result = resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
}
