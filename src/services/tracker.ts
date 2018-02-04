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
export class Tracker {

  database : any;     //firebase database instance
  loadInstance : any; //loading controller

  //====================================================== Firebase references =====================================================
  /*
        This references are used to stop event listiners when the user logs out
  */
    trackerDataChange : any = Array(); //Associative array - stores all the references for link and payment status changes
    trackerListChange : any = Array(); //Associative array - Stores all the references for changing tracker list

  //====================================================== Receiever mode variables =================================================

        keys_length : any; //store the length of total number of trackers
        activeTrackers : any =  Array(); //partial list containing header information about list of all active trackers
        activeTrackersKeys : any =  Array();
        activeTrackers_inst : any =  Array(); //this array is used to store all the instances of active trackers
        allTrackers : any =  Array();
        allTrackersKeys : any =  Array();
        i : any = 0 ; //loop control variable
        activeTracker_length : any;
        CHARPOOL = ["z","y","x","w","v","a","c",
                        "d","p","i","b","g","l","e",
                        "j","u","m","k","r","q","o",
                        "s","t","f","n","h",
                      ] //used to generate the finder id

  constructor(public loadingCtrl: LoadingController, public user : UserInterface , public http : Http , public network: Network , public battery : BatteryStatus , public location : LocationService , public events : Events , public storage : Storage)  {
      this.database = firebase.database() // creating a new database object
  }


// ============================================================== RECIEVER MODE FUNCTIONS =============================================================

  updateTrackers(){
    this.loadInstance = this.loadingCtrl.create({content:"Please Wait:: Refreshing service.."}); //starting loading animations
    this.loadInstance.present(); // presenting the loader
    this.user.getUserReference().then((reference)=>{
    this.database.ref('/users/'+reference+"/0/tracker_ids").orderByPriority().once('value',(data)=>{
            if(data == null){
            }else{
                    if(data.val() != null){
                        let listKeys = Object.keys(data.val()); //getting key list of all trackers as array
                        this.getTrackers(listKeys); //getting all user trackers from the database;
                    }else{ //results are empty
                      this.events.publish("usernoactivetrackers"); //user has no active trackers
                      this.loadInstance.dismiss().catch((error)=>{
                      })
                    }
            }
      },(error)=>{
        alert(error)
      });
    })
  }
  getTrackers(keys : any){ //getting all the tracker ids from the database
    let counter = 0;
    this.keys_length = keys.length;
    while(counter < keys.length){
    this.database.ref('/tracker_ids/'+keys[counter]).orderByPriority().once('value',(data)=>{
        this.i++;
        this.allTrackersKeys.push(data.key); //storing keys of all trackers
        this.allTrackers.push(data.val()[0]); //saving on a list of all trackers
        //checking if the tracker is active
        if(data.val()[0].link_status == 1){
          this.activeTrackersKeys[data.key] = data.key;
          this.activeTrackers.push(data.val()[0]) // saving value in the list of all active trackers
        }
        if(this.i == this.keys_length){  //checks if the function has collected all trackers
          if(this.activeTrackers.length == 0){ //there are no active tracker for this user
            this.events.publish("usernoactivetrackers"); //user has no active trackers
            this.loadInstance.dismiss().catch((error)=>{
              console.log(error)
            })
            return;
          }
          this.getTrackerInstances() //if the are some active trackers , then get the instances
        }
      },(error)=>{
        counter++;
        alert(error)
      });
              counter++;
    }
    this.i = 0;
    counter = 0;
    //adding event listiners to the tracker  , in order to sync the values
    while(counter < keys.length){
    this.trackerListChange[keys[counter]] = this.database.ref('/tracker_ids/'+keys[counter]+"/0"); //saving the firebase reference
    this.trackerListChange[keys[counter]].orderByPriority().on('child_changed',(data)=>{

        if(data.key == "link_status"){ //updates the link status of the tracker
          this.trackerLinkStateChange(data.ref.parent.parent.key ,data.val())  //load a new tracker instance into the array with this snapshot as reference
        }

        if(data.key == "payment_status"){ //changes the update status of the tracker

          for(var i = 0 ; i < this.allTrackers.length ; i++){
            if(this.allTrackers[i].tracker_id == data.ref.parent.parent.key ){
              this.allTrackers[i].payment_status = data.val();
              console.log("updated")
              console.log(i)
              console.log(this.allTrackers)
              return;
            }

          }
        }
      },(error)=>{
        counter++;
        alert(error)
      });
        counter++;
    }
    counter = 0;
  }

  /*
    Removes all tracker instances
    Removes and turns off all event listeners

  */

  clearTrackers(){
      //clearing tracker list change event listeners
      for(var i = 0 ; i < this.keys_length ; i++){
        if(this.trackerListChange[this.allTrackersKeys[i]] != null){
          this.trackerListChange[this.allTrackers[i].tracker_id].off();
        }
      }
      //clearing tracker data change
      for(var i = 0 ; i < this.activeTrackers.length ; i++){
          if(this.trackerDataChange[this.allTrackers[i].tracker_id] != null){ //if this is valid
            this.trackerDataChange[this.allTrackers[i].tracker_id].off();
          }
      }

      this.allTrackers  =  Array();
      this.keys_length = 0 ;
      this.activeTrackers  =  Array(); //partial list containing header information about list of all active trackers
      this.activeTrackersKeys  =  Array();
      this.activeTrackers_inst  =  Array(); //this array is used to store all the instances of active trackers
      this.allTrackers  =  Array();
      this.activeTracker_length = 0;
  }

/*
    Objective : this funtion collects all the active tracker instances from the databases
*/

  getTrackerInstances(){
    this.i = 0; //setting global control variable to zero
    for(var counter = 0 ; counter < this.activeTrackers.length ; counter++){
      this.database.ref('/trackers/'+this.activeTrackers[counter].tracker_id).orderByPriority().once('value',(data)=>{
              if(data == null){
                this.loadInstance.dismiss().catch((error)=>{
                })
                return;
              }else{
                this.i++;
                this.activeTrackers_inst[data.key] = data.val();
              }

              if(this.i = this.activeTrackers.length){ //
                if(this.activeTrackers.length != 0){
                  this.events.publish("tracker:loaded all trackers",Object.keys(this.activeTrackersKeys)); //sending keys of all active trackers
                  this.events.publish("tracker:done");
                }
                this.loadInstance.dismiss().catch((error)=>{
                })
              }
        },(error)=>{
          this.loadInstance.dismiss().catch((error)=>{
          })
          alert(error)
        });
    }
    for(var i = 0 ; i < this.activeTrackers.length ; i++){
      this.trackerDataChange[this.activeTrackers[i].tracker_id] = this.database.ref('/trackers/'+this.activeTrackers[i].tracker_id); //creating new reference
      this.trackerDataChange[this.activeTrackers[i].tracker_id].on('child_changed',(data)=>{
            if(data.key == "battery_level")
              this.activeTrackers_inst[data.ref.parent.key].battery_level = data.val();  // data.ref.parent.key is key value and data.key is the field to update and data.val() is the new value
            if(data.key == "state")
              this.activeTrackers_inst[data.ref.parent.key].state = data.val();  // data.ref.parent.key is key value and data.key is the field to update and data.val() is the new value
            if(data.key == "mode")
              this.activeTrackers_inst[data.ref.parent.key].mode = data.val();  // data.ref.parent.key is key value and data.key is the field to update and data.val() is the new value
            if(data.key == "x")
              this.activeTrackers_inst[data.ref.parent.key].x = data.val();  // data.ref.parent.key is key value and data.key is the field to update and data.val() is the new value
            if(data.key == "y")
              this.activeTrackers_inst[data.ref.parent.key].y = data.val();  // data.ref.parent.key is key value and data.key is the field to update and data.val() is the new value
        },(error)=>{
          this.loadInstance.dismiss().catch((error)=>{
          })
          alert(error)
        });
    }
  }

  /*
  When the tracker link_state == 1 , this fuction collects the new tracker instance from the database and appends it to the
  existing tracker list.
  */

  trackerLinkStateChange(key : any , newValue : any){
      console.log(newValue)
      if(newValue == 1){ //new tracker connected
              //adding the new reference to the list of instances

              //this times out compensate for the firebase time taked to add the child before actually being referenced. addes 4 seconds.
              setTimeout( () => {
              this.database.ref('trackers/'+key).once('value',(data)=>{
                      if(data == null){
                        console.log("Error")
                        return;
                      }else{



                        this.activeTrackersKeys[key] = key; //adding the tracker instance as a reference to the existing array
                        this.activeTrackers_inst[key] = data.val(); //adding the tracker instance as a reference to the existing array

                        // addring the key tracker to the list of all trackes and the activeTrackers
                        // since the tracker id is already active , we just have find it and change link_status to active
                        // all of this happens after the key is generated and added to firebase database via the cloudfunctions

                        for(var i = 0 ; i < this.allTrackers.length ; i++){
                          if(this.allTrackers[i].tracker_id == key ){
                            this.activeTrackers.push(this.allTrackers[i]) //pushing the new key into the list of all active trackers , note that index of key in the key array corresponds to the index in the list of all trackers
                            this.allTrackers[i].link_status = newValue;

                            //updating the link reference
                            this.database.ref('/tracker_ids/'+key+"/0/link_ref").once('value',(data)=>{
                            this.allTrackers[i].link_ref = data.val();
                            })


                            this.allTrackersKeys.push(key)
                            this.events.publish("tracker:loaded all trackers",Object.keys(this.activeTrackersKeys)); //telling the homepage that the new tracker is available and it should refresh
                            return;
                          }
                        }
                      }
                },(error)=>{
                  alert(error)
                });

                // adding listening event of the new tracker instance
                this.trackerDataChange[key] = this.database.ref('/trackers/'+key);
                this.trackerDataChange[key].on('child_changed',(data)=>{
                      if(data.key == "battery_level")
                        this.activeTrackers_inst[data.ref.parent.key].battery_level = data.val();  // data.ref.parent.key is key value and data.key is the field to update and data.val() is the new value
                      if(data.key == "state")
                        this.activeTrackers_inst[data.ref.parent.key].state = data.val();  // data.ref.parent.key is key value and data.key is the field to update and data.val() is the new value
                      if(data.key == "mode")
                        this.activeTrackers_inst[data.ref.parent.key].mode = data.val();  // data.ref.parent.key is key value and data.key is the field to update and data.val() is the new value
                      if(data.key == "x")
                        this.activeTrackers_inst[data.ref.parent.key].x = data.val();  // data.ref.parent.key is key value and data.key is the field to update and data.val() is the new value
                      if(data.key == "y")
                        this.activeTrackers_inst[data.ref.parent.key].y = data.val();  // data.ref.parent.key is key value and data.key is the field to update and data.val() is the new value
                  },(error)=>{
                    alert(error)
                  });


              }, 5000);


      }else{

            this.trackerDataChange[key].off(); //turn off the event listeners for the tracker

            //....1.... removing the off tracker from the list of active trackers
              console.log(this.activeTrackers)
            for(var k = 0 ; k < this.activeTrackers.length ; k++){
               if(this.activeTrackers[k].tracker_id == key){
                  this.activeTrackers.splice(k, 1)
               }
               break;
             }


             //......2...... changing the connection state of the tracker in the list of all trackers

            for(var i = 0 ; i < this.allTrackers.length ; i++){
                  if(this.allTrackers[i].tracker_id == key ){
                  this.allTrackers[i].link_status = newValue; //setting the state of the tracker to off
                }
            }
            this.activeTrackers_inst[key] = null;
            this.events.publish("trackerDeleted",key) //letting the map refresh that the tracker has been deleted , if this is the current active tracker , then it will be removed from the view
      }
  }

/*
  Objective : Changes the mode of the tracker
  Modes: Normal , Tracking , Watch mode;
  the function will change the mode of tracker to the one that preceeds the currently active mode
*/

  changeMode(tracker_id : string , mode : string){
      if(mode == "Normal"){
          this.database.ref("trackers/"+tracker_id).update({"mode": "Watch"}).then((results)=>{
              this.events.publish("modechange")
          }).catch((error)=>{
            alert(error)
          })
      }
      if(mode == "Watch"){
          this.database.ref("trackers/"+tracker_id).update({"mode": "Normal"}).then((results)=>{
            this.events.publish("modechange")
          }).catch((error)=>{
            alert(error)
          })
      }
      // if(mode == "Tracking"){
      //     this.database.ref("trackers/"+tracker_id).update({"mode": "Normal"}).then((results)=>{
      //     }).catch((error)=>{
      //       alert(error)
      //     })
      // }
    }

/*
  Objective : Disconnet the given tracker

*/
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

/*
  Objective : Generate new finder id ,
*/
  generateFinderId(){
    var finderID = Math.floor((Math.random() * 10) + 0).toString() ; //creating a new finder variable to store the id and it's initialized with the number to make it easy for realiase that all the characters are lower case
      for(var i = 0 ; i < 9 ; i++){ //limit is 9 because the first letter is already assigned
          if(Math.floor((Math.random() * 2) + 0) == 0)
            finderID = finderID.concat(this.CHARPOOL[Math.floor((Math.random() * 25) + 0)]); // appending a new letter to the string
          else
            finderID = finderID.concat(Math.floor((Math.random() * 10) + 0).toString()); // appending a new number 0 - 9
    }
    return finderID;
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
