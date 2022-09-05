import { Component, OnInit,Input , ViewChild, ElementRef } from '@angular/core';
import {ModalController, NavController, Platform} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {UsersService} from "../../services/users.service";
declare var google;
@Component({
  selector: 'app-contactinformation',
  templateUrl: './contactinformation.component.html',
  styleUrls: ['./contactinformation.component.scss'],
})
export class ContactinformationComponent implements OnInit  {
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  address: string;
  latitude: number;
  longitude: number;
  locationName:any;
  number:any;
  numberBackUp:any
  msg:any;
  constructor(private geolocation: Geolocation,private storage: Storage,private platform: Platform,private modalController:ModalController,private usersService:UsersService) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.modalController.dismiss();
    });
  }
  async ngOnInit() {
    this.number = await this.storage.get('numberInformation');
    this.numberBackUp = await this.storage.get('numberBackUpInformation');
    this.msg = await this.storage.get('msgInformation');
    this.loadMap();
  }
  closeModel(){
    this.modalController.dismiss();
  }
  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.map.addListener('dragend', () => {
        this.latitude = this.map.center.lat();
        this.longitude = this.map.center.lng();
        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
  getAddressFromCoords(lattitude, longitude) {
    this.usersService.getAddresFromMap(lattitude, longitude).then(address=>{
        this.locationName = address
        this.address = this.locationName.results[0].formatted_address;
      },
    ).catch((error) => {
      console.log('Error getting location', error);
    });
  }
  async saveAndBack(){
    await this.storage.set('numberInformation',this.number);
    await this.storage.set('numberBackUpInformation',this.numberBackUp);
    await this.storage.set('msgInformation',this.msg);
    await this.storage.set('addressmsgInformation',this.address);
    await this.storage.set('latitudeInformation',this.latitude);
    await this.storage.set('longitudeInformation',this.latitude);

    this.modalController.dismiss({
      "number":this.number,
      "numberBackUp":this.numberBackUp,
      "msg":this.msg,
      "latlong":this.latitude+","+this.longitude,
      "address":this.address
    })
  }
}
