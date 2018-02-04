import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';


@Injectable()
export class MessagingService {
  database : any;
  CHARPOOL = ["z","y","x","w","v","a","c",
                  "d","p","i","b","g","l","e",
                  "j","u","m","k","r","q","o",
                  "s","t","f","n","h",
                ]

  constructor()            {
    this.database = firebase.database();
  }
  postMessage(currentUserReference : string , otherUser : string , message : string)   : boolean{
    // let exist = this.scanDatabase(currentUserReference , );
    //   if(exist){
    //     //post to the existing one
    //     postMessageToExisting();
    //   }
    //   else {
    //     createChat(currentUserReference,otherUser) //creating a new chat
    //   }


    return false;
  }
  deleteMessage() : boolean{

    return false;
  }
  muteChat()      : boolean{

    return false;
  }
  deleteChat()    : boolean{

    return false;
  }

  /*
    objective  : Scans user database for existing chat to avoid creating new database instead
                , instead of inserting into the existing one. This runs everytime when someone
                  starts a new conversation
    return     : True if the chat already exist or else false.
  */
  scanDatabase(userReference : string , chatID : string)  : boolean{



    return false;
  }

  /*
    onjective : creates a new chat with a new reference in the message database
                The function also adds the new chat reference to user chat database
    algo       : 1 - Create a new id

    @params   : user1 , user2 - chat users , always created in pair
  */

  createChat(user1 , user2) : boolean{


      return false;
  }

  /* generates unique user id for message referecing in the databse
     please note that the reference can be tracked to check the user who created the chat
   */
  genUID(reference)        : string{
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

        return prefix+this.CHARPOOL[a] + this.CHARPOOL[b] + this.CHARPOOL[c] + this.CHARPOOL[d] + this.CHARPOOL[e] + this.CHARPOOL[f] + this.CHARPOOL[g] + this.CHARPOOL[h]+ this.CHARPOOL[i] + this.CHARPOOL[j] + this.CHARPOOL[k]  + Math.floor((Math.random() * 99) + 1); //generation random suffix - 4 Random letters + 1 Random number
  }
}
