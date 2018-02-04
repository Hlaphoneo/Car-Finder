import { Injectable } from '@angular/core';
import {AngularFireDatabase } from 'angularfire2/database';
import { Events} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase/app';
import { LocalNotifications } from '@ionic-native/local-notifications';


@Injectable()
export class GeneralInterface {
  database : any;
  CHARPOOL = ["z","y","x","w","v","a","c",
                  "d","p","i","b","g","l","e",
                  "j","u","m","k","r","q","o",
                  "s","t","f","n","h",
                ]
  constructor(
    public localNotifications : LocalNotifications,
    public events: Events,
    public storage: Storage,
    public ngDatabase : AngularFireDatabase ,
  ) {}


  addSupportMessage(message_data , user_id , username){
      var username_temp = '';
        username.then((value) =>{
            username_temp = value;

            user_id.then((reference)=>{
            this.database = firebase.database();
            this.database.ref('support/').update(
              { [this.generateUid(reference)] : [{'message':message_data , 'username' : username_temp , 'reference' : reference}]

              })
          });
        })
  }

  

  setTutState(){
   this.storage.set('tutstate',true)
  }
  checkTutState(){
    return this.storage.get('tutstate').then((value) => {
      return value;
    });
  }
  notify(info){
    this.localNotifications.schedule({
      id: 1,
      title : 'Car Finder',
      text: info,
      sound: 'file://sound.mp3'
    });

  }
  generateUid(reference){
    var prefix = reference.slice(0,5); //generating prefix using first 3 letter of te full name
        var a = Math.floor((Math.random() * 25) + 0);
        var b = Math.floor((Math.random() * 25) + 0);
        var c = Math.floor((Math.random() * 25) + 0);
        var d = Math.floor((Math.random() * 25) + 0);
        var e = Math.floor((Math.random() * 25) + 0);
        var f = Math.floor((Math.random() * 25) + 0);
        var g = Math.floor((Math.random() * 25) + 0);
        var h = Math.floor((Math.random() * 25) + 0);
        var i = Math.floor((Math.random() * 25) + 0);
        var j = Math.floor((Math.random() * 25) + 0);
        var k = Math.floor((Math.random() * 25) + 0);
        var l = Math.floor((Math.random() * 25) + 0);
        var m = Math.floor((Math.random() * 25) + 0);
        var n = Math.floor((Math.random() * 25) + 0);
        var o = Math.floor((Math.random() * 25) + 0);
        var p = Math.floor((Math.random() * 25) + 0);
        return prefix+this.CHARPOOL[a] + this.CHARPOOL[b] + this.CHARPOOL[c] + this.CHARPOOL[d] + this.CHARPOOL[e] + this.CHARPOOL[f] + this.CHARPOOL[g] + this.CHARPOOL[h]+ this.CHARPOOL[i] + this.CHARPOOL[j] + this.CHARPOOL[k] + this.CHARPOOL[l] + this.CHARPOOL[m] + this.CHARPOOL[n] + this.CHARPOOL[o] + this.CHARPOOL[p]  + Math.floor((Math.random() * 99) + 1); //generation random suffix - 4 Random letters + 1 Random number
  }
  generateLinkReference(){
    var prefix = 'cflinkref';
        var a = Math.floor((Math.random() * 25) + 0);
        var b = Math.floor((Math.random() * 25) + 0);
        var c = Math.floor((Math.random() * 25) + 0);
        var d = Math.floor((Math.random() * 25) + 0);
        var e = Math.floor((Math.random() * 25) + 0);
        var f = Math.floor((Math.random() * 25) + 0);
        var g = Math.floor((Math.random() * 25) + 0);
        var h = Math.floor((Math.random() * 25) + 0);
        var i = Math.floor((Math.random() * 25) + 0);
        var j = Math.floor((Math.random() * 25) + 0);
        var k = Math.floor((Math.random() * 25) + 0);
        var l = Math.floor((Math.random() * 25) + 0);
        var m = Math.floor((Math.random() * 25) + 0);
        var n = Math.floor((Math.random() * 25) + 0);
        var o = Math.floor((Math.random() * 25) + 0);
        var p = Math.floor((Math.random() * 25) + 0);
        return prefix+this.CHARPOOL[a] + this.CHARPOOL[b] + this.CHARPOOL[c] + this.CHARPOOL[d] + this.CHARPOOL[e] + this.CHARPOOL[f] + this.CHARPOOL[g] + this.CHARPOOL[h]+ this.CHARPOOL[i] + this.CHARPOOL[j] + this.CHARPOOL[k] + this.CHARPOOL[l] + this.CHARPOOL[m] + this.CHARPOOL[n] + this.CHARPOOL[o] + this.CHARPOOL[p]  + Math.floor((Math.random() * 99) + 1); //generation random suffix - 4 Random letters + 1 Random number
  }
}
