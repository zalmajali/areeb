import {Component, ElementRef, OnInit, ViewChild, Renderer2, Input} from '@angular/core';
import {Storage} from '@ionic/storage';
import {ModalController, Platform} from '@ionic/angular';
import {StoresService} from "../../services/stores.service";
@Component({
  selector: 'app-ordersrate',
  templateUrl: './ordersrate.component.html',
  styleUrls: ['./ordersrate.component.scss'],
})
export class OrdersrateComponent implements OnInit {
  @Input() id: string;
  @Input() ordrNumber: string;
  @ViewChild('val11',{read:ElementRef}) val11;
  @ViewChild('val21',{read:ElementRef}) val21;
  @ViewChild('val31',{read:ElementRef}) val31;
  @ViewChild('val41',{read:ElementRef}) val41;
  @ViewChild('val51',{read:ElementRef}) val51;
  @ViewChild('val12',{read:ElementRef}) val12;
  @ViewChild('val22',{read:ElementRef}) val22;
  @ViewChild('val32',{read:ElementRef}) val32;
  @ViewChild('val42',{read:ElementRef}) val42;
  @ViewChild('val52',{read:ElementRef}) val52;
  @ViewChild('val13',{read:ElementRef}) val13;
  @ViewChild('val23',{read:ElementRef}) val23;
  @ViewChild('val33',{read:ElementRef}) val33;
  @ViewChild('val43',{read:ElementRef}) val43;
  @ViewChild('val53',{read:ElementRef}) val53;
  @ViewChild('val14',{read:ElementRef}) val14;
  @ViewChild('val24',{read:ElementRef}) val24;
  @ViewChild('val34',{read:ElementRef}) val34;
  @ViewChild('val44',{read:ElementRef}) val44;
  @ViewChild('val54',{read:ElementRef}) val54;
  numberSelectedStarOne:any=0;
  numberSelectedStarTow:any=0;
  numberSelectedStarThree:any=0;
  numberSelectedStarFore:any=0;
  returnRateData:any;
  operationResult:any;
  constructor(private storesService:StoresService,private renderer:Renderer2,private storage: Storage,private platform: Platform,private modalController:ModalController) { }
  ngOnInit() {}
  functionNumRateStore(numStar:any,index:any){
    if(index == 1){
      if(numStar == 1){
        this.renderer.setStyle(this.val11.nativeElement,'background','');
        this.renderer.setStyle(this.val21.nativeElement,'background','');
        this.renderer.setStyle(this.val31.nativeElement,'background','');
        this.renderer.setStyle(this.val41.nativeElement,'background','');
        this.renderer.setStyle(this.val51.nativeElement,'background','');
        this.renderer.setStyle(this.val11.nativeElement,'background','#FFA500');
      }
      if(numStar == 2){
        this.renderer.setStyle(this.val11.nativeElement,'background','');
        this.renderer.setStyle(this.val21.nativeElement,'background','');
        this.renderer.setStyle(this.val31.nativeElement,'background','');
        this.renderer.setStyle(this.val41.nativeElement,'background','');
        this.renderer.setStyle(this.val51.nativeElement,'background','');
        this.renderer.setStyle(this.val11.nativeElement,'background','#FFA500');
        this.renderer.setStyle(this.val21.nativeElement,'background','#FFA500');
      }
      if(numStar == 3){
        this.renderer.setStyle(this.val11.nativeElement,'background','');
        this.renderer.setStyle(this.val21.nativeElement,'background','');
        this.renderer.setStyle(this.val31.nativeElement,'background','');
        this.renderer.setStyle(this.val41.nativeElement,'background','');
        this.renderer.setStyle(this.val51.nativeElement,'background','');
        this.renderer.setStyle(this.val11.nativeElement,'background','#FFA500')
        this.renderer.setStyle(this.val21.nativeElement,'background','#FFA500');
        this.renderer.setStyle(this.val31.nativeElement,'background','#FFA500');
      }
      if(numStar == 4){
        this.renderer.setStyle(this.val11.nativeElement,'background','');
        this.renderer.setStyle(this.val21.nativeElement,'background','');
        this.renderer.setStyle(this.val31.nativeElement,'background','');
        this.renderer.setStyle(this.val41.nativeElement,'background','');
        this.renderer.setStyle(this.val51.nativeElement,'background','');
        this.renderer.setStyle(this.val11.nativeElement,'background','#FFA500')
        this.renderer.setStyle(this.val21.nativeElement,'background','#FFA500');
        this.renderer.setStyle(this.val31.nativeElement,'background','#FFA500');
        this.renderer.setStyle(this.val41.nativeElement,'background','#FFA500')
      }
      if(numStar == 5){
        this.renderer.setStyle(this.val11.nativeElement,'background','');
        this.renderer.setStyle(this.val21.nativeElement,'background','');
        this.renderer.setStyle(this.val31.nativeElement,'background','');
        this.renderer.setStyle(this.val41.nativeElement,'background','');
        this.renderer.setStyle(this.val51.nativeElement,'background','');
        this.renderer.setStyle(this.val11.nativeElement,'background','#FFA500')
        this.renderer.setStyle(this.val21.nativeElement,'background','#FFA500');
        this.renderer.setStyle(this.val31.nativeElement,'background','#FFA500');
        this.renderer.setStyle(this.val41.nativeElement,'background','#FFA500')
        this.renderer.setStyle(this.val51.nativeElement,'background','#FFA500')
      }
      this.numberSelectedStarOne = numStar;
    }
    if(index == 2){
      if(numStar == 1){
        this.renderer.setStyle(this.val12.nativeElement,'background','');
        this.renderer.setStyle(this.val22.nativeElement,'background','');
        this.renderer.setStyle(this.val32.nativeElement,'background','');
        this.renderer.setStyle(this.val42.nativeElement,'background','');
        this.renderer.setStyle(this.val52.nativeElement,'background','');
        this.renderer.setStyle(this.val12.nativeElement,'background','#FFA500');
      }
      if(numStar == 2){
        this.renderer.setStyle(this.val12.nativeElement,'background','');
        this.renderer.setStyle(this.val22.nativeElement,'background','');
        this.renderer.setStyle(this.val32.nativeElement,'background','');
        this.renderer.setStyle(this.val42.nativeElement,'background','');
        this.renderer.setStyle(this.val52.nativeElement,'background','');
        this.renderer.setStyle(this.val12.nativeElement,'background','#FFA500');
        this.renderer.setStyle(this.val22.nativeElement,'background','#FFA500');
      }
      if(numStar == 3){
        this.renderer.setStyle(this.val12.nativeElement,'background','');
        this.renderer.setStyle(this.val22.nativeElement,'background','');
        this.renderer.setStyle(this.val32.nativeElement,'background','');
        this.renderer.setStyle(this.val42.nativeElement,'background','');
        this.renderer.setStyle(this.val52.nativeElement,'background','');
        this.renderer.setStyle(this.val12.nativeElement,'background','#FFA500')
        this.renderer.setStyle(this.val22.nativeElement,'background','#FFA500');
        this.renderer.setStyle(this.val32.nativeElement,'background','#FFA500');
      }
      if(numStar == 4){
        this.renderer.setStyle(this.val12.nativeElement,'background','');
        this.renderer.setStyle(this.val22.nativeElement,'background','');
        this.renderer.setStyle(this.val32.nativeElement,'background','');
        this.renderer.setStyle(this.val42.nativeElement,'background','');
        this.renderer.setStyle(this.val52.nativeElement,'background','');
        this.renderer.setStyle(this.val12.nativeElement,'background','#FFA500')
        this.renderer.setStyle(this.val22.nativeElement,'background','#FFA500');
        this.renderer.setStyle(this.val32.nativeElement,'background','#FFA500');
        this.renderer.setStyle(this.val42.nativeElement,'background','#FFA500')
      }
      if(numStar == 5){
        this.renderer.setStyle(this.val12.nativeElement,'background','');
        this.renderer.setStyle(this.val22.nativeElement,'background','');
        this.renderer.setStyle(this.val32.nativeElement,'background','');
        this.renderer.setStyle(this.val42.nativeElement,'background','');
        this.renderer.setStyle(this.val52.nativeElement,'background','');
        this.renderer.setStyle(this.val12.nativeElement,'background','#FFA500')
        this.renderer.setStyle(this.val22.nativeElement,'background','#FFA500');
        this.renderer.setStyle(this.val32.nativeElement,'background','#FFA500');
        this.renderer.setStyle(this.val42.nativeElement,'background','#FFA500')
        this.renderer.setStyle(this.val52.nativeElement,'background','#FFA500')
      }
      this.numberSelectedStarTow = numStar;
    }
    if(index == 3){
      if(numStar == 1){
        this.renderer.setStyle(this.val13.nativeElement,'background','');
        this.renderer.setStyle(this.val23.nativeElement,'background','');
        this.renderer.setStyle(this.val33.nativeElement,'background','');
        this.renderer.setStyle(this.val43.nativeElement,'background','');
        this.renderer.setStyle(this.val53.nativeElement,'background','');
        this.renderer.setStyle(this.val13.nativeElement,'background','#FFA500');
      }
      if(numStar == 2){
        this.renderer.setStyle(this.val13.nativeElement,'background','');
        this.renderer.setStyle(this.val23.nativeElement,'background','');
        this.renderer.setStyle(this.val33.nativeElement,'background','');
        this.renderer.setStyle(this.val43.nativeElement,'background','');
        this.renderer.setStyle(this.val53.nativeElement,'background','');
        this.renderer.setStyle(this.val13.nativeElement,'background','#FFA500');
        this.renderer.setStyle(this.val23.nativeElement,'background','#FFA500');
      }
      if(numStar == 3){
        this.renderer.setStyle(this.val13.nativeElement,'background','');
        this.renderer.setStyle(this.val23.nativeElement,'background','');
        this.renderer.setStyle(this.val33.nativeElement,'background','');
        this.renderer.setStyle(this.val43.nativeElement,'background','');
        this.renderer.setStyle(this.val53.nativeElement,'background','');
        this.renderer.setStyle(this.val13.nativeElement,'background','#FFA500')
        this.renderer.setStyle(this.val23.nativeElement,'background','#FFA500');
        this.renderer.setStyle(this.val33.nativeElement,'background','#FFA500');
      }
      if(numStar == 4){
        this.renderer.setStyle(this.val13.nativeElement,'background','');
        this.renderer.setStyle(this.val23.nativeElement,'background','');
        this.renderer.setStyle(this.val33.nativeElement,'background','');
        this.renderer.setStyle(this.val43.nativeElement,'background','');
        this.renderer.setStyle(this.val53.nativeElement,'background','');
        this.renderer.setStyle(this.val13.nativeElement,'background','#FFA500')
        this.renderer.setStyle(this.val23.nativeElement,'background','#FFA500');
        this.renderer.setStyle(this.val33.nativeElement,'background','#FFA500');
        this.renderer.setStyle(this.val43.nativeElement,'background','#FFA500')
      }
      if(numStar == 5){
        this.renderer.setStyle(this.val13.nativeElement,'background','');
        this.renderer.setStyle(this.val23.nativeElement,'background','');
        this.renderer.setStyle(this.val33.nativeElement,'background','');
        this.renderer.setStyle(this.val43.nativeElement,'background','');
        this.renderer.setStyle(this.val53.nativeElement,'background','');
        this.renderer.setStyle(this.val13.nativeElement,'background','#FFA500')
        this.renderer.setStyle(this.val23.nativeElement,'background','#FFA500');
        this.renderer.setStyle(this.val33.nativeElement,'background','#FFA500');
        this.renderer.setStyle(this.val43.nativeElement,'background','#FFA500')
        this.renderer.setStyle(this.val53.nativeElement,'background','#FFA500')
      }
      this.numberSelectedStarThree = numStar;
    }
    if(index == 4){
      if(numStar == 1){
        this.renderer.setStyle(this.val14.nativeElement,'background','');
        this.renderer.setStyle(this.val24.nativeElement,'background','');
        this.renderer.setStyle(this.val34.nativeElement,'background','');
        this.renderer.setStyle(this.val44.nativeElement,'background','');
        this.renderer.setStyle(this.val54.nativeElement,'background','');
        this.renderer.setStyle(this.val14.nativeElement,'background','#FFA500');
      }
      if(numStar == 2){
        this.renderer.setStyle(this.val14.nativeElement,'background','');
        this.renderer.setStyle(this.val24.nativeElement,'background','');
        this.renderer.setStyle(this.val34.nativeElement,'background','');
        this.renderer.setStyle(this.val44.nativeElement,'background','');
        this.renderer.setStyle(this.val54.nativeElement,'background','');
        this.renderer.setStyle(this.val14.nativeElement,'background','#FFA500');
        this.renderer.setStyle(this.val24.nativeElement,'background','#FFA500');
      }
      if(numStar == 3){
        this.renderer.setStyle(this.val14.nativeElement,'background','');
        this.renderer.setStyle(this.val24.nativeElement,'background','');
        this.renderer.setStyle(this.val34.nativeElement,'background','');
        this.renderer.setStyle(this.val44.nativeElement,'background','');
        this.renderer.setStyle(this.val54.nativeElement,'background','');
        this.renderer.setStyle(this.val14.nativeElement,'background','#FFA500')
        this.renderer.setStyle(this.val24.nativeElement,'background','#FFA500');
        this.renderer.setStyle(this.val34.nativeElement,'background','#FFA500');
      }
      if(numStar == 4){
        this.renderer.setStyle(this.val14.nativeElement,'background','');
        this.renderer.setStyle(this.val24.nativeElement,'background','');
        this.renderer.setStyle(this.val34.nativeElement,'background','');
        this.renderer.setStyle(this.val44.nativeElement,'background','');
        this.renderer.setStyle(this.val54.nativeElement,'background','');
        this.renderer.setStyle(this.val14.nativeElement,'background','#FFA500')
        this.renderer.setStyle(this.val24.nativeElement,'background','#FFA500');
        this.renderer.setStyle(this.val34.nativeElement,'background','#FFA500');
        this.renderer.setStyle(this.val44.nativeElement,'background','#FFA500')
      }
      if(numStar == 5){
        this.renderer.setStyle(this.val14.nativeElement,'background','');
        this.renderer.setStyle(this.val24.nativeElement,'background','');
        this.renderer.setStyle(this.val34.nativeElement,'background','');
        this.renderer.setStyle(this.val44.nativeElement,'background','');
        this.renderer.setStyle(this.val54.nativeElement,'background','');
        this.renderer.setStyle(this.val14.nativeElement,'background','#FFA500')
        this.renderer.setStyle(this.val24.nativeElement,'background','#FFA500');
        this.renderer.setStyle(this.val34.nativeElement,'background','#FFA500');
        this.renderer.setStyle(this.val44.nativeElement,'background','#FFA500')
        this.renderer.setStyle(this.val54.nativeElement,'background','#FFA500')
      }
      this.numberSelectedStarFore = numStar;
    }
  }
  closeModel(){
    this.modalController.dismiss();
  }
  async saveAndBack(){
    this.storesService.allStores(this.id,this.numberSelectedStarOne,this.numberSelectedStarTow,this.numberSelectedStarThree,this.numberSelectedStarFore).then(data=>{
      this.returnRateData = data;
      this.operationResult = this.returnRateData.Error.ErrorCode;
    })

    this.modalController.dismiss({
      "operationResult":this.operationResult
    })
  }
}
