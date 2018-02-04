import { Injectable } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import { Events} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications'; //for testing



@Injectable()
export class UserInterface {
  database : any;
  constructor(
    public localNotifications: LocalNotifications ,
    public events: Events,
    // public facebook : Facebook,
    public ngDatabase : AngularFireDatabase ,
    public storage: Storage,
  ) {

    // setInterval( () => {
    //     this.cool()
    //
    // }, 4000);
  }
  cool(){

    this.localNotifications.schedule({
      id: Math.floor((Math.random() * 25) + 0),
      title:"cool",
      text: 'Running'
    });
  }
  //used by signup
  updateUserData(username : string , reference : string , reports : any , loginType : string,email){
          this.storage.set('username',username);
          this.storage.set('reference', reference);
          this.storage.set('totalreports',reports);
          this.storage.set('loginType',loginType);
          this.storage.set('email',email);
  }

  //used by login
  setReferences(reportReferences : any){
      alert(reportReferences);
  }
  setImage(url : string)        {
    this.storage.set('img_url',url);
  }

  setChatKey(reference : string)        {
    this.storage.remove("chatkey");
    console.log("setting : " + reference)
    this.storage.set('chatkey',reference);
  }
  getImage()                    {
    return this.storage.get('img_url').then((address) =>{
        return address;
    })
  }
  storeKeys(list : any){
      // let data = JSON.stringify(list);
      // this.storage
  }
  getUsername()                 {
    return this.storage.get('username').then((value) => {
      return value;
    });
  }
  getUserChatReference()                 {
    return this.storage.get('chatkey').then((value) => {
      return value;
    });
  }
  getPhone()                    {
    return this.storage.get('phone').then((value) => {
      return value;
    });
  }
  getReportsNumber()            {
    return this.storage.get('totalreports').then((value) => {
      return value;
    });
  }
  getDateOfBirth()              {
    return this.storage.get('dateofbirth').then((value) => {
      return value;
    });
  }
  setUsername(username: string): void {
    this.storage.set('username', username);
  };
  getEmail(){
    return this.storage.get('email').then((value) => {
      return value;
    });
  };
  getUserReference() {
    return this.storage.get('reference').then((value) => {
      return value;
    });
  }
  setUserReference(ref: string): void {
    this.storage.set('reference', ref);
  };

}
