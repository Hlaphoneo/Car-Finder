import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events ,LoadingController } from 'ionic-angular';

import { BatteryStatus } from '@ionic-native/battery-status';
import { Network } from '@ionic-native/network';
import { LocationService } from './locationservice';
import { Http , Headers } from '@angular/http';
import * as firebase from 'firebase/app';
import { UserInterface } from './userdata';


@Injectable()
export class TrackerService {
  //====================================================== Tracker mode variables =================================================
  mode : any;
  levels : any ; //controlls the interval that is reponsible for sending levels to the firebase server
  batteryStatus : any;
  gpsStream : any ; //this function is used to control the interval of the gps updating interval
  networkState : any;
  referenceLink : any ; //used to refernce the database , it is referenced link this to in order to remove it later
  updateInterval : any; //this interval is used to update the count the update cycles


  loadInstance : any;
  database : any;

  //====================================================== Receiever mode variables =================================================


  constructor(public loadingCtrl: LoadingController, public user : UserInterface , public http : Http , public network: Network , public battery : BatteryStatus , public location : LocationService , public events : Events , public storage : Storage)  {
      this.database = firebase.database() // creating a new database object
      this.mode = "Unknown"
      this.updateInterval = 2000;

      // =============================================================== listening for location changes ===========================================================

      this.events.subscribe("locationchange",(x,y)=>{ //waiting for the location service to publish new coords
        this.getTrackerId().then((tracker_id)=>{
          let cords = {
                'x': x,
                'y':y
              }
          console.log(cords)
          this.database.ref('/trackers/'+tracker_id).update(cords).then(()=>{
            // alert("update success")
          }).catch((error)=>{
            alert(error)
          })
        })
      })
  }

// ============================================================== TRACKER MODE FUNCTIONS ==============================================================

/*
  Objective : Starts to stream location and levels information to the server
*/

  startStream(){

    //==========================================================listening for network changes==========================================================

        this.networkState = this.network.onDisconnect().subscribe(() => {
        this.events.publish('network:change',"Networ error");
      });
        this.networkState = this.network.onConnect().subscribe(() => {
        this.events.publish('network:change',"Connected");
      });

    //=====================================================streaming battery status-bar================================================================

        this.batteryStatus = this.battery.onChange().subscribe(
         (status: any) => {
           this.getTrackerId().then((id)=>{
                 let battery_object = {
                     'id' : id,
                     'battery_level' : status.level
                 }
                 var content = JSON.stringify(battery_object);
                 var headers = new Headers();
                 headers.append('Content-Type', 'application/json');
                 this.http.post('https://us-central1-konza-carfinder.cloudfunctions.net/update_battery',content,headers)
                 .subscribe((response) => {

                 })
               }
              );

           })

      //====================================================Connecting the tracker to the gps system and streaming the updates==========================


      this.location.setDefaults();   //setting geolocation results to the default values
      this.location.updateLocation(); //updating location
      this.gpsStream = setInterval(() => {
          // console.log("updating.... location")
          this.location.updateLocation(); //updating location
      },this.updateInterval); // the location will refresh updateInterval mins

    }

/*
  When the tracker is connected , this Functions saves the tracker information
*/
  setInfo(name : string , id : string , linkRef){
    this.storage.set('trackerName', name);
    this.storage.set('trackerID', id);
    this.storage.set('linkRef', linkRef);

      //loading link status and saving it in the referenceLink for later refereing when the state changes
      this.referenceLink = this.database.ref('/tracker_ids/'+id+"/0/link_status");
      this.referenceLink.on('value',(data)=>{
          // console.log(data.val())
          if(data.val() == 0){
            this.events.publish("tracker:trackeroff")
          }
      })
  }


  /*

  this function is used to turn off the firebase event listener for changing link_status modes of the tracker.
  in a way preventing the accumulation of event listiners
  */

  stopListening(){
    if(this.referenceLink != null){
      this.referenceLink.off();
      }
  }

/*
  Objective :Stops streaming of location and levels information to the server

*/
  stopStream(){
    clearInterval(this.levels); //stoping streaming of devices levels to the server
    this.batteryStatus.unsubscribe(); //stopping listening for bettery status change.
    this.networkState.unsubscribe(); //stopping listening for bettery status change.
    clearInterval(this.gpsStream)// stoping the gps updating interval
  }
  disconnectTracker(tracker_id : string ){
      //deleting the reference and setting the status to false.
      this.database.ref("tracker_ids/"+tracker_id+"/0/").update(
        {
          "link_ref":"none",
          "link_status":0
        }
      ).then(()=>{

      }).catch((error)=>{
          alert(error);
      })
  }





























// ============================================================== HELPER FUNCTIONS ==============================================================

  setConnectionState(state: any): void {
    this.storage.set('connectionState', state);
  };
  getConnectionState(){
    return this.storage.get('connectionState').then((state) =>{
        return state;
    })
  }
  getLinkReference(){
    return this.storage.get('linkRef').then((state) =>{
        return state;
    })
  }
  getTrackerId(){
    return this.storage.get('trackerID').then((state) =>{
        return state;
    })
  }
  getTrackerName(){
    return this.storage.get('trackerName').then((state) =>{
        return state;
    })
  }
  clearInfo(){
    this.storage.remove('trackerName');
    this.storage.remove('trackerID');
    this.storage.remove('linkRef');
  }
}
