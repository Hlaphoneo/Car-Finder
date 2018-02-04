import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TrackerDevicePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-tracker-device',
  templateUrl: 'tracker-device.html',
})
export class TrackerDevicePage {
  tracker : any;
  batteryLevel : any;
  linkToken : string;
  state : any;
  constructor(public navCtrl: NavController, public parameters: NavParams) {
    this.tracker = this.parameters.get("tracker");      //sent from the previous page
    this.linkToken = this.parameters.get("link_token"); //sent from the previous page
    this.batteryLevel = this.tracker.battery_level;
    this.tracker.state == 0 ? this.state ="offline" : this.state = "Online";
    console.log(this.tracker)

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TrackerDevicePage');
  }

}
