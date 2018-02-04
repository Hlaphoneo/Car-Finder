import { Component } from '@angular/core';
import { PopoverController , AlertController ,  Events , ViewController , NavController , App} from 'ionic-angular';
import * as $ from 'jquery'

import { Tracker } from '../../services/tracker';
import {SettingsPopOverPage} from '../settings-pop-over/settings-pop-over';
import {SelectTrackerPage} from '../select-tracker/select-tracker';
import  {ManageTrackersPage} from '../manage-trackers/manage-trackers';
import {PrivacySettingsPage} from '../privacy-settings/privacy-settings';
import {SupportPage} from '../support/support';
import {ModeSelectPage} from '../mode-select/mode-select';
import { Storage } from '@ionic/storage';
import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapOptions,
 CameraPosition,
 MarkerOptions,
 LatLng,
 Marker
} from '@ionic-native/google-maps';


@Component({
  selector: 'page-maphome',
  templateUrl: 'home.html'
})
export class AppHome {
  map: GoogleMap;
  mapElement: HTMLElement;

  activeTrackerKeys          : any = Array();
  activeSelectedTracker      : any; //object of the currently selected tracker
  activeSelectedTrackerKey   : string; //key of the currently selected tracker

  x               : 0;
  y               : 0;
  selfmarker      : Marker;
  mapRefreshRate  : any;

   constructor(public viewCtrl: ViewController ,  public appCtrl : App ,  public navCtrl: NavController, public googleMaps: GoogleMaps , public storage : Storage , public events : Events , public tracker : Tracker , public popoverCtrl : PopoverController){
      $("#tracker_message").hide() //hiding no tracker message
      this.listenForModeChanges()
      this.retriveActiveTracker()         // Retrieve the active last tracker
      this.waitForActiveTrackerChange()   // Changes the active tracker for the home page
      this.waitForActiveTrackers();       // waiting for all trackers to load; calls the listen function that updates the maps
      this.updateTrackers();              // Loads the all trackes from the database at firs run

      this.events.subscribe("readymaps",()=>{
        this.bringMapToFront();
      })


      //removes the deleted tracker from the map if it was the current active one.

      this.events.subscribe("trackerDeleted",(tracker_id)=>{
        if(tracker_id = this.activeSelectedTrackerKey){
          console.log("removing from the view")
          if(this.mapRefreshRate != null){
            clearInterval(this.mapRefreshRate) //clearing the map refresh rate
          }
          this.activeSelectedTrackerKey = null; //clearing the key
          $("#tracker_message").show()

        }
      })


  }
  /*
    This function retrieves currently active tracker on starting
    It checks if there are any active trackers
      If there are no active tracker , the function does nothing
      if there are some active tracker but there is not currently active tracker set , the function choose the first tracker in the
      list of all trackers as the current active tracker
  */
  ionViewDidLoad() {
    this.loadMap();
  }

  listenForModeChanges(){
    this.events.subscribe("modechange", () =>{
        clearInterval(this.mapRefreshRate) //clearing old refresh rate mode.
        this.listen() //listening with the new refresh rate
    })
  }

  retriveActiveTracker(){
    this.events.subscribe("tracker:loaded all trackers",()=>{ //watiting for all tracker to be loaded
      this.storage.get("activetracker").then((tracker_id)=>{
        if(tracker_id == null){
          //no active tracker
        }
        else{
            //check if the tracker instance is still available
            let temporaryKeys = Array(); // array to hold keys of the associative array
            temporaryKeys = Object.keys(this.tracker.activeTrackersKeys); //extracting keys from the associative array
            for(var i = 0 ; i < temporaryKeys.length ; i++){ //collecting active tracker
                if(temporaryKeys[i] == tracker_id){
                this.activeSelectedTrackerKey = tracker_id;
                this.listen();                      // Co-ordinates the update intervals and update maps , listening for location changes using the two different modes
                return;
              }
            }
            if(temporaryKeys.length > 0){ //if there are some trackers , pick the first one on the list as the active tracker
                console.log("tracker might be disconnected or removed - setting random key")
                this.activeSelectedTrackerKey = temporaryKeys[0]; //setting active tracker as an first active tracker
                this.storage.set("activetracker",temporaryKeys[0]); //saving the new tracker id for future reference
                this.listen();                      // Co-ordinates the update intervals and update maps , listening for location changes using the two different modes
              }
            }

          })

      })

    this.events.subscribe("usernoactivetrackers",()=>{
      console.log("user as no trackers")
    })
  }

  /*
    objective updates the map with new coordinates
    envoked by retrieveActiveTracker()
  */
  listen(){

    if(this.activeSelectedTrackerKey == null){
      return; // no active tracker selected
    }
    if(this.tracker.activeTrackers_inst[this.activeSelectedTrackerKey] != null){
      if(this.tracker.activeTrackers_inst[this.activeSelectedTrackerKey].mode == "Normal"){
        this.mapRefreshRate = setInterval(() => {
            console.log("refreshing map - normal mode")
            if(this.map != null){
                this.map.clear();
                this.selfmarker = null;
                      if(this.tracker.activeTrackers_inst[this.activeSelectedTrackerKey]){
                        this.y = this.tracker.activeTrackers_inst[this.activeSelectedTrackerKey].y;
                        this.x = this.tracker.activeTrackers_inst[this.activeSelectedTrackerKey].x;
                      }


                        let coordinate = new LatLng(this.y,this.x);

                        this.map.moveCamera({
                          'target': coordinate,
                          'tilt': 0,
                          'zoom': 17
                        })

                       if (this.selfmarker != null) {
                           this.selfmarker.setPosition(coordinate);
                           this.map.addMarker(this.selfmarker);
                       } else {
                           let markerIcon = {
                               'url': 'assets/marker.png',
                               'size': {
                                   width: 20,
                                   height: 20,
                               }
                           }
                           let markerOptions: MarkerOptions = {
                               position: coordinate,
                               icon: markerIcon,
                               title : "Me"
                           };
                            this.map.addMarker(markerOptions).then((marker) => { this.selfmarker = marker; });
                            }
                }
        },15000);

      }
      if(this.tracker.activeTrackers_inst[this.activeSelectedTrackerKey].mode == "Watch"){
        this.mapRefreshRate = setInterval(() => {
            console.log("refreshing map - watch mode")
            if(this.map != null){
                this.map.clear();
                this.selfmarker = null;

                        if(this.tracker.activeTrackers_inst[this.activeSelectedTrackerKey]){
                          this.y = this.tracker.activeTrackers_inst[this.activeSelectedTrackerKey].y;
                          this.x = this.tracker.activeTrackers_inst[this.activeSelectedTrackerKey].x;
                        }

                        let coordinate = new LatLng(this.y, this.x);

                        this.map.animateCamera({
                          'target': coordinate,
                          'tilt': 0,
                          'zoom': 17,
                          duration:3000
                        })

                       if (this.selfmarker != null) {
                           this.selfmarker.setPosition(coordinate);
                           this.map.addMarker(this.selfmarker);
                       } else {
                           let markerIcon = {
                               'url': "assets/marker.png",
                               'size': {
                                   width: 32,
                                   height: 37,
                               }
                           }
                           let markerOptions: MarkerOptions = {
                               position: coordinate,
                               icon: markerIcon,
                               title : "Car"
                           };
                            this.map.addMarker(markerOptions).then((marker) => { this.selfmarker = marker; });
                            }
                }
        },3000);
      }
    }
  }
  loadMap() {
    this.mapElement = document.getElementById('mapContainer');

    let mapOptions: GoogleMapOptions = {
              camera: {
                target: {
                  lat: -27.3740,
                  lng: 26.6200
                },
                zoom: 17,
                tilt: 0,
                },
               gestures: {
               scroll: false,
               tilt: false,
               rotate: false,
               zoom: false
           }
    };

    this.map = this.googleMaps.create(this.mapElement, mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        console.log('Map is ready!?');

        // Now you can use all methods safely.
        this.map.addMarker({
            title: 'Your Car',
            icon: 'blue',
            animation: 'DROP',
            position: {
              lat: -26.200657,
              lng: 28.010057
            }
          })
          .then(marker => {
            marker.on(GoogleMapsEvent.MARKER_CLICK)
              .subscribe(() => {
                alert('clicked');
              });
          });

      });
   }

  listenForLocationChanges(){
    // tracker.activeTrackers_inst[activeSelectedTrackerKey] ? tracker.activeTrackers_inst[activeSelectedTrackerKey].y
    //  this function updates the map when location changes
    //  this.events.subscribe("locationchange",()=>{
            //  this.map.clear();
            //  this.selfmarker = null;
            //  this.getLocation().then((data)=>{
            //          this.x = data.x;
            //          this.y = data.y;
            //          let coordinate = new LatLng(data.x, data.y);
             //
            //          this.map.moveCamera({
            //            'target': coordinate,
            //            'tilt': 0,
            //            'zoom': 14
            //          })
             //
            //         if (this.selfmarker != null) {
            //             this.selfmarker.setPosition(coordinate);
            //             this.map.addMarker(this.selfmarker);
            //         } else {
            //             let markerIcon = {
            //                 'url': 'https://lh3.googleusercontent.com/zPPRTrpL-rx7OMIqlYN63z40n',
            //                 'size': {
            //                     width: 20,
            //                     height: 20,
            //                 }
            //             }
            //             let markerOptions: MarkerOptions = {
            //                 position: coordinate,
            //                 icon: markerIcon,
            //                 title : "Me"
            //             };
            //              this.map.addMarker(markerOptions).then((marker) => { this.selfmarker = marker; });
            //         }
            //  })
    //  })

    //  this.locationService.setListeningState(true)//making sure the device is listening for any location changes by chaning listening state to true
   }
  waitForActiveTrackerChange(){
      this.events.subscribe("activetracker",(tracker_id)=>{ //event for currently active tracker
        this.activeSelectedTrackerKey = tracker_id; //this key is used to load all the needed resources for the appropiate tracker
      })
  }
  waitForActiveTrackers(){
    this.events.subscribe("tracker:loaded all trackers",(data)=>{
      this.activeTrackerKeys = data; //saving a list of all active trackers keys
      this.activeSelectedTracker = this.tracker.activeTrackers_inst[this.activeTrackerKeys[0]] //setting the default tracker

    })
  }

  changeMode(){
    if(this.tracker.activeTrackers_inst[this.activeSelectedTrackerKey] != null){
      this.tracker.changeMode(this.activeSelectedTrackerKey , this.tracker.activeTrackers_inst[this.activeSelectedTrackerKey].mode); //changing mode
    }
  }
  updateTrackers(){
    this.tracker.updateTrackers(); //getting all user tracker from the database
  }
  openSettings(event : any){
     this.map.setClickable(false);
    let popover = this.popoverCtrl.create(SettingsPopOverPage);

    popover.present({
      ev: event
    });

    // popover.onDidDismiss(() => {
    //     console.log(this.viewCtrl)
    //     this.map.setClickable(true);
    // });
  }
  bringMapToFront(){
      this.map.setClickable(true);
  }
  deactivateMap(){
    this.map.setClickable(false);

  }
  openTrackers(event : any){
    this.map.setClickable(false);
    let popover = this.popoverCtrl.create(SelectTrackerPage);

    popover.present({
      ev: event
    });

    popover.onDidDismiss(() => {

        this.map.setClickable(true);
    });
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
  }
  modeChange(){
    this.continueMessage("Are you sure you want to change service mode ?","Mode Chage");
  }

  continueMessage(message,title) {
    //   let alert = this.alertCtrl.create({
    //     title: title,
    //     subTitle: message,
    //     buttons: [{
    //         text: 'CANCEL',
    //         handler: () => {
    //         }
    //       },
    //       {
    //         text: 'CONTINUE',
    //         handler: () => {
    //             this.viewCtrl.dismiss()  //dismissing the pop over;
    //             this.appCtrl.getRootNav().push(ModeSelectPage).then(()=>{
    //               this.account.setAppMode("none") ;
    //               return false;
    //             })
    //
    //         }
    //       }]
    //   });
    //   alert.present();
    }

}
