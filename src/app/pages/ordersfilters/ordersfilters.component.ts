import { Component, OnInit,Input } from '@angular/core';
import {ModalController, NavController, Platform} from "@ionic/angular";
import {Storage} from "@ionic/storage";
@Component({
  selector: 'app-ordersfilters',
  templateUrl: './ordersfilters.component.html',
  styleUrls: ['./ordersfilters.component.scss'],
})
export class OrdersfiltersComponent implements OnInit {
  selectValues:any;
  constructor(private storage: Storage,private platform: Platform,private modalController:ModalController) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.modalController.dismiss();
    });
  }
  closeModel(){
    this.modalController.dismiss();
  }
  async ngOnInit() {
    this.selectValues = await this.storage.get('selectValues');
  }
  async saveDataAndBack(){
    await this.storage.set('selectValues',this.selectValues);
    this.modalController.dismiss({
      "soarting":this.selectValues
    })
  }
}
