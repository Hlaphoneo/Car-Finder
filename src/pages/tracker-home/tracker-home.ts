import { Component } from '@angular/core';
import {  NavController, NavParams , AlertController , PopoverController , Events  } from 'ionic-angular';
import { Http , Headers } from '@angular/http';
import * as $ from 'jquery'

import { TrackerService } from '../../services/tracker_service';
import { AccountService } from '../../services/accountservice';
import { GeneralInterface } from '../../services/generalinterface'; //contains helper functions
import { ModeSelectPage } from '../mode-select/mode-select';


@Component({
  selector: 'page-tracker-home',
  templateUrl: 'tracker-home.html',
})
export class TrackerHomePage {
  trackerName   : string;
  finderID      : string; //the key used to connect to the database
  trackerStatus : string = "Disconnected";
  connectionText: string = "CONNECT";
  linkRef       : string;

  // ------------------------animation--------------------------------------
  animationCtrl: any;

  constructor(public account : AccountService , public events : Events , public  generalInterface : GeneralInterface , public tracker : TrackerService , public popoverCtrl: PopoverController , public http: Http , public alertCtrl : AlertController , public navCtrl: NavController, public navParams: NavParams) {
    this.trackerName = '';
    this.finderID = '';

    //this event listen to the tracker link state , if the state changes the 0 , the this event is fired and then it disconnect the tracker;
    this.events.subscribe('tracker:trackeroff' ,  (mode)=>{
      this.tracker.getConnectionState().then((state)=>{
        console.log("connection state - "+state)
        if(state == 1){ // if the tracker is connected
            this.connect("new"); //this function will disconnect the tracker since it is already connected
        }else{
          console.log("the tracker is already disconnected")
        }
      })
    })

    //checking if the tracker was connected before shutting down then continue the connection it was ;
    this.tracker.getConnectionState().then((state)=>{
        if(state == 1){ //was already connected
          this.tracker.getTrackerId().then((id)=> { //getting tracker id
            this.finderID =  id;
            this.tracker.getTrackerName().then((name)=>{
              this.trackerName = name;
                this.tracker.getLinkReference().then((ref)=> { //retrieving the refernce that was saved to relink it with the tracker in the database
                    this.linkRef = ref;
                    this.connect('continue'); //connecting the tracker automatically
                    this.tracker.stopListening(); // cancelling previous event listeners
                    this.tracker.setInfo(this.trackerName,this.finderID,this.linkRef) // setting tracker identirty information and listening for mode changes
                })
            })
          })

        }
    })
  }
  /*
      Takes the sapp back to the mode selection page
  */
  back(){
      this.continueMessage("This action will disconnect the tracker if connected, do you want to continue ?. ","Warning")
  }

  /*
    conection mode is used to differentiate function call context. between continue or creation of new connection
  */
  connect(connectionMode : string) : void {
      //checking if the tracker is not already in connected state
      this.tracker.getConnectionState().then((state)=>{
          if(state == 1 && connectionMode != "continue"){ //if the connection is continueing don't toggle the button state
            this.disconnect(); //if the tracker is connected , then you have to put it in disconnected state
            return;
          }
          else{
            this.animation('connecting');  //starting connecting animation
            let inputState = this.validateInput();
            if(connectionMode == 'new'){
              this.linkRef = this.generalInterface.generateLinkReference(); //generating a new tracker link reference
            }
              if(inputState){
                                            console.log("here")
                      let connect_info = {
                          'tracker_name' : this.trackerName,
                          'id' : this.finderID,
                          'link_ref' : this.linkRef
                      }
                      var content = JSON.stringify(connect_info);
                      var headers = new Headers();
                      headers.append('Content-Type', 'application/json');
                      this.http.post('https://us-central1-konza-carfinder.cloudfunctions.net/connect_tracker',content,headers)
                      .subscribe((response) => {
                                                    console.log(response["_body"])
                          /*
                              Possible responses
                                  paymenterror - id exists but not active because of none payment
                                  trackernotfound - tracjer id does not exist
                                  trackerinuse - tracker is already linked to another device
                                  trackerlinked - tracker has been successfuly linked with the service
                          */
                          if(response["_body"] == 'paymenterror' ){
                            this.animation('disconnected');
                            this.notify("The ID you provided is pending payment.")
                          }
                          if(response["_body"] == 'trackernotfound'){
                            this.animation('disconnected');
                            this.notify("The ID you provided is not found.")
                          }
                          if(response["_body"] == 'trackerinuse'){
                            this.animation('disconnected');
                            this.notify("The ID you provided is already in use.")
                          }
                          if(response["_body"] == 'trackerlinked'){
                            this.animation('connected');
                            this.trackerStatus = "Connected";
                            this.tracker.setConnectionState(1);
                            this.tracker.stopListening(); // cancelling previous event listeners
                            this.tracker.setInfo(this.trackerName,this.finderID,this.linkRef);
                            this.tracker.startStream(); //starting streaming location and levels information to the server / the data is streamed to the connected tracker
                            this.account.setAppMode("tracker");
                          }
                          if(response["_body"] == 'linkedalready'){
                            this.trackerStatus = "Connected";
                            this.animation('connected');
                            this.account.setAppMode("tracker"); //the tracker is not connect , setting app mode
                            this.tracker.startStream(); //starting streaming location and levels information to the server
                          }
                      })
              }
              else{
                      this.animation("disconnected"); //changing animation state to disconnected
              }
          }
      })
  }
  disconnect(){
    this.animation('disconnecting')
    let disconnect_info = {
        'id' : this.finderID
    }
    var content = JSON.stringify(disconnect_info);
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.http.post('https://us-central1-konza-carfinder.cloudfunctions.net/disconnect_tracker',content,headers)
    .subscribe((response) => {
        if(response["_body"] == 'trackerremoved'){

          this.animation('disconnected');
          this.trackerStatus = "Disconnected"
          this.tracker.stopStream(); //stoping the service from streaming updates
          this.tracker.clearInfo() //removing all the information about the tracker
          this.tracker.setConnectionState(0); // putting tracker in disconnected state
          this.events.publish("trackerdisconnected") // the tracker has been successfuly disconnected : notifying function handler of the continueMessage function
        }
    })
  }
  validateInput(){
      if(this.trackerName.length < 3){
        this.showMessage("Tracker name must be at least 3 characters.");
        return false;
      }
      if(this.finderID.length < 10){
        this.showMessage("Finder ID too short , please login to your tracker portal to access your correct key.");
        return false;
      }
      if(this.finderID.length > 10){
        this.showMessage("Finder ID too long , please login to your tracker portal to access your correct ID.");
        return false;
      }
      /*
        1. Checks if the string does not contain chars that are not
           - Digits
           - letters
           - Or space
      */
      for(var i =  0; i < this.finderID.length; i ++){
          if(!(this.finderID.charCodeAt(i) >= 97 && this.finderID.charCodeAt(i) <= 122) && !(this.finderID.charCodeAt(i) >= 65 && this.finderID.charCodeAt(i) <= 90) && !(this.finderID.charCodeAt(i) >= 48 && this.finderID.charCodeAt(i) <= 57) && this.finderID.charCodeAt(i) != 32){
                this.showMessage("ID contains invalid characters , only digits and letters are allowed.");
                return false;
          }
      }
      return true; //the input is correct
  }
  // -------------------------------------------------------------------------- Helper Functions -----------------------------------------------------------------

  //used to alert user about the outcome of the connection
  notify(message : string){
        let alert = this.alertCtrl.create({
        subTitle: message,
        buttons: ['OK']
      });
      alert.present();
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
              console.log("testings")
              this.tracker.getConnectionState().then((state)=>{
                console.log("handler state"+ "   "+ state)
                if(state == 1){
                  this.disconnect(); //if the tracker was connect , please disconnect it .
                }
                else{
                  this.navCtrl.push(ModeSelectPage); // no tracker connected going to the mode select page
                  console.log("tracke already disconnected")
                }
              })
              this.events.subscribe("trackerdisconnected",()=>{ //after back button click , the events wait to listen if the tracker has been successfuly disconnected
                this.account.setAppMode("none"); //resttng the application mode
                this.navCtrl.setRoot(ModeSelectPage) //set mode select page as root.
              })
            }
          }]
      });
      alert.present();
    }
  showMessage(message : string , title = "error"){
      let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
  /*
    Objective   : responible for changin app animation of different states
    @parameters : connect
                  connected
                  disconnected
  */
  animation(action : string){
      if(action == "connecting"){
        $(".connect_tracker_button").prop("disabled",true); //disabling button
        $(".tracker_input  :input ").prop("disabled",true); //disabling button
        $(".tracker_info_container").addClass("take_to_back")
        $(".connect_tracker_button").html("CONNECTING...")
        this.animationCtrl = setInterval(() => {
          $(".state_img").fadeOut(1000)
          $(".state_img").fadeIn(1000)
        }, 1000);
      }
      if(action == "disconnecting"){
        $(".connect_tracker_button").prop("disabled",true); //disabling button
        $(".tracker_info_container").addClass("take_to_back")
        $(".connect_tracker_button").html("DISCONNECTING...")
        this.animationCtrl = setInterval(() => {
          $(".state_img").fadeOut(1000)
          $(".state_img").fadeIn(1000)
        }, 1000);
      }
      if(action == "disconnected"){
        clearInterval(this.animationCtrl); // stoping animation
        $(".state_img").stop(true); //stoping all animations instantly
        $(".state_img").fadeIn(1000) //making sure the the logo animated comes on top after the animation has stopped
        $(".tracker_info_container").removeClass("take_to_back") //making all input field visible
        $(".connect_tracker_button").removeClass("buttonConnected"); //changing button color to orange
        $(".connect_tracker_button").prop("disabled",false);
        $(".tracker_input :input").prop("disabled",false); //making sure that the user can only enter information when the state is correct
        $(".state_img").removeClass("connected");   //restong the original disconnected logo
        $(".connect_tracker_button").html("CONNECT") // restoring button text to connect
      }
      if(action == "connected"){
          clearInterval(this.animationCtrl); // stoping animation
          $(".state_img").stop(true); //stoping all animations instantly
          $(".state_img").fadeIn(1000) //making sure the the logo animated comes on top after the animation has stopped/
          $(".state_img").addClass("connected");
          $(".connect_tracker_button").addClass("buttonConnected");
          $(".tracker_input :input").prop("disabled",true); //disabling button
          $(".connect_tracker_button").prop("disabled",false);
          $(".connect_tracker_button").html("DISCONNECT")
      }
  }
}
