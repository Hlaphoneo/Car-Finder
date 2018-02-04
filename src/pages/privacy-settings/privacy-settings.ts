import { Component } from '@angular/core';
import {  NavController, NavParams , Events } from 'ionic-angular';
import {TermsOfService} from '../termsofservice/termsofservice';
import {ModeSelectPage} from '../mode-select/mode-select';
import {AppAboutPage} from '../app-about/app-about';
import {LoginPage} from '../login/login';



import { AccountService } from '../../services/accountservice';

/**
 * Generated class for the PrivacySettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-privacy-settings',
  templateUrl: 'privacy-settings.html',
})
export class PrivacySettingsPage {

  constructor( public account : AccountService , public events : Events , public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrivacySettingsPage');
  }

  presentTerms(){
    this.navCtrl.push(TermsOfService);
  }
  presentAbout(){
    this.navCtrl.push(AppAboutPage);
  }
  logout(){
    this.account.logout();
      this.events.subscribe('user:logout',() => {
          this.navCtrl.setRoot(LoginPage) //logging the user out
      });
  }
}
