import { Component, OnInit } from '@angular/core';
import {ModalController, NavController, Platform} from "@ionic/angular";
import {CategoriesService} from "../../services/categories.service";
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-bannar',
  templateUrl: './bannar.component.html',
  styleUrls: ['./bannar.component.scss'],
})
export class BannarComponent implements OnInit {
  returnBannersHomeData:any;
  operationResult:any;
  images:any;
  constructor(private storage: Storage,private categoriesService:CategoriesService,private modalController:ModalController) { }
  ngOnInit() {
    this.categoriesService.bannerSp().then(async data=>{
      this.returnBannersHomeData = data;
      this.operationResult = this.returnBannersHomeData.Error.ErrorCode;
      if(this.operationResult==1){
        this.images = this.returnBannersHomeData.Data.image;
      }
    });
  }
  async closeModel(){
    await this.storage.set('showBanner',1);
    this.modalController.dismiss();
  }
}
