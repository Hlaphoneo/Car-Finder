import { Component } from '@angular/core';
import {  NavController, NavParams , AlertController , Events} from 'ionic-angular';
import {TrackerDevicePage} from '../tracker-device/tracker-device';
import {NewTrackerPage} from '../new-tracker/new-tracker';
import { Tracker } from '../../services/tracker';

@Component({
  selector: 'page-manage-trackers',
  templateUrl: 'manage-trackers.html',
})
export class ManageTrackersPage {
  trackers : any = Array();
  activeTrackers : any = Array();

  constructor(public events : Events , public tracker : Tracker , public alertCtrl : AlertController , public navCtrl: NavController, public navParams: NavParams) {
      this.trackers = this.tracker.allTrackers;
      this.activeTrackers = this.tracker.activeTrackers_inst; //loading all instances of active trackers
  }

  back(){
    this.navCtrl.pop();
  }
  openTracker(index : any){
    if(this.tracker.allTrackers[index].payment_status == 0){
      this.message("Payment pending!!","This tracker id is waiting for payment , please pay <strong>R250</strong> and link your tracker to continue.");
      return;
    }
    if(this.tracker.allTrackers[index].link_status == 0){
      this.message("Inactive","Tracker not linked , please link the tracker to continue.");
      return;
    }else{
      let data = {'tracker' : this.tracker.activeTrackers_inst[this.tracker.allTrackers[index].tracker_id],'link_token':this.tracker.allTrackers[index].link_ref};
      this.navCtrl.push(TrackerDevicePage,data)
    }

  }
  disconnectTracker(index : string){
    if(this.tracker.allTrackers[index].link_status == 0){
        this.message("Not connected","The tracker is already disconnected");

    }else{
      this.tracker.disconnectTracker(this.tracker.allTrackers[index].tracker_id); //disconeting the tracker using the id
    }

  }
  addNewTracker(){
    this.continueMessage("Agreement","By generating a new tracker id , you accept our terms of service and willing to pay <strong>R250</strong> non-refundable operation fee.")
  }
  continueMessage(title,message) {
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
            this.navCtrl.push(NewTrackerPage)
            // this.mode === "tracker" ? this.navCtrl.push(TrackerHomePage) : this.navCtrl.push(LoginPage) ;
          }
        }]
    });
    alert.present();
  }
  message(title,message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: [{
          text: 'OK',
          handler: () => {
          }
        },
        ]
    });
    alert.present();
  }
}
