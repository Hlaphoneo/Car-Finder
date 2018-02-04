import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GeneralInterface } from '../../services/generalinterface';
import { LoginPage } from '../login/login';

/**
 * Generated class for the WelcomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public ginterface : GeneralInterface) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

  done(){
      this.ginterface.setTutState();
      this.navCtrl.setRoot(LoginPage);
  }

}
