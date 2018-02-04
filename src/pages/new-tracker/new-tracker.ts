import { Component } from '@angular/core';
import { NavController, NavParams , Events} from 'ionic-angular';
import { Http , Headers } from '@angular/http';
import * as $ from 'jquery'
import * as firebase from 'firebase/app';

import { Tracker } from '../../services/tracker';
import { UserInterface } from '../../services/userdata';


@Component({
  selector: 'page-new-tracker',
  templateUrl: 'new-tracker.html',
})
export class NewTrackerPage {
  id : string;
  database : any; //firebase database reference
  animationCtrl: any;

  constructor(public events : Events , public user : UserInterface , public http : Http , public tracker : Tracker , public navCtrl: NavController, public navParams: NavParams) {
    this.id = '*****';
    this.database = firebase.database();
  }

  /*
      Recursive function for generating finder ids
      generates new id and checks it against the existing ids
      if the id exist , the fuction generates the new id;
        if the new id is unique , the pair of user reference and the new finder id is sent to the firebase cloud function
  */


  newID(){
    this.animation('generating'); //starting generating animation
    let finderID = this.tracker.generateFinderId(); //generating new id

    //1 - checking if the reference is not already allocated to another account
    this.database.ref('/tracker_ids').once('value',(data)=>{
      if(data.hasChild(finderID)){ //if the id is already taken generate a new one
          this.newID(); //recursion point
      }
      else{
        this.user.getUserReference().then((ref)=>{  //getting user reference to send it with the id
          let newID = {
            'id' : finderID,
            'user_ref' : ref
          }
          var content = JSON.stringify(newID);
          var headers = new Headers();
          headers.append('Content-Type', 'application/json');
          this.http.post('https://us-central1-konza-carfinder.cloudfunctions.net/register_new_id',content,headers)
          .subscribe((response) => {
              if(response.status == 200){
                this.id = finderID;
                this.animation('done')
                this.tracker.clearTrackers(); //clearing previous tracker array
                this.tracker.updateTrackers() //updating trackers with new lists
              }else{
                alert("Failed to generate new id , please try again later")
                this.animation('normal')
              }

          })
        })
      }
    })
    return;
  }



//==========================================================================================================================================================================




















  // ------------------------------------------------------- ANIMATIONS -------------------------------------------------------------------------------

  animation(action : string){
      if(action == "generating"){
        $(".generate_id").prop("disabled",true); //disabling button
        $(".generate_id").addClass("take_to_back")
        $(".generate_id").html("GENERATING...")
      }
      if(action == "normal"){
        $(".generate_id").prop("disabled",false); //disabling button
        $(".generate_id").removeClass("take_to_back")
        $(".generate_id").html("TRY AGAIN...")
      }
      if(action == "done"){
          $(".generate_id").addClass("buttonConnected");
          $(".generate_id").html("<strong>THANK YOU</strong>")
      }
  }
}
