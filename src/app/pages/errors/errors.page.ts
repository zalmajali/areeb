import { Component, OnInit } from '@angular/core';
import {NavController} from "@ionic/angular";
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import {Storage} from "@ionic/storage";
import { Network } from '@ionic-native/network/ngx';
@Component({
  selector: 'app-errors',
  templateUrl: './errors.page.html',
  styleUrls: ['./errors.page.scss'],
})
export class ErrorsPage implements OnInit {
  backToPage:any;
  constructor(private sqlite: SQLite,private network:Network,private navCtrl: NavController,private storage:Storage ) {

  }
  ngOnInit() {
  }
}
