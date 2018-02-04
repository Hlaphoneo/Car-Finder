import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';
import { UserInterface } from './userdata';
import { Storage } from '@ionic/storage';

import * as firebase from 'firebase/app';


import 'rxjs/add/operator/toPromise';

export class ChatMessage {
  userid: string;
  userName: string;
  sender : any;
}

export class UserInfo {
    id: string;
    name?: string;
    avatar?: string;
}

@Injectable()
export class ChatService {
    database : any;
    reportKey : any;
    listListener : any;
    chatList : any = Array();
    constructor(public storage : Storage , public user : UserInterface , public http: Http,public events: Events) {
      this.database = firebase.database();
      this.getMsgList(); //just for testing
      this.attachEventListers()
    }




    getMsgList() {
      // alert("asd")
      this.user.getUserChatReference().then((reportKey)=>{
                  // console.log("loading chats:: id - "+reportKey)
              this.listListener = firebase.database().ref("support/"+reportKey+"/messages");
                    this.listListener.on('child_added', (data) => {
                      this.events.publish("newMessage"); //sending the focus of the chat page
                      // console.log(data.val());
                      this.chatList.push(data.val());
                      // let listKeys = Object.keys(data.val()); //getting key list of all trackers as array
                      // listKeys = listKeys.reverse();
                      this.attachEventListers();
                    // addCommentElement(postElement, data.key, data.val().text, data.val().author);
                });

      })


    }

  testassistant(message: any) {
            this.user.getUserReference().then((reference)=>{

                this.database.ref("users/"+reference+"/0/chat").once("value").then((data)=>{
                    if(data.val() == null){

                        console.log("no chat")
                        this.user.getUsername().then((name)=>{
                            const newChat: ChatMessage = {
                              userid: reference,
                              userName: name,
                              sender : "a"
                            };

                            this.database.ref("support").push(newChat).then((snapshot)=>{
                                    this.reportKey =  snapshot.key;
                                    this.user.setChatKey(this.reportKey); //saving the report key for later

                                    //sending the message to the support
                                    const newMessage = {
                                      message: message,
                                      sender : "a"
                                    };

                                    this.database.ref("support/"+this.reportKey+"/messages").push(newMessage).then((snapshot)=>{
                                          this.database.ref("users/"+reference+"/0/chat").push({
                                            chatid : this.reportKey,
                                            new : 0
                                          }).then((data)=>{ //Message has been sent;

                                          })

                                    }).catch((error)=>{
                                        alert(error);
                                    })

                            }).catch((error)=>{
                                alert(error);
                            })
                        })

                    }else{
                      console.log("chat already exisist")
                      this.user.getUserChatReference().then((referenceChat)=>{
                          const newMessage = {
                          message: message,
                          sender : "a"
                        };

                            this.database.ref("support/"+referenceChat+"/messages").push(newMessage).then((snapshot)=>{


                            }).catch((error)=>{
                                alert(error);
                            })


                      })

                    }

                })

            })




    }

  attachEventListers( ){
      // console.log(this.chatList)






    }

  sendMsg(message: any) {
            this.user.getUserReference().then((reference)=>{

                this.database.ref("users/"+reference+"/0/chat").once("value").then((data)=>{
                    if(data.val() == null){

                        console.log("no chat")
                        this.user.getUsername().then((name)=>{
                            const newChat: ChatMessage = {
                              userid: reference,
                              userName: name,
                              sender : "u"
                            };

                            this.database.ref("support").push(newChat).then((snapshot)=>{
                                    this.reportKey =  snapshot.key; //new chat key
                                    this.user.setChatKey(this.reportKey); //saving the report key for later


                                    //sending the message to the support
                                    const newMessage = {
                                      message: message,
                                      sender : "u"
                                    };

                                    this.database.ref("support/"+this.reportKey+"/messages").push(newMessage).then((snapshot)=>{
                                          this.database.ref("users/"+reference+"/0/chat").push({
                                            chatid : this.reportKey,
                                            new : 0
                                          }).then((data)=>{
                                            this.listListener.off();
                                            this.getMsgList(); // listening for messages on the new event listListeners

                                          })

                                    }).catch((error)=>{
                                        alert(error);
                                    })

                            }).catch((error)=>{
                                alert(error);
                            })
                        })

                    }else{
                      console.log("chat already exisist")
                      this.user.getUserChatReference().then((referenceChat)=>{ //getting already existing reportKey
                          const newMessage = {
                          message: message,
                          sender : "u"
                        };

                            this.database.ref("support/"+referenceChat+"/messages").push(newMessage).then((snapshot)=>{


                            }).catch((error)=>{
                                alert(error);
                            })


                      })

                    }

                })

            })




    }

}
