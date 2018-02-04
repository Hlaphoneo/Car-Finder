import { Component } from '@angular/core';
import {  NavController, NavParams , AlertController , LoadingController , Events } from 'ionic-angular';
import { Tracker } from '../../services/tracker';
import { AccountService } from '../../services/accountservice';
import { AppHome } from '../home/home';

// ------------------------Pages---------------------------------

import {TrackerHomePage} from '../tracker-home/tracker-home';
import {LoginPage} from '../login/login';

@Component({
  selector: 'page-mode-select',
  templateUrl: 'mode-select.html',
})
export class ModeSelectPage {
  mode : any;

  constructor(public events : Events , public account : AccountService , public tracker : Tracker , public alertCtrl : AlertController , public loadingCtrl : LoadingController , public navCtrl: NavController, public navParams: NavParams) {
    // this.navCtrl.push(TrackerHomePage);
    //checking if the app is in tracker mode
    this.tracker.getConnectionState().then((state)=>{
      console.log(state)
      console.log(state)
      if(state == 1 ){ //if the device was already running in tracker mode
        this.navCtrl.push(TrackerHomePage);
      }
    })
  }

  logout(){
    let alert = this.alertCtrl.create({
      title: '',
      subTitle: 'You about to logout ?',
      buttons: [{
          text: 'NO',
          handler: () => {
          }
        },
        {
          text: 'YES',
          handler: () => {
            this.account.logout();
              this.events.subscribe('user:logout',() => {
                  this.tracker.clearTrackers();
                  this.navCtrl.setRoot(LoginPage) //logging the user out
              });
          }
        }]
    });
    alert.present();
  }
  setMode(mode : string){
      this.mode = mode;
  }
  continueMessage(message) {
    let alert = this.alertCtrl.create({
      title: 'Connection mode',
      subTitle: message,
      buttons: [{
          text: 'CANCEL',
          handler: () => {
          }
        },
        {
          text: 'CONTINUE',
          handler: () => {
            if(this.mode == "tracker"){
              this.navCtrl.setRoot(TrackerHomePage); // tracke rapp state is set only after the tracke is connected
            }else{
              this.navCtrl.setRoot(AppHome);
              this.account.setAppMode("reciever") ;
            }
          }
        }]
    });
    alert.present();
  }
}
