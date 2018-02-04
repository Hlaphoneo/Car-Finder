import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppData } from '../../services/appdata';


@Component({
  selector: 'page-app',
  templateUrl: 'faq.html'
})
export class Faq {

  constructor(public appData : AppData ,public navCtrl: NavController) {

  }

}
