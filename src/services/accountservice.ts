import { Injectable } from '@angular/core';
import {AngularFireDatabase } from 'angularfire2/database';
import { Events , ToastController ,MenuController , LoadingController } from 'ionic-angular';
import { UserInterface } from './userdata';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase/app';

import { Tracker } from './tracker';

@Injectable()
export class AccountService {
  errorMessage : any;
  loadInstance : any;
  database : any ; //users database reference
  constructor(public tracker : Tracker , public menu : MenuController , public storage : Storage ,public user : UserInterface , public loadingCtrl : LoadingController ,public toastCtrl : ToastController , public events: Events,public ngDatabase : AngularFireDatabase){

  }
emailSignUp(email : string , password : string , name : string ){
  this.showLoading("Signing up...");
    firebase.auth().createUserWithEmailAndPassword(email, password).then((user)=>{
      this.createProfile(email,name,user.uid) //creating a new user profile , using the new uid the last parameter is the url of the default photo
    }).catch((error:any)=>{
            this.loadInstance.dismiss();
            var errorCode = error.code;
            var errorMessage = error.message;
            if(errorCode == "auth/network-request-failed"){
              this.errorToast("Network error , please check your data");
            }else {
              // alert(errorMessage);
             this.errorToast(errorMessage);
            }
      });
    }
emailLogin(email : string , password : string){
        let loader = this.loadingCtrl.create({content:"signing in.."});
        loader.present();
        firebase.auth().signInWithEmailAndPassword(email,password)
        .then((response:any) => {
          this.collectProfile(response.uid,"assets/small.png","email"); //collecting snapshot profile from firebase datase
          loader.dismiss();
        }).catch((error :any) => {
            loader.dismiss();
            // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
              this.errorToast("Wrong password")
              return;
        }
        if(errorCode === "auth/user-not-found"){
          this.errorToast("Email not registered");
          return;
        }
        if(errorCode == "a  uth/network-request-failed"){
          this.errorToast("Network error , please try again later")
          return;
        }
        else {
              this.errorToast(errorMessage);;
        }
      });

    }
facebookLogin(username : string , uid : string , photoURL : string){
      this.checkUser(uid).then((value)=>{
            if(value === true){ //if the user exist in the database
                this.collectProfile(uid,photoURL,"facebook"); //collects user data from the database and init all the local data variables
            }
            else{ //if the user does not extist in the databse
                this.createProfile("no-email",username,uid); //creating a new user profile , note this also prepares the local user variables
            }
      })

    }
recoverPassword(email : string){
  this.showLoading("Sending reset link...");
  var auth = firebase.auth();
  var emailAddress = email;
    if(this.validateEmail(email) === true){
      auth.sendPasswordResetEmail(emailAddress).then((value)=>{
        this.events.publish("recovered","Reset link is now sent to your email");
        this.loadInstance.dismiss();

      }).catch((error)=>{
        this.events.publish("error","System error , try again later");
        this.loadInstance.dismiss();
      })
    }else{
      this.events.publish("error" ,"Error email invalid");
      this.loadInstance.dismiss();
    }
}
validateEmail(email){
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
  }
checkUser(reference : string){
    return firebase.database().ref('/users/').once('value').then((snapshot) => {
      if(snapshot.hasChild(reference)){
        return true;
      }
      else {
        return false;
      }
    })
}
logout(): void  {
  //showing animation
  var loading = this.loadingCtrl.create({
    content: "Signing off.."
    });
    loading.present();
    //removinguser
    this.setAppMode("none") //restoring the application mode


  this.storage.get('loginType').then((value)=>{
        if(value === "email"){
          this.tracker.clearTrackers(); //removing all the trackers data
          firebase.auth().signOut().then(()=>{
          this.removeUserData(); //removing user data
          }).catch((error) => {

          });
        }
        // if(value === "facebook"){
        //       this.facebook.logout();
        // }
        var wait = setTimeout( () => {
          loading.dismiss();
          clearTimeout(wait);
          this.events.publish('user:logout');
        }, 3000);
  })

}
loggedIn(): Promise<boolean> {
    return this.storage.get('loginState').then((value) => {
    return value === true;
  });
};
removeUserData(){
  this.storage.remove('loginState');
  this.storage.remove('username');
  this.storage.remove('dateofbirth');
  this.storage.remove('reference');
  this.storage.remove('updateUserDataState');

}
collectProfile(reference :string,photoURL : string , loginType : string){
      this.checkUser(reference).then((state)=>{
          if(state === true){
              firebase.database().ref('/users/'+reference+'/0').once('value').then((snapshot) => {
              this.user.updateUserData(snapshot.val().name,snapshot.val().reference,snapshot.val().total_reports,loginType,snapshot.val().email); // updating user data using the new profile data
              this.storage.set('loginState', true); // setting user login state
              this.events.publish('user:login');
              return;
            })
          }
          else
              this.errorToast("Failed to acquire user profile");
      })


    }
createProfile(email : string , name : string , uid : string){
          this.database = firebase.database();
          this.database.ref('users/').update(
            { [uid] : [{'email':email , 'name' :name , "reference" : uid }]
          }).then((data)=>{

                this.user.updateUserData(name,uid,0,'email',email);
                this.storage.set('loginState', true); // setting user login state
                this.events.publish('user:login');
          }).catch((data)=>{
            this.errorToast("Unknown error occured , please try again using a different email.")
          })
                this.loadInstance.dismiss();
  }

  // Set the application mode  -- Tracker Mode or Recieve Mode , this information is used in the next login.

  setAppMode(mode : string){
    this.storage.set("app-mode",mode)
  }
  getAppMode(){
    return this.storage.get('app-mode').then((mode) =>{
        return mode;
    })
  }


// ======================================================= ANIMATION ================================================


showLoading(text : string) {
   this.loadInstance  = this.loadingCtrl.create({
    content: text
  });
    this.loadInstance.present();
  }
errorToast(messageData : string) {
        let toast = this.toastCtrl.create({
          message: messageData,
          duration: 3000,
          dismissOnPageChange: true
        });
        toast.present();
      }
createToast(messageData : string) {
        let toast = this.toastCtrl.create({
          message: messageData,
          duration: 3000,
          dismissOnPageChange: true
        });

        return toast;
      }


}
