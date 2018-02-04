import { Component } from '@angular/core';
import {  NavController, NavParams , Events , ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Tracker } from '../../services/tracker';


@Component({
  selector: 'page-select-tracker',
  templateUrl: 'select-tracker.html',
})
export class SelectTrackerPage {
  activeTrackerKeys : any;
  activeSelectedTracker : any;

  constructor(public viewCtrl: ViewController , public storage : Storage , public events : Events, public tracker : Tracker , public navCtrl: NavController, public navParams: NavParams) {

    }

  setActive(tracker_id : string){
    if(tracker_id != null){
    this.events.publish("activetracker",tracker_id)
    this.storage.set("activetracker",tracker_id);
    this.viewCtrl.dismiss()  //dismissing the pop over;
  }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectTrackerPage');
  }

}
