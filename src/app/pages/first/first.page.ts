import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform,NavController } from '@ionic/angular';
@Component({
  selector: 'app-first',
  templateUrl: './first.page.html',
  styleUrls: ['./first.page.scss'],
})
export class FirstPage implements OnInit {

  constructor(private storage: Storage,private platform: Platform,private navCtrl: NavController) {
    this.platform.backButton.subscribe(() =>{
    })
    this.storage.get('showFirstPage').then(showFirstPage=>{
      if(showFirstPage==1)
        this.navCtrl.navigateRoot('/home');
    });
  }

  ngOnInit() {
    this.storage.get('showFirstPage').then(showFirstPage=>{
      if(showFirstPage==1)
        this.navCtrl.navigateRoot("/home");
      else
        this.storage.set('showFirstPage',1);
    });
  }
  functionHomePage(){
    this.storage.set('showFirstPage',1);
    this.navCtrl.navigateRoot("/home");
  }
}
