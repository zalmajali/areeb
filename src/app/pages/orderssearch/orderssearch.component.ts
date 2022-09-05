import { Component, OnInit } from '@angular/core';
import {Storage} from '@ionic/storage';
import {ModalController, Platform} from '@ionic/angular';

@Component({
  selector: 'app-orderssearch',
  templateUrl: './orderssearch.component.html',
  styleUrls: ['./orderssearch.component.scss'],
})
export class OrderssearchComponent implements OnInit {
  orderNumber:any;
  storeName:any;
  productName:any;
  priceFrom:any;
  priceTo:any;
  fromDate:any;
  toDate:any;
  status:any
  constructor(private storage: Storage,private platform: Platform,private modalController:ModalController) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.modalController.dismiss();
    });
  }
  async ngOnInit() {
    this.orderNumber = await this.storage.get('orderNumber');
    this.storeName = await this.storage.get('storeName');
    this.productName = await this.storage.get('productName');
    this.priceFrom = await this.storage.get('priceFrom');
    this.priceTo = await this.storage.get('priceTo');
    this.fromDate = await this.storage.get('fromDate');
    this.toDate = await this.storage.get('toDate');
    this.status = await this.storage.get('status');
  }
  closeModel(){
    this.modalController.dismiss();
  }
  async checkFirstDate(event){
    let Val = event.split('T');
    this.fromDate = Val[0]
  }
  async checkLastDate(event){
    let Val = event.split('T');
    this.toDate = Val[0]
  }
  async selectValStatus(event){
    this.status = event
  }
  async saveAndBack(){
    await this.storage.set('orderNumber',this.orderNumber);
    await this.storage.set('storeName',this.storeName);
    await this.storage.set('productName',this.productName);
    await this.storage.set('priceFrom',this.priceFrom);
    await this.storage.set('priceTo',this.priceTo);
    await this.storage.set('fromDate',this.fromDate);
    await this.storage.set('toDate',this.toDate);
    await this.storage.set('status',this.status);
    this.modalController.dismiss({
      "orderNumber":this.orderNumber,
      "storeName":this.storeName,
      "productName":this.productName,
      "priceFrom":this.priceFrom,
      "priceTo":this.priceTo,
      "fromDate":this.fromDate,
      "toDate":this.toDate,
      "status":this.status,
    })
  }
}
