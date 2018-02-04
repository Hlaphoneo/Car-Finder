import { Component } from '@angular/core';
import {  NavController, NavParams , ViewController , AlertController , App} from 'ionic-angular';
import  {ManageTrackersPage} from '../manage-trackers/manage-trackers';
import {PrivacySettingsPage} from '../privacy-settings/privacy-settings';
import {SupportPage} from '../support/support';
import {ModeSelectPage} from '../mode-select/mode-select';

import { AccountService } from '../../services/accountservice';



@Component({
  selector: 'page-settings-pop-over',
  templateUrl: 'settings-pop-over.html',
})
export class SettingsPopOverPage {

  constructor(public account : AccountService , public appCtrl : App ,  public alertCtrl : AlertController , public viewCtrl: ViewController , public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPopOverPage');
  }

  openPage(page : string){
      switch (page) {
        case 'managetracker':
            this.navCtrl.push(ManageTrackersPage)
          break;
        case 'privacy':
            this.navCtrl.push(PrivacySettingsPage)
          break;
        case 'support':
            this.navCtrl.push(SupportPage)
          break;
        default:

      }
          this.viewCtrl.dismiss()  //dismissing the pop over;
  }
  changeMode(){
    this.continueMessage("Are you sure you want to change service mode ?","Mode Chage");
  }

  continueMessage(message,title) {
      let alert = this.alertCtrl.create({
        title: title,
        subTitle: message,
        buttons: [{
            text: 'CANCEL',
            handler: () => {
            }
          },
          {
            text: 'CONTINUE',
            handler: () => {
                this.viewCtrl.dismiss()  //dismissing the pop over;
                this.appCtrl.getRootNav().push(ModeSelectPage).then(()=>{
                  this.account.setAppMode("none") ;
                  return false;
                })

            }
          }]
      });
      alert.present();
    }
}
