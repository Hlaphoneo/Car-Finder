import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppData } from '../../services/appdata';

@Component({
  selector: 'page-app',
  templateUrl: 'paymentinfo.html'
})
export class PaymentInfo {

  constructor(public appData : AppData , public navCtrl: NavController) {

  }

}
